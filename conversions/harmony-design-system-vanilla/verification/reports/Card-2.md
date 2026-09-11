# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `Card` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-10T15:45:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| priorReport | `Card-1.md` (FAIL; DEF-001–DEF-003 open) |

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

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/components/cards` |
| converted | Live `http://localhost:5178/components/cards` |
| metrics | `conversions/harmony-design-system-vanilla/verification/artifacts/card-2/capture-metrics.json` |
| screenshots | `card-2/ref-vp-light-*.png`, `conv-vp-light-*.png`, `conv-vp-dark-top.png`, `conv-forced-colors-top.png` |
| live probe | Every titled `harmony-card` has bodyText; actions 3/1; footerBtns 2; interactive role=button tabIndex=0 clicks=2 |

## Approved non-defects (plan / userDecision)

- No `.card__icon-btn` — ghost `btn--icon-xs` (accepted)
- Native `.card--interactive` CSS only; CE `interactive` → button a11y
- Kanban out of scope; footer demos intentional; `title` HTML tooltip documented

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Cards + intro | present | Native + hybrid paths documented |
| Basic / Header / Icons / Elevated / Interactive / Primary | present | Hybrid body/actions restored |
| Footer (intentional) | present | Cancel + Continue |
| API + Accessibility + Import | present | |

**Content gaps (open):** 0

## Visual parity

| Item | Status | Notes |
|------|--------|-------|
| Card surface / radius / shadow / primary top | present | Matches reference CSS tokens |
| Header title / subtitle / body | present | Hybrid no longer wiped |
| Header icon actions | present | Ghost icon-xs (accepted chrome delta) |
| Interactive CE a11y | present | role=button, keyboard click |
| Dark / forced-colors | present | Boundaries + focus usable |

**Visual gaps (open):** 0

## Prior FAIL remediation (Card-1)

| ID | Was | Now |
|----|-----|-----|
| DEF-001 | Hybrid titled cards lose body after re-sync | **fixed** |
| DEF-002 | Hybrid header-actions wiped | **fixed** (3 / 1) |
| DEF-003 | Hybrid footer wiped | **fixed** (footerBtns:2) |

## Defects

### DEF-001 — fixed — visual/structure/behavior
`HarmonyCard.#collectContent()` re-harvests managed regions on re-sync.

### DEF-002 — fixed — visual/structure
Header-actions preserved.

### DEF-003 — fixed — visual/structure
Footer preserved.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Notes | Verifier recommends PASS. AskQuestion before `elements.Card.status = synced`. |
