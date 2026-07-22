# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `ProgressBar` |
| iteration | `4` |
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
| accepted | 2 |
| **total** | 3 |

**Result:** PASS

## Defects

### DEF-001

- **status:** fixed
- **category:** api
- **description:** Removed invented `size` prop on `@mui/material/LinearProgress` (not in MUI docs). User chose skip via AskQuestion; Sizes section uses `UnsupportedEquivalentCallout`; theme applies single default md height.

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Section: Sizes (sm, md, lg) | accepted | `UnsupportedEquivalentCallout` per manifest `skippedProps` + `userDecision` |
| All other sections | present | |

## Examples purity

| Check | Status |
|-------|--------|
| No invented `size` on `LinearProgress` | PASS |
| No fidelity `sx` on `LinearProgress` | PASS |
| `skippedProps` recorded in manifest | PASS |

## Verifier notes

- MUI LinearProgress has no native `size` prop — `existing-mui` strategy cannot add one via module augmentation without user choosing custom export.
- ProgressBar element ready for `synced` status.
