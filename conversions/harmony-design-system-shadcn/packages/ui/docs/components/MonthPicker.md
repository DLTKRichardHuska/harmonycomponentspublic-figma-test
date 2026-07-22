# MonthPicker

Year navigation + 12-month grid. Value: `YYYY-MM`.

## Import

```tsx
import { MonthPicker } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` (YYYY-MM) | — | Selected month |
| `onSelect` | `(month: string) => void` | — | Month selected |
| `min` / `max` | `string` | — | Bounds |
| `locale` | `string` | `'en-US'` | Month labels |
| `disabled` | `boolean` | `false` | Disable |

See [DateInput.md](./DateInput.md) for `DateInput type="month"`.
