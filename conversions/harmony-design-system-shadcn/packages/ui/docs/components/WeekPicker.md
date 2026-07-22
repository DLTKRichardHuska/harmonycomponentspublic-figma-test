# WeekPicker

ISO week list with year navigation. Value: `YYYY-Www`.

## Import

```tsx
import { WeekPicker } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` (YYYY-Www) | — | Selected week |
| `onSelect` | `(week: string) => void` | — | Week selected |
| `min` / `max` | `string` | — | Bounds |
| `locale` | `string` | `'en-US'` | Range labels |
| `disabled` | `boolean` | `false` | Disable |

See [DateInput.md](./DateInput.md) for `DateInput type="week"`.
