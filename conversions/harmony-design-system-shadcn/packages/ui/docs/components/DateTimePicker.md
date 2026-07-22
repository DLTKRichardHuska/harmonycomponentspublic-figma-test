# DateTimePicker

Composite of `DatePicker` + `TimePicker`. Emits `YYYY-MM-DDTHH:MM` via `onSelect` when both date and time are set.

## Import

```tsx
import { DateTimePicker } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` (YYYY-MM-DDTHH:MM) | — | Selected datetime |
| `onSelect` | `(datetime: string) => void` | — | Both parts set |
| `timeFormat` | `'12' \| '24'` | `'24'` | Time panel format |
| `min` / `max` | `string` | — | Datetime or date bounds |
| `locale` | `string` | `'en-US'` | Date locale |
| `disabled` | `boolean` | `false` | Disable |

Prefer `DateInput type="datetime-local"` for form fields. See [DateInput.md](./DateInput.md).
