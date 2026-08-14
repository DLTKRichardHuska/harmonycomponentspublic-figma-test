# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `NotificationBadge` |
| iteration | `2` |
| artifactType | `html` + `png` |
| generatedAt | `2026-08-14T13:10:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 3 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 3 |

**Result:** PASS

**PASS: zero conversion defects.** Iteration 1 FAIL from [Verify shadcn batch A](f8935429-a824-4173-b0ae-f6b86edc3f08): labeled Dot / Number / Overflow inventories now lead Examples; recapture `#examples` shows the indicators.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/notification-badges` |
| converted (live) | `http://localhost:5177/components/notification-badges` |
| reference PNG | `verification/artifacts/notification-badge-1/ref-top.png` (`#examples`) |
| converted PNG | `verification/artifacts/notification-badge-1/conv-top.png` (`#examples`) |
| converted HTML | `verification/artifacts/notification-badge-1/conv.html` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Dot Badges Primary + Error, sizes ± border | present | |
| Number Badges (1 / 5) size+border grids | present | |
| Overflow Badges 99+ grids | present | |
| On an anchor | present | Approved Consumer API; after inventories |
| Border on dark field | present | |
| Props + Accessibility | present | |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Dot rows | Primary blue and error red circles, size ladder | Same two rows in one card | present |
| Number rows | Blue “1” and red “5” circles | Same | present |
| Overflow rows | Blue/red 99+ pills | Same | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | confirmed |
| Confirmed by | explicit user instruction to add labeled standalone inventories and recapture |
| Notes | Iteration 2 |

## Defects

### DEF-NB-001 — **fixed** — labeled Dot/Number/Overflow inventories
### DEF-NB-002 — **fixed** — first-screen indicators in `#examples` capture
### DEF-NB-003 — **fixed** — recapture unblocked visual compare

## Recommendation

PASS — keep `NotificationBadge` `synced`.
