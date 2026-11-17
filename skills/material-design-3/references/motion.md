# Motion

M3 Expressive replaced fixed easing curves with **spring physics** for anything
that moves in space. This is the single biggest behavioural change in the
Expressive update, and the most common thing missing from designs that claim to
be Expressive.

## Springs, not durations

A spring is defined by **damping ratio** and **stiffness**, not by a time.

- **Stiffness** — how hard the spring pulls. Higher resolves faster.
- **Damping ratio** — how quickly oscillation decays. `1.0` is critically
  damped (no bounce); below `1.0` overshoots.

Because no duration is specified, the same token feels correct on a watch, a
phone and a desktop: the system resolves it against the device context. A fixed
400ms translation that feels right on a phone feels sluggish on a watch.

## Spring tokens

Two families, three speeds each.

- **Spatial** — anything that changes position, size or shape. May overshoot.
- **Effects** — opacity and colour. Always critically damped, because a colour
  that overshoots goes briefly wrong, and a fade that overshoots flickers.

| Token | Expressive (damping / stiffness) | Standard (damping / stiffness) |
| --- | --- | --- |
| fast spatial | 0.6 / 800 | 0.9 / 1400 |
| default spatial | 0.8 / 380 | 0.9 / 700 |
| slow spatial | 0.8 / 200 | 0.9 / 300 |
| fast effects | 1.0 / 3800 | 1.0 / 3800 |
| default effects | 1.0 / 1600 | 1.0 / 1600 |
| slow effects | 1.0 / 800 | 1.0 / 800 |

The effects springs are identical across both schemes — only spatial motion
differs in character.

**Choosing a scheme:** `expressive` is the recommended default, and gives
noticeable bounce. `standard` is more restrained — appropriate for dense,
utilitarian, data-heavy or professional interfaces where bounce reads as noise.
Pick one per product and stay with it; mixing schemes makes an app feel
inconsistent rather than varied.

**Choosing a speed:** fast for small elements and immediate feedback (a switch,
a chip, a button press), default for most transitions, slow for large surfaces
covering significant distance (a bottom sheet, a full-screen transition).
Larger movement wants slower springs.

Read these from the theme rather than hardcoding the numbers, so a motion
scheme change propagates:

```kotlin
val motion = MaterialTheme.motionScheme
AnimatedVisibility(
  visible = expanded,
  enter = expandVertically(animationSpec = motion.defaultSpatialSpec()),
)
```

Exact token values vary slightly between implementations and versions. The
table above is the reference; the theme is the source of truth at runtime.

## Easing and duration tokens

Still valid, and still correct for fades, colour changes, and the web where
spring support is thinner.

**Easing:**

| Token | Curve | Use |
| --- | --- | --- |
| `emphasized` | begins slow, ends slow, strong middle | Large, prominent transitions |
| `emphasized-decelerate` | `cubic-bezier(0.05, 0.7, 0.1, 1.0)` | Elements entering the screen |
| `emphasized-accelerate` | `cubic-bezier(0.3, 0.0, 0.8, 0.15)` | Elements leaving the screen |
| `standard` | `cubic-bezier(0.2, 0.0, 0, 1.0)` | Small, functional transitions |
| `standard-decelerate` | `cubic-bezier(0, 0, 0, 1)` | Entering, small |
| `standard-accelerate` | `cubic-bezier(0.3, 0, 1, 1)` | Exiting, small |
| `linear` | — | Continuous motion only: spinners, progress |

The asymmetry matters: things **enter decelerating** (arriving and settling) and
**exit accelerating** (leaving decisively). Using one symmetrical curve for both
is the most common motion mistake.

**Duration:** `short1–4` (50/100/150/200ms), `medium1–4` (250/300/350/400ms),
`long1–4` (450/500/550/600ms), `extra-long1–4` (700/800/900/1000ms).

Rough guidance: state changes and small fades at `short`, most component
transitions at `medium`, full-screen and large-surface transitions at `long`.
Anything past `extra-long2` needs a reason.

## What to animate

**Do:**

- Position, size and shape changes — with spatial springs.
- Opacity and colour — with effects springs or duration tokens.
- Shape morphs on press and selection.
- Container transforms, where one element visibly becomes another (a card
  expanding into a detail view). This is Material's signature transition.
- Navigation transitions, consistently in one direction per navigation depth.

**Don't:**

- Animate layout on first paint. A screen should arrive composed, not assemble
  itself while the user waits.
- Animate more than two or three things at once in one region. Stagger instead.
- Animate to communicate something static — motion carries change, not state.
- Use motion as the only signal for an important change; pair it with a visible
  result.

## Reduced motion

Honour the system preference. This is a hard requirement, not a nicety —
vestibular disorders make large unexpected motion genuinely unpleasant.

When reduced motion is requested: replace spatial motion with a cross-fade,
keep duration short, drop parallax, overshoot and bounce entirely. Do not
disable transitions altogether — an instant swap can be more disorienting than
a short fade, because the change goes unnoticed.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  /* then reinstate short opacity transitions deliberately */
}
```

In Compose, check the system setting and substitute `snap()` or a short
`tween()` for spring specs.

## Checks

- Spatial changes use springs; fades use effects springs or durations.
- One motion scheme across the product.
- Entering animations decelerate, exiting animations accelerate.
- Nothing animates on first paint.
- Reduced motion handled with fades, not with nothing.
