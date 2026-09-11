# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `date-pickers` (PickerPopup, DatePicker, TimePicker, MonthPicker, WeekPicker) |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-11T01:25:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| plan | `conversions/harmony-design-system-vanilla/plans/date-pickers.md` |
| manifest | `elements.PickerPopup` / `DatePicker` / `TimePicker` / `MonthPicker` / `WeekPicker` — `web-component`, `in-progress` — not marked `synced` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 0 |
| blocked | 0 |
| deferred | 6 |
| accepted | 0 |
| **total** | 7 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/date-picker` (CP light). Calendar, time, month, and week popups opened from the field examples. |
| converted | Live `http://localhost:5178/components/date-picker` (CP light and CP dark via demo product/mode; forced-colors emulation). Popup opened from **Choose date**. |

Rendered evidence reviewed on both servers. Source was used only to explain the week-selected gap, not to pass it.

## Content parity

Inventory is the reference Date Picker page versus the converted widget page. Unconverted field and range sections are the approved scope exclusions — not open defects.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Date Picker | present | Converted title matches; badge is in-progress demo chrome, not the reference stable badge. |
| Intro: custom pickers, tokens, keyboard | different | Deferred — converted intro describes the five widgets and popup, not the DateInput field page. Approved. |
| In-page nav: Examples, Date Range Picker, Props, Accessibility | deferred | Range, field props, and educational a11y cards are out of this scope. Widget keyboard/ARIA live in component docs. |
| Date Input field (label, readonly field, calendar icon) | deferred | DateInput not converted. Callout on the converted page. |
| Time Input field | deferred | Standalone `harmony-time-picker` (24h and 12h) instead of a field. |
| Date and Time field | deferred | DateTimePicker not converted. Callout. |
| With Constraints field (next 30 days) | present | Constraints shown on the calendar widget; days outside min/max are muted and not selectable. |
| Disabled field | deferred | Standalone disabled calendar with value 2024-01-15, not a disabled text field. |
| Stacked / inline label fields | deferred | Form-layout wiring waits on DateInput. |
| Month Picker field | present | Month grid widget with year nav and Jun selected. |
| Week Picker field | different | Week list is present; selected week does not look selected. See DEF-001. |
| 12-hour time | present | AM/PM widget; PM filled, switching to AM updates the value. |
| Date Range Picker / Expanded | deferred | Callout. No range-day modifiers. |
| Props tables for DatePicker / range / DateInput | deferred | Converted API table covers the five tags, events, and value formats. Consumer docs hold the full attribute tables. |
| Accessibility cards (keyboard, ARIA, focus, SR) | deferred | Educational cards omitted. Keyboard and roles checked on the widgets. |

**Content gaps (open):** 0 (Week selected appearance is a visual gap, not a missing section.)

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Calendar chrome | Bordered panel, chevron month nav, **September 2026**, Sun–Sat row, 36px day cells | Same rhythm in a card: bordered calendar, chevrons, **September 2026**, weekday row, 36px cells | present |
| Today | 10 outlined in Costpoint blue, semibold | Same: 10 outlined in the same blue, semibold (light and dark) | present |
| Other-month days | Muted gray (30, 31, 1–5) | Muted gray outside the month | present |
| Constrained days | Opening a min/max field disables days outside the range | Next-30-days widget: days before 10 Sep and after the max are gray, not-allowed; in-range days stay full contrast | present |
| Disabled calendar | Disabled field shows the date in a field, not an open grid | Open January 2024 grid, nav disabled, 15 washed blue — readable as disabled selected | present |
| Time 24h | Popup: boxed hour and minute, colon, up/down chevrons, starts 00:00 | Standalone 14:30 with the same chevron and boxed inputs | present |
| Time 12h | Field popup with AM/PM (title bar not used on DateInput) | 02:30 with AM outline and PM solid blue; hour step goes to 15:30, AM click to 03:30 | present |
| Month grid | Year 2026, 3×4 month buttons, bordered tiles | 2024, same 3×4 tiles; **Jun** solid blue with light text | present |
| Week list | Compact popup: year between chevrons, **Week n** left, date range right, scroll | Same list layout, year between chevrons (not overlapping), list scrolls (max height 400px) | present |
| Selected week | Selected week is a solid primary row with light text (same treatment as selected month) | **Week 3** (value `2024-W03`) stays a plain row; only the date range is pale. No blue selected row | different |
| Popup placement | Opens under the field, left-aligned, small gap | With room below, opens under **Choose date**, left-aligned, 8px gap. Near the viewport bottom it flips above instead of clipping | present |
| Popup chrome | DateInput popups have no title bar | Titled **Select date** plus close — approved popup `title` demo, not DateInput field chrome | present |
| Dark calendar | Page and popup use dark surfaces; today ring stays visible | Card and days switch to dark surfaces; today ring stays a lighter blue | present |
| Forced colors | No reference baseline | Days have a black border on white; selected month, selected week, and PM use a solid highlight fill with light text; keyboard focus is a 2px highlight outline; panel has a border and no shadow | present |

**Visual gaps (open):** 1

## Human confirmation

| Field | Value |
|-------|-------|
| Status | confirmed for approved exclusions only; pending for the open week-selected gap |
| Confirmed by | explicit user instruction (do not fail DateInput, DateTimePicker, range, native input dual path, range-day modifiers, Popover API, role=dialog without aria-modal, standalone widgets) |
| Notes | Do not mark DEF-001 accepted without a human decision. Do not mark these elements `synced` on this report. |

**conversion-agent** must **AskQuestion** before sync when Status is `pending`.

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **reference:** On the week picker, the selected week is a solid primary-blue row. The week label and date range are light text on that fill — the same selected treatment as a chosen month (Jun).
- **converted:** On `/components/date-picker`, **Month and week**, the month grid shows **Jun** as a solid blue tile. **Week 3** (the widget’s `2024-W03` value) does not. It looks like the other weeks, except the date range **Jan 15 – Jan 21** is pale. A designer cannot see which week is selected.
- **description:** Designer would see the selected week as an ordinary list row with a faded date range, while the month next to it clearly shows the selected month in blue.
- **evidence:** Live converted page, CP light, Week 3 row. `aria-selected` is true, but the row fill is transparent and the label color is normal body text. Forced-colors does show Week 3 as a highlight row — the light/dark look is what fails.
- **remediationHint:** Later `.week-picker__week` rules reset background and color after `.week-picker__week--selected`, so the selected fill never paints. Keep the selected (and selected-range) rules after the base week rules in the shadow sheet.

## Blocked items

None. Both review servers responded.

## Verifier notes

Readonly. Content and visual matrices use rendered descriptions, not a CSS property match as a pass.

Checked and not failed:

- Popup opens under the trigger when there is room (left-aligned, 8px gap) and closes on date select (`Selected: 2026-09-15`). Escape and light dismiss close it. Near the bottom of the viewport it flips above rather than clipping.
- Keyboard: arrows, Home/End, Page Down, and Enter on the calendar; month and week arrows plus Enter; time spinbutton Arrow Up. Popup focuses a day when it opens.
- Consumer API matches `docs/components/{PickerPopup,DatePicker,TimePicker,MonthPicker,WeekPicker}.md`, `AGENTS.md`, `llms.txt`, and `custom-elements.json` (attrs, events, parts, show/hide). Widgets are not form-associated.
- `role="dialog"` with `aria-modal="false"` (approved non-modal popover). Trigger gets `aria-haspopup`, `aria-controls`, `aria-expanded`.
- Forced-colors are shadow-local: Canvas panel, Highlight selected month/week/PM, Highlight focus outline, no shadow-only boundary.
