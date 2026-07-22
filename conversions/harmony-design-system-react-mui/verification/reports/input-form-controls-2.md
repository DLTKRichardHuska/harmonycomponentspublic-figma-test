# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Input`, `Textarea`, `Label`, `NumberInput`, `RangeInput` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-07-15T22:15:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 3 |
| blocked | 0 |
| deferred | 2 |
| accepted | 1 |
| **total** | 6 |

**Result:** PASS

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/inputs` (HTTP 200, CP × light) |
| reference | Live review `http://localhost:4321/components/labels` (HTTP 200, CP × light) |
| reference | Live review `http://localhost:4321/components/specialty-inputs` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/inputs` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/labels` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/specialty-inputs` (HTTP 200, CP × light) |
| screenshots | `verification/artifacts/input-form-controls-2/` (light page + states / range / steppers / labels a11y pairs) |
| probe | `verification/artifacts/input-form-controls-2/probe-light.json`, `probe-final.json` |

Rendered evidence reviewed on both dev servers at matched CP × light. Probe/`getComputedStyle` used as evidence only — visual rows judged from screenshot pairs + live browse.

### Plan decisions (not defects)

- Toggle and DateInput out of scope; specialty Date/Time section deferred (`DemoCallout` OK)
- TextField `outlined` = Harmony; filled/standard stock MUI
- NumberInput = TextField + InputAdornment IconButtons composite (no package export) — locked plan approach
- No Harmony* exports for these five

### Remediation re-check (from iteration 1 FAIL)

| Prior defect | Iteration 2 outcome |
|--------------|---------------------|
| DEF-001 Error helper gray | **fixed** — helper matches error border red |
| DEF-002 Range filled blue track | **fixed** — track/rail uniform divider gray; thumb primary |
| DEF-003 Number steppers silhouette | **accepted** — intentional MUI composite; width constrained (~168); human instructed not FAIL for remaining Astro segmented chrome delta |
| DEF-004 Labels Semantic HTML missing | **fixed** — fourth a11y card present |

## Content parity

### Input / Textarea (`/components/inputs`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Inputs + stable badge | present | |
| Page description | present | |
| Article nav: Examples, Props, Usage, Accessibility | present | Converted also links Mapping — target-specific |
| Example: Basic Input | present | |
| Example: Input Types | present | Native number spinners hidden on both |
| Example: With Icon | present | |
| Example: Trailing icon and slot | present | |
| Example: States | present | Error helper color matches (was DEF-001) |
| Example: Textarea | present | |
| Example: With Label (Stacked) | present | |
| Example: With Label (Inline) | present | |
| Example: Textarea With Label | present | |
| Example: Form Example | present | |
| Example: Form Example with Inline Labels | present | |
| Input / Textarea props tables | present | |
| Extra: Harmony mapping | present | Target-specific |
| Usage Do / Don't | present | Chrome-only card vs list differences OK |
| A11y: Labels, Error Announcements | present | Converted title "Error messages" — same guidance |
| Catalog dependency Icon | present | `synced` |
| Label composites (dependsOn Label) | present | Same-batch verify OK |

### Label (`/components/labels`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Labels + stable badge | present | |
| Page description | present | |
| Examples: Basic, Required, With Helper Text | present | Required `*` red on both |
| Props table | present | |
| Extra: Harmony mapping | present | Target-specific |
| A11y: Label Association | present | |
| A11y: Required Indicators | present | |
| A11y: Screen Reader Support | present | |
| A11y: Semantic HTML | present | Was DEF-004 — now present |

### NumberInput / RangeInput (`/components/specialty-inputs`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Specialty Inputs + badge | present | Description shortened (dates deferred) — OK |
| DemoCallout: Date inputs deferred | present | Plan decision |
| Example: Number Input (plain type=number) | present | |
| Example: Number Input with steppers | present | Intentional MUI adornment composite (DEF-003 accepted) |
| Example: Number Input With Label | present | |
| Example: Range Input | present | Uniform gray track (was DEF-002) |
| Example: Range Input With Label | present | |
| Example: Date and Time | deferred | Plan — DemoCallout |
| Example: URL Input | present | |
| Example: Phone Input | present | |
| Props: NumberInput, RangeInput | present | |
| Props: TimePicker / MonthPicker / WeekPicker / DateTimePicker | deferred | With Date/Time section |
| Extra: Harmony mapping | present | Target-specific |

**Content gaps (open):** 0

## Visual parity

Compare at CP × light. Judgments from matched light screenshot pairs + browse.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic outlined TextField | Light gray border, rounded, white/input fill, Lexend-style label above | Same family: outlined MUI field, matching border gray, label above | present |
| Leading / trailing icons | Muted icons inset in field | HarmonyIcon adornments, muted | present |
| Trailing action (eye) | Icon button in trailing slot | IconButton + HarmonyIcon | present |
| Disabled field | Tinted disabled fill, muted value | Disabled fill + muted text | present |
| Error field border | Error / pink-red outline | Error-red outline | present |
| Error helper text | Same error red as border ("Please enter a valid value") | Same message in matching error red | present |
| Textarea | Multi-line outlined field ~4 rows | TextField multiline rows={4} | present |
| Inline / stacked labels | Label beside or above control | Stack row/column FormLabel + TextField | present |
| Required asterisk | Red `*` after label text | Red MUI asterisk | present |
| Helper `(optional)` | Muted parenthetical beside label | Caption Typography muted | present |
| Number steppers | Compact segmented control (~82×22): elevated −/+ wells + narrow centered value | Compact outlined TextField (~168×40) with −/+ IconButton adornments; native spinners hidden | accepted — Intentional MUI mapping (locked InputAdornment+IconButton; width roughly compact) |
| Range track | Uniform gray track; blue circular thumb; no filled primary segment | Uniform divider-gray track + rail; blue primary thumb; no filled blue segment | present |
| Range value label | `75%` / `$100` secondary | Same text, secondary Typography | present |
| Labels a11y cards (×4) | Association, Required, Screen Reader, Semantic HTML | Same four cards including Semantic HTML | present |
| Date/Time examples | Live date/time fields | Deferred callout instead | deferred |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | confirmed |
| Confirmed by | explicit user instruction (re-verify remit) |
| Notes | User instructed: remaining NumberInput silhouette delta after width constraint is Acceptable intentional / Intentional MUI mapping for locked InputAdornment+IconButton composite — not FAIL. Date/Time deferred per plan. Do not mark manifest `synced` until conversion-agent AskQuestion / human sync step. |

## Defects

### DEF-001

- **status:** fixed
- **category:** visual / tokens
- **reference:** Error helper under States reads in error red, matching the error border.
- **converted:** Error helper now reads the same message in matching error red (was muted secondary gray in iteration 1).
- **description:** Designer no longer sees a gray error message under an error border — helper and border share error red on both surfaces.
- **evidence:** `ref-inputs-states.png` vs `conv-inputs-states.png` (CP light); probe-light both helperColor `rgb(216, 49, 72)`.

### DEF-002

- **status:** fixed
- **category:** visual
- **reference:** Range track is a single continuous gray line; only the thumb is theme-primary blue.
- **converted:** Track and rail both read as divider gray; thumb stays primary blue (was filled primary track left of thumb in iteration 1).
- **description:** Designer sees an unfilled gray rail with a blue thumb on both surfaces — no progress-style blue fill.
- **evidence:** `ref-specialty-range-input.png` vs `conv-specialty-range-input.png`; probe-light track/rail `rgb(191, 198, 212)`, thumb `rgb(42, 120, 198)`.

### DEF-003

- **status:** accepted
- **category:** visual / mapping
- **reference:** NumberInput is a compact segmented control (side −/+ wells + narrow centered value) with shared outer border (~82px wide).
- **converted:** Outlined TextField with start/end IconButton adornments at constrained width (~168px); value centered; native spinners hidden. Still not Astro segmented chrome.
- **description:** Remaining silhouette difference is structural to the approved InputAdornment + IconButton composite. Width is now compact (was ~full-width ~280px). Per re-verify instructions, treat as Intentional MUI mapping — not an open FAIL.
- **evidence:** `ref-specialty-number-steppers.png` vs `conv-specialty-number-steppers.png`; probe-light num width ref 82 / conv 168.

### DEF-004

- **status:** fixed
- **category:** structure
- **reference:** Labels Accessibility includes four cards, ending with **Semantic HTML**.
- **converted:** Four cards — Label Association, Required Indicators, Screen Reader Support, Semantic HTML.
- **description:** Designer sees the Semantic HTML accessibility guidance on conversion (was missing in iteration 1).
- **evidence:** `ref-labels-a11y.png` vs `conv-labels-a11y.png`; probe-light `a11yCardTitles` includes Semantic HTML on both.

### DEF-005

- **status:** deferred
- **category:** structure
- **reference:** Date and Time example section with DateInput fields.
- **converted:** `DemoCallout` explaining date inputs deferred.
- **description:** Intentionally out of scope per approved plan.
- **evidence:** Plan + specialty demo callout.

### DEF-006

- **status:** deferred
- **category:** structure
- **reference:** Props tables for TimePicker, MonthPicker, WeekPicker, DateTimePicker.
- **converted:** Only NumberInput + RangeInput props (plus mapping).
- **description:** Deferred with Date/Time specialty batch per plan.
- **evidence:** Reference specialty props section vs converted props section.

## Blocked items

None — both servers reachable; Icon dependency `synced`; Label circular dependency handled by verifying the five-element batch together.

## Verifier notes

- Designer compare completed per VERIFIER.md / VISUAL_MATCH_GATE.md (three-column visual matrix; no CSS-only closure).
- Examples purity: demos import MUI + `HarmonyIcon` directly; no file-local demo wrapper components; layout-only `sx` on stacks / compact NumberInput width. Mapping + props present.
- Manifest strategy (`existing-mui`, no Harmony* exports, outlined Harmony chrome, NumberInput composite) respected.
- Recommend **PASS** with zero open defects. Parent must not mark manifest `synced` on verifier PASS alone — AskQuestion for sync; DEF-003 accepted and DEF-005/006 deferred already covered by plan / re-verify remit.
