# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Accordion` |
| iteration | `1` |
| artifactType | `image` |
| generatedAt | `2026-07-20T21:55:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 0 |

**Result:** PASS

CP × light. All example sections present; bordered accordion group, headers, chevrons, default-open body, disabled “Locked section” gray text, and a11y cards match designer-visible reference. Recommend PASS pending human confirmation before `synced`.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/accordion` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/accordion` (HTTP 200, CP × light) |
| screenshot | `verification/artifacts/toggle-dropdown-accordion-1/ref-accordion-page-top.png` / `conv-accordion-page-top.png` |
| screenshot | `verification/artifacts/toggle-dropdown-accordion-1/ref-accordion-with-default-open.png` / `conv-accordion-with-default-open.png` |
| screenshot | `verification/artifacts/toggle-dropdown-accordion-1/refA-disabled-page.png` / `convA-disabled-page.png` |
| probe | `verification/artifacts/toggle-dropdown-accordion-1/detailed-compare.json` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | Accordion |
| Article nav (Examples, With label, Props, Accessibility) | present | Converted adds Harmony mapping (OK) |
| Examples: Basic Accordion | present | Exclusive expand via controlled `expanded` |
| Examples: With Label | present | “Account preferences” + `role="group"` |
| Examples: With Default Open | present | First FAQ open |
| Examples: Allow Multiple | present | Uncontrolled siblings |
| Examples: Disabled Sections | present | Locked section disabled |
| Examples: Focus | present | Interactive focus note; no staging classes |
| Section: Props | present | |
| A11y: Keyboard / ARIA / Screen Reader | present | Matches reference card set |

**Content gaps (open):** 0

## Visual parity

CP × light.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Group chrome | Single bordered white card, ~8px outer radius, internal hairline dividers | Same bordered Accordion stack / radius / dividers | present |
| Header typography | 14px medium dark text, 16px padding, chevron right | Same 14px/500, 16px padding, HarmonyIcon chevron | present |
| Default open body | First item expanded; body secondary text under header; chevron rotated up | Same open panel + rotated chevron | present |
| Disabled “Locked section” | Gray muted header text among normal siblings | Same muted `rgb(107,114,128)` treatment | present |
| With label | “Account preferences” above Notifications / Privacy | Same | present |
| Focus affordance | Hover/focus grey on headers (interactive) | Theme `:hover` / `Mui-focusVisible` (no staging classes) | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS; conversion-agent must AskQuestion before marking Accordion `synced`. |

## Defects

None.

## Blocked items

None. Icon dependency synced. Both servers reachable.

## Verifier notes

- Rendered evidence reviewed. Three-column visual matrix completed.
- Composite: `expandIcon={<HarmonyIcon name="chevron-down" />}`; field label via Typography + `role="group"`.
- Examples purity: Accordion / Summary / Details only; `expandIcon` is a JSX const, not a local component.
- Minor body-copy wording differences (e.g. “49 components”) are not designer-blocking for chrome parity.
- No skipped-feature callouts required for Accordion.
