# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Toggle` |
| iteration | `1` |
| artifactType | `image` |
| generatedAt | `2026-07-20T21:55:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 2 |

**Result:** FAIL

CP × light. Segmented variant correctly skipped with callout (do not fail). Visual switch chrome matches reference. Missing Accessibility “Screen Reader Support” card keeps content parity open.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/toggle-switches` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/toggle-switches` (HTTP 200, CP × light) |
| screenshot | `verification/artifacts/toggle-dropdown-accordion-1/ref-toggle-page-top.png` / `conv-toggle-page-top.png` |
| screenshot | `verification/artifacts/toggle-dropdown-accordion-1/ref-toggle-states.png` / `conv-toggle-states.png` |
| screenshot | `verification/artifacts/toggle-dropdown-accordion-1/ref-toggle-sizes.png` / `conv-toggle-sizes.png` |
| screenshot | `verification/artifacts/toggle-dropdown-accordion-1/ref-toggle-segmented-toggle.png` |
| probe | `verification/artifacts/toggle-dropdown-accordion-1/ref-toggle-probe.json` / `conv-toggle-probe.json` |
| probe | `verification/artifacts/toggle-dropdown-accordion-1/detailed-compare.json` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | Toggle Switches; binary on/off (converted omits segmented mention in description — OK with skip) |
| Article nav | present | Converted adds Harmony mapping (OK) |
| Examples: Basic Toggle | present | Enable notifications / Dark mode |
| Examples: States | present | Unchecked / Checked / Disabled / Checked & Disabled |
| Examples: Sizes | present | Small / Medium |
| Examples: Without Label | present | Three unlabeled switches |
| Examples: Segmented toggle | accepted | `UnsupportedEquivalentCallout` for `variant="segmented"` (+ optionLabelLeft/Right) |
| Section: Props | present | MUI-oriented props table |
| Section: Harmony mapping | present | Converted-only (OK) |
| A11y: Labels | present | |
| A11y: Keyboard Navigation | present | |
| A11y: ARIA Attributes | present | |
| A11y: Screen Reader Support | missing | Reference card present; converted omits |
| A11y: Disabled State | present | |

**Content gaps (open):** 1

## Visual parity

CP × light. Track/thumb metrics from rendered review + probes (evidence only).

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Medium track off | Gray pill ~44×24, white thumb left | Same gray `rgb(191,198,212)` 44×24, white thumb left | present |
| Medium track on | Blue pill `rgb(42,120,198)` 44×24, thumb right | Same blue 44×24, thumb right | present |
| Disabled / checked-disabled | Faded track + faded label | Same faded opacity ~0.5 treatment | present |
| Small vs medium | Small ~36×20 / thumb 16; medium 44×24 / thumb 20 | Same sizes | present |
| Label beside track | Label right of switch, dark text | FormControlLabel same rhythm | present |
| Segmented examples | Two-label sliding controls shown | Replaced by info callout (accepted gap) | accepted |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Do not mark Toggle `synced` until Screen Reader card restored and human confirms. Accepted segmented skip already in userDecision. |

## Defects

### DEF-001

- **status:** open
- **category:** structure
- **reference:** Accessibility section includes a “Screen Reader Support” card explaining announcement of label and on/off state.
- **converted:** Accessibility has Labels, Keyboard, ARIA, Disabled only — no Screen Reader Support card.
- **description:** Designer reviewing the doc page would notice the missing Screen Reader Support accessibility card that the reference Toggle page shows.
- **evidence:** Live `:4321` / `:5176` `#accessibility`; Dialog-2 precedent restored the same card as required content.
- **remediationHint:** Add an `A11yCard title="Screen Reader Support"` aligned with reference copy (adapted for MUI Switch).

### DEF-002

- **status:** accepted
- **category:** api
- **reference:** Segmented toggle examples with Item 1 / Item 2 in-track labels.
- **converted:** `UnsupportedEquivalentCallout` for `variant="segmented"`; no segmented controls rendered.
- **description:** Accepted gap per plan/userDecision — do not fail.
- **evidence:** `conv-toggle-page-top.png` callout; manifest `skippedProps` / `gaps`.

## Blocked items

None. Icon/Label not required for Toggle. Both review servers reachable.

## Verifier notes

- Rendered evidence reviewed (not source-only). Three-column visual matrix completed.
- Dependencies: none blocking.
- Examples purity: direct `Switch` + `FormControlLabel` — no local wrappers.
- Callout for segmented present and correct.
