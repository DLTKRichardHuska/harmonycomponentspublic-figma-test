# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `ButtonGroup` |
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

**PASS: zero conversion defects.** Iteration 1 FAIL from [Verify shadcn batch A](f8935429-a824-4173-b0ae-f6b86edc3f08) remediated: gapped default shell (`gap-[var(--space-2)]`, ghost unselected), Multiple Button Counts, icon-only + per-size icon rows.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/button-groups` |
| converted (live) | `http://localhost:5177/components/button-groups` |
| reference PNG | `verification/artifacts/button-group-1/ref-top.png` (`#examples`) |
| converted PNG | `verification/artifacts/button-group-1/conv-top.png` (`#examples`) |
| converted HTML | `verification/artifacts/button-group-1/conv.html` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Default Variant (Container with Border) | present | |
| Default Variant - Toggle Example | present | |
| Size variants | present | |
| Orientation | present | |
| Disabled | present | |
| Multiple Button Counts 2 / 5 / 10 | present | Iteration 2 |
| With icons and text (all sizes) | present | Iteration 2 |
| Icon-only Bold/Italic/Underline | present | Iteration 2 |
| Outline connected strip | present | |
| Props + Accessibility | present | |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Default shell | Bordered tray; Selected primary chip; Option 1/2 spaced in tray | Same tray + primary chip + spaced ghost labels | present |
| Toggle Day/Week/Month | Selected Day chip in tray | Same | present |
| Outline strip | Joined Left/Middle/Right, no outer shell | Same | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | confirmed |
| Confirmed by | explicit user instruction to remediate ButtonGroup visual + missing examples |
| Notes | Iteration 2 |

## Defects

### DEF-BG-001 — **fixed** — gapped default shell vs joined bar
### DEF-BG-002 — **fixed** — Multiple Button Counts 2/5/10
### DEF-BG-003 — **fixed** — icon-only + per-size icon+text rows

## Recommendation

PASS — keep `ButtonGroup` `synced`.
