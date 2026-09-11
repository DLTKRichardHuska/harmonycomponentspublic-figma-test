# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Chip` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-10T18:45:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| priorReport | `Chip-1.md` (FAIL; DEF-001 open) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 3 |
| accepted | 0 |
| **total** | 4 |

**Result:** PASS

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/chips` (CP light) |
| converted | Live `http://localhost:5178/components/chips` (CP light/dark, forced-colors) |
| metrics | `verification/artifacts/chip-2/capture-metrics.json` |
| screenshots | `verification/artifacts/chip-2/` (`ref-light-*`, `conv-light-*`, `conv-dark-top.png`, `conv-forced-colors-top.png`, `conv-api-clip.png`, `conv-a11y-clip.png`) |

Rendered evidence: Playwright browse after remediation. Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No public `.chip` recipe | deferred | Manifest accepted |
| No Astro `state` attr — CSS pseudo-states | deferred | Manifest accepted |
| Staged Hover/Focused/Pressed columns | deferred | Covered by no-state-attr gap |
| Custom Element vs Astro span.chip | n/a | Not a defect |
| `stable` maturity chip | deferred | Docs chrome |
| Forced-colors look vs Astro | n/a | Border + system colors |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Chips + intro | present | |
| Sizes sm/md/lg | present | Heights 16 / 24 / 32; type 10 / 14 / 16 |
| Variants Fill / Outline | present | CP primary match |
| Selected & disabled | present | Staging hover/focus deferred |
| With icon & removable | present | |
| Types (dots / overflow) | present | |
| Props / API | present | **fixed** — API table |
| Accessibility | present | **fixed** — pressed/remove/disabled guidance |
| npm + static consume | present | |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Size ladder | Blue fill 16/24/32, font 10/14/16 | Same heights, colors, fonts | present |
| Fill / Outline | Primary fill vs transparent + border | Same | present |
| Disabled | 50% opacity | opacity 0.5 | present |
| Removable / icons | Leading icons + trailing x | Same affordance | present |
| Staged hover/focus/pressed | Dedicated columns | Omitted (accepted) | deferred |
| API + Accessibility | Props + a11y cards | On-page API table + Accessibility card | present |
| Forced-colors | n/a | System colors + border | present |

**Visual gaps (open):** 0

## Prior FAIL remediation (Chip-1)

| ID | Was | Now |
|----|-----|-----|
| DEF-001 | Missing Props + Accessibility | **fixed** — API table + Accessibility section |

No visual regressions vs Chip-1 size/fill/outline metrics.

## Behavior

| Check | Result |
|-------|--------|
| Controlled `selected` + body click (demo) | present (page wires toggle) |
| Remove control + `remove` event | present |
| `:hover` / `:focus-visible` in shadow CSS | present (approved; no staging) |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | Verifier recommends PASS. AskQuestion before `elements.Chip.status = synced`. |

## Defects

### DEF-001

- **status:** fixed
- **category:** structure
- **description:** API table + Accessibility section now on demo page.
- **evidence:** `chip-2/conv-api-clip.png`, `conv-a11y-clip.png`; hasApi/hasA11y true

## Blocked items

None.

## Verifier notes

- CP light fill/outline metrics matched reference for sampled size rows.
- Content + visual matrices completed per DESIGNER_COMPARE / VISUAL_MATCH_GATE.
