# React + Tailwind

## Setup

Generate tokens plus a Tailwind theme block in one step:

```bash
npm i @material/material-color-utilities
node scripts/m3-theme.mjs --seed "#6750A4" --format tailwind > src/m3-theme.css
```

The `tailwind` format emits the `--md-sys-color-*` custom properties for both
schemes, then an `@theme inline` block mapping each role onto a Tailwind colour.
Import it after Tailwind:

```css
/* src/index.css */
@import 'tailwindcss';
@import './m3-theme.css';
```

Every role is then a utility: `bg-primary`, `text-on-primary`,
`bg-surface-container-high`, `border-outline-variant`,
`text-on-surface-variant`.

Dark mode comes from the generated CSS — `prefers-color-scheme` automatically,
or `data-theme="dark"` on `<html>` for a manual toggle. **You do not need
Tailwind's `dark:` variant for colour**, because the custom properties swap
underneath. Writing `dark:bg-slate-800` next to M3 roles is a sign the token
layer is being bypassed.

## Remaining theme tokens

```css
@theme {
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-lg-increased: 20px;
  --radius-xl: 28px;
  --radius-xl-increased: 32px;
  --radius-2xl: 48px;

  --text-display-large: 3.5625rem;
  --text-display-large--line-height: 4rem;
  --text-display-large--letter-spacing: -0.015625rem;
  --text-display-large--font-weight: 400;

  --text-headline-large: 2rem;
  --text-headline-large--line-height: 2.5rem;
  --text-headline-large--font-weight: 400;

  --text-title-medium: 1rem;
  --text-title-medium--line-height: 1.5rem;
  --text-title-medium--letter-spacing: 0.009375rem;
  --text-title-medium--font-weight: 500;

  --text-body-large: 1rem;
  --text-body-large--line-height: 1.5rem;
  --text-body-large--letter-spacing: 0.03125rem;
  --text-body-large--font-weight: 400;

  --text-body-medium: 0.875rem;
  --text-body-medium--line-height: 1.25rem;
  --text-body-medium--letter-spacing: 0.015625rem;
  --text-body-medium--font-weight: 400;

  --text-label-large: 0.875rem;
  --text-label-large--line-height: 1.25rem;
  --text-label-large--letter-spacing: 0.00625rem;
  --text-label-large--font-weight: 500;

  --ease-m3-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-m3-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --ease-m3-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
}
```

Then `text-body-large`, `rounded-md`, `ease-m3-standard` work as utilities.
Add the rest of the type scale from `typography.md` as needed.

## State layers

Tailwind's `hover:bg-*` replaces the background rather than overlaying it,
which is not how M3 states work. Define a state-layer utility once:

```css
@utility m3-state {
  position: relative;
  isolation: isolate;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0;
    pointer-events: none;
    border-radius: inherit;
    transition: opacity 100ms var(--ease-m3-standard);
  }
  &:hover::after { opacity: 0.08; }
  &:focus-visible::after { opacity: 0.12; }
  &:active::after { opacity: 0.12; }
  &:disabled::after { opacity: 0; }
}
```

## Components

```tsx
import { type ReactNode, type ButtonHTMLAttributes } from 'react';

type Variant = 'filled' | 'tonal' | 'elevated' | 'outlined' | 'text';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const variants: Record<Variant, string> = {
  filled: 'bg-primary text-on-primary',
  tonal: 'bg-secondary-container text-on-secondary-container',
  elevated: 'bg-surface-container-low text-primary shadow-md',
  outlined: 'border border-outline text-primary',
  text: 'text-primary',
};

// Heights and padding from the M3 Expressive button spec.
const sizes: Record<Size, string> = {
  xs: 'min-h-8 px-3 text-label-large',
  sm: 'min-h-10 px-4 text-label-large',
  md: 'min-h-14 px-6 text-title-medium',
  lg: 'min-h-24 px-12 text-headline-small',
  xl: 'min-h-34 px-16 text-headline-large',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = 'filled',
  size = 'sm',
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={[
        'm3-state inline-flex items-center justify-center gap-2',
        'rounded-full cursor-pointer',
        'disabled:opacity-38 disabled:pointer-events-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'focus-visible:outline-primary',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}
```

Note `xs` and `sm` fall below 48px. Either wrap them in a padded hit area or
apply `before:absolute before:inset-x-0 before:-inset-y-1 before:min-h-12`.

```tsx
export function Card({
  variant = 'filled',
  children,
}: {
  variant?: 'elevated' | 'filled' | 'outlined';
  children: ReactNode;
}) {
  const styles = {
    elevated: 'bg-surface-container-low shadow-sm',
    filled: 'bg-surface-container-highest',
    outlined: 'bg-surface border border-outline-variant',
  }[variant];

  return (
    <div className={`rounded-md p-4 text-on-surface ${styles}`}>{children}</div>
  );
}
```

## Motion

Tailwind transitions are duration-based, so they cover effects well and spatial
motion only approximately. For real spring behaviour use Motion (formerly
Framer Motion) with the spring values from `motion.md`:

```tsx
import { motion } from 'motion/react';

// Expressive default spatial: damping 0.8, stiffness 380
<motion.div
  animate={{ y: open ? 0 : 24 }}
  transition={{ type: 'spring', stiffness: 380, damping: 0.8 * 2 * Math.sqrt(380) }}
/>
```

Motion's `damping` is a coefficient, not a ratio — convert with
`c = 2 × ζ × √k`. Passing the ratio directly gives motion far more bouncy than
intended, which is a frequent bug.

Respect reduced motion:

```tsx
import { useReducedMotion } from 'motion/react';

const reduce = useReducedMotion();
const spec = reduce
  ? { duration: 0.1 }
  : { type: 'spring', stiffness: 380, damping: 31 };
```

## Breakpoints

Tailwind's defaults do not match Material's. Override them:

```css
@theme {
  --breakpoint-compact: 0px;
  --breakpoint-medium: 600px;
  --breakpoint-expanded: 840px;
  --breakpoint-large: 1200px;
  --breakpoint-xlarge: 1600px;
}
```

Then `medium:`, `expanded:`, `large:` prefixes line up with the window size
classes in `layout.md`, and navigation patterns can key off them directly.
