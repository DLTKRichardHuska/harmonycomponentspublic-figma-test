# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Avatar` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | 2026-09-10T18:30:00.000Z |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 0 |
| blocked | 0 |
| deferred | 3 |
| accepted | 0 |
| **total** | 4 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/avatar` (CP light) |
| converted | Live `http://localhost:5178/components/avatar` (CP light/dark, forced-colors) |
| screenshots | `verification/artifacts/avatar-1/` (`ref-cp-light-*.png`, `conv-cp-light-*.png`, `conv-forced-colors-top.png`) |
| metrics | `verification/artifacts/avatar-1/capture-metrics.json` |

Rendered evidence: Playwright browse of matching routes (CP light). Source-only review was not used for the verdict.

## Approved non-defects / deferred

| Item | Status | Notes |
|------|--------|-------|
| No public `.avatar` / `button.avatar` recipe | deferred | Manifest accepted gap |
| No Astro `avatar--demo-hover` / `avatar--demo-focus` staging columns | deferred | Explicit accepted gap — real hover/focus OK |
| Custom Element / ElementInternals vs Astro button/div | n/a | Not a defect |
| `stable` maturity chip | deferred | Docs chrome only |
| Forced-colors look vs Astro | n/a | Border usable under HC |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Avatar + intro | present | CE + interactive click note |
| Sizes (icon) sm/md/lg | present | 24 / 32 / 40; radius 4 / 8 / 12 |
| Variants icon / initials / image | present | JD initials; Unsplash portrait |
| Interactive Default | present | role via ElementInternals; tabIndex 0 |
| Interactive Hover (demo) / Focus (demo) | deferred | Accepted — note on page explains real interaction |
| Interactive Disabled | present | opacity 0.5; tabIndex -1 |
| Props / API | missing | Consume snippets only (DEF-001) |
| Accessibility | missing | Reference Roles and labels card (DEF-001) |
| npm + static consume | present | |

**Content gaps (open):** 1

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Icon sizes | CP blue squares `rgb(42,120,198)`, white user glyph, 24/32/40 | Same color, sizes, radii | present |
| Initials | White **JD** on CP blue md | Same | present |
| Image | Photo fills square frame | Same portrait fill | present |
| Interactive default | Pointer cursor, blue square | Same | present |
| Interactive disabled | Faded 50% opacity | opacity `0.5`, `not-allowed` | present |
| Demo hover/focus staging | Lighter blue / focus ring columns | Omitted (accepted); `:focus-visible` uses `--focus-ring-primary` | deferred |
| Forced-colors | n/a | System fill/text + 1px border | present |

**Visual gaps (open):** 0

## Behavior / a11y (component)

| Check | Result |
|-------|--------|
| Interactive Enter/Space → click | PASS (`clicks: 2`) |
| Disabled blocks activation | PASS (tabIndex -1, opacity 0.5) |
| `:focus-visible` rule | present (`box-shadow: var(--focus-ring-primary)`) |
| Missing initials/src → user icon | present (default variant) |

## Defects

### DEF-001

- **status:** open
- **category:** structure
- **reference:** Props table + Accessibility card (roles/labels for img vs button)
- **converted:** Consume snippets only; no Accessibility section on the demo page
- **description:** Designer would not find the Props/Accessibility educational content that the reference Avatar page (and other synced vanilla demos like Icon/Button) provide.
- **evidence:** Live `:5178/components/avatar`; Icon-2 precedent (missing Accessibility was FAIL until fixed)
- **remediationHint:** Add Avatar API table + short Accessibility callout (img vs button, aria-label, Enter/Space) to `DemoAvatarPage.js`

## Blocked items

None.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | Visual/behavior look PASS; FAIL on missing Accessibility/API page content. Confirm deferred demo-hover gap remains accepted before sync. |

## Verifier notes

- Matched CP light on both servers before judging colors.
- Approved interactive gap (no staging classes) documented on the converted page and in the manifest — not counted as open.
