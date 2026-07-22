# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `DateInput` (+ DatePicker, TimePicker, MonthPicker, WeekPicker, DateTimePicker, PickerPopup) |
| iteration | `2` |
| artifactType | `html` + `png` |
| generatedAt | `2026-07-20T16:30:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |
| priorReport | `DateInput-1.md` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 6 |
| blocked | 0 |
| deferred | 1 |
| accepted | 0 |
| **total** | 7 |

**Result:** PASS

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/date-picker` |
| converted (live) | `http://localhost:5177/components/date-picker` |
| reference specialty | `http://localhost:4321/components/specialty-inputs` |
| converted specialty | `http://localhost:5177/components/specialty-inputs` |
| capture set | `conversions/harmony-design-system-shadcn/verification/artifacts/date-input-2/` |
| accessibility | `…/ref-accessibility.png`, `…/conv-accessibility.png` |
| props | `…/ref-props.png`, `…/conv-props.png`, `…/conv-specialty-props.png` |
| specialty Date\|Time | `…/ref-specialty-datetime.png`, `…/conv-specialty-datetime.png` |
| date panel | `…/ref-date-panel.png`, `…/conv-date-panel.png` |
| time 12h | `…/ref-time12-open.png`, `…/conv-time12-panel.png` |
| datetime | `…/ref-datetime-open.png`, `…/conv-datetime-panel.png` |
| month / week | `…/conv-month-panel.png`, `…/conv-week-panel.png` |
| inventories | `…/*-inventory.json` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Date Picker | present | Converted badge `in progress` vs reference `stable` (expected while unsynced) |
| Intro description | present | |
| Article nav: Examples | present | |
| Article nav: Date Range Picker | present | |
| Article nav: Props | present | |
| Article nav: Accessibility | present | Was DEF-001 — fixed |
| ImportSnippet (package imports) | present | Additive vs reference |
| Example: Date Input | present | |
| Example: Time Input | present | |
| Example: Date and Time | present | |
| Example: With Constraints | present | |
| Example: Disabled (Jan 15, 2024) | present | |
| Example: With Label (Stacked / Inline) | present | Via `DateInputField` (approved hybrid) |
| Example: Month Picker | present | |
| Example: Week Picker | present | |
| Example: 12-Hour Time Format | present | |
| Date Range Picker live demos | deferred | UnsupportedEquivalentCallout — plan out of scope (DEF-007) |
| Props: DateInput | present | |
| Props: DatePicker / Calendar | present | |
| Props: TimePicker | present | Was DEF-006 — fixed |
| Props: MonthPicker | present | Was DEF-006 — fixed |
| Props: WeekPicker | present | Was DEF-006 — fixed |
| Props: DateTimePicker | present | Was DEF-006 — fixed |
| Props: DateRange* | deferred | Covered by callout |
| Accessibility section (4 cards) | present | Was DEF-001 — fixed |
| Specialty: Date and Time two-column | present | Was DEF-005 — fixed |
| Specialty: Time/Month/Week/DateTime props | present | Was DEF-006 — fixed |

**Content gaps (open):** 0

### Docs / import / Consumer API

| Check | Status |
|-------|--------|
| Element-specific ImportSnippet with package name | PASS |
| No duplicated Getting Started global setup | PASS |
| Approved API: bare DateInput no label; Field hybrid | PASS |
| Approved API: panels `onSelect`; Calendar alias | PASS |
| WeekPicker implemented | PASS |
| AI docs / AGENTS.md / llms.txt (prior iteration) | PASS — not re-audited; no regression signal on demo |

### Stack elegance

| Check | Status |
|-------|--------|
| `react-day-picker` + Radix Popover + Harmony tokens | PASS |
| Package `Icon` / `Button` for nav and trailing icons | PASS |
| DateRange skipped with callout | PASS (intentional) |

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Closed DateInput trigger | Stacked label, rounded field, muted placeholder, trailing calendar icon | Same pattern and rhythm | present |
| Closed TimeInput trigger | Same with clock icon | Same | present |
| Disabled with value | Grayed field showing “Jan 15, 2024” | Same | present |
| Inline / stacked labeled fields | Label left or above input | Same via DateInputField | present |
| Date calendar popup | July 2026; bordered square nav; “Sun…Sat”; today = primary **border** on day cell | Same chrome — bordered nav, Sun…Sat, today primary border | present (was DEF-003) |
| Time spinner (24h) | HH : MM with up/down chevrons | Same spinner pattern | present |
| Time spinner (12h) | Dual stacked AM / PM buttons; active filled primary | Dual stacked AM / PM; AM filled primary | present (was DEF-004) |
| Month picker panel | Year header + 3×4 month grid; bordered year nav | Same structure and bordered nav | present |
| Week picker panel | Year header + Week N + date ranges | Same structure and bordered nav | present |
| DateTime popup layout | Calendar above time; horizontal rule under calendar | Calendar above time; horizontal rule; stacked | present (was DEF-002) |
| Specialty Date and Time | Date \| Time in two-column row | Date \| Time in `sm:grid-cols-2` row | present (was DEF-005) |
| Accessibility cards | Four guidance cards after Props | Four equivalent cards (Keyboard, ARIA, Focus, Screen Reader) | present (was DEF-001) |
| DateRange section | Live range pickers | Gap callout only | deferred |

