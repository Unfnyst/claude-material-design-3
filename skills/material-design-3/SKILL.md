---
name: material-design-3
description: >
  Applies Google's Material Design 3 (Material You) and M3 Expressive to interface
  work: dynamic colour roles generated from a seed colour, the type scale, shape and
  elevation, spring-based motion, adaptive breakpoints, and component specifications.
  Use when the user asks for Material Design, Material 3, M3, Material You, M3
  Expressive, an Android-style or Google-style interface, a Jetpack Compose or
  Material Web UI, M3 design tokens, a Material theme from a brand colour, or wants
  existing UI audited against Material guidelines.
---

# Material Design 3

Material Design 3 is Google's openly published design system. Build with it freely.

**This skill does not reproduce Google's brand.** The Google wordmark, the
four-colour G, Product Sans, and the visual identity of Google's own apps are
trademarks and are not covered by Material's open licence. Never recreate them,
and never present output as coming from Google. If asked for Google's brand
assets or a look-alike of a Google product, decline and offer an original
Material-based design instead. Roboto is Apache-2.0 and free to use.

## Decide what the user needs

Classify the request before building:

| Request | Do this |
| --- | --- |
| "Make this look Material" / new UI | Establish a theme first, then layout, then components |
| "Generate a theme from `#hex`" | Run `scripts/m3-theme.mjs` (see Theming below) |
| "Is this Material-correct?" | Audit against `references/accessibility.md` and the token rules below |
| A single component | Read `references/components.md` for that component's spec only |
| Motion feels wrong | Read `references/motion.md` — almost always a spring/easing mismatch |

Do not load every reference. Load the ones the task needs.

## Non-negotiables

These are the rules that separate real Material from something that merely
looks rounded. Apply them without being asked.

1. **Never hardcode a colour.** Every colour comes from a role token
   (`--md-sys-color-primary`, `MaterialTheme.colorScheme.primary`). A raw hex in
   component code is a defect. The one exception is the generated theme file
   itself.
2. **Always pair a container with its `on-` role.** Text or icons on
   `primary-container` use `on-primary-container`. This pairing is what
   guarantees contrast; breaking it breaks accessibility.
3. **Dark mode is not optional.** Generate both schemes together. Never darken a
   light scheme by hand.
4. **In dark mode, express elevation with surface containers, not shadow.**
   Shadows are nearly invisible on dark surfaces. Step up through
   `surface-container-low` → `surface-container` → `surface-container-high`.
5. **Minimum touch target is 48×48dp**, even when the visible control is
   smaller. Pad, don't grow the visual.
6. **Type comes from the scale.** Use `body-large`, `title-medium`,
   `label-large` — not arbitrary sizes. `label-large` is button text.
7. **Motion uses springs, not fixed durations**, for anything that moves in
   space. Durations are for fades and colour only.
8. **State layers, not colour swaps.** Hover/focus/press apply a semi-opaque
   overlay of the content colour over the unchanged base.

## Theming

A complete M3 scheme is derived algorithmically from one seed colour. Do not
invent role values by hand and do not guess hexes — the mapping runs through the
HCT colour space and hand-picked values will be wrong.

**Generate it:**

```bash
npm i @material/material-color-utilities
node ${CLAUDE_PLUGIN_ROOT}/skills/material-design-3/scripts/m3-theme.mjs \
  --seed "#6750A4" --format css
```

Formats: `css` (custom properties, light + dark + `[data-theme]`), `compose`
(Kotlin `lightColorScheme`/`darkColorScheme`), `tailwind` (CSS plus a Tailwind
v4 `@theme` block), `json`.

Useful flags:

- `--variant` — `tonal_spot` (default, the Material You look), `vibrant`,
  `expressive`, `neutral`, `content`, `fidelity`, `monochrome`, `rainbow`,
  `fruit_salad`. Use `content` or `fidelity` when the seed must survive
  recognisably (brand colour).
- `--contrast 0 | 0.5 | 1` — standard, medium, high. Ship all three if the
  product has an accessibility setting.
- `--spec 2021 | 2025` — `2025` is the M3 Expressive colour mapping.

