# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `DateInput`, `DatePicker`, `TimePicker`, `DateTimePicker`, `MonthPicker`, `PickerPopup` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-07-16T22:35:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 5 |
| fixed | 0 |
| blocked | 0 |
| deferred | 2 |
| accepted | 0 |
| **total** | 7 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/date-picker` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/date-picker` (HTTP 200, CP × light) |
| screenshots | `verification/artifacts/date-picker-1/` (`ref-` / `conv-` page, examples, popup, week/range, calendar detail) |
| probe | `verification/artifacts/date-picker-1/visual-metrics.json`, `ref-probe.json`, `conv-probe.json` |

Rendered evidence reviewed on both dev servers at matched CP × light. Probe/`getComputedStyle` used as evidence only — visual rows judged from screenshot pairs + live browse.

### Plan decisions (not open defects)

- Use existing MUI X v9 `DatePicker` / `TimePicker` / `DateTimePicker`; month via `DatePicker` `views={['year','month']}` `openTo="month"`
- `WeekPicker` / `DateInput type="week"` — approved skip with `UnsupportedEquivalentCallout` (manifest `WeekPicker` status `gap`)
- `DateRangePicker` / `DateRangePickerExpanded` — out of scope; follow-up `DemoCallout` on converted page
- Label composites via `FormLabel` + `Stack` (depends on synced `Label`)
- No `HarmonyDateInput` package export

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Date Picker + stable badge | present | |
| Page description | present | Converted wording mentions MUI X — OK |
| Article nav: Examples, Date Range Picker, Props, Accessibility | present | Converted also links Harmony mapping — target-specific |
| Example: Date Input | present | |
| Example: Time Input | present | |
| Example: Date and Time | present | |
| Example: With Constraints | present | |
| Example: Disabled | present | |
| Example: With Label (Stacked) | present | |
| Example: With Label (Inline) | present | |
| Example: Month Picker | present | |
| Example: Week Picker (live control) | deferred | Approved skip — `UnsupportedEquivalentCallout` |
| Example: 12-Hour Time Format | present | |
| Section: Date Range Picker (live) | deferred | Approved out of scope — follow-up callout |
| Section: Date Range Picker — Expanded (live) | deferred | Same |
| Props: DateInput | present | |
| Props: DatePicker | different | Folded into DateInput + Harmony mapping; no separate DatePicker table |
| Props: DateRangePicker / Expanded | deferred | With range follow-up |
| Accessibility cards (4) | present | Keyboard, ARIA, Focus, Screen Reader |
| Extra: Harmony mapping | present | Target-specific |
| Catalog dependency Label | present | `synced` |
| Week callout documents approved gap | present | |
| Range callout documents follow-up | present | |

**Content gaps (open):** 0 (Week/Range content gaps deferred per plan)

## Visual parity

CP × light. Field metrics from `visual-metrics.json` (rendered boxes).

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Date field height (CP) | Compact ~20px Harmony field | Tall ~56px default MUI Pickers field | different |
| Date field type size | 12px Figtree | 16px Figtree | different |
| Date field corner radius | 4px | 8px | different |
| Date field border | Harmony gray `rgb(191, 198, 212)` | Stock MUI notch `rgba(0,0,0,0.23)` | different |
| Empty-state cue | Placeholder “Select date” / “Select time” | Section mask “MMMM DD, YYYY” / “hh:mm” | different |
| Disabled field fill | Gray fill `rgb(234, 234, 234)` + muted text | Transparent fill; muted text only; still 56px tall | different |
| Trailing calendar/clock icon | Small 16px icon inside compact field | Present as open button (~20px) on tall field | different |
| Inline label row | Label left of compact field | Label left of tall field (layout OK; density still wrong) | different |
| Calendar popup paper | Bordered panel ~310×358, soft gray fill | Themed layout ~280 wide; paper chrome present | present |
| Calendar day cell size | ~36×36 day buttons | ~28×28 CP-compact day buttons | different |
| Selected / today day fill | Filled primary circle, white numeral (day 16) | Primary selected fill when active; today treatment can read lighter/outline before selection | different |
| Month header chrome | Prev/next chevrons beside month title | MUI header with month switch chevron + arrows | present |
| Week example | Live week field | Blue unsupported callout (approved) | deferred |
| Date range examples | Live single + expanded range UIs | Follow-up callout (approved) | deferred |

**Visual gaps (open):** 5

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Week skip and DateRange follow-up are plan-approved deferred items. Open visual field/popup defects must be remediated (or human-accepted) before PASS / sync. |

