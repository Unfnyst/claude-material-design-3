#!/usr/bin/env node
/**
 * m3-theme — generate a complete Material Design 3 color scheme from one seed
 * color, using Google's own Apache-2.0 color algorithms.
 *
 * Requires: npm i @material/material-color-utilities
 *
 * Usage:
 *   node m3-theme.mjs --seed "#6750A4"
 *   node m3-theme.mjs --seed "#1B6B4E" --format compose
 *   node m3-theme.mjs --seed "#B3261E" --variant vibrant --contrast 0.5
 *   node m3-theme.mjs --seed "#6750A4" --format json --out theme.json
 *
 * Options:
 *   --seed <hex>       Source colour. Required. "#RGB" or "#RRGGBB".
 *   --format <name>    css (default) | compose | tailwind | json
 *   --variant <name>   tonal_spot (default) | neutral | vibrant | expressive
 *                      | content | fidelity | monochrome | rainbow | fruit_salad
 *   --contrast <n>     -1..1. 0 = standard (default), 0.5 = medium, 1 = high.
 *   --spec <year>      2021 (default) | 2025. 2025 is the M3 Expressive mapping.
 *   --out <path>       Write to a file instead of stdout.
 */

import { register } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG = '@material/material-color-utilities';

// ---------------------------------------------------------------- arguments

function parseArgs(argv) {
  const out = {
    format: 'css',
    variant: 'tonal_spot',
    contrast: 0,
    spec: '2021',
  };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    const name = key.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) {
      fail(`Option --${name} needs a value.`);
    }
    out[name] = value;
    i++;
  }
  return out;
}

function fail(message) {
  console.error(`m3-theme: ${message}`);
  process.exit(1);
}

function normaliseHex(input) {
  if (!input) fail('Missing --seed. Example: --seed "#6750A4"');
  let hex = String(input).trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    fail(`"${input}" is not a hex colour. Use #RGB or #RRGGBB.`);
  }
  return `#${hex.toLowerCase()}`;
}

const args = parseArgs(process.argv.slice(2));
const seedHex = normaliseHex(args.seed);

const contrast = Number(args.contrast);
if (!Number.isFinite(contrast) || contrast < -1 || contrast > 1) {
  fail('--contrast must be a number from -1 to 1.');
}

if (!['2021', '2025'].includes(String(args.spec))) {
  fail('--spec must be 2021 or 2025.');
}

const FORMATS = ['css', 'compose', 'tailwind', 'json'];
if (!FORMATS.includes(args.format)) {
  fail(`--format must be one of: ${FORMATS.join(', ')}`);
}

// ------------------------------------------------------------ load the lib

register(pathToFileURL(resolvePath(HERE, 'esm-ext-hook.mjs')));

// Look for the package in the user's project first (that is where they will
// have installed it), then next to this script. Import by resolved file URL so
// a bare-specifier lookup from the script's own directory cannot fail.
function locatePackage() {
  const candidates = [
    pathToFileURL(resolvePath(process.cwd(), 'noop.js')),
    import.meta.url,
  ];
  for (const base of candidates) {
    try {
      return createRequire(base).resolve(PKG);
    } catch {
      /* try the next base */
    }
  }
  return null;
}

const pkgEntry = locatePackage();
if (!pkgEntry) {
  console.error(
    `m3-theme: ${PKG} is not installed.\n\n` +
      `  npm i ${PKG}\n\n` +
      `It is Google's own Apache-2.0 implementation of the M3 colour\n` +
      `algorithms. This script does not reimplement the colour science.`
  );
  process.exit(1);
}

const mcu = await import(pathToFileURL(pkgEntry).href);
const {
  Hct,
  DynamicScheme,
  MaterialDynamicColors,
  Variant,
  argbFromHex,
  hexFromArgb,
} = mcu;

// ------------------------------------------------------------------ scheme

const VARIANT_KEY = String(args.variant).toUpperCase();
if (!(VARIANT_KEY in Variant)) {
  fail(
    `Unknown --variant "${args.variant}". Options: ` +
      Object.keys(Variant)
        .filter((k) => Number.isNaN(Number(k)))
        .map((k) => k.toLowerCase())
        .join(', ')
  );
}

const sourceHct = Hct.fromInt(argbFromHex(seedHex));

function buildScheme(isDark) {
  return new DynamicScheme({
    sourceColorHct: sourceHct,
    variant: Variant[VARIANT_KEY],
    contrastLevel: contrast,
    isDark,
    specVersion: String(args.spec),
    platform: DynamicScheme.DEFAULT_PLATFORM,
  });
}

