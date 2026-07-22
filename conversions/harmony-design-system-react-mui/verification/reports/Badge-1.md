# Verification report: Badge (iteration 1)

**Scope:** Badge  
**Status:** PASS (accepted gaps: none)  
**Date:** 2026-07-09

## Strategy

Custom `StatusBadge` export — Harmony Badge maps to package `StatusBadge`, not MUI Chip or Badge.

## Content inventory

| Reference section | Converted demo | Status |
|-------------------|----------------|--------|
| Variants (9) | Variants | present |
| Sizes (3) | Sizes | present |
| With Icons | With Icons | present |
| Props | Props | present |
| Accessibility | Accessibility | present |

## Visual summary

- Status label pills use alert-chip token colors for all 9 variants
- Heights: small 16px, medium 20px, large 24px
- Icons scale with badge size via HarmonyIcon

## Recommendation

**PASS** — implement complete; demo mirrors reference doc examples.
