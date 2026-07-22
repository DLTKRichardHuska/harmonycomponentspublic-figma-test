# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Dropdown` |
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

CP × light. Iteration-1 open-menu placeholder row remediated — open list is countries-only on both sides. Closed placeholder still via `displayEmpty` + `renderValue`. Slots callout remains accepted.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/dropdowns` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/dropdowns` (HTTP 200, CP × light) |
| screenshot | `verification/artifacts/toggle-dropdown-2/ref-dropdown-page-top.png` / `conv-dropdown-page-top.png` |
| screenshot | `verification/artifacts/toggle-dropdown-2/ref-menu-open-tight.png` / `conv-menu-open-tight.png` |
| screenshot | `verification/artifacts/toggle-dropdown-2/ref-dropdown-menu-open.png` / `conv-dropdown-menu-open.png` |
| probe | `verification/artifacts/toggle-dropdown-2/ref-dropdown-probe.json` / `conv-dropdown-probe.json` |
| summary | `verification/artifacts/toggle-dropdown-2/summary.json` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | Dropdowns |
| Article nav | present | Converted adds Harmony mapping (OK) |
| Examples: Basic Dropdown | present | Country + closed placeholder |
| Examples: With Label (Stacked) | present | |
| Examples: With Label (Inline) | present | Label left of field (CP) |
| Examples: With Pre-selected Value | present | Priority = Medium |
| Examples: Disabled | present | |
| Astro trigger / option-N slots | accepted | `UnsupportedEquivalentCallout` present |
| Section: Props | present | |
| A11y: Labels / Keyboard / ARIA / Disabled | present | Matches reference card set |

**Content gaps (open):** 0

## Visual parity

CP × light.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Closed trigger height / type | ~20px tall, 12px text, white fill, gray border, 4px radius | Same 20px / 12px / white / outline / 4px | present |
| Placeholder in closed field | “Select a country” + chevron | Same via `displayEmpty` + `renderValue` | present |
| Stacked vs inline labels | Stacked above; inline to the left | Same layouts | present |
| Disabled field | Faded control + value | Same faded treatment | present |
| Open menu surface | Light gray paper, soft shadow, 4px radius, option rows ~37px | Same surface/shadow/radius/row height | present |
| Open menu option list | Countries only (US…France); no placeholder row | Same five countries only; no “Select a country” row | present |
| Demo field width | ~180px min-width control | `fullWidth` in maxWidth 360 (Input demo pattern) | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Recommend PASS. AskQuestion before marking Dropdown `synced`. Slot skip already accepted. |

## Defects

### DEF-001

- **status:** fixed
- **category:** visual
- **reference:** Open Basic Dropdown menu lists United States → France only.
- **converted:** Same countries-only list after removing empty `MenuItem` (iteration 2).
- **description:** Iteration-1 extra selected placeholder option is gone; designer opening both menus sees matching option lists.
- **evidence:** `ref-menu-open-tight.png` vs `conv-menu-open-tight.png`; `summary.json` menu item arrays equal.

### DEF-002

- **status:** accepted
- **category:** api
- **reference:** Astro named `trigger` / `option-0…9` slots.
- **converted:** Info callout; options via `MenuItem` children.
- **description:** Accepted gap per plan/userDecision — do not fail.
- **evidence:** Callout on `conv-dropdown-page-top.png`; manifest `skippedProps` / `gaps`.

## Blocked items

None. Label and Icon dependencies synced. Both review servers reachable.

## Verifier notes

- Rendered evidence reviewed. Three-column visual matrix completed.
- Iteration 1 FAIL closed by omitting empty MenuItem from open lists while keeping closed placeholder.
- Examples purity: direct Select/MenuItem — no Harmony wrappers.
- Accordion not re-verified (prior PASS; no regression suspected).
