# Material Design 3

A plugin that teaches Claude to design and build interfaces with **Material
Design 3** (Material You) and **M3 Expressive** — properly, not just with
rounded corners.

It covers the colour role system and how to generate a scheme from a seed
colour, the type scale, shape and elevation, spring-based motion, adaptive
breakpoints, component specifications, and an accessibility audit. It includes
a working theme generator that produces exact token values rather than
approximations.

**Works in Claude, Claude Cowork, and Claude Code.** It's a standard plugin
with no surface-specific assumptions, so any of them will load it. The design
guidance is identical everywhere; the only difference is that the theme
generator needs a shell with Node available to run.

## What's in it

One skill, `material-design-3`, with a lean body and detail loaded on demand:

| Reference | Covers |
| --- | --- |
| `color.md` | Tonal palettes, tone mapping, all 49 roles, variants, contrast levels, dark mode, custom colours |
| `typography.md` | The full type scale, emphasized styles, typeface rules, text scaling |
| `shape-and-elevation.md` | Corner scale, the 35-shape library, shape morphing, elevation, state layers |
| `motion.md` | Spring tokens for both motion schemes, easing and duration tokens, what to animate |
| `layout.md` | Window size classes, panes, navigation per breakpoint, spacing, insets |
| `components.md` | Buttons through snackbars, with Expressive sizes and the new components |
| `accessibility.md` | Contrast, targets, focus, RTL, semantics, and a full audit checklist |
| `implementation-web.md` | Plain HTML/CSS, tokens, Material Web components |
| `implementation-react-tailwind.md` | Tailwind v4 token mapping, example components, spring conversion |
| `implementation-compose.md` | `MaterialExpressiveTheme`, dynamic colour, adaptive scaffolds |

## Install

**Claude Code**, from your shell:

```bash
claude plugin marketplace add Unfnyst/claude-material-design-3
claude plugin install material-design-3@unfnyst
```

Or in one step from inside a session, on Claude Code v2.1.275 or later:

```
/plugin install material-design-3 --marketplace Unfnyst/claude-material-design-3
```

**Claude and Claude Cowork**: add the marketplace from a session the same way,
with `/plugin install material-design-3 --marketplace Unfnyst/claude-material-design-3`.

To try it without installing, clone the repository and start Claude Code with
`claude --plugin-dir ./claude-material-design-3`.

Updates are not automatic. Run
`claude plugin update material-design-3@unfnyst` to pull a new version, or
turn on auto-update for the marketplace.

## Using it

Just ask. The skill triggers on Material Design, Material 3, M3, Material You,
M3 Expressive, Jetpack Compose UI work, M3 design tokens, or a request for a
Material theme from a brand colour.

```
Build a settings screen in Material 3.
Generate an M3 theme from #1B6B4E.
Audit this component against Material guidelines.
Why does my Material app's motion feel wrong?
Convert this Tailwind UI to M3 tokens.
```

## The theme generator

A full M3 scheme is derived algorithmically through the HCT colour space — it
cannot be eyeballed. The bundled script does it with Google's own Apache-2.0
colour library.

```bash
npm i @material/material-color-utilities

node skills/material-design-3/scripts/m3-theme.mjs --seed "#6750A4" --format css
```

| Flag | Values |
| --- | --- |
| `--seed` | Required. `#RGB` or `#RRGGBB`. |
| `--format` | `css` (default), `compose`, `tailwind`, `json` |
| `--variant` | `tonal_spot` (default), `neutral`, `vibrant`, `expressive`, `content`, `fidelity`, `monochrome`, `rainbow`, `fruit_salad` |
| `--contrast` | `0` standard (default), `0.5` medium, `1` high |
| `--spec` | `2021` (default), `2025` (the Expressive mapping) |
| `--out` | Write to a file instead of stdout |

Output covers 49 colour roles across light and dark schemes. The `compose`
format omits `shadow`, which has no `ColorScheme` parameter.

Requires Node 20 or newer. The script carries a small resolve hook because
`@material/material-color-utilities` v0.4.0 publishes some internal imports
without file extensions, which Node's ESM resolver rejects; the hook repairs
this in memory and never touches anything on disk.

If Node isn't available, Claude will point you at Google's Material Theme
Builder rather than inventing a palette.

## Scope

Material Design 3 is Google's **openly published** design system, and Roboto is
Apache-2.0. Both are free to build with.

This plugin deliberately does **not** cover Google's brand: the Google
wordmark, the four-colour G, Product Sans and Google Sans, or the visual
identity of Google's own apps. Those are trademarks, they are not part of
Material's open licence, and the skill instructs Claude to decline requests to
reproduce them or to pass work off as coming from Google.

If you installed this expecting a Google brand kit, it isn't one — and
shouldn't be.

## Accuracy

Token values were verified against Google's published specifications and the
open-source implementations (`material-color-utilities`,
`material-components-web`, Compose Material3) rather than written from memory.
The palette construction values and spring tables were read directly out of the
reference implementation.

Material moves. M3 Expressive rolled out through 2025–2026 and component
availability still differs by platform — Compose leads, Android Views follows,
the web lags. The skill tells Claude to check availability rather than promise
a component that doesn't exist on the target platform.

## License

Apache-2.0 — see [`LICENSE`](LICENSE).

The theme generator's dependency, `@material/material-color-utilities`, is also
Apache-2.0 and is **not** bundled here; it is installed by the user with npm.

## Credits

Material Design 3 is a design system by Google.
`@material/material-color-utilities` is © Google LLC, Apache-2.0.
This plugin is an independent implementation guide and is not affiliated with
or endorsed by Google.
