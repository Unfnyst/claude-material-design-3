# Web (HTML + CSS)

## State of web support

Be honest with users about this. Google's web component library,
`@material/web`, covers baseline M3 well but **has not kept pace with M3
Expressive** — button groups, split buttons, toolbars, FAB menus and the
loading indicator are not available there, and active development slowed
considerably.

The practical consequence: on the web, **implement M3 as a token system**
rather than reaching for the component library. Generate the tokens, build
components against them. You get the colour system, type scale, shape,
elevation and state behaviour — which is most of what makes something Material
— without waiting on library parity.

Use `@material/web` when you want working components fast and baseline M3 is
enough. Use tokens when you need Expressive, custom components, or control.

## Tokens

Generate the colour scheme:

```bash
npm i @material/material-color-utilities
node scripts/m3-theme.mjs --seed "#6750A4" --format css > m3-theme.css
```

That emits `--md-sys-color-*` for light and dark, under both
`prefers-color-scheme` and `[data-theme]` so you can offer a manual toggle.

Add the remaining token families yourself — they are static:

```css
:root {
  /* Shape */
  --md-sys-shape-corner-none: 0px;
  --md-sys-shape-corner-extra-small: 4px;
  --md-sys-shape-corner-small: 8px;
  --md-sys-shape-corner-medium: 12px;
  --md-sys-shape-corner-large: 16px;
  --md-sys-shape-corner-large-increased: 20px;
  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-extra-large-increased: 32px;
  --md-sys-shape-corner-extra-extra-large: 48px;
  --md-sys-shape-corner-full: 9999px;

  /* Typeface */
  --md-ref-typeface-brand: 'Roboto', system-ui, sans-serif;
  --md-ref-typeface-plain: 'Roboto', system-ui, sans-serif;

  /* State layer opacity */
  --md-sys-state-hover-state-layer-opacity: 0.08;
  --md-sys-state-focus-state-layer-opacity: 0.12;
  --md-sys-state-pressed-state-layer-opacity: 0.12;
  --md-sys-state-dragged-state-layer-opacity: 0.16;

  /* Easing */
  --md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-standard-decelerate: cubic-bezier(0, 0, 0, 1);
  --md-sys-motion-easing-standard-accelerate: cubic-bezier(0.3, 0, 1, 1);

  /* Duration */
  --md-sys-motion-duration-short2: 100ms;
  --md-sys-motion-duration-short4: 200ms;
  --md-sys-motion-duration-medium2: 300ms;
  --md-sys-motion-duration-medium4: 400ms;
  --md-sys-motion-duration-long2: 500ms;
}
```

Full type scale values are in `typography.md`.

## Elevation

Material's shadows are two layers — a tight key shadow and a diffuse ambient
one. A single `box-shadow` reads flatter and slightly wrong.

```css
:root {
  --md-sys-elevation-1:
    0 1px 2px 0 rgb(0 0 0 / 0.30),
    0 1px 3px 1px rgb(0 0 0 / 0.15);
  --md-sys-elevation-2:
    0 1px 2px 0 rgb(0 0 0 / 0.30),
    0 2px 6px 2px rgb(0 0 0 / 0.15);
  --md-sys-elevation-3:
    0 4px 8px 3px rgb(0 0 0 / 0.15),
    0 1px 3px 0 rgb(0 0 0 / 0.30);
  --md-sys-elevation-4:
    0 6px 10px 4px rgb(0 0 0 / 0.15),
    0 2px 3px 0 rgb(0 0 0 / 0.30);
  --md-sys-elevation-5:
    0 8px 12px 6px rgb(0 0 0 / 0.15),
    0 4px 4px 0 rgb(0 0 0 / 0.30);
}
```

In dark mode, prefer stepping through `surface-container*` roles over applying
these.

## State layers

```css
.m3-state {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}
.m3-state::after {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  pointer-events: none;
  border-radius: inherit;
  transition: opacity var(--md-sys-motion-duration-short2)
    var(--md-sys-motion-easing-standard);
}
.m3-state:hover::after {
  opacity: var(--md-sys-state-hover-state-layer-opacity);
}
.m3-state:focus-visible::after {
  opacity: var(--md-sys-state-focus-state-layer-opacity);
}
.m3-state:active::after {
  opacity: var(--md-sys-state-pressed-state-layer-opacity);
}
.m3-state:disabled {
  opacity: 0.38;
  pointer-events: none;
}
.m3-state:disabled::after { opacity: 0; }
```

`border-radius: inherit` matters — without it, square corners flash inside
rounded buttons.

## A component, built on tokens

```css
.m3-button-filled {
  /* Small button: Expressive padding is 16px, not the old 24px */
  min-height: 40px;
  padding-inline: 16px;
  border: none;
  border-radius: var(--md-sys-shape-corner-full);
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);

  font-family: var(--md-ref-typeface-plain);
  font-size: 0.875rem;   /* label-large */
  line-height: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.00625rem;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;

  /* 48px target without a 48px visual */
  position: relative;
}
.m3-button-filled::before {
  content: '';
  position: absolute;
  inset: -4px 0;
  min-height: 48px;
}

.m3-card-filled {
  background: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-on-surface);
  border-radius: var(--md-sys-shape-corner-medium);
  padding: 16px;
}
```

## Material Web components

If you do use the library:

```bash
npm i @material/web
```

```js
import '@material/web/button/filled-button.js';
import '@material/web/textfield/outlined-text-field.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';

document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
```

```html
<md-filled-button>Confirm</md-filled-button>
<md-outlined-text-field label="Email"></md-outlined-text-field>
```

Theme by setting `--md-sys-color-*` — components read from them. To restyle one
instance, override its component tokens (not prefixed with `comp`):

```css
md-filled-button.danger {
  --md-sys-color-primary: var(--md-sys-color-error);
  --md-sys-color-on-primary: var(--md-sys-color-on-error);
}
```

Reach inside with `::part()`, where the part name is the sub-component tag
without the `md-` prefix:

```css
md-checkbox::part(focus-ring) { width: 32px; height: 32px; }
```

Import only the components you use — the library is large and does not
tree-shake from a barrel import.

## Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap" rel="stylesheet">
```

Self-host for production — Roboto is Apache-2.0, so you can serve it yourself,
which avoids a third-party request and the privacy question that comes with it.

Material Symbols for icons:

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
```

```html
<span class="material-symbols-outlined">search</span>
```

The `FILL` axis animates between outlined and filled — useful for selected
navigation states.
