# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Dropdown` |
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

CP × light. Closed-field chrome (height, border, type size, radius) matches. Astro slot skip correctly callout’d. Open menu shows an extra selected “Select a country” row that reference does not — designer-visible FAIL.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/dropdowns` (HTTP 200, CP × light) |
| converted | Live review `http://localhost:5176/components/dropdowns` (HTTP 200, CP × light) |
| screenshot | `verification/artifacts/toggle-dropdown-accordion-1/ref-dropdown-page-top.png` / `conv-dropdown-page-top.png` |
| screenshot | `verification/artifacts/toggle-dropdown-accordion-1/ref-dropdown-basic-dropdown.png` / `conv-dropdown-basic-dropdown.png` |
| screenshot | `verification/artifacts/toggle-dropdown-accordion-1/ref-menu-open-tight.png` / `conv-menu-open-tight.png` |
| probe | `verification/artifacts/toggle-dropdown-accordion-1/ref-dropdown-probe.json` / `conv-dropdown-probe.json` |
| probe | `verification/artifacts/toggle-dropdown-accordion-1/detailed-compare.json` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + description | present | Dropdowns |
| Article nav | present | Converted adds Harmony mapping (OK) |
| Examples: Basic Dropdown | present | Country + placeholder |
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
| Closed trigger height / type | ~20px tall, 12px text, white fill, 1px gray border, 4px radius | Same 20px / 12px / white / gray outline / 4px | present |
| Placeholder in closed field | Gray “Select a country” + chevron | Same | present |
| Stacked vs inline labels | Stacked above; inline to the left | Same layouts | present |
| Disabled field | Faded control + “United States” value | Same faded treatment | present |
| Open menu surface | Light gray paper, soft shadow, 4px radius, option rows ~37px | Same surface/shadow/radius/row height | present |
| Open menu option list | Countries only (US…France); no placeholder row | First row “Select a country” italic, selected blue tint, then countries | different |
| Demo field width | ~180px min-width control | `fullWidth` in maxWidth 360 (Input demo pattern) | present |

**Visual gaps (open):** 1

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Slot skip already accepted in userDecision. Open-menu placeholder row needs remediate or human accept before sync. |

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **reference:** Open Basic Dropdown menu lists United States → France only; placeholder stays on the closed trigger, not as a menu row.
- **converted:** Open menu starts with a selected italic “Select a country” `MenuItem`, then the country list.
- **description:** Designer opening both menus side by side would see an extra highlighted placeholder option on conversion that is absent on reference.
- **evidence:** `ref-menu-open-tight.png` vs `conv-menu-open-tight.png`; option inventory in probes.
- **remediationHint:** Keep `displayEmpty` + `renderValue` for closed placeholder, but omit the empty `MenuItem` from the list (or hide it) so open options match reference countries-only list.

### DEF-002

- **status:** accepted
- **category:** api
- **reference:** Astro named `trigger` / `option-0…9` slots.
- **converted:** Info callout; options via `MenuItem` children.
- **description:** Accepted gap per plan/userDecision — do not fail.
- **evidence:** Callout on `conv-dropdown-page-top.png`; manifest `skippedProps` / `gaps`.

## Blocked items

None. Label and Icon dependencies synced. Both servers reachable.

## Verifier notes

- Rendered evidence reviewed. Three-column visual matrix completed.
- Composite labels use FormLabel + Stack inline (approved).
- Examples purity: direct Select/MenuItem — no Harmony wrappers.
- Demo `fullWidth` width matches Input conversion pattern — not filed as defect.
