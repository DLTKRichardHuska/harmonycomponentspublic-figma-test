# DatePicker

Harmony calendar panel — shadcn Calendar pattern on `react-day-picker`, styled with Harmony tokens.

Also exported as **`Calendar`** for AI familiarity.

## Import

```tsx
import { DatePicker, Calendar } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` (YYYY-MM-DD) | — | Selected date |
| `onSelect` | `(date: string) => void` | — | Day selected |
| `min` / `max` | `string` | — | Selectable bounds |
| `disabled` | `boolean` | `false` | Disable all days |
| `locale` | `string` | `'en-US'` | Locale hint |
| `className` | `string` | — | Root classes |

Nav icons use package `Icon` (`chevron-left` / `chevron-right`).

For form fields, prefer `DateInput` / `DateInputField`. See [DateInput.md](./DateInput.md).
