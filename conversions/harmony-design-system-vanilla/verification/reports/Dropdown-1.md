# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Dropdown` (consumer **Select**) |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-09-11T00:40:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| plan | `conversions/harmony-design-system-vanilla/plans/Select.md` |
| manifest | `elements.Dropdown` strategy `web-component` — not marked `synced` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 0 |
| blocked | 0 |
| deferred | 1 |
| accepted | 0 |
| **total** | 1 |

**Result:** PASS

**PASS: zero conversion defects.**

## Side-by-side visual summary

| Area | Verdict |
|------|---------|
| Closed field (CP) | Match. Both the Astro trigger and the converted closed select are a 20px field, 12px type, 4px radius, 1px border, down chevron, muted placeholder. The select fills the example width like an Input; the Astro trigger stays shrink-wrapped. |
| Closed field (VP) | Match. Both are 40px tall, 16px type, 8px radius, white fill, grey border, chevron. Placeholder on the select is muted grey; selected text is body color. |
| Labels | Match. Stacked label sits above the field. Inline label sits to the left. CP unset labeled examples (Error) stay inline; VP unset labeled examples stack. |
| Form layout | Match. `harmony-select` lines up with `harmony-input` on the same row (label column, required mark, 20px CP control). Inputs page contact forms include Country / Priority selects in the same grid. |
| Dark | Match. Dark field fill, light value text, muted placeholder, faded disabled field, red error border plus message. |
| Forced-colors | Checked (Playwright `forcedColors: active`). Borders, OS chevron, error text, and selected rows stay visible. Not a fail vs Astro (reference has no HC baseline). |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | `http://localhost:4321/components/dropdowns` (CP light, CP dark, VP light) |
| converted | `http://localhost:5178/components/dropdowns` and `http://localhost:5178/components/inputs` |
| screenshots | `conversions/harmony-design-system-vanilla/verification/artifacts/dropdown-1/` |

Rendered evidence was reviewed (live pages plus screenshots). Source was used only to resolve the approved Select mapping.

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Dropdowns | present | Converted badge reads in progress (manifest), not stable — see DEF-001 |
| Intro copy | present | Converted lede explains Select + OS picker (approved framing) |
| Section: Examples / Basic Dropdown | present | Country, placeholder "Select a country" |
| Section: With Label (Stacked) | present | Label above the field |
| Section: With Label (Inline) | present | Label left of the field |
| Section: With Pre-selected Value | present | Priority shows Medium |
| Section: Disabled | present | Country (Disabled), United States, muted field |
| Section: Error | present | Plan extra (not on the Astro page). Red border, required mark, "Select a country" message |
| Section: Multiple | present | Plan extra. Native multi-list, US and UK selected |
| Section: Native select | present | Unclassed `<select>` plus helper note |
| Section: Form layout | present | First Name input beside Country select |
| Section: Props / API | present | Select attributes, not Astro `options` / trigger slots |
| Section: Accessibility | present | Native select keyboard/name/disabled. Listbox ARIA cards omitted (approved OS picker) |
| Article nav (Examples / Props / Accessibility) | deferred | Demo chrome, same class as Input-2 DEF-002 |
| Inputs `/components/inputs` form-layout Country select | present | Stacked contact form, inline First/Last + Country/Priority row, stacked single-column layout |

**Content gaps (open):** 0

Approved gaps not scored as missing: custom `.dropdown__menu` listbox, trigger button, option-0…9 slots, Kanban CP menu positioning. No `harmony-dropdown`.

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Closed field, CP light | Compact white trigger, grey border, 20px tall, 4px corners, small type, grey "Select a country", chevron | Full-width white select, same height, border, radius, type, muted placeholder, chevron | present |
| Closed field, VP light | Taller 40px trigger, 8px corners, 16px type, white fill, grey border, chevron | 40px full-width select, same radius, type, border, chevron; placeholder muted grey | present |
| Closed field vs converted Input (CP) | Input control is 20px, 4px radius, 12px type | Select control is 20px, same radius and type, chevron in the right padding | present |
| Stacked label | "Country" above the field inside the example card | Same, label above a full-width field | present |
| Inline label | "Country" left of a short trigger | "Country" left of the field, vertically centered | present |
| Pre-selected | Trigger reads "Medium" | Select reads "Medium" | present |
| Disabled | Faded trigger, "United States", still has a chevron | Grey field, muted "United States", chevron remains | present |
| Dark mode (CP) | Dark slate trigger, light text, muted placeholder, faded disabled | Same dark field, light "Medium", muted placeholder, faded disabled, red error border and message | present |
| Error (converted extra) | Not on the Astro page | Label, red asterisk, red 2px border, red helper under the field | present |
| Multiple (converted extra) | Not on the Astro page | Native multi-list, selected rows highlighted, no chevron | present |
| Native select | n/a (Astro uses a button trigger) | Same closed-field chrome as `harmony-select` | present |
| Form layout row | n/a on reference Dropdown page | "First Name" and "Country" share one row; labels, asterisks, and 20px controls line up | present |
| Inputs page form layout | Reference inputs page has no dropdown | Country select matches input height and label columns in stacked and inline forms; Priority sits beside Country on the inline row | present |
| Forced-colors | No reference baseline | Borders stay visible, OS chevron returns, disabled uses system grey text, error is thicker border plus text, selected options use system highlight | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Ask before marking `elements.Dropdown` `synced`. DEF-001 is demo chrome, not Select fidelity. |

## Defects

### DEF-001

- **status:** deferred
- **category:** structure
- **reference:** Dropdowns page has a green stable badge and an article nav (Examples, Props, Accessibility)
- **converted:** Orange in-progress badge; no article nav. Page sections and examples are still on the page
- **description:** A designer would notice docs chrome (status chip and in-page jump links) differs from DocsLayout. The Select examples themselves are present. Same demo-chrome gap deferred on Input (Input-2 DEF-002).
- **evidence:** `verification/artifacts/dropdown-1/ref-cp-light-full.png`, `conv-cp-light-top.png`
- **remediationHint:** optional demo-chrome only; do not block Select

## Blocked items

None. Both review surfaces responded (`:4321` and `:5178`). Forced-colors was captured; it was not left unverified.

## Consumer API

| Check | Status |
|-------|--------|
| `packages/ui/docs/components/Select.md` | present — native `<select>` / `.select` and `<harmony-select>` |
| `AGENTS.md` catalog map | Dropdown → native `select` + `harmony-select`; no `harmony-dropdown` |
| `llms.txt` | Select line present |
| `custom-elements.json` | tag `harmony-select` |
| Strategy | `web-component` dual path matches the approved plan |

## Verifier notes

Readonly compare. Content and visual matrices use rendered descriptions from live review of `/components/dropdowns` and `/components/inputs`, plus artifacts under `verification/artifacts/dropdown-1/`. Open list is the OS picker — not scored against `.dropdown__menu`. Manifest was not updated.

Recommendation: **PASS**. Human visual acceptance required before `synced`.
