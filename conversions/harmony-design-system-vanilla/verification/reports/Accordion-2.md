# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Accordion` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-11T19:54:26.846Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| priorReport | `Accordion-1.md` (FAIL; condensed examples / missing Accessibility) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 1 |
| accepted | 2 |
| **total** | 4 |

**Result:** PASS

**PASS: zero conversion defects.**

## Side-by-side visual summary

| Area | Reference (`:4321`, CP light) | Converted (`:5178`, CP light) | Verdict |
|------|-------------------------------|-------------------------------|---------|
| Basic accordion | 3 collapsed FAQ rows, chevrons right, hairline dividers | Same titles/layout/chevrons | Match |
| With Label | "Account preferences" above Notifications/Privacy | Same | Match |
| Default Open | First item expanded with body copy | Same ("Can I customize…") | Match |
| Allow Multiple | Multi-open Section A/B | A+B open, C closed | Match |
| Disabled | "Locked section" muted | Same mute + non-interactive affordance | Match |
| Focus | Interactive headers for focus/hover grey | Same demo present | Match |
| API / Accessibility | Props table + a11y subsections | CE attribute table + condensed a11y callout | Match (equivalent) |
| Consume snippets | n/a (Astro docs) | npm + static zip | Extra OK |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/accordion` (CP light) |
| converted | Live `http://localhost:5178/components/accordion` (CP light) |
| screenshots | `verification/artifacts/Accordion-2-ref.png`, `Accordion-2-conv.png` |
| section PNGs | `verification/artifacts/accordion-table-2/ref-accordion-sec-*.png`, `conv-accordion-sec-*.png` |
| metrics | `verification/artifacts/accordion-table-2/conv-accordion-detail.json`, `*-inventory.json` |

Rendered evidence: Playwright browse + section scroll captures after remediation. Not source-only.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No public `.accordion` recipe | accepted | Manifest / userDecision |
| No Astro `items[]` / item slots | accepted | Manifest / userDecision |
| Badge `stable` vs `synced` | deferred | Docs chrome |
| Props table vs CE attribute API table | accepted | Strategy web-component Consumer API |
| Condensed Accessibility (one callout vs Keyboard/ARIA/SR cards) | accepted | Same outcomes documented |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Accordion | present | |
| Intro | present | Wording differs; intent clear |
| Basic Accordion | present | |
| With Label | present | |
| With Default Open | present | |
| Allow Multiple | present | |
| Disabled Sections | present | |
| Focus | present | |
| Props / API | present | Named API; CE attrs |
| Accessibility | present | Remediated from Accordion-1 |
| Consume npm / static | present | Conversion-only |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Accordion chrome | Bordered stack, right chevrons, ~50px closed rows | Same rhythm and chevrons | present |
| Label above group | Bold "Account preferences" | Same | present |
| Default-open body | Expanded first item shows brand-copy body | Same | present |
| Multi-open | Multiple headers expanded | Section A+B open | present |
| Disabled mute | Locked header lighter grey | Same mute | present |
| Focus demo | Tab/click focus grey on headers | Demo present with same FAQ titles | present |

**Visual gaps (open):** 0

## Prior FAIL remediation (Accordion-1)

| ID | Was | Now |
|----|-----|-----|
| DEF-001 | Missing Accessibility; examples condensed | **fixed** — Basic, With Label, Default Open, Allow Multiple, Disabled, Focus, API, Accessibility all on demo |

### DEF-001

- **status:** fixed
- **category:** structure
- **reference:** Full example set + Accessibility
- **converted:** Same section set now rendered
- **description:** Designer no longer sees a condensed-only Accordion page missing Accessibility.
- **evidence:** Live CP-light browse; `conv-accordion-sec-Accessibility.png`, `conv-accordion-sec-Disabled-Sections.png`, inventory headings

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS; human confirm before treating Accordion-2 as acceptance (manifest already `synced` from prior path — confirm still advised) |

## Defects

None open.

## Blocked items

None.

## Verifier notes

- Content + visual matrices completed from rendered `:4321` vs `:5178` (DESIGNER_COMPARE / VISUAL_MATCH_GATE).
- 6 `harmony-accordion` hosts / 17 items measured; disabled item `Locked section` present.
- Demo chrome differences (Product switcher, coverage %) ignored.
