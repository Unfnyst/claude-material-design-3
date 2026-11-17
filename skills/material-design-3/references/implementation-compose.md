# Jetpack Compose

Compose is the reference implementation and gets Expressive components first.
Material's own direction for Android is Compose-first.

## Dependencies

```kotlin
dependencies {
    implementation(platform("androidx.compose:compose-bom:<current>"))
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material3:material3-window-size-class")
    implementation("androidx.compose.material3.adaptive:adaptive")
    implementation("androidx.compose.material3.adaptive:adaptive-layout")
    implementation("androidx.compose.material3.adaptive:adaptive-navigation")
}
```

Check which `material3` version is resolved before relying on newer components
— the hero carousel, secure password fields and auto-sizing text arrived in
recent releases, and some Expressive APIs remain behind
`@OptIn(ExperimentalMaterial3ExpressiveApi::class)`.

## Theme

`MaterialExpressiveTheme` is the Expressive entry point. It takes a motion
scheme alongside colour, shape and typography.

```kotlin
@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit,
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context)
            else dynamicLightColorScheme(context)
        }
        darkTheme -> M3DarkColors
        else -> M3LightColors
    }

    MaterialExpressiveTheme(
        colorScheme = colorScheme,
        motionScheme = MotionScheme.expressive(),
        content = content,
    )
}
```

**Prefer dynamic colour on Android 12+.** It is the point of Material You — the
scheme follows the user's wallpaper. Keep a generated fallback for older
versions and for when a brand colour must hold:

```bash
node scripts/m3-theme.mjs --seed "#6750A4" --format compose > Color.kt
```

Use `MotionScheme.standard()` instead of `expressive()` for dense, utilitarian
interfaces where bounce reads as noise.

## Using the theme

Read from `MaterialTheme`; never hardcode.

```kotlin
Surface(
    color = MaterialTheme.colorScheme.surfaceContainer,
    contentColor = MaterialTheme.colorScheme.onSurface,
    shape = MaterialTheme.shapes.medium,
) {
    Text("Title", style = MaterialTheme.typography.titleMedium)
}
```

`Surface` sets `LocalContentColor`, so descendant `Text` and `Icon` inherit the
correct `on-` colour automatically. Using a raw `Box` with a background colour
loses that and is how mismatched content colours creep in.

## Motion

Pull specs from the theme so a scheme change propagates:

```kotlin
val motion = MaterialTheme.motionScheme

val offset by animateDpAsState(
    targetValue = if (expanded) 0.dp else 24.dp,
    animationSpec = motion.defaultSpatialSpec(),
)

AnimatedVisibility(
    visible = visible,
    enter = fadeIn(animationSpec = motion.defaultEffectsSpec()),
    exit = fadeOut(animationSpec = motion.fastEffectsSpec()),
)
```

Spatial specs for movement, effects specs for alpha and colour. Falling back to
`tween(300)` for a spatial change is the most common way Expressive motion gets
lost.

For reduced motion, check the system setting and substitute `snap()` or a short
`tween()`.

## Shapes

```kotlin
Box(Modifier.clip(MaterialTheme.shapes.extraLarge))
```

The Expressive shape library:

```kotlin
@OptIn(ExperimentalMaterial3ExpressiveApi::class)
Box(
    Modifier
        .size(96.dp)
        .clip(MaterialShapes.Cookie9Sided.toShape())
)
```

Decorative use only — avatars, image crops, loading indicators, empty states.
Never as the bounds of a tap target.

## Adaptive layout

Let the adaptive libraries handle breakpoints rather than reading raw widths:

```kotlin
val windowSizeClass = currentWindowAdaptiveInfo().windowSizeClass

val showRail = windowSizeClass.isWidthAtLeastBreakpoint(
    WindowSizeClass.WIDTH_DP_MEDIUM_LOWER_BOUND
)
```

Breakpoint constants: `WIDTH_DP_MEDIUM_LOWER_BOUND` 600,
`WIDTH_DP_EXPANDED_LOWER_BOUND` 840, `WIDTH_DP_LARGE_LOWER_BOUND` 1200,
`WIDTH_DP_EXTRA_LARGE_LOWER_BOUND` 1600, `HEIGHT_DP_MEDIUM_LOWER_BOUND` 480,
`HEIGHT_DP_EXPANDED_LOWER_BOUND` 900.

For navigation that adapts on its own:

```kotlin
NavigationSuiteScaffold(
    navigationSuiteItems = {
        destinations.forEach { dest ->
            item(
                selected = dest == current,
                onClick = { navigate(dest) },
                icon = { Icon(dest.icon, contentDescription = dest.label) },
                label = { Text(dest.label) },
            )
        }
    },
) {
    AppContent()
}
```

That picks a bottom bar, rail or drawer per window size class — the mapping in
`layout.md` — without branching by hand.

For list–detail, use `ListDetailPaneScaffold` from `adaptive-layout`; it handles
pane counts, back behaviour and the compact single-pane case.

## Insets

```kotlin
enableEdgeToEdge()  // in onCreate
```

```kotlin
Scaffold { padding ->
    LazyColumn(contentPadding = padding) { /* ... */ }
}
```

Pass `Scaffold`'s padding to the scrollable content's `contentPadding`, not to
a `Modifier.padding` on the list. The former lets content scroll under the
system bars while still clearing them at rest; the latter clips the scroll
region short.

## Accessibility

```kotlin
IconButton(onClick = onSearch) {
    Icon(Icons.Default.Search, contentDescription = "Search")
}

Icon(Icons.Default.ChevronRight, contentDescription = null)  // decorative

Modifier.semantics { selected = isSelected }

Modifier.minimumInteractiveComponentSize()  // enforces the 48dp target
```

Use `sp` for text and `dp` for layout — never `dp` for font size, or text stops
scaling with the user's setting.

Use `start`/`end` rather than `left`/`right` so RTL mirrors correctly.

## Previews

```kotlin
@Preview(name = "Light")
@Preview(name = "Dark", uiMode = Configuration.UI_MODE_NIGHT_YES)
@Preview(name = "Large text", fontScale = 2.0f)
@Preview(name = "Tablet", device = Devices.TABLET)
@Composable
private fun ScreenPreview() {
    AppTheme { Screen() }
}
```

Previewing all four catches the majority of M3 defects — dark-mode contrast,
200% text clipping, and layouts that assume compact width.
