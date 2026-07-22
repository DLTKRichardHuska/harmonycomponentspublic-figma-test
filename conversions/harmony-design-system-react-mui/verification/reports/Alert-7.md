# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Alert` |
| iteration | `7` |
| artifactType | `html` |
| generatedAt | `2026-07-08T22:00:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 2 |

**Result:** PASS

## Defects

### DEF-001

- **status:** fixed
- **category:** api
- **description:** Removed invented `size="sm"` on nested `LinearProgress`; uses default theme height (ProgressBar `size` skipped).

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Enhanced with Progress bar height (reference sm / 4px) | accepted | ProgressBar `size` skipped — converted uses theme default md (8px) |

## Verifier notes

- Alert remains `synced`; composite uses documented MUI props only.
