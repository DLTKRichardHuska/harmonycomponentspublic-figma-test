# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Badge` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | 2026-09-10T18:30:00.000Z |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 2 |
| fixed | 0 |
| blocked | 0 |
| deferred | 2 |
| accepted | 0 |
| **total** | 4 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/badges` (CP light + dark screenshots) |
| converted | Live `http://localhost:5178/components/badges` (CP light/dark, forced-colors) |
| screenshots | `verification/artifacts/badge-1/` (`ref-cp-light-*.png`, `conv-cp-light-*.png`, `conv-cp-dark-top.png`, `conv-forced-colors-top.png`) |
| metrics | `verification/artifacts/badge-1/capture-metrics.json` |

Rendered evidence: Playwright browse of matching routes (CP light aligned). Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No public `.badge` recipe | deferred | Manifest `userDecision.gaps` (accepted) |
| NotificationBadge out of scope | deferred | Manifest gap; separate catalog element |
| Custom Element / open Shadow DOM vs Astro `<Badge>` | n/a | Not a defect per VERIFIER.md |
| `stable` maturity chip on title | deferred | Reference docs chrome only |
| Forced-colors look vs Astro | n/a | No reference HC baseline; border + Canvas colors usable |
| Consume npm/static snippets vs Astro Props table shape | n/a | Equivalent consumer path when API table present — see DEF-002 |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Badges + intro | present | CE intro + icon note |
| Section: Variants (9) | present | default→disabled; colors match CP light |
| Section: Sizes small/medium/large | present | Heights 16 / 20 / 24 |
| Section: With Icons (4 status + size row) | different | Converted shows 3 icon badges only; missing Pending + size-scaling row (DEF-001) |
| Section: Props / API | missing | No on-page API table; consume snippets only (DEF-002) |
| Section: Accessibility | missing | Reference has 3 a11y cards (DEF-002) |
| npm + static consume snippets | present | `demo-consume-snippets` |
| NotificationBadge | deferred | Out of scope |

**Content gaps (open):** 2

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Variant pills (CP light) | Soft fills + matching borders (e.g. default `rgb(247,248,250)` / primary cyan `rgb(199,242,255)`) | Same measured fills, borders, text colors, pill radius `9999px` | present |
| Size ladder | 16 / 20 / 24 px heights; 10 / 12 / 14 px type | Same heights and font sizes | present |
| Icon badges | Check/clock/x/info leading glyphs; icons scale on sm/md/lg success row | Check/x/info present and sized; clock + size-scale row absent | different |
| Dark mode default | Dark grey fill / light text on default | Same default dark treatment (`rgb(55,66,77)` / `rgb(182,182,196)`) | present |
| Forced-colors | n/a | Host keeps border; text/fill remap to system colors | present |

**Visual gaps (open):** 1 (icon example coverage — counted under DEF-001)

## Defects

### DEF-001

- **status:** open
- **category:** structure
- **reference:** With Icons shows Approved (check), Pending (clock), Rejected (x), Info, plus a second row of success icon badges at small/medium/large
- **converted:** With icons shows Complete (check), Failed (x), Info only — no warning/clock example and no icon size-scaling row
- **description:** Designer would miss the Pending/warning+clock example and the demonstration that icons scale with badge size.
- **evidence:** `badge-1/ref-cp-light-top.png` vs `badge-1/conv-cp-light-top.png`; metrics badge counts 19 example badges vs 15
- **remediationHint:** Add warning+clock and success icon size ladder examples to `DemoBadgesPage.js` (labels may match reference or stay product-neutral)

### DEF-002

- **status:** open
- **category:** structure
- **reference:** Props table + Accessibility section (Semantic HTML, Color Contrast, Icon Badges)
- **converted:** Consume npm/static snippets only; no Accessibility heading or a11y cards; no on-page attribute API table
- **description:** Designer/docs reader loses the Props and Accessibility educational sections present on the reference page (same class of gap that failed Icon-1 until remediated).
- **evidence:** Live browse `:5178/components/badges`; `hasA11y: false` in capture metrics; compare Icon-2 DEF-001/002 precedent
- **remediationHint:** Add compact Badge API table + Accessibility callouts (decorative span, contrast, icon labeling) mirroring Button/Icon demo pages

## Blocked items

None — both servers reachable.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | Verifier recommends FAIL until DEF-001/002 closed or human accepts. AskQuestion before `elements.Badge.status = synced`. |

## Verifier notes

- CP light matrix: variant colors/heights/padding matched computed styles on both surfaces.
- Approved API surface (`variant`/`size`/`icon`, default slot, part `icon`) is implemented; CEM + `docs/components/Badge.md` + `AGENTS.md`/`llms.txt` list Badge.
- Shadow-local `@media (forced-colors: active)` present in `badge.css`.
