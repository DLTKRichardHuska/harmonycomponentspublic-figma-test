# Plan: Date / time pickers (finish in-progress)

**Status:** approved  
**Conversion:** harmony-design-system-react-mui  
**Scope:** DateInput, DatePicker, TimePicker, DateTimePicker, MonthPicker, PickerPopup  
**Approved by:** user (execute Finish in-progress date/time pickers)  
**Date:** 2026-07-16

## Element strategy (reuse — do not re-litigate)

| Element | Strategy | Target |
|---------|----------|--------|
| DateInput | existing-mui | MUI X DatePicker / TimePicker / DateTimePicker; month via year/month views |
| DatePicker | existing-mui | `@mui/x-date-pickers/DatePicker` |
| TimePicker | existing-mui | `@mui/x-date-pickers/TimePicker` |
| DateTimePicker | existing-mui | `@mui/x-date-pickers/DateTimePicker` |
| MonthPicker | existing-mui | DatePicker `views=[year, month]` `openTo=month` |
| PickerPopup | existing-mui | MUI X popper/layout slots (no standalone export) |
| WeekPicker | skip | MUI X Community has no WeekPicker |

Prop mappings, composites, skipped props, and `userDecision` live in `conversion.manifest.json`.

## Accepted / deferred gaps

- Empty-state whole-field placeholders (`Select date`) — accepted technology gap; muted MUI X format masks remain
- `WeekPicker` / `DateInput type=week` — skip (gap)
- DateRange / DateRangeExpanded — deferred follow-up (demo callout only)

## Sequence

1. Accept DateInput-3 PASS (0 open defects; empty-copy gap already accepted)
2. Mark DateInput, DatePicker, TimePicker, DateTimePicker, MonthPicker, PickerPopup → `synced`
3. Leave WeekPicker as `gap`
4. `compute_coverage.mjs --conversion harmony-design-system-react-mui --write`

## Out of scope

Toggle, Shell, Tables, Dialogs, DateRange implementation; custom Harmony* wrappers; purity exceptions.
