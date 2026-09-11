# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Avatar` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-10T18:45:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| priorReport | `Avatar-1.md` (FAIL; DEF-001 open) |

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
| reference | Live `http://localhost:4321/components/avatar` (CP light) |
| converted | Live `http://localhost:5178/components/avatar` (CP light/dark, forced-colors) |
| metrics | `verification/artifacts/avatar-2/capture-metrics.json` |
| screenshots | `verification/artifacts/avatar-2/` (`ref-light-*`, `conv-light-*`, `conv-dark-top.png`, `conv-forced-colors-top.png`, `conv-api-clip.png`, `conv-a11y-clip.png`) |

Rendered evidence: Playwright browse after remediation. Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No public `.avatar` / `button.avatar` recipe | deferred | Manifest accepted |
| No Astro demo-hover/focus staging columns | deferred | Explicit accepted gap |
| Custom Element / ElementInternals | n/a | Not a defect |
| `stable` maturity chip | deferred | Docs chrome |
| Forced-colors look vs Astro | n/a | Border usable under HC |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Avatar + intro | present | |
| Sizes (icon) sm/md/lg | present | 24 / 32 / 40; radius 4 / 8 / 12 |
| Variants icon / initials / image | present | JD; Unsplash portrait |
| Interactive Default + Disabled | present | Staging hover/focus deferred |
| Props / API | present | **fixed** — API table |
| Accessibility | present | **fixed** — img vs button, Enter/Space |
| npm + static consume | present | |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Icon sizes | CP blue squares 24/32/40, radius 4/8/12 | Same color, sizes, radii | present |
| Initials | White JD on CP blue md | Same | present |
| Image | Photo fills frame | Same portrait | present |
| Interactive default / disabled | Pointer / faded 50% | Same; opacity 0.5 disabled | present |
| Demo hover/focus staging | Dedicated columns | Omitted (accepted) | deferred |
| API + Accessibility | Props + roles card | On-page API table + Accessibility card | present |
| Forced-colors | n/a | System fill/text + border | present |

**Visual gaps (open):** 0

## Prior FAIL remediation (Avatar-1)

| ID | Was | Now |
|----|-----|-----|
| DEF-001 | Missing Props + Accessibility | **fixed** — API table + Accessibility section |

No visual/behavior regressions vs Avatar-1 (sizes, variants, interactive disabled).

## Behavior / a11y (component)

| Check | Result |
|-------|--------|
| Interactive role/focus (approved API) | present (documented + ElementInternals) |
| Disabled visual | opacity 0.5 |
| Missing initials/src → user icon | present |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | Verifier recommends PASS. Confirm deferred demo-hover gap remains accepted before sync. AskQuestion before `elements.Avatar.status = synced`. |

## Defects

### DEF-001

- **status:** fixed
- **category:** structure
- **description:** API table + Accessibility section now on demo page.
- **evidence:** `avatar-2/conv-api-clip.png`, `conv-a11y-clip.png`; hasApi/hasA11y true

## Blocked items

None.

## Verifier notes

- Matched CP light on both servers before judging colors.
- Content + visual matrices completed per DESIGNER_COMPARE / VISUAL_MATCH_GATE.
