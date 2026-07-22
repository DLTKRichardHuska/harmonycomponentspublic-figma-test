# Verification report: NotificationBadge (iteration 1)

**Scope:** NotificationBadge  
**Status:** PASS (accepted gaps documented)  
**Date:** 2026-07-09

## Strategy

`existing-mui` — `@mui/material/Badge` + `mapNotificationBadgeToTheme.ts`

## Content inventory

| Reference section | Converted demo | Status |
|-------------------|----------------|--------|
| Dot badges primary/error | Dot on IconButton | present (wrapped) |
| Number badges | Number on IconButton | present (wrapped) |
| Overflow badges | Overflow on Icon/Avatar | present (wrapped) |
| Border variants | overlap="circular" | present |
| Props | Props | present |
| Accessibility | Accessibility | present |

## Accepted gaps

- Standalone span layout — demos use MUI wrapper pattern on Icon/Avatar
- `size` sm/lg — no native MUI Badge size prop; theme targets md

## Recommendation

**PASS** — with documented skips per userDecision.
