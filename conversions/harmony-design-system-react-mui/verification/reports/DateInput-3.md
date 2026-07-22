# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `DateInput`, `DatePicker`, `TimePicker`, `DateTimePicker`, `MonthPicker`, `PickerPopup` |
| iteration | `3` |
| artifactType | `html` |
| generatedAt | `2026-07-16T23:05:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 5 |
| blocked | 0 |
| deferred | 2 |
| accepted | 1 |
| **total** | 8 |

**Result:** PASS (pending human confirmation)

**PASS: zero open conversion defects.** Remaining items are the accepted empty-copy technology gap and plan-deferred Week / DateRange scopes.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/date-picker` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/date-picker` (HTTP 200, CP × light) |
| screenshots | `verification/artifacts/date-picker-1/` plus live iteration 2/3 probes |

### Plan decisions (not open defects)

- Use existing MUI X v9 `DatePicker` / `TimePicker` / `DateTimePicker`; month via year/month views
- `WeekPicker` / `DateInput type="week"` — approved skip
- `DateRangePicker` / Expanded — out of scope follow-up callout
- Empty-state whole-field placeholders (“Select date”) accepted as technology gap under `existing-mui` (muted format masks remain)

### Remediation re-check

| Prior defect | Outcome |
|--------------|---------|
| DEF-001 Field density | fixed |
| DEF-002 Field border/fill | fixed |
| DEF-003 Empty tone/copy | tone fixed; copy accepted |
| DEF-004 Disabled fill | fixed |
| DEF-005 Today chrome | fixed — transparent fill + 1px primary outline |

## Content parity

All DateInput examples present except Week (skip callout) and Date Range (follow-up callout). Props, Accessibility, and Harmony mapping present.

## Visual parity

| Item | Status |
|------|--------|
| CP compact field shell (20px / 12px / 4px / Harmony border / white fill / disabled fill / focus) | present |
| Empty-state muted tone | present |
| Empty-state “Select …” copy | accepted gap (muted format masks) |
| Calendar day size ~36 and 14px type | present |
| Today primary outline + transparent fill | present |
| Week / DateRange | deferred |

## Defects

### DEF-001 — fixed
Compact CP field density via `MuiPickersOutlinedInput`.

### DEF-002 — fixed
Harmony border and input fill.

### DEF-003 — accepted
Empty fields show muted MUI X format sections (`MMMM DD, YYYY`) instead of whole-field placeholders (`Select date`). Documented MUI X accessible field API; custom field wrapper declined under approved `existing-mui` / no-wrapper strategy.

### DEF-004 — fixed
Disabled gray fill.

### DEF-005 — fixed
Today transparent fill with explicit `1px solid` primary outline; focus keeps transparent fill; selected today uses primary fill.

### DEF-006 — deferred
WeekPicker skip.

### DEF-007 — deferred
DateRange follow-up.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | accepted |
| Confirmed by | user |
| Notes | Visual match accepted (“The date pickers look good”); empty-state format-mask gap accepted; Week skip and DateRange deferred unchanged. |

## Verifier notes

PASS with human acceptance. Synced DateInput, DatePicker, TimePicker, DateTimePicker, MonthPicker, PickerPopup; WeekPicker remains `gap`/`skip`.
