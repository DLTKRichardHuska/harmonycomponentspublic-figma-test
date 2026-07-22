# Plan: Date/time inputs — harmony-design-system-shadcn

status: synced (verifier PASS DateInput-2; execute complete 2026-07-20)  
scope: DatePicker, TimePicker, MonthPicker, WeekPicker, PickerPopup, DateTimePicker, DateInput  
strategy: `component` (all)  
created: 2026-07-20  
approved: 2026-07-20  

## Element strategy

| Element | Strategy | Analog |
|---------|----------|--------|
| DatePicker | component | shadcn Calendar (`react-day-picker`) |
| TimePicker | component | Custom spinner panel in Popover chrome |
| MonthPicker | component | Month grid on Calendar chrome |
| WeekPicker | component | ISO week list in Calendar shell |
| PickerPopup | component | Radix/shadcn Popover |
| DateTimePicker | component | DatePicker + TimePicker composite |
| DateInput | component | Input trigger + Popover; `DateInputField` convenience |

## Approach & stack fit (locked)

**Stack:** `react-day-picker` + `@radix-ui/react-popover` + `date-fns`, Harmony tokens, package `Icon` only.

**Form hybrid:** bare primitives (no label on controls) + `Field` composition + `DateInputField` (same as InputField).

**Friction:** Time/Month/Week custom panels inside Popover; WeekPicker custom ISO logic; range pickers out of scope (callout on demo).

## Consumer API (user confirmed)

Defaults locked on execute (plan packet + implement-as-specified):

- **Picker panels:** `value` + `onSelect` (string ISO shapes).
- **DateInput:** `value` + `onChange` (form control, matches Input).
- **Calendar:** public alias of DatePicker for AI familiarity.
- **DateInputField:** `label`, `labelVariant`, `helper`, `required` + DateInput props.
- No `label` / `labelVariant` on bare DateInput or picker panels.

## Blocking dependencies

- Icon — synced
- Label / Field — synced
- Input — synced

## Out of scope

- DateRangePicker / DateRangePickerExpanded (internal)

## Execute order

1. Deps + PickerPopup / Popover
2. DatePicker (+ Calendar alias)
3. TimePicker, MonthPicker, WeekPicker
4. DateTimePicker
5. DateInput + DateInputField
6. Demos + docs + AGENTS.md
7. Verify → human accept → synced
