# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Input`, `Textarea`, `Label`, `NumberInput`, `RangeInput` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-07-15T22:05:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 4 |
| fixed | 0 |
| blocked | 0 |
| deferred | 2 |
| accepted | 0 |
| **total** | 6 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/inputs` (HTTP 200) |
| reference | Live review `http://localhost:4321/components/labels` (HTTP 200) |
| reference | Live review `http://localhost:4321/components/specialty-inputs` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/inputs` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/labels` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/specialty-inputs` (HTTP 200) |
| screenshots | `verification/artifacts/input-form-controls-1/` (page/examples + section clips; CP × light pairs preferred) |
| probe | `verification/artifacts/input-form-controls-1/probe-light.json`, `probe-final.json` |

Rendered evidence reviewed on both dev servers. Probe/`getComputedStyle` used as evidence only — visual rows judged from screenshot pairs + live browse.

### Plan decisions (not defects)

- Toggle and DateInput out of scope; specialty Date/Time section deferred (`DemoCallout` OK)
- TextField `outlined` = Harmony; filled/standard stock MUI
- NumberInput = TextField + InputAdornment IconButtons composite (no package export)
- No Harmony* exports for these five

## Content parity

### Input / Textarea (`/components/inputs`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Inputs + stable badge | present | |
| Page description | present | |
| Article nav: Examples, Props, Usage, Accessibility | present | Converted also links Mapping — target-specific |
| Example: Basic Input | present | |
| Example: Input Types | present | |
| Example: With Icon | present | |
| Example: Trailing icon and slot | present | |
| Example: States | present | Error helper color fails visual (DEF-001) |
| Example: Textarea | present | |
| Example: With Label (Stacked) | present | Stack + FormLabel composite |
| Example: With Label (Inline) | present | Row Stack composite |
| Example: Textarea With Label | present | |
| Example: Form Example | present | |
| Example: Form Example with Inline Labels | present | |
| Input / Textarea props tables | present | |
| Extra: Harmony mapping | present | Target-specific |
| Usage Do / Don't | present | Content present; cards vs plain lists (chrome only) |
| A11y: Labels, Error Announcements | present | |
| Catalog dependency Icon | present | `synced` |
| Label composites (dependsOn Label) | present | Verified in same batch (circular batch OK) |

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
| A11y: Semantic HTML | missing | DEF-004 |

### NumberInput / RangeInput (`/components/specialty-inputs`)

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Specialty Inputs + badge | present | Description shortened (dates deferred) — OK |
| DemoCallout: Date inputs deferred | present | Plan decision |
| Example: Number Input (plain type=number) | present | |
| Example: Number Input with steppers | present | Content present; chrome fails visual (DEF-003) |
| Example: Number Input With Label | present | |
| Example: Range Input | present | Filled track fails visual (DEF-002) |
| Example: Range Input With Label | present | |
| Example: Date and Time | deferred | Plan — DemoCallout |
| Example: URL Input | present | |
| Example: Phone Input | present | |
| Props: NumberInput, RangeInput | present | |
| Props: TimePicker / MonthPicker / WeekPicker / DateTimePicker | deferred | With Date/Time section |
| Extra: Harmony mapping | present | Target-specific |

**Content gaps (open):** 1 (DEF-004)

## Visual parity

Compare at CP × light unless noted. Mode mismatches in some early captures were re-shot; judgments below use matched light pairs + state/section clips.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic outlined TextField | Light gray border, rounded (`radius-lg`), white/input fill, Figtree body, Lexend label above | Same family look: outlined MUI field, matching border gray, Lexend label | present |
| Leading / trailing icons | Muted icons inset in field | HarmonyIcon adornments, muted | present |
| Trailing action (eye) | Icon button in trailing slot | IconButton + HarmonyIcon | present |
| Disabled field | Tinted disabled fill, muted value | Disabled fill + muted text | present |
| Error field border | Error / pink-red outline | Error-red outline | present |
| Error helper text | Same error/pink-red as border ("Please enter a valid value") | Same message in muted secondary gray | different — DEF-001 |
| Textarea | Multi-line outlined field ~4 rows | TextField multiline rows={4} | present |
| Inline / stacked labels | Label beside or above control | Stack row/column FormLabel + TextField | present |
| Required asterisk | Red `*` after label text | Red MUI asterisk | present |
| Helper `(optional)` | Muted parenthetical beside label | Caption Typography muted | present |
| Number steppers | Compact segmented control: elevated side buttons + narrow centered value (~one control group) | Wide full outlined TextField with −/+ IconButtons inside adornments | different — DEF-003 |
| Range track | Uniform gray track; blue circular thumb; no filled blue segment | Gray rail + blue filled track left of thumb + blue thumb | different — DEF-002 |
| Range value label | `75%` / `$100` secondary, ~sm | Same text, secondary Typography | present |
| Date/Time examples | Live date/time fields | Deferred callout instead | deferred |

**Visual gaps (open):** 3 (DEF-001, DEF-002, DEF-003)

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends FAIL. Do not mark elements `synced` until open defects remediated or human accepts gaps. |

## Defects

### DEF-001

- **status:** open
- **category:** visual / tokens
- **reference:** Error helper under States reads in error pink/red, matching the error border.
- **converted:** Error helper reads "Please enter a valid value" in muted secondary gray; border is already error red.
- **description:** Designer would see a gray error message on conversion while reference uses the same error red as the field border.
- **evidence:** `ref-inputs-states.png` vs `conv-inputs-states.png`; probe `helperColor` ref `rgb(244, 98, 134)` / light equivalent error vs conv `rgb(82, 89, 105)` with class `MuiFormHelperText-root Mui-error`.
- **remediationHint:** `mapSelectionControlChromeToTheme.ts` forces `MuiFormHelperText` `&.Mui-error` to `text-secondary` (Checkbox/Radio chrome). TextField error helpers need `error.main` (override after selection chrome, or scope the secondary color to selection-control helpers only).

### DEF-002

- **status:** open
- **category:** visual
- **reference:** Range track is a single continuous gray line; only the thumb is theme-primary blue.
- **converted:** Active track left of the thumb is solid primary blue; rail to the right is gray.
- **description:** Designer would see a filled progress-style slider on conversion vs an unfilled gray track on reference.
- **evidence:** `ref-specialty-range-input.png` vs `conv-specialty-range-input.png` (CP light).
- **remediationHint:** In `mapSliderToTheme.ts`, match reference by making `track` use the same color as `rail` (divider / border), keeping thumb primary — or otherwise suppress filled-track contrast so the track reads as one gray bar.

### DEF-003

- **status:** open
- **category:** visual
- **reference:** NumberInput is a compact segmented control (side −/+ wells + narrow centered value) with shared outer border.
- **converted:** Full-width outlined TextField (~280px) with IconButton adornments inside the field chrome.
- **description:** Designer would see a short stepper widget on reference but a long text field with end/start icons on conversion — same affordance, different silhouette and density. Composite strategy is approved; silhouette still fails designer-equivalence.
- **evidence:** `ref-specialty-number-steppers.png` vs `conv-specialty-number-input-with-steppers.png`.
- **remediationHint:** Theme/demo composite to approximate compact width, segmented button wells (elevated/`elevated-bg` side regions, dividers), and centered value — still using TextField + InputAdornment IconButtons, no HarmonyNumberInput export.

### DEF-004

- **status:** open
- **category:** structure
- **reference:** Labels Accessibility includes four cards, ending with **Semantic HTML**.
- **converted:** Three cards only — Label Association, Required Indicators, Screen Reader Support.
- **description:** Designer would miss the Semantic HTML accessibility guidance block on the Labels page.
- **evidence:** Live `#accessibility` inventory — ref titles include Semantic HTML; conv omits it (`LabelsDemo.tsx`).

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
- Examples purity: demos import MUI + `HarmonyIcon` directly; no file-local demo wrapper components; layout-only `sx` on stacks/labels. Mapping + props present.
- Manifest strategy (`existing-mui`, no Harmony* exports, outlined Harmony chrome) respected — those are not defects.
- Recommend **FAIL** until DEF-001–004 closed or human accepts. Parent must not mark manifest `synced` on verifier PASS alone.
