# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `Avatar` |
| iteration | `1` |
| artifactType | `html` + `png` |
| generatedAt | `2026-08-14T13:10:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 1 |

**Result:** PASS

**PASS: zero conversion defects.** [Verify shadcn batch A](f8935429-a824-4173-b0ae-f6b86edc3f08) DEF-AV-001 (static Hover/Focus demo columns) **accepted** — no staging classes; hover/focus via real interaction. Same pattern as Chip static states.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/avatar` |
| converted (live) | `http://localhost:5177/components/avatar` |
| reference PNG | `verification/artifacts/avatar-1/ref-top.png` |
| converted PNG | `verification/artifacts/avatar-1/conv-top.png` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Title Avatar | present | |
| Sizes icon sm/md/lg | present | |
| Variants icon / initials / image | present | |
| Interactive default | present | |
| Interactive Hover (demo) / Focus (demo) | accepted | No static staging |
| Interactive disabled | present | Separate group |
| Props + Accessibility | present | |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Icon avatar | Rounded square, primary fill, white silhouette | Same | present |
| Initials / image | JD / photo in same frame | Same | present |
| Hover/focus tiles | Labeled demo columns | Omitted; live CSS | accepted |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | confirmed |
| Confirmed by | explicit user instruction — treat Avatar hover/focus columns as accepted |
| Notes | Manifest `gaps[]` updated |

## Defects

### DEF-AV-001

- **status:** accepted
- **category:** structure
- **reference:** Interactive Hover (demo) / Focus (demo) columns
- **converted:** omitted
- **description:** Designer would not see staged hover/focus tiles — approved (no docs staging classes).
- **evidence:** `AvatarsDemo.tsx`; conversion-agent purity (Chip-equivalent)

## Recommendation

PASS — keep `Avatar` `synced`.
