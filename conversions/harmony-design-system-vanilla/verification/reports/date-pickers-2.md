# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `date-pickers` (PickerPopup, DatePicker, TimePicker, MonthPicker, WeekPicker) |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-11T01:40:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| plan | `conversions/harmony-design-system-vanilla/plans/date-pickers.md` |
| manifest | `elements.PickerPopup` / `DatePicker` / `TimePicker` / `MonthPicker` / `WeekPicker` — `web-component`, `in-progress` — not marked `synced` |
| prior | `verification/reports/date-pickers-1.md` (FAIL, DEF-001 open) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 6 |
| accepted | 0 |
| **total** | 7 |

**Result:** PASS

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/date-picker` (CP light). Week popup opened from Select Week; Week 3 selected and reopened. Month Jun selected the same way. |
| converted | Live `http://localhost:5178/components/date-picker` (CP light, CP dark, forced-colors). Standalone week widget value `2024-W03`. |
| screenshots | `conversions/harmony-design-system-vanilla/verification/artifacts/date-pickers-2/` (`conv-cp-light-week.png`, `conv-cp-light-week3.png`, `ref-cp-light-week-popup.png`, `ref-cp-light-selected-week.png`, `conv-cp-light-month.png`, `ref-cp-light-selected-month.png`, `conv-cp-dark-week.png`, `conv-forced-colors-week.png`, calendar / time / popup / disabled clips) |
| metrics | `conv-light-metrics.json`, `conv-dark-metrics.json`, `conv-forced-colors-metrics.json`, `ref-week-selected-metrics.json` — supporting only; verdict is the screenshots |

Rendered evidence reviewed on both servers. Computed style was not used as the pass gate.

## Content parity

Inventory is the reference Date Picker page versus the converted widget page. Unconverted field and range sections stay approved scope exclusions — not open defects.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Date Picker | present | Converted title matches; badge is in-progress demo chrome, not the reference stable badge. |
| Intro: custom pickers, tokens, keyboard | deferred | Converted intro describes the five widgets and popup, not the DateInput field page. Approved. |
| In-page nav: Examples, Date Range Picker, Props, Accessibility | deferred | Range, field props, and educational a11y cards are out of this scope. Widget keyboard/ARIA live in component docs. |
| Date Input field (label, readonly field, calendar icon) | deferred | DateInput not converted. Callout on the converted page. |
| Time Input field | deferred | Standalone `harmony-time-picker` (24h and 12h) instead of a field. |
| Date and Time field | deferred | DateTimePicker not converted. Callout. |
| With Constraints field (next 30 days) | present | Constraints shown on the calendar widget; days outside min/max are muted and not selectable. |
| Disabled field | deferred | Standalone disabled calendar with value 2024-01-15, not a disabled text field. |
| Stacked / inline label fields | deferred | Form-layout wiring waits on DateInput. |
| Month Picker field | present | Month grid widget with year nav and Jun selected. |
| Week Picker field | present | Week list is present. Week 3 now reads as the selected row (DEF-001 fixed). Year differs (widget is 2024; reference field opens 2026) — same selected treatment. |
| 12-hour time | present | AM/PM widget; PM filled for 14:30. |
| Date Range Picker / Expanded | deferred | Callout. No range-day modifiers. |
| Props tables for DatePicker / range / DateInput | deferred | Converted API table covers the five tags, events, and value formats. Consumer docs hold the full attribute tables. |
| Accessibility cards (keyboard, ARIA, focus, SR) | deferred | Educational cards omitted. Keyboard and roles checked on the widgets in iteration 1. |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Calendar chrome | Bordered panel, chevron month nav, September 2026, Sun–Sat row, day cells | Same rhythm in a card: bordered calendar, chevrons, September 2026, weekday row | present |
| Today | 10 outlined in Costpoint blue, semibold | Same: 10 outlined in the same blue, semibold (light and dark) | present |
| Other-month days | Muted gray outside the month | Muted gray outside the month | present |
| Constrained days | Opening a min/max field disables days outside the range | Next-30-days widget: days outside min/max are gray and not selectable | present |
| Disabled calendar | Disabled field shows the date in a field, not an open grid | Open January 2024 grid, nav muted, 15 a washed blue among pale days — readable as disabled selected | present |
| Time 24h | Popup: boxed hour and minute, colon, up/down chevrons | Standalone boxed inputs with chevrons (value 14:30) | present |
| Time 12h | Field popup with AM/PM | 02:30 with AM outline and PM solid blue | present |
| Month grid | Year nav, 3×4 month buttons, bordered tiles; selected month is a solid primary tile with light text | 2024, same 3×4 tiles; Jun is a solid blue tile with white text, same fill as the reference selected month | present |
| Week list | Compact popup: year between chevrons, Week n left, date range right, scroll | Same list layout, year between chevrons, list scrolls | present |
| Selected week | Selected week is a solid Costpoint-blue row. Week label and date range are white on that fill — same treatment as a chosen month | Week 3 (2024-W03, Jan 15 – Jan 21) is a solid blue row with white label and white date range. Neighbor weeks stay plain dark text on the card. Same selected row as the reference week popup | present |
| Popup placement | Opens under the field, left-aligned, small gap | Choose date opens a titled panel under the trigger with the calendar | present |
| Popup chrome | DateInput popups have no title bar | Titled Select date plus close — approved popup title demo, not DateInput field chrome | present |
| Dark calendar / week | Page and popup use dark surfaces; selected fill stays a lighter primary with dark text | Card is dark; Week 3 is a light-blue row with dark text; unselected weeks stay light text on the dark card | present |
| Forced colors | No reference baseline | Unselected weeks are black-bordered white rows; Week 3 is a solid highlight fill with light text on both the label and the date range. Selected month and PM use the same highlight fill | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | confirmed for approved exclusions; pending before manifest `synced` |
| Confirmed by | explicit user instruction (do not fail DateInput, DateTimePicker, DateRange pickers, no native date input dual path, Popover API popup) |
| Notes | DEF-001 is fixed, not accepted. Do not mark these elements `synced` on this report. |

