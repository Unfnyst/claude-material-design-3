# Accessibility and final audit

M3's structure does a lot of this for you — but only if the structure is
actually used. The failures below are what happen when roles get bypassed.

## Colour and contrast

The `on-` role pairings are engineered to meet WCAG AA. **The moment you put a
colour on a surface it was not designed for, that guarantee is gone.**

Targets:

- **4.5:1** for body text.
- **3:1** for large text (18.66px bold or 24px regular and above).
- **3:1** for meaningful non-text: icons carrying information, input borders,
  focus indicators, chart elements.
- No requirement for decoration that carries no meaning.

Specific traps:

- **`outline-variant` does not meet 3:1.** It is for decorative dividers. A
  text field border or a meaningful boundary uses `outline`.
- **Disabled content at 38% opacity fails contrast** by design. That is
  accepted for disabled states — but do not reuse 38% for secondary content
  that people need to read. Use `on-surface-variant`.
- **Text over images** has no guaranteed contrast. Add a scrim.
- **Large saturated accent areas in dark mode** often pass contrast and still
  feel wrong. Prefer `primary-container`.

Ship `--contrast 0.5` and `--contrast 1` schemes if the product has an
accessibility setting. Android exposes contrast as a system preference; honour
it where the platform surfaces it.

**Never encode meaning in colour alone.** Error states need text. Selected
states need an indicator or icon. Chart series need labels, patterns or direct
annotation.

## Touch targets

**48×48dp minimum**, always, even where the visible control is 32dp. Pad the
target; do not inflate the graphic.

- Minimum 8dp between adjacent targets.
- Extra small and small buttons, icon buttons, checkboxes, radios and switches
  all need deliberate target padding.
- Check that a target is not clipped by a parent with `overflow: hidden`.

## Focus

Keyboard and switch-access users need a visible focus indicator on everything
interactive.

- Use `:focus-visible`, not `:focus`, so pointer users do not see rings on
  click.
- A focus indicator needs 3:1 contrast against its surroundings. The 12% state
  layer alone is not enough — pair it with a visible ring or outline.
- Focus order follows reading order. A DOM order that disagrees with visual
  order is a defect.
- Focus must be trapped inside a modal dialog and restored to the triggering
  element on close.
- Never remove an outline without replacing it.

## Motion

Honour `prefers-reduced-motion` / the platform equivalent. Replace spatial
motion with a short cross-fade; remove parallax, bounce and overshoot. Do not
remove all transition — an instant swap can go unnoticed. Details in
`motion.md`.

Nothing should flash more than three times per second.

## Text scaling

- Android: `sp` for text, never `dp`. Web: `rem`, never `px`.
- Test at **200%**. Layouts must reflow; text must not clip or truncate.
- Avoid fixed heights on containers holding text. This is the single most
  common scaling failure.
- Minimum 12sp, and only for genuinely secondary content.

## Semantics

- Every control has an accessible name. An icon-only button needs a label —
  `aria-label` on web, `contentDescription` in Compose.
- Decorative images get an empty description so screen readers skip them.
- Use the real element: a `<button>` for a button. A clickable `div` loses
  keyboard activation, focus and role.
- State is exposed programmatically: `aria-pressed`, `aria-selected`,
  `aria-expanded`, or Compose's `selected`/`toggleable` semantics.
- Related controls are grouped and labelled — a radio set needs a group label,
  not just labels per option.
- Live regions announce async changes: validation results, loading completion,
  snackbar content.

## RTL

- Use logical properties: `margin-inline-start`, not `margin-left`. Compose
  handles this when you use `start`/`end` rather than `left`/`right`.
- Directional icons mirror — back arrows, next, indentation. Icons depicting
  objects do not.
- Numbers and clock faces do not mirror.
- Test with an actual RTL locale, not a mirrored screenshot.

## Audit checklist

Run this before calling Material work finished.

**Colour**
- [ ] No raw hex outside the generated theme
- [ ] Every container paired with its `on-` role
- [ ] Light and dark both present; dark generated, not hand-derived
- [ ] `outline` for meaningful borders; `outline-variant` only decorative
- [ ] No meaning carried by colour alone
- [ ] Dark-mode depth via surface containers, not shadow

**Type**
- [ ] All text on the scale; `label-large` on buttons
- [ ] Scalable units; legible at 200%
- [ ] No fixed-height containers around text
- [ ] Reading columns constrained at expanded and above

**Shape, elevation, state**
- [ ] Corner values from the scale
- [ ] Hover 8% / focus 12% / pressed 12% state layers present
- [ ] State layers inherit border radius
- [ ] Disabled elements inert, 38% content / 12% container
- [ ] Decorative shapes not used as tap-target bounds

**Layout**
- [ ] Every target breakpoint handled
- [ ] Navigation pattern matches the breakpoint
- [ ] Three panes maximum; back behaviour defined
- [ ] 8dp grid; 16dp compact margins, 24dp above
- [ ] Insets read from the platform
- [ ] Phone landscape checked (medium width, compact height)

**Motion**
- [ ] Springs for spatial, durations or effects springs for fades
- [ ] Enter decelerates, exit accelerates
- [ ] One motion scheme throughout
- [ ] Nothing animates on first paint
- [ ] Reduced motion handled

**Accessibility**
- [ ] 48dp targets everywhere, 8dp apart
- [ ] Visible `:focus-visible` indicator at 3:1
- [ ] Focus order matches reading order; trapped and restored in modals
- [ ] Accessible name on every control
- [ ] Real semantic elements, not clickable containers
- [ ] State exposed programmatically
- [ ] Logical properties; RTL tested

**Scope**
- [ ] No Google wordmark, four-colour G, Product Sans or Google Sans
- [ ] Nothing presented as a Google product
