# Link

cva-styled `<a>` (no stock shadcn Link). Uses package **Icon** for `external`.

## Import

```tsx
import { Link } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<Link href="/docs">Documentation</Link>
<Link href="https://example.com" external>
  External site
</Link>
<Link href="/muted" muted size="sm">
  Muted
</Link>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | — | Required |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Text size |
| `muted` | `boolean` | `false` | Muted color |
| `external` | `boolean` | `false` | `target=_blank`, `rel=noopener`, Icon |
| `asChild` | `boolean` | `false` | Radix Slot |
| HTML attrs | — | — | Forwarded to `<a>` |

**Skipped:** Astro responsive default size below 768px when no size class — always use explicit `size` (default `md`).

Export `linkVariants`. Demo: `/components/links`.
