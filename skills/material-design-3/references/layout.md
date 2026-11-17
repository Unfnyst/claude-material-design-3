# Layout

## Breakpoints (window size classes)

Based on the **window** available to the app, not the physical screen. A phone
app in a freeform window on a desktop is compact. The window size class can
change during the app's lifetime — split screen, folding, window resize.

| Class | Width | Typical |
| --- | --- | --- |
| Compact | < 600dp | Phone portrait |
| Medium | 600–839dp | Phone landscape, small tablet portrait, unfolded portrait |
| Expanded | 840–1199dp | Tablet landscape, unfolded landscape |
| Large | 1200–1599dp | Large tablet, small desktop |
| Extra-large | ≥ 1600dp | Desktop, connected displays |

Height classes: compact < 480dp, medium 480–899dp, expanded ≥ 900dp.

**Width is what matters most**, because vertical scrolling is universal. But
check height for one specific case: a phone in landscape has medium width and
compact height, where a two-pane layout fails — there is not enough vertical
room for either pane to be useful.

Large and extra-large were added for desktop and connected displays. If the
product only ever runs on phones and tablets, handling compact/medium/expanded
is sufficient.

## Panes

The pane count follows the breakpoint:

| Class | Panes |
| --- | --- |
| Compact | 1 |
| Medium | 1, or 2 if content is genuinely hierarchical |
| Expanded | 2 |
| Large / extra-large | 2, or 3 with a supporting pane |

Never more than three. Beyond that, people lose track of which pane they are
acting in.

**Patterns:**

- **List–detail.** List on the left, detail on the right. At compact, these
  become two destinations with navigation between them. The canonical case:
  mail, settings, file browsers.
- **Supporting pane.** A main pane plus a secondary pane for tools, filters, or
  metadata. The supporting pane collapses first as width shrinks.
- **Feed.** A grid that reflows by adding columns rather than restructuring.

Decide which pane owns the back action before building. In list–detail at
compact, back goes from detail to list; at expanded, back exits the screen
entirely because both are already visible.

## Navigation per breakpoint

This mapping is close to mandatory in Material — getting it wrong is immediately
recognisable as non-native.

| Class | Navigation |
| --- | --- |
| Compact | Bottom navigation bar (3–5 destinations), or modal drawer for more |
| Medium | Navigation rail |
| Expanded | Navigation rail, or permanent drawer |
| Large / extra-large | Permanent drawer, or wide navigation rail |

The **wide navigation rail** is an Expressive-era addition for tablets and
desktop: a rail with labels alongside icons, sitting between the compact rail
and a full drawer.

A bottom bar at expanded width is wrong — it strands navigation far from the
content and wastes the horizontal space that made the breakpoint expanded. Move
it to a rail.

## Spacing and margins

Material sits on an **8dp baseline grid**. Use multiples of 8 for layout
spacing; 4dp is permitted for fine adjustment inside components.

**Window margins** — the gap between content and the window edge:

| Class | Margin |
| --- | --- |
| Compact | 16dp |
| Medium | 24dp |
| Expanded and larger | 24dp |

**Pane spacing** is 24dp between panes.

M3 Expressive introduced a formalised spacing system carried through the
components themselves, rather than spacing being applied ad hoc around them.
Where a component specifies its own internal padding, use that rather than
adding margin around it — doubling up is a frequent cause of designs that feel
loose and unlike Material.

**Content width.** At expanded and above, do not let text span the full window.
Constrain a reading column to roughly 45–75 characters and let the surrounding
space stay empty. Empty space is a layout decision, not wasted room.

## The expressive layout scaffold

The Expressive layout system provides a scaffold that adapts a screen across
breakpoints, including guidance for watches and XR, rather than requiring a
separate layout per form factor. Use the platform's scaffold component — it
handles window insets, navigation placement and pane behaviour as a unit.

Hand-rolling this is where most adaptive bugs come from: forgotten insets under
the status bar, navigation overlapping content on gesture-navigation devices,
panes that do not re-split after a fold.

## Insets and edge-to-edge

Draw edge-to-edge and then inset content by the system bars. Never assume the
status bar or navigation bar height — read it from the platform.

Specific traps:

- Scrollable content should pass **under** the system bars, with padding added
  so the last item can still be scrolled clear of them.
- A FAB must clear the navigation bar and the bottom app bar.
- On folding devices, avoid placing an interactive target across the hinge.

## Checks

- Behaviour defined for every breakpoint the product will meet, not just phone
  and desktop.
- Navigation pattern matches the breakpoint.
- No more than three panes; back behaviour defined per pane.
- Spacing on the 8dp grid; margins 16dp compact, 24dp medium and up.
- Reading columns constrained at expanded and above.
- Insets read from the platform, not hardcoded.
- Phone-landscape case checked (medium width, compact height).