// Every MaterialDynamicColors member that can resolve to a colour. The five
// *PaletteKeyColor entries are palette anchors rather than UI roles, so they
// are excluded from output.
const ROLES = Object.getOwnPropertyNames(MaterialDynamicColors)
  .filter((name) => {
    const d = Object.getOwnPropertyDescriptor(MaterialDynamicColors, name);
    return d && d.value && typeof d.value.getArgb === 'function';
  })
  .filter((name) => !name.endsWith('PaletteKeyColor'));

function schemeToHexMap(isDark) {
  const scheme = buildScheme(isDark);
  const map = {};
  for (const role of ROLES) {
    map[role] = hexFromArgb(MaterialDynamicColors[role].getArgb(scheme));
  }
  return map;
}

const light = schemeToHexMap(false);
const dark = schemeToHexMap(true);

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const header = [
  `Material Design 3 colour scheme`,
  `seed ${seedHex} · variant ${args.variant} · contrast ${contrast} · spec ${args.spec}`,
  `Generated with @material/material-color-utilities (Apache-2.0).`,
];

// ------------------------------------------------------------------ output

function asCss() {
  const block = (map, indent) =>
    Object.entries(map)
      .map(([role, hex]) => `${indent}--md-sys-color-${kebab(role)}: ${hex};`)
      .join('\n');

  return [
    `/*`,
    ...header.map((l) => ` * ${l}`),
    ` */`,
    ``,
    `:root {`,
    block(light, '  '),
    `}`,
    ``,
    `@media (prefers-color-scheme: dark) {`,
    `  :root {`,
    block(dark, '    '),
    `  }`,
    `}`,
    ``,
    `/* Explicit override, e.g. <html data-theme="dark"> */`,
    `[data-theme='light'] {`,
    block(light, '  '),
    `}`,
    ``,
    `[data-theme='dark'] {`,
    block(dark, '  '),
    `}`,
    ``,
  ].join('\n');
}

function asTailwind() {
  // Tailwind v4: tokens declared in @theme become utilities such as
  // bg-primary, text-on-primary, border-outline-variant.
  const vars = Object.keys(light)
    .map((role) => `  --color-${kebab(role)}: var(--md-sys-color-${kebab(role)});`)
    .join('\n');

  return [
    `/*`,
    ...header.map((l) => ` * ${l}`),
    ` *`,
    ` * Import this after the generated CSS custom properties. The @theme block`,
    ` * maps M3 roles onto Tailwind colour utilities.`,
    ` */`,
    ``,
    asCss(),
    `@theme inline {`,
    vars,
    `}`,
    ``,
  ].join('\n');
}

function asCompose() {
  // Compose's ColorScheme has no `shadow` parameter — shadow colour is handled
  // by the elevation APIs. Emitting it would not compile.
  const COMPOSE_SKIP = new Set(['shadow']);
  const params = (map) =>
    Object.entries(map)
      .filter(([role]) => !COMPOSE_SKIP.has(role))
      .map(([role, hex]) => `    ${role} = Color(0xFF${hex.slice(1).toUpperCase()}),`)
      .join('\n');

  return [
    `// ${header.join('\n// ')}`,
    ``,
    `import androidx.compose.material3.darkColorScheme`,
    `import androidx.compose.material3.lightColorScheme`,
    `import androidx.compose.ui.graphics.Color`,
    ``,
    `val M3LightColors = lightColorScheme(`,
    params(light),
    `)`,
    ``,
    `val M3DarkColors = darkColorScheme(`,
    params(dark),
    `)`,
    ``,
    `// Prefer dynamicLightColorScheme(context) / dynamicDarkColorScheme(context)`,
    `// on Android 12+ so the user's wallpaper colours win; fall back to these.`,
    `//`,
    `// surfaceVariant is emitted for compatibility; prefer the surfaceContainer*`,
    `// roles in new work.`,
    ``,
  ].join('\n');
}

function asJson() {
  return JSON.stringify(
    {
      seed: seedHex,
      variant: args.variant,
      contrastLevel: contrast,
      specVersion: String(args.spec),
      generatedBy: '@material/material-color-utilities',
      schemes: { light, dark },
    },
    null,
    2
  ) + '\n';
}

const rendered =
  args.format === 'css'
    ? asCss()
    : args.format === 'tailwind'
      ? asTailwind()
      : args.format === 'compose'
        ? asCompose()
        : asJson();

if (args.out) {
  writeFileSync(args.out, rendered, 'utf8');
  console.error(`m3-theme: wrote ${ROLES.length} roles × 2 schemes to ${args.out}`);
} else {
  process.stdout.write(rendered);
}
