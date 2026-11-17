# Shape, elevation and state

## Corner radius scale

Ten steps. Values in dp (Android) or px (web).

| Token | Value | Default users |
| --- | --- | --- |
| `corner-none` | 0 | Full-screen surfaces, edge-to-edge images |
| `corner-extra-small` | 4 | Snackbars |
| `corner-small` | 8 | Text fields, menus, chips |
| `corner-medium` | 12 | Cards |
| `corner-large` | 16 | FAB, extended FAB, navigation drawer |
| `corner-large-increased` | 20 | Expressive-era components |
| `corner-extra-large` | 28 | Dialogs, bottom sheets, side sheets |
| `corner-extra-large-increased` | 32 | Expressive-era large surfaces |
| `corner-extra-extra-large` | 48 | Expressive decorative surfaces |
| `corner-full` | pill / circle | Buttons, badges, sliders, switches |

Web tokens: `--md-sys-shape-corner-medium` and so on, `corner-full` expressed as
a large value such as `9999px`.

Asymmetry is allowed and used deliberately — a bottom sheet is `extra-large` on
its top corners and `none` on the bottom, because the bottom edge meets the
screen edge. Apply the scale per corner when a surface meets an edge.

## The expressive shape library

M3 Expressive adds a library of 35 non-rectangular shapes — cookie, clover,
scallop, burst and similar forms — available as `MaterialShapes` in Compose and
in the Material Shapes Figma library.

Use them for:

- Avatar and image crops
- Loading indicators
- Decorative emphasis and empty states

Do **not** use them for the bounds of a tap target. People need to predict where
a control begins and ends; a scalloped button edge makes the hit area
unguessable. Decorative use only.

## Shape morphing

Expressive shapes carry a built-in morph animation, so a shape can transition
smoothly into another rather than cross-fading.

Standard applications:

- **Button press.** Round buttons morph toward square when pressed. Both round
  and square variants share the same pressed shape, so the press reads
  consistently. Corner values differ per button size.
- **FAB → extended FAB**, and FAB collapsing to a small FAB on scroll.
- **Selection.** An item morphing shape on selection, instead of only changing
  colour.
- **Loading indicators** cycling through shapes.

Pair morphs with a spatial spring, not a fixed duration — see `motion.md`.

## Elevation

Six levels. Level is the semantic unit; dp is the shadow geometry.

| Level | dp | Typical users |
| --- | --- | --- |
| 0 | 0 | Most components at rest, flat surfaces |
| 1 | 1 | Elevated cards, filled buttons at rest |
| 2 | 3 | Menus, navigation bar, search bar |
| 3 | 6 | FAB at rest, dialogs, pickers |
| 4 | 8 | Navigation drawer, elements being dragged |
| 5 | 12 | FAB pressed, highest emphasis |

### Tonal elevation

M3 expresses elevation two ways: a cast shadow, and a **tonal overlay** — a tint
of `surface-tint` (derived from primary) mixed into the surface, growing with
level.

- **Light mode** uses shadow as the main cue, tonal tint as reinforcement.
- **Dark mode** relies on tone, because shadows are nearly invisible on dark
  backgrounds. In practice, prefer the `surface-container*` roles over an
  elevation value; they encode the same hierarchy more legibly and are what
  current Material components use.

**Rule of thumb:** reach for a surface container role first. Use an elevation
level when something genuinely floats above the content plane — a FAB, a
dialog, a dragged item.

Avoid stacking more than two or three elevation levels in one view. Depth stops
communicating once everything is raised.

## State layers

Interaction states are a semi-opaque overlay of the content colour over the
unchanged base colour. The base never changes — this is what keeps states
consistent across every colour role.

| State | Overlay opacity |
| --- | --- |
| Hover | 8% |
| Focus | 12% |
| Pressed | 12% |
| Dragged | 16% |
| Selected / activated | 12% (persistent) |

Only one state layer applies at a time. If an element is focused and then
hovered, the hover layer shows until the pointer leaves, then focus resumes.

**Disabled** is handled differently: content drops to 38% opacity and the
container to 12%. Disabled elements take no state layer.

Web implementation:

```css
.m3-interactive {
  position: relative;
  isolation: isolate;
}
.m3-interactive::before {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity 100ms;
  pointer-events: none;
  border-radius: inherit;
}
.m3-interactive:hover::before { opacity: 0.08; }
.m3-interactive:focus-visible::before { opacity: 0.12; }
.m3-interactive:active::before { opacity: 0.12; }
```

Note `border-radius: inherit` — a state layer that ignores the parent's shape
produces square corners flashing inside a rounded button, a very common bug.

On touch, the pressed state is additionally expressed as a ripple radiating
from the contact point. Compose and Material Web provide this; if hand-rolling,
a scale-and-fade from the touch coordinates is an acceptable approximation.

## Checks

- Corner values come from the scale, not arbitrary numbers.
- Surfaces meeting a screen edge use `none` on that edge.
- Decorative shapes never define a tap target's bounds.
- Dark mode depth carried by surface containers, not shadow.
- State layers inherit the parent's border radius.
- Disabled elements have no hover or press response.
