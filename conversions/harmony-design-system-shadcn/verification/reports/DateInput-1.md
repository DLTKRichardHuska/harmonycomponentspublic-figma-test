# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `DateInput` (+ DatePicker, TimePicker, MonthPicker, WeekPicker, DateTimePicker, PickerPopup) |
| iteration | `1` |
| artifactType | `html` + `png` |
| generatedAt | `2026-07-20T16:15:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 5 |
| fixed | 0 |
| blocked | 0 |
| deferred | 1 |
| accepted | 0 |
| **total** | 6 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/date-picker` |
| converted (live) | `http://localhost:5177/components/date-picker` |
| reference specialty | `http://localhost:4321/components/specialty-inputs` |
| converted specialty | `http://localhost:5177/components/specialty-inputs` |
| reference HTML | `conversions/harmony-design-system-shadcn/verification/artifacts/date-input-1/ref-date-picker.html` |
| converted HTML | `conversions/harmony-design-system-shadcn/verification/artifacts/date-input-1/conv-date-picker.html` |
| viewport examples | `…/ref-viewport-examples.png`, `…/conv-viewport-examples.png` |
| date panel open | `…/ref-date-open.png`, `…/conv-date-open.png`, `…/ref-date-panel.png`, `…/conv-date-panel.png` |
| time panel open | `…/ref-time-open.png`, `…/conv-time-open.png` |
| month / week / datetime | `…/ref-*-page.png`, `…/conv-*-panel.png` |
| specialty Date and Time | `…/ref-specialty-datetime.png`, `…/conv-specialty-datetime.png` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Date Picker | present | Converted badge `in progress` vs reference `stable` (expected while unsynced) |
| Intro description | present | Wording differs slightly; intent matches |
| Article nav: Examples | present | |
| Article nav: Date Range Picker | present | |
| Article nav: Props | present | |
| Article nav: Accessibility | **missing** | DEF-001 |
| ImportSnippet (package imports) | present | Required on conversion; additive vs reference |
| Example: Date Input | present | Label + DateInput + calendar icon |
| Example: Time Input | present | Clock icon |
| Example: Date and Time | present | |
| Example: With Constraints | present | |
| Example: Disabled (Jan 15, 2024) | present | |
| Example: With Label (Stacked) | present | Converted uses `DateInputField` (approved hybrid) |
| Example: With Label (Inline) | present | Converted uses `DateInputField` |
| Example: Month Picker | present | Panel opens |
| Example: Week Picker | present | Implemented — not skipped |
| Example: 12-Hour Time Format | present | |
| Date Range Picker live demos | **deferred** | UnsupportedEquivalentCallout — plan out of scope |
| Props: DateInput | present | |
| Props: DatePicker / Calendar | present | |
| Props: DateRange* | deferred | Covered by callout |
| Accessibility section (4 cards) | **missing** | DEF-001 |
| Specialty: Date and Time section | present | Layout differs — DEF-005 |
| Specialty: picker props tables (Time/Month/Week/DateTime) | **missing** | DEF-006 |

**Content gaps (open):** 3 (DEF-001, DEF-005 notes, DEF-006)

### Docs / import / Consumer API

| Check | Status |
|-------|--------|
| Element-specific ImportSnippet with package name | PASS |
| No duplicated Getting Started global setup | PASS |
| Snippet matches `packages/ui` exports | PASS (`DateInput`, `DateInputField`, `DatePicker`, `Calendar`) |
| Approved API: bare DateInput no label; `onChange(string)` | PASS |
| Approved API: panels `onSelect`; Calendar alias | PASS (docs + code) |
| Approved API: Popover / PickerPopup | PASS (`docs/components/PickerPopup.md`) |
| AI docs set (DateInput, DatePicker, Time, Month, Week, DateTime, PickerPopup) | PASS |
| AGENTS.md / llms.txt | PASS — hybrid Field guidance present |
| WeekPicker implemented | PASS |

### Stack elegance

| Check | Status |
|-------|--------|
| `react-day-picker` + Radix Popover + `date-fns` + Harmony tokens | PASS (per plan) |
| Package `Icon` / `Button` for nav and trailing icons | PASS |
| No Lucide at demo call sites | PASS |
| DateRange skipped with callout | PASS (intentional) |

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Closed DateInput trigger | Stacked label, rounded field, muted placeholder, trailing calendar icon | Same pattern and rhythm | present |
| Closed TimeInput trigger | Same with clock icon | Same | present |
| Disabled with value | Grayed field showing “Jan 15, 2024” | Same | present |
| Inline / stacked labeled fields | Label left or above input | Same via DateInputField | present |
| Date calendar popup (month grid) | July 2026; bordered square nav buttons; “Sun…Sat”; today = primary **border** on day cell | July 2026; bare chevrons; “Su…Sa”; today = **underline** only | **different** (DEF-003) |
| Time spinner (24h) | HH : MM with up/down chevrons in popup | Same spinner pattern | present |
| Time spinner (12h) | AM and PM as **two** stacked period buttons | Single **toggle** button showing current period | **different** (DEF-004) |
| Month picker panel | Year header + 3×4 month grid in popup | Same structure | present |
| Week picker panel | Year header + Week N + date ranges list | Same structure (Week 1–N, ranges) | present |
| DateTime popup layout | Calendar **above** time; horizontal rule under calendar | On desktop: calendar **left**, time **right**, vertical divider | **different** (DEF-002) |
| Specialty Date and Time | Date \| Time in a **two-column** row | Date, Time, and DateInputField **stacked** vertically | **different** (DEF-005) |
| DateRange section | Live range pickers | Gap callout only | deferred |

**Visual gaps (open):** 4 (DEF-002–005)