If Node is unavailable, send the user to Google's Material Theme Builder rather
than approximating a scheme. State that you cannot compute exact values without
it; do not fabricate a palette.

**No seed given?** Ask for a brand colour. If the user has no preference, say
you are using Material's baseline `#6750A4` and proceed — do not stall.

## Quick reference

Full tables live in the references; these are the values needed constantly.

**Shape** (corner radius, dp): none 0 · extra-small 4 · small 8 · medium 12 ·
large 16 · large-increased 20 · extra-large 28 · extra-large-increased 32 ·
extra-extra-large 48 · full (pill/circle).

Defaults: cards 12 · text fields, menus, chips 8 · FAB and nav drawer 16 ·
dialogs and bottom sheets 28 · buttons, badges, sliders full.

**Elevation** (level → dp): 0 → 0 · 1 → 1 · 2 → 3 · 3 → 6 · 4 → 8 · 5 → 12.

**State layer opacity**: hover 8% · focus 12% · pressed 12% · dragged 16%.
Disabled content 38%, disabled container 12%.

**Breakpoints** (width, dp): compact < 600 · medium 600–839 · expanded 840–1199
· large 1200–1599 · extra-large ≥ 1600.

Navigation follows the breakpoint: bottom bar at compact, navigation rail at
medium, expanded rail or permanent drawer at expanded and up.

**Type scale** (size/line-height in sp, weight): display 57/64, 45/52, 36/44 ·
headline 32/40, 28/36, 24/32 · title 22/28 (400), 16/24 (500), 14/20 (500) ·
body 16/24, 14/20, 12/16 · label 14/20, 12/16, 11/16 (all 500).

## Build order

Work in this sequence. Skipping ahead produces UI that needs reworking.

1. **Theme** — generate the scheme, wire both light and dark, confirm the
   seed with the user if it was a guess.
2. **Layout** — pick the breakpoint behaviour and navigation pattern before
   placing content. `references/layout.md`.
3. **Surfaces** — assign each region a surface role. Establish the elevation
   story before adding colour accents.
4. **Components** — use real M3 components and their specified variants.
   `references/components.md`.
5. **Type and accent** — apply the scale; use `primary` sparingly, for the one
   action that matters most per view.
6. **Motion** — springs for movement, durations for fades.
   `references/motion.md`.
7. **Check** — run the checklist in `references/accessibility.md`.

## References

| File | Read it when |
| --- | --- |
| `references/color.md` | Theming, role meanings, tone mapping, contrast levels, dark mode |
| `references/typography.md` | Type scale values, emphasized styles, font setup |
| `references/shape-and-elevation.md` | Corner values, the shape library, shape morph, elevation, state layers |
| `references/motion.md` | Spring tokens, easing and duration tokens, transition patterns |
| `references/layout.md` | Breakpoints, panes, spacing, navigation per size class |
| `references/components.md` | Any specific component's anatomy, variants and measurements |
| `references/accessibility.md` | Contrast, targets, focus, reduced motion, text scaling, final audit |
| `references/implementation-web.md` | Plain HTML/CSS, Material Web components |
| `references/implementation-react-tailwind.md` | React, Tailwind v4 token mapping |
| `references/implementation-compose.md` | Jetpack Compose, `MaterialExpressiveTheme`, dynamic colour |

## Common mistakes

- **Rounded corners and calling it Material.** The system is the colour role
  structure and the surface hierarchy; shape is the smallest part.
- **Using `primary` everywhere.** It is an accent. Most surfaces are neutral;
  `primary` marks the main action.
- **`surface-variant` for cards.** Prefer the `surface-container*` roles;
  `surface-variant` persists mainly for backward compatibility.
- **Fixed durations for spatial motion.** Spring tokens adapt across device
  sizes; fixed milliseconds do not.
- **Shadow for depth in dark mode.** Use tonal surface steps.
- **Hand-mixing a dark palette.** Generate it.
- **Treating M3 Expressive as a coat of paint.** It changes motion (springs),
  shape (morphing, 35-shape library), type (emphasized styles), and adds
  components. Read `references/motion.md` and `references/components.md` before
  claiming a design is Expressive.
