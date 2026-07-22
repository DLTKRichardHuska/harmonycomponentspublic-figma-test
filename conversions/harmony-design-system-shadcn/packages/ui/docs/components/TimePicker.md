# TimePicker

Hour/minute spinner panel (12h or 24h). Opens inside Popover via `DateInput type="time"` or standalone.

## Import

```tsx
import { TimePicker } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` (HH:MM) | — | 24h value |
| `onSelect` | `(time: string) => void` | — | Time changed |
| `format` | `'12' \| '24'` | `'24'` | Display / spinner mode |
| `step` | `number` | `1` | Minute step |
| `min` / `max` | `string` | — | Time bounds |
| `disabled` | `boolean` | `false` | Disable controls |

Icons via package `Icon` / `Button`. See [DateInput.md](./DateInput.md).
