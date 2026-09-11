# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Card` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-10T15:33:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 3 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 3 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/cards` |
| converted | Live `http://localhost:5178/components/cards` |
| metrics | `conversions/harmony-design-system-vanilla/verification/artifacts/card-1/capture-metrics.json` |
| screenshots | `card-1/ref-vp-light-*.png`, `conv-vp-light-*.png`, `conv-vp-dark-top.png`, `conv-forced-colors-top.png` |

## Approved non-defects (plan / userDecision)

- No `.card__icon-btn` — ghost icon-xs (accepted)
- Native `.card--interactive` CSS only; CE interactive → button a11y
- Kanban out of scope; footer examples intentional; `title` HTML tooltip documented

## Defects

### DEF-001 — fixed — visual/structure/behavior
Hybrid titled cards lose body content after re-sync. Fixed in Card-2 via `#collectContent()` re-harvest.

### DEF-002 — fixed — visual/structure
Hybrid header-actions wiped. Fixed in Card-2.

### DEF-003 — fixed — visual/structure
Hybrid footer wiped. Fixed in Card-2.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | superseded |
| Notes | FAIL iteration 1 — see Card-2 PASS |
