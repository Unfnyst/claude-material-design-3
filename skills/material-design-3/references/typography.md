# Typography

## The type scale

Five roles — display, headline, title, body, label — each at large, medium and
small. Fifteen styles total. Sizes in sp (Android) or px/rem (web); line heights
in the same unit.

| Style | Size | Line height | Weight | Tracking | Use |
| --- | --- | --- | --- | --- | --- |
| display-large | 57 | 64 | 400 | −0.25 | Hero numerals, splash text |
| display-medium | 45 | 52 | 400 | 0 | Large marketing text |
| display-small | 36 | 44 | 400 | 0 | |
| headline-large | 32 | 40 | 400 | 0 | Screen titles |
| headline-medium | 28 | 36 | 400 | 0 | Section headers |
| headline-small | 24 | 32 | 400 | 0 | Card titles |
| title-large | 22 | 28 | 400 | 0 | App bar titles, dialog titles |
| title-medium | 16 | 24 | 500 | 0.15 | List item primary text, card titles |
| title-small | 14 | 20 | 500 | 0.1 | Dense list titles |
| body-large | 16 | 24 | 400 | 0.5 | Long-form reading |
| body-medium | 14 | 20 | 400 | 0.25 | Default body copy |
| body-small | 12 | 16 | 400 | 0.4 | Captions, metadata |
| label-large | 14 | 20 | 500 | 0.1 | **Button text**, tabs, nav items |
| label-medium | 12 | 16 | 500 | 0.5 | Small labels, badges |
| label-small | 11 | 16 | 500 | 0.5 | Overlines, smallest labels |

### Choosing a role

- **Display** is for one or two elements at most, on large screens. It is not
  "a big headline" — it is a graphic element made of type.
- **Headline** is for titles that structure a screen.
- **Title** is for titles inside components: cards, list rows, app bars.
- **Body** is for prose. Default to `body-medium`; use `body-large` where
  someone will read more than a sentence or two.
- **Label** is for interactive and utilitarian text. Button labels are always
  `label-large`. Using `body-*` on a button is a common tell that a design is
  not actually Material.

Do not invent intermediate sizes. If the scale feels wrong for the content,
change which role you are using, not the number.

## Emphasized styles (M3 Expressive)

M3 Expressive adds an emphasized variant of each of the fifteen styles. They
mirror the baseline metrics but carry more weight, giving a second axis of
hierarchy without changing size.

Use them for the one element in a view that must dominate — a hero title, the
active item in a list, a key figure — while everything else stays on the
baseline scale. Reaching for emphasized everywhere flattens the hierarchy and
defeats the purpose.

Tokens: `--md-sys-typescale-<style>-emphasized-*` on web;
`MaterialTheme.typography.<style>Emphasized` in Compose where available.

## Typeface

**Roboto** is the default, licensed Apache-2.0 and free to use and redistribute.
Roboto Flex is the variable version, which is what makes the emphasized styles
cheap to ship — one file, multiple weights.

**Product Sans and Google Sans are not available for third-party use.** They are
Google's brand typefaces. Never substitute them in, and never claim a design
uses them.

Substituting another typeface is legitimate and common. If you do:

- Keep the metrics. The scale's line heights assume Roboto's proportions; a
  taller x-height font may need line heights nudged up.
- Keep two reference tokens distinct: `--md-ref-typeface-brand` (display,
  headline) and `--md-ref-typeface-plain` (title, body, label). Setting these
  two retheme all fifteen styles at once.

## Tokens

### Web

Each style exposes five properties:

```css
--md-sys-typescale-body-large-font
--md-sys-typescale-body-large-size
--md-sys-typescale-body-large-line-height
--md-sys-typescale-body-large-weight
--md-sys-typescale-body-large-tracking
```

Apply them as a group:

```css
.body-large {
  font-family: var(--md-sys-typescale-body-large-font);
  font-size: var(--md-sys-typescale-body-large-size);
  line-height: var(--md-sys-typescale-body-large-line-height);
  font-weight: var(--md-sys-typescale-body-large-weight);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
}
```

To retheme every style's font at once, set `--md-ref-typeface-brand` and
`--md-ref-typeface-plain` rather than overriding fifteen `-font` tokens.

### Compose

```kotlin
Text("Section", style = MaterialTheme.typography.headlineMedium)
Text("Body copy", style = MaterialTheme.typography.bodyMedium)
```

Override selectively by copying the default typography and replacing styles:

```kotlin
val AppTypography = Typography().let {
  it.copy(
    headlineMedium = it.headlineMedium.copy(fontFamily = BrandFont),
    bodyMedium = it.bodyMedium.copy(fontFamily = TextFont),
  )
}
```

## Accessibility

- **Respect the user's text size setting.** Use `sp` in Android, never `dp`, for
  text. On web use `rem`, never `px`, for font size.
- **Test at 200% scaling.** Layouts must reflow, not clip or truncate. This is
  where fixed-height containers around text break.
- **Minimum body size is 12sp**, and only for genuinely secondary content.
  `body-small` for primary reading matter is a defect.
- **Line length** 45–75 characters for body text. At expanded and larger
  breakpoints, constrain the text column rather than letting it span the window.
- **Don't communicate with weight alone** where it carries meaning; pair with a
  colour role or an icon.