**conversion-agent** must **AskQuestion** before sync when Status is `pending`.

## Defects

### DEF-001

- **status:** fixed
- **category:** visual
- **reference:** On the week picker, the selected week is a solid primary-blue row. The week label and date range are light text on that fill — the same selected treatment as a chosen month.
- **converted:** On `/components/date-picker`, **Month and week**, Week 3 is now that same solid blue row. The label **Week 3** and the range **Jan 15 – Jan 21** are both white. Jun beside it is the same blue tile. A designer can see which week is selected.
- **description:** The previous gap (plain row, faded date range) is gone. Light, dark, and forced-colors all show the selected week as a filled row, not an ordinary list item.
- **evidence:** Live converted page, CP light, `verification/artifacts/date-pickers-2/conv-cp-light-week.png` beside `ref-cp-light-week-popup.png`. Close clips: `conv-cp-light-week3.png` and `ref-cp-light-selected-week.png`. Dark: `conv-cp-dark-week.png`. Forced-colors: `conv-forced-colors-week.png`.
- **remediationHint:** None. Selected rules now paint after the base week rule. Do not move `.week-picker__week` back below `.week-picker__week--selected`.

## Blocked items

None. Both review servers responded.

## Verifier notes

Readonly. Content and visual matrices use rendered descriptions. Week 3 was judged from screenshots of the live pages, not from CSS order or computed style alone.

Checked and not failed on this pass:

- Selected week matches the reference selected row and the selected month tile (solid primary fill, light text, semibold). Unselected weeks stay plain.
- Calendar today ring, other-month mute, disabled January 2024 day 15, 12-hour PM fill, and the titled popup calendar are unchanged from the prior pass.
- Forced-colors still show a highlight fill for the selected week, with a border on unselected rows — usable without a reference HC baseline.
- Approved exclusions remain deferred, not open defects.

Do not mark these elements `synced` from this report.
