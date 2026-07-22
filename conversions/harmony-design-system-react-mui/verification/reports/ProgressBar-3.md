# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `ProgressBar` |
| iteration | `3` |
| artifactType | `html` |
| generatedAt | `2026-07-08T21:00:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 3 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 4 |

**Result:** PASS

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/progress-bar` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/progress-bar` (HTTP 200) |
| prior report | `verification/reports/ProgressBar-2.md` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | present | |
| Article nav: Examples, Props, Accessibility | accepted | Same accepted gap as Button-2 |
| Section: Basic Progress (4 bars) | present | |
| Section: Sizes (sm, md, lg) | present | |
| Section: Variants (default, success, warning, error) | present | |
| Section: With Label (42%) | present | |
| Section: Props table | present | |
| Section: Accessibility (4 cards) | present | |
| Extra: Harmony → MUI mapping table | accepted | Target-specific addition |

**Content gaps (open):** 0

## Examples purity

| Check | Status |
|-------|--------|
| No file-local wrapper components | PASS |
| Direct `@mui/material/LinearProgress` imports | PASS |
| No `LinearProgress sx={{ height` fidelity styling | PASS |
| `size` via theme-augmented prop | PASS |
| `showLabel` composite — props only, no fidelity sx | PASS |
| Manifest `propMappings` / `compositeEquivalents` recorded | PASS |

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Track / bar colors (all variants) | Match | Match | present |
| Heights sm / md / lg | 4 / 8 / 12 px | 4 / 8 / 12 px | present |
| With Label `42%` text | 14px secondary | 14px secondary (`subtitle2` + `textSecondary`) | present (fixed DEF-001) |
| With Label label gap | 4px below bar | 4px (`Stack spacing={0.5}`) | present (fixed DEF-003) |
| Example section descriptions | 14px secondary | 14px secondary (`DemoExampleGroup` fix) | present (fixed DEF-002) |
| ARIA determinate | progressbar + valuenow/min/max | Match | present |

**Visual gaps (open):** 0

## Defects

### DEF-001

- **status:** fixed
- **category:** visual
- **description:** With Label typography — remediated with `variant="subtitle2" color="textSecondary"` composite (no fidelity sx).

### DEF-002

- **status:** fixed
- **category:** visual
- **description:** Example subsection descriptions — remediated in `@/demo/ui/DemoExampleGroup` with `subtitle2` + `textSecondary`.

### DEF-003

- **status:** fixed
- **category:** visual
- **description:** With Label spacing — remediated with neutral layout `Stack spacing={0.5}` between bar and label.

## Verifier notes

- ProgressBar element ready for `synced` status after adoption-model remediation (no fidelity sx in examples).
- Theme augmentation: `LinearProgress` `size` prop via `mapProgressBarToTheme.ts` + `themeAugmentation.ts`.
