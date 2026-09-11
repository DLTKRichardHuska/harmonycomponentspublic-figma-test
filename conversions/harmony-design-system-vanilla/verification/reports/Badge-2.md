# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Badge` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-10T18:45:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| priorReport | `Badge-1.md` (FAIL; DEF-001–DEF-002 open) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 2 |
| blocked | 0 |
| deferred | 3 |
| accepted | 0 |
| **total** | 5 |

**Result:** PASS

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/badges` (CP light) |
| converted | Live `http://localhost:5178/components/badges` (CP light/dark, forced-colors) |
| metrics | `verification/artifacts/badge-2/capture-metrics.json` |
| screenshots | `verification/artifacts/badge-2/` (`ref-light-*`, `conv-light-*`, `conv-dark-top.png`, `conv-forced-colors-top.png`, `conv-api-clip.png`, `conv-a11y-clip.png`) |

Rendered evidence: Playwright browse of matching routes after remediation. Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No public `.badge` recipe | deferred | Manifest accepted |
| NotificationBadge out of scope | deferred | Separate catalog element |
| Custom Element / open Shadow DOM | n/a | Not a defect |
| `stable` maturity chip on title | deferred | Docs chrome; explains ref badge count 20 vs conv 19 |
| Forced-colors look vs Astro | n/a | No reference HC baseline |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Badges + intro | present | |
| Section: Variants (9) | present | Colors match CP light |
| Section: Sizes small/medium/large | present | Heights 16 / 20 / 24 |
| Section: With Icons | present | **fixed** — Approved/Pending(clock)/Rejected/Info + success size ladder |
| Section: Props / API | present | **fixed** — API table (variant/size/icon) |
| Section: Accessibility | present | **fixed** — decorative/status + color/icon guidance |
| npm + static consume | present | |
| NotificationBadge | deferred | Out of scope |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Variant pills (CP light) | Soft fills + matching borders | Same measured fills/colors/heights (all 9 MATCH) | present |
| Size ladder | 16 / 20 / 24 px | Same | present |
| Icon badges | Check/clock/x/info + size-scale success row | Pending+clock present; Small/Medium/Large icon row 16/20/24 | present |
| Dark / forced-colors | Dark default treatment | Captured; HC usable | present |
| API + Accessibility | Props + a11y cards | On-page API table + Accessibility card | present |

**Visual gaps (open):** 0

## Prior FAIL remediation (Badge-1)

| ID | Was | Now |
|----|-----|-----|
| DEF-001 | Missing Pending/clock + icon size row | **fixed** — 4 status icons + sm/md/lg success icons |
| DEF-002 | Missing Props + Accessibility | **fixed** — API table + Accessibility section |

Variant color matrix: Default→Disabled all MATCH vs reference computed styles at CP light.

## Consumer API / a11y

| Check | Result |
|-------|--------|
| Attrs `variant`, `size`, `icon` + default slot + part `icon` | present |
| Docs / CEM / AGENTS / llms | present |
| Forced-colors shadow-local | present |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | Verifier recommends PASS. AskQuestion before `elements.Badge.status = synced`. |

## Defects

### DEF-001

- **status:** fixed
- **category:** structure
- **description:** Pending/clock and icon size-scaling row now present.
- **evidence:** `badge-2` iconSectionTexts; conv-light-top.png

### DEF-002

- **status:** fixed
- **category:** structure
- **description:** API table + Accessibility section now on demo page.
- **evidence:** `conv-api-clip.png`, `conv-a11y-clip.png`; hasApi/hasA11y true

## Blocked items

None.

## Verifier notes

- CP light aligned on both servers before color compare.
- Content + visual matrices completed per DESIGNER_COMPARE / VISUAL_MATCH_GATE.
