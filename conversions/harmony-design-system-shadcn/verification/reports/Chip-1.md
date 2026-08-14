# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `Chip` |
| iteration | `1` |
| artifactType | `html` + `png` |
| generatedAt | `2026-08-14T01:35:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 2 |
| **total** | 2 |

**Result:** PASS

**PASS: zero conversion defects.** Static hover/focused/pressed docs columns and legacy selected omitted per `userDecision` / `gaps[]`.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/components/chips` |
| converted (live) | `http://localhost:5177/components/chips` |
| reference PNG (top) | `conversions/harmony-design-system-shadcn/verification/artifacts/chip-1/ref-top.png` |
| converted PNG (top) | `conversions/harmony-design-system-shadcn/verification/artifacts/chip-1/conv-top.png` |
| reference HTML | `conversions/harmony-design-system-shadcn/verification/artifacts/chip-1/ref.html` |
| converted HTML | `conversions/harmony-design-system-shadcn/verification/artifacts/chip-1/conv.html` |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Chips | present | |
| Intro | present | Same copy |
| Sizes sm/md/lg | present | |
| Fill / outline | present | |
| States Hover / Focused / Pressed | accepted | Manifest gaps: static docs states omitted (CSS pseudo) |
| Disabled | present | |
| Types text / dots / overflow | present | |
| Icons / removable | present | |
| Legacy selected | accepted | Manifest skippedProps `selected` |
| Props + Accessibility | present | |

**Content gaps (open):** 0

### Docs / import checks

| Check | Status |
|-------|--------|
| ImportSnippet Chip | PASS |
| `docs/components/Chip.md` | PASS |

## Side-by-side visual / behavior summary

**Matches**

- Filled primary chips with rounded rectangle + “Chip Text”
- Outline variant, size ladder, removable, overflow, dots

**Differs (not defects)**

- No static Hover/Focus/Pressed columns (accepted)
- No legacy Selected example (accepted)
- ImportSnippet; `synced` vs `stable`

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Fill chips | Three blue rounded pills Small/Medium/Large | Fill + outline chips, same primary fill | present |
| Outline | Filled vs outline described | Outline chip with border | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | confirmed |
| Confirmed by | human (prior visual accept 2026-07-19) + explicit re-verify to restore report |
| Notes | Accepted gaps unchanged: legacy selected; static hover/focus/pressed |

## Defects

### DEF-001

- **status:** accepted
- **category:** mapping
- **reference:** Legacy Selected State example
- **converted:** omitted
- **description:** Designer would not see a selected Chip prop demo — approved skip.
- **evidence:** `gaps[]` / skippedProps `selected`

### DEF-002

- **status:** accepted
- **category:** mapping
- **reference:** Static Hover / Focused / Pressed example columns
- **converted:** omitted (real CSS pseudo-states)
- **description:** Docs-only staged states omitted — approved.
- **evidence:** `gaps[]`

## Recommendation

PASS — keep `Chip` `synced`.
