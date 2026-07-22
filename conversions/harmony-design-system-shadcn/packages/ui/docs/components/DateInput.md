# DateInput

Form control for date/time values. Readonly Input trigger + Popover; panel swaps by `type`.

**No built-in `label` prop.** Compose with `Label` / `Field`, or use `DateInputField`.

## Import

```tsx
import {
  DateInput,
  DateInputField,
  DatePicker,
  Calendar,
  TimePicker,
  MonthPicker,
  WeekPicker,
  DateTimePicker,
  PickerPopup,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## DateInput props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'date' \| 'time' \| 'datetime-local' \| 'month' \| 'week'` | `'date'` | Picker panel |
| `value` | `string` | — | ISO value for the type |
| `onChange` | `(value: string) => void` | — | Form-style change handler |
| `min` / `max` | `string` | — | Bounds (same ISO shape) |
| `timeFormat` | `'12' \| '24'` | `'24'` | Time spinner / display |
| `locale` | `string` | `'en-US'` | Display formatting |
| `error` / `errorMessage` | `boolean` / `string` | — | Same as Input |
| `name` | `string` | — | Hidden input for forms |
| `disabled` / `required` / `id` | — | — | Standard form props |

## DateInputField

```tsx
<DateInputField label="Select Date" labelVariant="stacked" value={date} onChange={setDate} />
```

Same contract as `InputField`: `label`, `labelVariant`, `helper`, `required` + all DateInput props.

## Picker panels

| Export | Value | Handler |
|--------|-------|---------|
| `DatePicker` / `Calendar` | `YYYY-MM-DD` | `onSelect` |
| `TimePicker` | `HH:MM` | `onSelect` |
| `MonthPicker` | `YYYY-MM` | `onSelect` |
| `WeekPicker` | `YYYY-Www` | `onSelect` |
| `DateTimePicker` | `YYYY-MM-DDTHH:MM` | `onSelect` (when both set) |

`Calendar` is an alias of `DatePicker` (shadcn familiarity). Built on `react-day-picker` + Harmony tokens; icons via package `Icon`.

## PickerPopup / Popover

Radix Popover primitives (`Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`) plus `PickerPopup` convenience shell with optional title.

## Do not

- Put `label` / `labelVariant` on bare `DateInput`
- Import Lucide for calendar icons — use package `Icon` / Button `icon` names
