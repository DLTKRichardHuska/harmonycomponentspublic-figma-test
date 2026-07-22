# Verification report: Chip (iteration 1)

**Scope:** Chip  
**Status:** PASS (accepted gaps documented)  
**Date:** 2026-07-09

## Strategy

`existing-mui` — `@mui/material/Chip` + `mapChipToTheme.ts`

## Content inventory

| Reference section | Converted demo | Status |
|-------------------|----------------|--------|
| Sizes | Sizes (sm/md) + callout for lg | present (lg skipped) |
| Variants Fill/Outline | Fill/Outline | present |
| States Enabled/Disabled | Enabled/Disabled | present |
| States Hover/Focused/Pressed | Callout | skipped |
| Text chips | Text chips | present |
| Horiz/vert dots | Composite icon slot | present |
| Overflow | Composite label | present |
| With icons | With icons | present |
| Removable | Removable (onDelete) | present |
| Legacy selected | Callout | skipped |

## Accepted gaps

- `size="lg"` — MUI Chip has only small/medium
- Static `state` props — MUI uses pseudo-states
- Legacy `selected` — no MUI equivalent

## Recommendation

**PASS** — with documented skips per userDecision.
