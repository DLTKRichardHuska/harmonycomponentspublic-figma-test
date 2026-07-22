# Tooltip

shadcn-style compound Tooltip on **`@radix-ui/react-tooltip`**. Prefer wrapping the app (or page) in **TooltipProvider**.

## Import

```tsx
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Button,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="secondary">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent text="Helpful tip" position="top" />
  </Tooltip>
</TooltipProvider>
```

## Props

### TooltipContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | — | Convenience body (children win) |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Maps to Radix `side` |
| `side` / `sideOffset` | Radix | `sideOffset` 8 | Standard Radix props |
| `children` | `ReactNode` | — | Content override |

**Skipped:** Astro `cornerVariant` (sharp corners / no arrow) — no Radix equivalent.

Demo: `/components/tooltips`.
