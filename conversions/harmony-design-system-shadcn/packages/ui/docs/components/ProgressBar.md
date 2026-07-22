# ProgressBar

Harmony progress indicator — stock [shadcn Progress](https://ui.shadcn.com/docs/components/progress) pattern (Radix Progress) with Harmony sizes, variants, and optional percentage label.

## Import

```tsx
import { ProgressBar, progressBarVariants } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

Requires `HarmonyThemeProvider` and package styles (see Getting Started).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Current progress (required) |
| `max` | `number` | `100` | Maximum value |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Bar height via `--space-1` / `--space-2` / `--space-3` |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'` | Indicator color |
| `showLabel` | `boolean` | `false` | Percentage label below the bar |
| `className` | `string` | — | Extra classes on the Radix root |

## Inherited / stack surface

Forwards `ref` and other safe `HTMLAttributes` on the outer wrapper `<div>` (e.g. `id`, `data-*`, `aria-*`). Presentational — no custom Harmony events or `asChild`. `value` / `max` drive Radix Progress; the root omits `children`.

```tsx
<ProgressBar value={40} />
<ProgressBar value={72} max={100} size="lg" variant="success" showLabel />
```

Also export `progressBarVariants` for composing the same track/indicator styles.

## Behavior notes

- **Clamping:** `value` is clamped to `[0, max]`; invalid `max` (≤ 0) falls back to `100`.
- **Label:** `showLabel` renders rounded percentage text under the bar.
- **Motion:** indicator uses `transition-transform duration-300 ease-out`.

## Composition recipes

```tsx
{/* Inline with Alert progressValue — or nest ProgressBar yourself */}
<ProgressBar value={60} size="sm" variant="warning" />

{/* Full-width block in a card */}
<div className="w-full space-y-2">
  <span className="text-sm text-[var(--text-secondary)]">Upload</span>
  <ProgressBar value={35} showLabel />
</div>
```

## If you were about to use stock shadcn Progress

| Stock shadcn | Harmony |
|--------------|---------|
| `Progress` | `ProgressBar` |
| Size via `className="h-*"` | `size="sm" \| "md" \| "lg"` |
| Indicator color via CSS | `variant="default" \| "success" \| "warning" \| "error"` |
| Manual % text | `showLabel` |
| `progressVariants` (local) | `progressBarVariants` |

## Do not

- Expect indeterminate animation — API is determinate `value` / `max` only
- Restyle with Lucide or foreign progress widgets — use package `ProgressBar`
