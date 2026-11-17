# Components

Use the platform's real M3 components wherever they exist. Hand-rolling a
component means reimplementing its state layers, ripple, shape morph, motion
spec, accessibility semantics and RTL behaviour — and missing some of them.

## Buttons

Five sizes in M3 Expressive. Small is the default; baseline M3 had only this one.

| Size | Height | Padding | Icon | Label style |
| --- | --- | --- | --- | --- |
| Extra small | 32dp | 12dp | 20dp | label-large |
| Small (default) | 40dp | 16dp | 20dp | label-large |
| Medium | 56dp | 24dp | 24dp | title-medium |
| Large | 96dp | 48dp | 32dp | headline-small |
| Extra large | 136dp | — | 40dp | headline-large |

Note: baseline M3 specified 24dp padding on the small button. **Expressive
changes this to 16dp** — carrying the old value forward is a visible tell.

Extra small and small buttons must still present a **48×48dp touch target**.
Pad the hit area; do not enlarge the visual.

**Colour variants**, in descending emphasis: `filled` (default, `primary` fill)
→ `tonal` (`secondary-container`) → `elevated` (surface plus shadow) →
`outlined` (`outline` border) → `text` (no container).

One filled button per view. If two actions look equally important, one of them
is not.

**Shape:** round (default) or square, new in Expressive. On press, buttons morph
toward square; both shapes share the same pressed shape. Corner values differ
per size.

**Toggle variant** is new in Expressive — a button that holds a selected state.

### Button groups (new in Expressive)

A container that coordinates shape, width and motion across a set of buttons.
Adjacent buttons react when one is pressed, squishing and reshaping. Works at
all five sizes. Use for segmented actions and filter rows.

Inner padding — standard: XS 18dp, S 12dp, M/L/XL 8dp. Connected: XS 4dp,
S 8dp, M 8dp, L 16dp, XL 20dp.

### Split button (new in Expressive)

A primary action plus a menu button that spins and changes shape when
activated. Same five sizes. Use when an action has related alternatives.

### Icon buttons

Five sizes, container/icon in dp: XS 32/20, S 40/24 (default), M 56/24,
L 96/32, XL 136/40. Corner radius is half the container at every size.

Variants: standard (low emphasis), filled, tonal, outlined. Use outlined for
medium emphasis on busy surfaces; standard on colourful surfaces.

## FABs

| Variant | Size |
| --- | --- |
| Small FAB | 40dp |
| FAB | 56dp |
| Large FAB | 96dp |
| Extended FAB | 56dp tall, width fits the label |

One FAB per screen, for the single most likely action. Shape `large` or `full`.
Elevation level 3 at rest, 5 when pressed.

**FAB menu** is new in Expressive: a FAB that expands into a set of related
actions, replacing the older speed-dial pattern.

Must clear the navigation bar and any bottom app bar.

## App bars and toolbars

**Top app bar** variants: small, centre-aligned, medium, large. Medium and
large have a two-line form that collapses to small on scroll — use them when
the title deserves prominence on arrival.

**Bottom app bar** holds up to four actions plus a FAB. Appropriate on compact
only; at wider breakpoints move actions into a rail or top bar.

**Toolbars** are new in Expressive: a flexible floating container for
frequently used actions, horizontal or vertical, docked or floating. Use where
a fixed app bar is too rigid — media controls, editing surfaces.

## Navigation

Match the breakpoint (see `layout.md`):

- **Navigation bar** — 3–5 destinations, compact only. 80dp tall.
- **Navigation rail** — medium and up. Vertical, 80dp wide. The **wide
  navigation rail** (Expressive) adds labels beside icons for large screens.
- **Navigation drawer** — modal at compact, permanent at expanded and up.
  360dp wide standard.
- **Tabs** — primary (under an app bar, switching views) or secondary (nested
  within a view). Tabs are not top-level navigation; use a bar or rail for that.

Mark the active destination with both an indicator and a colour change, never
colour alone.

## Containers

**Cards** — 12dp corner, 16dp internal padding, 8dp maximum between cards.
Variants: elevated (level 1), filled (`surface-container-highest`), outlined
(`outline-variant` border). Pick one variant per surface and stay with it;
mixed card styles in one list read as a bug.

A card is a container for a single coherent subject. A card wrapping unrelated
content is just a box.

**Dialogs** — 28dp corner, `surface-container-high`, elevation 3. Basic
(title, text, up to two actions) or full-screen at compact when the content
needs room. Actions are text buttons, right-aligned, confirming action last.
Maximum two actions; three means the question is wrong.

**Sheets** — bottom sheet (28dp top corners, 0 bottom), side sheet. Modal with
a scrim, or standard alongside content. Bottom sheets at compact where a dialog
would crowd; side sheets at expanded.

**Menus** — 8dp corner, `surface-container`, elevation 2. 48dp per item
minimum.

## Selection and input

**Chips** — 8dp corner, 32dp tall. Assist, filter, input, suggestion. Filter
chips show a check when selected. Chips are not buttons; they modify or
represent, they do not commit.

**Text fields** — filled or outlined, 8dp corner, 56dp tall with label.
Pick one variant per form. Label, supporting text and error text all have
defined slots; error state uses the `error` roles and must include text, not
just a red border.

**Switch** — binary, applies immediately, no confirmation.
**Checkbox** — multiple selection, or a single opt-in applied on submit.
**Radio** — one of several, 2–5 options; beyond that use a menu.
**Slider** — continuous or discrete. Expressive updates give it a configurable
waveform and thickness.

All of these need a 48dp target regardless of visual size.

## Feedback

**Progress indicators** — linear or circular; determinate when progress is
known, indeterminate when not. Expressive reworks these with configurable
waveform and thickness.

**Loading indicator** is new in Expressive: a shape-morphing indicator that
replaces the plain spinner for in-app loading.

**Snackbar** — `inverse-surface` with `inverse-on-surface` text, one optional
action, 4dp corner. Transient and non-blocking. Never use one for anything the
user must act on.

**Badge** — a count or a dot on an icon. `error` role by convention.

**Tooltip** — plain (short label) or rich (title, text, action).

## Newer additions

Recent stable Compose Material3 releases added a **hero carousel**, **secure
password fields**, and **auto-sizing text** that shrinks to fit its container.
Check the version in use before relying on these.

Component availability differs by platform: Compose leads, Android Views
follows, and the web implementation lags noticeably for Expressive components.
Verify before promising a component on the web.

## Checks

- Real M3 components used where the platform provides them.
- One filled button and one FAB per view.
- Small-button padding 16dp, not the old 24dp.
- 48dp targets on every interactive element, including XS and S buttons.
- One card variant, one text-field variant per surface.
- Dialogs at two actions or fewer.
- Active navigation marked by more than colour.
- Component availability confirmed for the target platform.
