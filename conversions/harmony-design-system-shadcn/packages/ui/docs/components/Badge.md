# Badge

Harmony status / label chip — stock [shadcn Badge](https://ui.shadcn.com/docs/components/badge) pattern with Alert Chip color tokens and package `Icon`.

## Import

```tsx
import { Badge, badgeVariants } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

Requires `HarmonyThemeProvider` and package styles (see Getting Started).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'orange' \| 'pink' \| 'disabled'` | `'default'` | Alert Chip color set |
| `size` | `'sm' \| 'md' \| 'lg'` | `'lg'` | Height / padding — maps Astro `small` / `medium` / `large` (default large → `lg`) |
| `icon` | `string` | — | Harmony `Icon` name (leading) |
| `className` | `string` | — | Extra classes (`cn` / `badgeVariants`) |
| `children` | `ReactNode` | — | Label |

## Inherited / stack surface

Forwards `ref` and `HTMLAttributes` on the root `<span>`. Presentational — no custom Harmony events or `asChild`.

```tsx
<Badge>Default</Badge>
<Badge variant="success" size="sm">Done</Badge>
<Badge variant="primary" icon="check-circle">Approved</Badge>
```

Also export `badgeVariants` for composing the same styles onto custom elements.

## Behavior notes

- **Astro size names:** reference `small` / `medium` / `large` → stack `sm` / `md` / `lg`. Default remains large (`lg`).
- **Icon size map:** `sm→xs`, `md→xs`, `lg→sm` (package `Icon`).
- **`disabled` variant:** visual only — does not set `aria-disabled` or block clicks (use parent controls if interactive).

## Composition recipes

```tsx
<div className="flex flex-wrap gap-2">
  <Badge variant="info">Info</Badge>
  <Badge variant="warning" icon="exclamation-triangle">Risk</Badge>
  <Badge variant="error" size="md">Blocked</Badge>
</div>
```

```tsx
import { badgeVariants } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { cn } from '@dltkrichardhuska/harmony-design-system-shadcn/utils';

<span className={cn(badgeVariants({ variant: 'orange', size: 'sm' }))}>Custom</span>
```

## If you were about to use stock shadcn Badge

| Stock shadcn | Harmony |
|--------------|---------|
| `variant="default"` / `secondary` / `destructive` / `outline` | Harmony set: `default`, `primary`, `success`, `warning`, `error`, `info`, `orange`, `pink`, `disabled` |
| Size via `className` | `size="sm" \| "md" \| "lg"` (default `lg`) |
| Lucide child icons | `icon="check-circle"` (package `Icon` names) |
| Local `badgeVariants` | Package `badgeVariants` |

## Do not

- Pass Astro size strings (`small` / `medium` / `large`) — use `sm` / `md` / `lg`
- Import Lucide for badge glyphs — use `icon` + Harmony names
- Confuse with `NotificationBadge` (counts/dots) or `Chip` (interactive filters)