**Visual gaps (open):** 0

## Side-by-side visual / behavior summary

**Matches**

- Full example inventory (date, time, datetime, constraints, disabled, labeled Field, month, week, 12h)
- Trigger fields and popover open/close for date, time, month, week, datetime
- Calendar chrome after remediation: bordered nav, three-letter weekdays, today primary border
- DateTime stacked calendar-then-time
- Dual AM/PM period buttons on 12h time
- Specialty Date \| Time two-column layout
- Accessibility nav + four cards
- Props tables for Time / Month / Week / DateTime on Date Picker and Specialty demos

**Differs (not defects)**

- ImportSnippet and `in progress` badge
- `DateInputField` instead of Astro label props on bare DateInput (approved hybrid)
- DateRange live demos → intentional callout (DEF-007 deferred)
- Converted today cell may show a light primary-tint fill under the border — still reads as “today with primary border,” not the prior underline-only treatment
- DOM / Radix / react-day-picker markup vs Astro

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends **PASS**. Do **not** mark manifest `synced` until human AskQuestion accepts visual match (and deferred DateRange gap). |

## Defects

### DEF-001

- **status:** fixed
- **category:** structure
- **reference:** Article nav includes Accessibility; four a11y cards
- **converted:** Nav link `#accessibility` + four equivalent cards present
- **description:** Accessibility section restored on Date Picker demo.
- **evidence:** `conv-accessibility.png`; inventory nav href `#accessibility`

### DEF-002

- **status:** fixed
- **category:** visual
- **reference:** DateTime popup stacked calendar above time
- **converted:** Same stacked layout with horizontal rule under calendar
- **description:** Side-by-side desktop split removed; matches reference composition.
- **evidence:** `ref-datetime-open.png` vs `conv-datetime-panel.png`

### DEF-003

- **status:** fixed
- **category:** visual
- **reference:** Bordered square month nav; “Sun…Sat”; today primary cell border
- **converted:** Bordered nav; “Sun…Sat”; today primary border
- **description:** Calendar chrome now designer-equivalent to reference.
- **evidence:** `ref-date-panel.png` vs `conv-date-panel.png`

### DEF-004

- **status:** fixed
- **category:** visual
- **reference:** Separate AM and PM buttons; active filled primary
- **converted:** Dual stacked AM / PM buttons; AM filled primary
- **description:** Single toggle replaced with dual period buttons.
- **evidence:** `ref-time12-open.png` vs `conv-time12-panel.png`

### DEF-005

- **status:** fixed
- **category:** visual
- **reference:** Specialty Date and Time in two-column grid
- **converted:** Date \| Time side-by-side at `sm` width
- **description:** Specialty section layout matches reference pair.
- **evidence:** `ref-specialty-datetime.png` vs `conv-specialty-datetime.png`

### DEF-006

- **status:** fixed
- **category:** structure
- **reference:** Specialty / picker props for Time, Month, Week, DateTime
- **converted:** Props tables for TimePicker, MonthPicker, WeekPicker, DateTimePicker on Date Picker and Specialty demos
- **description:** Demo props inventory covers panel components.
- **evidence:** `conv-props.png`, `conv-accessibility.png` (DateTimePicker table), `conv-specialty-props.png` + inventory headings

### DEF-007

- **status:** deferred
- **category:** structure
- **reference:** Live DateRangePicker and DateRangePickerExpanded demos
- **converted:** UnsupportedEquivalentCallout only
- **description:** Intentional out-of-scope per approved plan `date-time-inputs.md`.
- **evidence:** Callout on `#date-range-picker` at `:5177`
- **remediationHint:** Follow-up plan for range pickers

## Blocked items

None — both review surfaces responded HTTP 200; PNG/HTML captures succeeded for remediated surfaces. (Reference time/month/week/datetime **panel crop** screenshots timed out on invisible dialog nodes; open-page PNGs + converted panel crops + prior-iteration reference panels were used for those rows.)

## Verifier notes

- Re-verify after remediation of DateInput-1 FAIL (DEF-001–006).
- Designer compare with live browse + Playwright PNG evidence (not source-only).
- Visual matrix uses three rendered columns; no CSS/probe-only PASS.
- **PASS** recommendation: open == 0; only remaining item is deferred DateRange (DEF-007).
- Manifest was **not** updated (`synced` not recommended). Human AskQuestion required before sync.

**PASS:** Prior open conversion defects are fixed in rendered review. Await human confirmation before marking elements synced.
