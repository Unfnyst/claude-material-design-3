# Colour

## How the system works

M3 colour is generated, not picked. One seed colour produces an entire
light-and-dark scheme through four steps:

1. **Seed → HCT.** The seed is converted into HCT (Hue, Chroma, Tone), a space
   where Tone maps to perceived lightness. This is what makes contrast
   predictable.
2. **HCT → six tonal palettes.** Primary, secondary, tertiary, neutral,
   neutral-variant, error. Each is the seed's hue (or a rotation of it) held at
   a fixed chroma.
3. **Palettes → 13 tones each.** 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99,
   100. Tone 0 is black, 100 is white.
4. **Tones → role tokens.** Each role takes a specific tone, and the light and
   dark schemes take different tones from the same palettes.

Because step 4 is a fixed mapping, contrast is structural: pairing a container
role with its `on-` role always lands at an accessible ratio.

### Palette construction (TONAL_SPOT, the default)

Values below are read from Google's own implementation. `h` is the seed hue.

| Palette | 2021 spec | 2025 spec (Expressive) |
| --- | --- | --- |
| Primary | h, chroma 36 | h, chroma 32 |
| Secondary | h, chroma 16 | h, chroma 16 |
| Tertiary | h + 60°, chroma 24 | h + 40°, chroma 28 |
| Neutral | h, chroma 6 | h, chroma 5 |
| Neutral-variant | h, chroma 8 | h, chroma 8.5 |
| Error | hue 25, chroma 84 | hue 12, chroma 60 |

Note the consequence: **the seed colour usually does not appear in the scheme.**
Chroma is clamped, so a vivid brand colour comes back muted. If the brand colour
must survive recognisably, generate with `--variant content` or
`--variant fidelity`, which preserve the source far more closely.

### Variants

| Variant | Character |
| --- | --- |
| `tonal_spot` | Default. Low-to-medium colourfulness, tertiary derived from the seed. |
| `neutral` | Nearly greyscale. Content-first products. |
| `vibrant` | High chroma primary, wide hue spread. |
| `expressive` | Unexpected tertiary hues, playful. |
| `content` | Seed preserved closely; palettes derived from it. Brand work. |
| `fidelity` | Closest possible match to the seed. |
| `monochrome` | Pure greyscale. |
| `rainbow`, `fruit_salad` | Wide, decorative hue spreads. |

### Tone mapping (2021 spec, TONAL_SPOT)

| Role | Light | Dark |
| --- | --- | --- |
| primary | P40 | P80 |
| on-primary | P100 | P20 |
| primary-container | P90 | P30 |
| on-primary-container | P10 (newer: P30) | P90 |
| secondary / tertiary | same pattern on their palettes | same |
| surface | N98–99 | N6–10 |
| on-surface | N10 | N90 |
| surface-variant | NV90 | NV30 |
| on-surface-variant | NV30 | NV80 |
| outline | NV50 | NV60 |
| outline-variant | NV80 | NV30 |
| inverse-surface | N20 | N90 |
| error | E40 | E80 |

Use this to reason about a scheme, not to build one — run the generator for
actual values.

## Generating a scheme

```bash
npm i @material/material-color-utilities
node scripts/m3-theme.mjs --seed "#6750A4" --format css
```

See the skill body for all flags. Never hand-author role values: the HCT
solve cannot be done by eye, and approximations drift visibly from Material
Theme Builder output that designers will compare against.

### Contrast levels

`--contrast 0` (standard), `0.5` (medium), `1` (high). These are a real M3
feature, not an afterthought — Android exposes them as a user setting. At high
contrast, `on-surface` resolves to pure black or white. If the product has an
accessibility setting, generate all three and switch at runtime.

## The roles

49 roles. Grouped by what they are for.

### Accent — primary, secondary, tertiary

Each has four roles following one pattern:

- **`primary`** — the most prominent action. Filled buttons, active states,
  selected indicators. Use it sparingly: one primary action per view.
- **`on-primary`** — content on top of `primary`.
- **`primary-container`** — a less prominent fill of the same hue. Tonal
  buttons, selected chips, highlighted containers.
