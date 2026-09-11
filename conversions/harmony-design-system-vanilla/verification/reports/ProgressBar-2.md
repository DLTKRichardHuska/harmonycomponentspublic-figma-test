# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `ProgressBar` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-10T18:45:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| priorReport | `ProgressBar-1.md` (FAIL; DEF-001–DEF-002 open) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 2 |
| blocked | 0 |
| deferred | 1 |
| accepted | 0 |
| **total** | 3 |

**Result:** PASS

**PASS: zero conversion defects.**

## Side-by-side visual summary

| Area | Reference (`:4321`) | Converted (`:5178`) | Verdict |
|------|---------------------|---------------------|---------|
| Basic fills 25/50/75/100 | Pill track + primary fill | Same heights (8px md), fill %, colors | Match |
| Sizes sm/md/lg @ 60% | 4 / 8 / 12 px tracks | Same ladder | Match |
| Variants @ 75% | default / success / warning / error | Same semantic fills | Match |
| With Label 42% | `42%` under track | Same label text/placement | Match |
| API / Props | Props section | **API** attribute table (value/max/size/variant/show-label) + parts note | Match (remediated) |
| Accessibility | A11y cards | Accessibility section (progressbar + forced-colors) | Match (remediated) |

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/progress-bar` |
| converted | Live `http://localhost:5178/components/progress-bar` |
| metrics | `verification/artifacts/progress-bar-2/capture-metrics.json` |
| screenshots | `ref-light-top/full.png`, `conv-light-top/full.png`, `conv-dark-top.png`, `conv-forced-colors-top.png`, `conv-api-clip.png`, `conv-a11y-clip.png` |

Rendered evidence: Playwright browse of matching routes after remediation. Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No HTML `<progress>` | n/a | Manifest accepted; absent on both |
| No public `.progress` recipe | deferred | Manifest `userDecision.gaps` |
| Shadow DOM vs Astro `.progress` | n/a | Not a defect when appearance matches |
| `stable` maturity chip | deferred | Docs chrome only |
| Forced-colors look ≠ Astro | n/a | HC outcome gate; shadow-local rules present |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Progress Bar | present | |
| Intro description | present | CE-focused wording; same intent |
| Badge `stable` | deferred | Docs chrome |
| Examples: Basic / Sizes / Variants / With Label | present | Same demo set |
| Section: Props / API | present | **fixed** — API table on demo page |
| Section: Accessibility | present | **fixed** — ElementInternals + forced-colors guidance |
| Consume npm + static snippets | present | |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic Progress fills | Four pill bars ~25/50/75/100%, primary on grey track | Same fill ratios, track/bar colors | present |
| Size ladder | Thin / medium / thick | 4 / 8 / 12 px tracks | present |
| Variant colors | Blue / green / amber / red fills | Same semantic fills in examples | present |
| With Label | `42%` under bar | `42%` under bar | present |
| API table | Props attributes visible | Attribute table + parts note rendered | present |
| Accessibility | Guidance cards | Accessibility card with progressbar + HC note | present |
| Dark / forced-colors | Mode switch / n/a HC | Dark top + HC capture usable | present |

**Visual gaps (open):** 0

## Prior FAIL remediation (ProgressBar-1)

| ID | Was | Now |
|----|-----|-----|
| DEF-001 | Missing Props/API on demo | **fixed** — `API` h2 + attribute table |
| DEF-002 | Missing Accessibility section | **fixed** — Accessibility h2 + ElementInternals / forced-colors copy |

No visual regressions vs ProgressBar-1 passing matrix (fills, sizes, variants, label).

## Consumer API / mapping / a11y

| Check | Result |
|-------|--------|
| Tag `harmony-progress`, open Shadow DOM | present |
| Attrs `value`, `max`, `size`, `variant`, `show-label` | present |
| Parts `track`, `bar`, `label` | present |
| ElementInternals `role=progressbar` | documented + implemented |
| Forced-colors shadow-local | present |
| Docs / CEM / AGENTS / llms | present |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS. AskQuestion before `elements.ProgressBar.status = synced`. |

## Defects

### DEF-001

- **status:** fixed
- **category:** structure
- **reference:** Props section with attribute table
- **converted:** API table on `/components/progress-bar`
- **description:** Prior gap closed — designer now sees an on-page API table equivalent to Props.
- **evidence:** `progress-bar-2/conv-api-clip.png`; metrics `hasApi: true`, 6 table rows

### DEF-002

- **status:** fixed
- **category:** structure
- **reference:** Accessibility section
- **converted:** Accessibility section with progressbar + forced-colors guidance
- **description:** Prior gap closed — Accessibility content is on the demo page.
- **evidence:** `progress-bar-2/conv-a11y-clip.png`; metrics `hasA11y: true`

## Blocked items

None — both review surfaces reachable.

## Verifier notes

- Rendered evidence reviewed on live `:4321` and `:5178`; not source-only.
- Visual matrix uses three columns with designer-visible descriptions; metrics closed fill/height/color at aligned product theme.
- Content + visual matrices completed per DESIGNER_COMPARE / VISUAL_MATCH_GATE.
- Reference article-nav chips vs converted in-page `h2`s — equivalent discoverability; not a defect.