**conversion-agent** must **AskQuestion** before sync when Status is `pending`.

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **reference:** CP date/time fields read as compact ~20px Harmony inputs (12px type, 4px radius).
- **converted:** Same examples read as large ~56px MUI X Pickers fields (16px type, 8px radius).
- **description:** Designer would see converted picker fields as default MUI medium density, not CP Harmony compact inputs matching TextField/DateInput on the Inputs page.
- **evidence:** Live CP light browse; `verification/artifacts/date-picker-1/ref-examples-cp-light.png` vs `conv-examples-cp-light.png`; `visual-metrics.json` (ref `h:20` / conv `h:56`).
- **remediationHint:** Theme `MuiPickersOutlinedInput` / `MuiPickersTextField` (MUI X v9 field slots) with the same CP metrics as `mapTextFieldToTheme` — TextField overrides do not apply to Pickers field roots.

### DEF-002

- **status:** open
- **category:** tokens
- **reference:** Field border uses Harmony border gray on white input background.
- **converted:** Field uses stock MUI outlined notch `rgba(0,0,0,0.23)` on transparent field background.
- **description:** Designer would see a colder/default MUI outline instead of Harmony field chrome shared with other form controls.
- **evidence:** `visual-metrics.json` notch vs ref `borderColor`; example screenshot pair.
- **remediationHint:** Map Pickers outlined field border/background to Harmony `divider` / `inputBackground` tokens in `mapDatePickersToTheme` (or shared field chrome helper).

### DEF-003

- **status:** open
- **category:** visual
- **reference:** Empty fields show friendly placeholders (“Select date”, “Select time”, “Select month”).
- **converted:** Empty fields show format section masks (“MMMM DD, YYYY”, “hh:mm”, “MMMM YYYY”).
- **description:** Designer would read converted empties as format templates, not the same empty-state copy as reference.
- **evidence:** Example screenshot pair; `visual-metrics.json` `sections: ["MMMM DD, YYYY"]` vs ref `placeholder: "Select date"`.
- **remediationHint:** Prefer Harmony placeholder copy via slotProps / field props where MUI X allows; avoid leaving raw section masks as the only empty cue if parity is required.

### DEF-004

- **status:** open
- **category:** visual
- **reference:** Disabled date field shows gray filled background and muted value “Jan 15, 2024”.
- **converted:** Disabled field stays tall/transparent with muted text only — no Harmony disabled fill.
- **description:** Designer would not see the same disabled affordance as other Harmony CP inputs.
- **evidence:** `visual-metrics.json` disabled blocks; Disabled example on both routes.
- **remediationHint:** Apply Harmony disabled background on `MuiPickersOutlinedInput` `.Mui-disabled` to match TextField disabled chrome.

### DEF-005

- **status:** open
- **category:** visual
- **reference:** Open calendar uses larger day cells (~36px) in a ~310px bordered popup; today/current day reads as a filled primary circle with white text.
- **converted:** Open calendar uses smaller CP-compact days (~28px) in a narrower layout; today can read as a lighter/outline treatment until selected (selected fill is primary when active).
- **description:** Designer comparing open pickers side by side would notice denser/smaller day grid and a softer today treatment versus reference’s filled current day.
- **evidence:** `ref-popup-open-cp-light.png` / `conv-popup-open-cp-light.png`; earlier popup probe daySample 36 vs 28; calendar detail shots.
- **remediationHint:** Revisit CP `daySize` and today styles in `mapDatePickersToTheme` (`MuiPickerDay`) so open calendar rhythm matches reference more closely while keeping MUI structure.

### DEF-006

- **status:** deferred
- **category:** structure
- **reference:** Week Picker example shows a live week field.
- **converted:** `UnsupportedEquivalentCallout` explaining no MUI X Community WeekPicker.
- **description:** Intentional approved skip (2026-07-16); not an open conversion defect.
- **evidence:** `conv-week-range-cp-light.png`; manifest `WeekPicker` / `DateInput.skippedProps`.

### DEF-007

- **status:** deferred
- **category:** structure
- **reference:** Date Range Picker and Expanded live examples plus their props tables.
- **converted:** Follow-up callout stating range conversion is a separate scope.
- **description:** Explicitly out of scope per plan; callout present.
- **evidence:** `ref-range-cp-light.png` vs `conv-range-cp-light.png`.

## Blocked items

None — both review surfaces reachable.

## Verifier notes

- Scope verified as DateInput picker family on `/components/date-picker` (CP light first).
- Examples purity: no file-local wrapper components; demos use `@mui/x-date-pickers` + `FormLabel`/`Stack` composites. Inline `FormLabel` `sx={{ whiteSpace: 'nowrap' }}` treated as layout, not a FAIL.
- Hard dependencies `Label` synced; picker elements are same-batch `in-progress` (not dependency-blocked).
- Root cause of field FAIL: MUI X v9 uses `MuiPickersOutlinedInput`, which is not covered by `mapTextFieldToTheme`’s `MuiOutlinedInput` overrides; `mapDatePickersToTheme` currently themes popup/calendar more than the field shell.
- Recommend **FAIL** until DEF-001–005 closed or human-accepted. Then re-verify popups + disabled + empty states before sync.
)