- **`on-primary-container`** — content on `primary-container`.

`secondary` is for less prominent components; `tertiary` is a contrasting
accent for balance and expressive highlights. Most interfaces use primary and
neutrals heavily, secondary occasionally, tertiary rarely.

### Surfaces — the backbone

Most of an interface is surface roles, not accents.

| Role | Use |
| --- | --- |
| `surface` | The default background for everything |
| `on-surface` | Primary text and icons |
| `on-surface-variant` | Secondary text, icons, supporting copy |
| `surface-dim` | Dimmest background of the scheme |
| `surface-bright` | Brightest background |
| `surface-container-lowest` | Lowest-emphasis container |
| `surface-container-low` | |
| `surface-container` | The standard card or sheet fill |
| `surface-container-high` | |
| `surface-container-highest` | Highest-emphasis container |
| `surface-variant` | Legacy; prefer `surface-container*` |
| `surface-tint` | The colour used for tonal elevation overlays |
| `inverse-surface` | Snackbars, tooltips |
| `inverse-on-surface` | Content on `inverse-surface` |
| `inverse-primary` | Accent on an inverse surface |

**The surface containers are how you express depth.** Stepping from
`surface-container-low` to `surface-container-high` reads as "closer to the
viewer" without any shadow, and works identically in light and dark mode. Reach
for these before reaching for elevation.

### Outline

- **`outline`** — borders that must be clearly visible: outlined text fields,
  outlined buttons. Meets 3:1 against its background.
- **`outline-variant`** — decorative dividers and subtle separators. Does not
  meet 3:1, so never use it for a border that carries meaning.

### Error

`error`, `on-error`, `error-container`, `on-error-container`. Same pattern as
the accents. Use for validation failures and destructive confirmation — not for
general warnings, which have no dedicated role (use tertiary or a custom role).

### Fixed accents

`primary-fixed`, `primary-fixed-dim`, `on-primary-fixed`,
`on-primary-fixed-variant`, and the same for secondary and tertiary.

These hold the **same value in light and dark mode**. Use them where an element
must not flip with the theme: a branded hero band, a persistent coloured header,
an element that sits over media. `*-fixed-dim` is the slightly darker variant
for when the standard fixed role is too bright.

### Utility

- **`background` / `on-background`** — legacy; equal to `surface` /
  `on-surface` in current schemes. Prefer the surface roles.
- **`shadow`** — the colour of cast shadows. No Compose `ColorScheme`
  parameter; elevation APIs handle it.
- **`scrim`** — the overlay behind modals and drawers. Typically applied at
  around 32% opacity.

## Dark mode

Generated, never hand-derived. Rules that differ from light mode:

- **Express elevation with surface containers, not shadow.** Shadows barely
  register on dark backgrounds.
- **Accents get lighter, not darker** — primary moves from tone 40 to tone 80.
- **Avoid large areas of saturated accent.** A full-bleed `primary` panel that
  reads well in light mode becomes glaring in dark mode. Use
  `primary-container` or a surface container instead.
- **Never pure black** as the base surface unless targeting OLED power saving
  deliberately; the scheme's dark surface is a very dark neutral, which keeps
  elevation legible.

## Custom colours

Products often need semantic colours Material has no role for — success,
warning, a per-category colour. Generate them as **custom colours harmonised to
the seed** rather than dropping in a raw hex, so they sit in the same tonal
world. The `material-color-utilities` `themeFromSourceColor` function accepts a
`customColors` array with a `blend` flag for exactly this.

Name them as roles, mirroring the system pattern: `--md-sys-color-success`,
`--md-sys-color-on-success`, `--md-sys-color-success-container`,
`--md-sys-color-on-success-container`.

## Checks

- No raw hex anywhere outside the generated theme file.
- Every container paired with its `on-` role.
- Both schemes present; dark not derived by hand.
- `primary` used for one action per view, not as a general tint.
- Depth carried by surface containers in dark mode.
- `outline-variant` not used for meaningful borders.