## Side-by-side visual / behavior summary

**Matches**

- Example inventory for all DateInput types including Month, Week, and 12-hour time
- Trigger fields (placeholders, icons, disabled value display, constraints example)
- Popover open/close for date, time, month, week
- WeekPicker is live (not skipped)
- Time 24h spinner affordance
- Month grid and ISO week list content model
- ImportSnippet + approved Consumer API surface in package docs

**Differs (defects)**

- Accessibility block absent on converted Date Picker page
- DateTime composite chrome is side-by-side vs reference stacked
- Calendar “today” and nav/weekday chrome read differently
- 12h period control is one toggle vs two AM/PM buttons
- Specialty Date and Time layout is stacked vs two-column

**Differs (not defects)**

- ImportSnippet and `in progress` badge
- `DateInputField` instead of Astro `label` props on bare DateInput (approved hybrid)
- DateRange live demos → intentional callout
- DOM / Radix / react-day-picker markup vs Astro

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends FAIL. Do **not** mark manifest `synced`. Human AskQuestion after remediate or to accept remaining visual gaps. |

## Defects

### DEF-001

- **status:** open
- **category:** structure
- **reference:** Article nav includes Accessibility; page ends with four a11y cards (Keyboard, ARIA, Focus, Screen Reader)
- **converted:** Nav stops at Props; no Accessibility section
- **description:** Designer would miss the Accessibility section that is on the reference Date Picker doc (present on other converted demos such as Button/Spinner).
- **evidence:** Live browse `#accessibility` on `:4321` vs missing on `:5177`; content inventory headings
- **remediationHint:** Add Accessibility nav link + equivalent guidance cards on `DatePickerDemo`

### DEF-002

- **status:** open
- **category:** visual
- **reference:** DateTime popup shows calendar full width with time spinner **below** (border under calendar)
- **converted:** At desktop width, calendar and time sit **side by side** with a vertical divider
- **description:** Designer would see a different DateTimePicker composition — horizontal split vs stacked calendar-then-time.
- **evidence:** `ref-datetime-open.png` vs `conv-datetime-open.png` / `conv-datetime-panel.png`
- **remediationHint:** Match reference stacked layout (`flex-col` only; border-bottom under date section) unless human accepts side-by-side as intentional

### DEF-003

- **status:** open
- **category:** visual
- **reference:** Month nav uses bordered square icon buttons; weekdays “Sun…Sat”; today has primary-colored **cell border**
- **converted:** Month nav is bare chevrons; weekdays “Su…Sa”; today is **underlined** text with no primary border treatment
- **description:** Designer would notice different calendar chrome — especially today’s indicator and nav button treatment — when comparing open date panels side by side.
- **evidence:** `ref-date-panel.png` vs `conv-date-panel.png`
- **remediationHint:** Restyle DayPicker `classNames` / Chevron wrappers toward bordered nav buttons, primary today border, and three-letter weekday labels

### DEF-004

- **status:** open
- **category:** visual
- **reference:** 12-hour panel shows separate AM and PM buttons (active state filled primary)
- **converted:** Single outline button that toggles the current period label (AM ↔ PM)
- **description:** Designer would see a different AM/PM control pattern in the 12-hour time picker.
- **evidence:** `conv-time12-panel.png`; reference TimePicker period button pair in Astro/CSS
- **remediationHint:** Render two period buttons with active styling like reference

### DEF-005

- **status:** open
- **category:** visual
- **reference:** Specialty “Date and Time” shows Date and Time fields in a responsive **two-column** grid
- **converted:** Same fields stacked vertically, plus an extra inline `DateInputField` demo
- **description:** Designer would see a different specialty-section layout (column stack vs side-by-side pair). Extra Field example is additive API teaching — layout of the core pair is the gap.
- **evidence:** `ref-specialty-datetime.png` vs `conv-specialty-datetime.png`
- **remediationHint:** Use `sm:grid-cols-2` for Date + Time; keep DateInputField below if desired

### DEF-006

- **status:** open
- **category:** structure
- **reference:** Specialty Inputs Props documents TimePicker, MonthPicker, WeekPicker, DateTimePicker
- **converted:** Specialty Props only NumberInput + RangeInput; Date Picker Props only DateInput + DatePicker/Calendar
- **description:** Doc-page props inventory for panel components is thinner than reference specialty page (package AI docs exist, but demo parity with reference props tables does not).
- **evidence:** Content inventory on `/components/specialty-inputs` props sections
- **remediationHint:** Add panel prop tables to Date Picker and/or Specialty demo, or explicitly defer demo props with userDecision if package docs are enough

### DEF-007

- **status:** deferred
- **category:** structure
- **reference:** Live DateRangePicker and DateRangePickerExpanded demos
- **converted:** UnsupportedEquivalentCallout only
- **description:** Intentional out-of-scope per approved plan `date-time-inputs.md` and custom instructions.
- **evidence:** Callout on `#date-range-picker` at `:5177`
- **remediationHint:** Follow-up plan for range pickers

## Blocked items

None — both review surfaces responded HTTP 200; PNG/HTML captures succeeded.

## Verifier notes

- Designer compare completed with live browse + Playwright PNG evidence (not source-only).
- Visual matrix uses three rendered columns; no CSS/probe-only PASS.
- Consumer API / docs checks PASS against approved plan packet; FAIL is from **page content** and **rendered panel chrome**.
- Manifest was **not** updated (`synced` not recommended).
- Recommend remediate DEF-001–005 (and optionally DEF-006), re-verify as `DateInput-2`, then human AskQuestion before any sync.

**FAIL:** open conversion defects remain (Accessibility missing; DateTime layout; calendar today/nav chrome; 12h AM/PM; specialty layout; demo props tables).
