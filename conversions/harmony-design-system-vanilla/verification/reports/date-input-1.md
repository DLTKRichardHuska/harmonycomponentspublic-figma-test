# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `DateInput` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-11T02:55:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| plan | `conversions/harmony-design-system-vanilla/plans/DateInput.md` |
| manifest | `elements.DateInput` — `web-component`, `synced` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 6 |
| **total** | 6 |

**Result:** PASS

**PASS: zero conversion defects.** Human visual accept 2026-09-11 → synced.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/date-picker` (CP light). Date field popup opened from `#date-basic`. |
| converted | Live `http://localhost:5178/components/date-picker` (CP light, CP dark, forced-colors). `harmony-date-input` plus one form-layout row. |
| screenshots | `conversions/harmony-design-system-vanilla/verification/artifacts/date-input-1/` |
| probe | `probe.json` — supporting only; verdict is the screenshots and live browse |

Rendered evidence reviewed on both servers.

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Empty date field | White 20px field, 4px radius, gray “Select date”, trailing calendar | Same white 20px field, same radius, placeholder, and trailing calendar | present |
| Time field | “Select time” with a trailing clock | Same clock field; filled demo reads `14:30` with the clock still trailing | present |
| Datetime display | Empty “Select date & time” with a trailing calendar | Filled `Jan 15, 2024 14:30`, same calendar chrome and height | present |
| Month | Empty “Select month”, trailing calendar | Filled `June 2024`, same field chrome | present |
| Week | Empty “Select week”, trailing calendar | Filled `2024, Week 3`, same field chrome | present |
| Disabled | Gray fill, muted “Jan 15, 2024”, faded trailing calendar | Same gray fill, muted text, and faded icon | present |
| Stacked label | “Select Date” above the empty field | Same stacked label and field | present |
| Inline label | “Select Date” on the left of the empty field | Same inline label and field | present |
| Open popup | Calendar drops under the field, left-aligned, and closes after a day click | Same calendar under the field (left-aligned, ~8px gap); choosing a day closes it | present |
| Form-layout row | No form row on the reference Date Picker page | “Start” plus required mark lines up with “Name”; both controls are 20px | present |
| Forced-colors focus | Not used as the visual target | Focused field shows a 2px solid outline on the control | present |
| Forced-colors disabled | Not used as the visual target | Disabled field uses a distinct border and icon treatment, not text color alone | present |

## Defects

Zero conversion defects.

## Accepted gaps

- Web component `harmony-date-input`, open Shadow DOM, form-associated. Not a native `input type="date"`.
- No Astro auto-id, `labelFor`, automatic CP inline labels, or `error` attr.
- `time-format` changes the popup clock only. Field text stays 24-hour.
- Date range pickers and Specialty Inputs stay out of scope. The range callout remains.
- Unlabeled Date / Time examples omit the sibling “Select Date” label the reference puts outside the control. The field itself matches. Stacked, inline, and form layout show labels.

## Designer side-by-side

On Costpoint light the compact date field matches: short white box, quiet gray placeholder, calendar or clock at the trailing edge, disabled state washed gray with a faded icon. Opening the field drops the calendar under the control; picking a day closes it and fills a readable date while the form value stays the machine string. In a form row, Start and its required mark sit on the same line and at the same height as Name. Dark mode keeps the field readable. Forced colors keep a hard focus ring and a disabled state that is not hue-only.
