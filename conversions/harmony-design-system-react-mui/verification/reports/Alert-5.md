# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Alert` |
| iteration | `5` |
| artifactType | `html` |
| generatedAt | `2026-07-08T19:15:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 0 |
| accepted | 3 |
| **total** | 4 |

**Result:** PASS

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/alerts` (HTTP 200, CP light) |
| converted | Live review `http://localhost:5176/components/alerts` (HTTP 200, CP light) |
| prior report | `verification/reports/Alert-4.md` |

Rendered evidence reviewed on both dev servers after adoption-model remediation.

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | accepted | MUI mapping framing — target-specific |
| Article nav | accepted | Converted adds Harmony mapping link |
| Section: Variants (4 severities) | present | |
| Section: Dismissible | present | |
| Section: Without Title (2 alerts) | present | |
| Section: Enhanced Variant (2 alerts) | present | |
| Section: Enhanced with Actions (2 alerts) | present | |
| Section: Enhanced with Progress (2 alerts) | present | Progress Alert 75%, Countdown Alert 45% — inline LinearProgress |
| Section: Props table | present | MUI-native props |
| Section: Accessibility — Role | present | |
| Extra: Harmony → MUI mapping table | accepted | Target-specific addition |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Standard alert border-radius 8px | 8px | 8px | present |
| Standard severity tints | Match CP light | Match CP light | present |
| Enhanced card bg + shadow | rgb(247,248,250) + shadow | Match | present |
| Enhanced left accent | Separate border element | 8px outlined border | accepted |
| Enhanced action buttons 24px / 12px | xs buttons | small Button overrides | present |
| Progress bar height | 4px (sm) | 4px | present |
| Progress values | 75 / 45 | 75 / 45 | present |
| Progress bar colors | success / warning | success / warning | present |

**Visual gaps (open):** 0

## Defects

### DEF-005 — Demo Harmony-prop wrapper (DismissibleAlert)

- **status:** fixed
- **category:** structure
- **description:** Removed `DismissibleAlert` demo helper that accepted Harmony `progressValue` prop. Enhanced with Progress now uses inline `Alert` + `LinearProgress` JSX per adoption model.
- **evidence:** `AlertsDemo.tsx` lines 375–404; no local component accepts `progressValue`.

## Blocked items

None.

## Verifier notes

- Demo imports `@mui/material/Alert` and `LinearProgress` directly — no Harmony Alert wrapper export.
- Allowed demo helpers only: `EnhancedActions`, `AlertActionButton`, `ExampleBlock`, `PropsTable` (layout/chrome — no Harmony catalog props).
- `progressValue` appears only in Harmony → MUI mapping documentation row, not as a demo component prop.
- Manifest: `strategy: existing-mui`, `compositeEquivalents[progressValue].dependsOn: ["ProgressBar"]` — ProgressBar `synced`.
- Iteration 5 validates adoption-model remediation; visual/content parity unchanged from Alert-4 PASS.
