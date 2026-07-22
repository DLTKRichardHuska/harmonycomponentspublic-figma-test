# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Toggle` |
| iteration | `2` |
| artifactType | `image` |
| generatedAt | `2026-07-20T21:58:58.501Z` |
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

CP × light. Iteration-1 content gap (missing Screen Reader Support card) remediated. Segmented callout remains accepted. Visual switch chrome unchanged and matches reference.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/toggle-switches` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/toggle-switches` (HTTP 200, CP × light) |
| screenshot | `verification/artifacts/toggle-dropdown-2/ref-toggle-page-top.png` / `conv-toggle-page-top.png` |
| screenshot | `verification/artifacts/toggle-dropdown-2/ref-toggle-a11y.png` / `conv-toggle-a11y.png` |
| screenshot | `verification/artifacts/toggle-dropdown-2/ref-toggle-full.png` / `conv-toggle-full.png` |
| probe | `verification/artifacts/toggle-dropdown-2/ref-toggle-probe.json` / `conv-toggle-probe.json` |
| summary | `verification/artifacts/toggle-dropdown-2/summary.json` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | Toggle Switches; binary on/off |
| Article nav | present | Converted adds Harmony mapping (OK) |
| Examples: Basic Toggle | present | Enable notifications / Dark mode |
| Examples: States | present | Unchecked / Checked / Disabled / Checked & Disabled |
| Examples: Sizes | present | Small / Medium |
| Examples: Without Label | present | Three unlabeled switches |
| Examples: Segmented toggle | accepted | `UnsupportedEquivalentCallout` for `variant="segmented"` |
| Section: Props | present | |
| Section: Harmony mapping | present | Converted-only (OK) |
| A11y: Labels | present | |
| A11y: Keyboard Navigation | present | |
| A11y: ARIA Attributes | present | |
| A11y: Screen Reader Support | present | Restored in iteration 2 (`conv-toggle-a11y.png`) |
| A11y: Disabled State | present | |

**Content gaps (open):** 0

## Visual parity

CP × light.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Medium track off | Gray pill ~44×24, white thumb left | Same gray `rgb(191,198,212)` 44×24, white thumb left | present |
| Medium track on | Blue pill `rgb(42,120,198)` 44×24, thumb right | Same blue 44×24, thumb right | present |
| Disabled / checked-disabled | Faded track + faded label | Same faded treatment | present |
| Label beside track | Label right of switch | FormControlLabel same rhythm | present |
| Accessibility card set | Five cards including Screen Reader Support | Same five cards including Screen Reader Support | present |
| Segmented examples | Two-label sliding controls | Info callout only (accepted) | accepted |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Recommend PASS. AskQuestion before marking Toggle `synced`. Accepted segmented skip unchanged. |

## Defects

### DEF-001

- **status:** fixed
- **category:** structure
- **reference:** Accessibility includes “Screen Reader Support” card.
- **converted:** Same card present with MUI-adapted copy (iteration 2).
- **description:** Iteration-1 missing Screen Reader Support card is remediated; designer sees the full five-card Accessibility set.
- **evidence:** `ref-toggle-a11y.png` vs `conv-toggle-a11y.png`.

### DEF-002

- **status:** accepted
- **category:** api
- **reference:** Segmented toggle examples with Item 1 / Item 2 in-track labels.
- **converted:** `UnsupportedEquivalentCallout` for `variant="segmented"`.
- **description:** Accepted gap per plan/userDecision — do not fail.
- **evidence:** Callout on `conv-toggle-page-top.png`; manifest `skippedProps` / `gaps`.

## Blocked items

None. Both review servers reachable.

## Verifier notes

- Rendered evidence reviewed (not source-only). Three-column visual matrix completed.
- Iteration 1 FAIL closed by restoring Screen Reader Support A11yCard.
- Examples purity: direct `Switch` + `FormControlLabel` — no local wrappers.
- Accordion not re-verified (prior PASS; no regression suspected).
