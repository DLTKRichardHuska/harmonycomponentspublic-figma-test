# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Spinner` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-07-14T20:06:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 2 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 3 |

**Result:** PASS

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/spinner` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/spinner` (HTTP 200) |
| screenshots | `verification/artifacts/spinner-2/` (`ref-` / `conv-` light + dark page, examples, a11y) |
| probe / inventory | `verification/artifacts/spinner-2/probe.json` |

Rendered evidence reviewed on both dev servers (CP product; light + dark). Source-only review not used for PASS. Probe/`getComputedStyle` used as evidence only — visual rows judged from screenshot pairs + live browse.

Prior report: `verification/reports/Spinner-1.md` (FAIL — DEF-001, DEF-002 open).

## Content parity

Inventory of reference `spinner.astro` vs converted `SpinnersDemo.tsx` at `/components/spinner`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | present | Matches reference: “Spinners indicate that content is loading or an action is being processed.” (DEF-001 fixed) |
| Article nav: Examples, Props, Accessibility | present | Converted also links Mapping — target-specific |
| Example: Sizes (sm, md, lg) | present | |
| Example: In Context (inline + card) | present | Same “Loading…” / “Loading content…” copy |
| Props table | present | Lists Harmony `size` enum (mirrors reference); Mapping section documents MUI numeric size/thickness |
| Accessibility: ARIA Attributes | present | MUI-framed copy (aria-label on CircularProgress) — equivalent topic |
| Accessibility: Screen Reader Support | present | |
| Accessibility: Animation Preferences | present | `prefers-reduced-motion` card present (DEF-002 fixed) |
| Extra: Harmony → MUI mapping | accepted | Target-specific addition — not a gap |

**Content gaps (open):** 0

## Visual parity

Rendered appearance — CP product; light (primary) and dark confirmed.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Sizes row — three rings, ascending | Small / medium / large CSS border rings; primary arc on gray track | Same hierarchy via CircularProgress; primary arc on gray track | present |
| Spinner active color (light) | Primary blue `rgb(42, 120, 198)` | Primary blue `rgb(42, 120, 198)` | present |
| Spinner track / rest ring (light) | Border gray `rgb(191, 198, 212)` | Track `rgb(191, 198, 212)` via enableTrackSlot | present |
| Approximate outer sizes (light) | ~23 / ~34 / ~56 px | ~20 / ~30 / ~50 px | present |
| Stroke weight grows with size | sm thinner, lg thicker (2/3/4px borders) | sm/md/lg thickness 2.5 / 3.5 / 4 | present |
| Inline “Loading…” row | sm spinner left of secondary text | Same layout and copy | present |
| Card “Loading content…” | lg spinner centered above secondary caption in outlined card | Same composition | present |
| Dark mode primary + track | Primary cyan-blue on muted gray track | Same reading (`rgb(89, 172, 255)` on `rgb(95, 104, 113)`) | present |
| Indeterminate motion character | CSS full-ring rotate (~0.8s) | MUI CircularProgress arc animation | present |
| A11y cards (three) | ARIA + Screen Reader + Animation Preferences cards | Same three-card stack; Animation Preferences now present | present |

**Visual gaps (open):** 0

Motion engines differ (CSS border spin vs MUI arc) but both read as indeterminate loading with track + primary accent — intentional for `existing-mui` CircularProgress; not filed as open defect.

## Examples purity / mapping checks

| Check | Status |
|-------|--------|
| Direct `@mui/material/CircularProgress` in examples | PASS |
| No file-local React components wrapping MUI | PASS |
| No invented Harmony-shaped props on CircularProgress | PASS — uses documented `size` / `thickness` |
| No fidelity `sx` for Harmony size/color | PASS — layout-only sx on Paper/Stack/Box |
| Manifest `propMappings` cover Harmony `size` | PASS |
| Catalog dependencies | none — N/A |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | accepted |
| Confirmed by | user (complete-in-progress execute) |
| Notes | Visual match accepted 2026-07-14; Spinner marked `synced` |

## Defects

### DEF-001

- **status:** fixed
- **category:** structure
- **reference:** Page intro reads “Spinners indicate that content is loading or an action is being processed.”
- **converted:** Same lead sentence under Spinner title (was DocsLayout meta blurb).
- **description:** Designer would no longer see a mismatched page description.
- **evidence:** Live browse light pages; `probe.json` (`texts.expectedDesc: true`, `oldDesc: false`); `ref-light-page.png` / `conv-light-page.png`

### DEF-002

- **status:** fixed
- **category:** structure
- **reference:** Accessibility section includes “Animation Preferences” (`prefers-reduced-motion`).
- **converted:** Third Accessibility card “Animation Preferences” present with reduced-motion guidance (MUI-framed).
- **description:** Designer now sees the reduced-motion guidance card matching the reference doc.
- **evidence:** Live browse; `probe.json` (`animationPrefs: true`); `ref-light-a11y.png` / `conv-light-a11y.png`

### DEF-003

- **status:** accepted
- **category:** structure
- **reference:** Article nav links Examples, Props, Accessibility
- **converted:** Also includes Harmony mapping
- **description:** Extra mapping nav/section is target-specific documentation — not a designer gap for the Spinner examples themselves.
- **evidence:** Prior component verifies (ButtonGroup, ProgressBar) treat mapping as accepted addition

## Blocked items

None — both review surfaces reachable.

## Verifier notes

- Strategy `existing-mui` → `@mui/material/CircularProgress` + `mapSpinnerToTheme.ts` (theme defaults: indeterminate, primary, size 24, thickness 3.5, `enableTrackSlot`, track = divider).
- Hard dependency check: Spinner has no catalog `dependsOn` — not blocked.
- A11y role differs (`role="status"` on reference vs MUI `progressbar`) — equivalent labeled loading affordance for this strategy; not filed as open.
- Re-verify after Spinner-1 remediate: DEF-001 and DEF-002 closed; content + visual matrices clean.
- Designer compare completed per DESIGNER_COMPARE / VISUAL_MATCH_GATE with three-column visual matrix; PASS not closed from CSS/probe alone — screenshot pairs reviewed side-by-side.
- Recommend PASS; human confirmation still required before manifest `synced`.
