# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `DateTimePicker` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-11T02:10:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| plan | `conversions/harmony-design-system-vanilla/plans/DateTimePicker.md` |
| manifest | `elements.DateTimePicker` — `web-component`, `synced` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 0 |
| blocked | 0 |
| deferred | 4 |
| accepted | 0 |
| **total** | 4 |

**Result:** PASS

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/date-picker` (CP light). Date and Time popup opened from `datetime-basic`. |
| converted | Live `http://localhost:5178/components/date-picker` (CP light, CP dark, forced-colors). Standalone `harmony-datetime-picker`. |
| screenshots | `conversions/harmony-design-system-vanilla/verification/artifacts/datetime-1/` (`ref-cp-light-popup.png`, `conv-cp-light-filled.png`, `conv-cp-light-12h.png`, `conv-cp-light-empty.png`, `conv-cp-light-disabled.png`, `conv-cp-dark-filled.png`, `conv-forced-colors-filled.png`) |
| probe | `probe.json` — supporting only; verdict is the screenshots |

Rendered evidence reviewed on both servers.

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Date and Time widget | present | Standalone sections on the Date Picker page. Not a form field (approved). |
| Calendar, divider, time spinner | present | |
| Empty, prefilled, 12-hour, disabled | present | Approved demos |
| DateInput field, label, popup chrome | deferred | Out of scope. Not failed. |
| Specialty Inputs props table | deferred | Intentionally not converted. NumberInput and RangeInput are not started. |
| Date range | deferred | Out of scope. Not failed. |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Combined widget | White calendar card, current month, today as a blue ring, time `00:00`, hairline under the grid | Same stacked calendar and spinner. Empty shot is after a day click (day filled, time still `00:00`) | present |
| Divider | Hairline under the calendar, gap before the spinner | Same hairline and gap in light, dark, and high contrast | present |
| Prefilled `2024-01-15T14:30` | Not opened with a value | January 2024, 15 solid blue, time `14:30` / `02:30 PM`. Light filled PNG shows 16 only because the probe clicked it first | present |
| 12-hour | Not shown on the date-picker page | `02` `:` `30`, AM outline, PM filled blue | present |
| Disabled | Not shown as a datetime widget | Same layout, faded blue 15, muted numbers and chevrons | present |
| Dark | Not captured for this popup | Dark card, light type, light-blue selected day, dark time boxes, divider visible | present |
| Forced colors | No reference baseline | White canvas, black type, bordered days, selected day distinct, black divider between date and time | present |

**Visual gaps (open):** 0

## Behavior and API

`2024-01-15T14:30` splits to date `2024-01-15` and time `14:30`. `time-format="12"` maps to the time picker. `disabled` reaches both children. Clicking 16 emitted `datetime-select` `2024-01-16T14:30` and updated the host. A date-only click on the empty widget did not emit. Not form-associated. Docs, CEM, `AGENTS.md`, and `llms.txt` match the approved surface. No page errors.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | confirmed |
| Confirmed by | human (via AskQuestion) |
| Notes | Visual accept 2026-09-10 after datetime-1 PASS. Marked synced. |

## Defects

### DEF-001

- **status:** deferred
- **category:** mapping
- **reference:** Date and Time is a form field with a popup
- **converted:** standalone widget
- **description:** DateInput is a later catalog element. Not a defect for this scope.
- **disposition:** deferred

### DEF-002

- **status:** deferred
- **category:** api
- **reference:** Astro auto-id
- **converted:** consumer sets `id`
- **description:** Confirmed gap. Not a defect.
- **disposition:** deferred

### DEF-003

- **status:** deferred
- **category:** behavior
- **reference:** emits only after both halves are picked in that session
- **converted:** emits when either half changes and the other is already known
- **description:** Approved production difference.
- **disposition:** deferred

### DEF-004

- **status:** deferred
- **category:** other
- **reference:** Specialty Inputs props table includes DateTimePicker
- **converted:** widget demo lives on the Date Picker page
- **description:** Specialty Inputs was not converted. Not a defect for this scope.
- **disposition:** deferred
