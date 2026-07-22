# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `foundation` |
| iteration | 3 |
| artifactType | `html` |
| generatedAt | 2026-07-06T19:35:00Z |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 3 |
| blocked | 0 |
| deferred | 5 |
| accepted | 0 |
| **total** | 8 |

**Result:** PASS

DEF-003 (page titles 30px vs 36px) verified fixed on all five foundation routes. No new open defects.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | `http://localhost:4321/foundation/{colors,typography,spacing,elevations,dela}` |
| converted | `http://localhost:5176/foundation/{colors,typography,spacing,elevations,dela}` |
| page title probe | Inline Playwright probe — all routes ref/conv 36px |
| swatch compare | `verification/artifacts/diag/compare-swatches.mjs` — 104 palette keys match |
| semantic probe | `verification/artifacts/diag/probe-semantic-i3.mjs` — CP light/dark match |
| typography probe | `verification/artifacts/diag/probe-text.mjs` — article h1 36px |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Colors: all required sections | present | Accessibility callouts included |
| Typography: all samples + table | present | |
| Spacing: scale, patterns, radius, CSS table | present | |
| Elevations: scale, values, hierarchy | present | |
| Dela: brand guide, star, launch icon, tokens, gradient | present | |
| Dela: Live Demo, Panel Usage, AI Guidelines, Accessibility | deferred | Per VERIFIER.md — shell phase |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Palette swatches (all products × modes) | match | match | present |
| Semantic swatches | match | match | present |
| Typography display samples | match | match | present |
| Page titles (all routes) | 36px | 36px | present |
| Spacing bars + radius tiles | match | match | present |
| Elevations shadows | match | match | present |

**Visual gaps (open):** 0

## Defects

### DEF-003 — Page titles 30px vs reference 36px

- **status:** fixed
- **category:** visual
- **reference:** Foundation page titles at **36px** (`--text-4xl` / `page-header__title--sm`).
- **converted:** `DemoPageHeader` now uses `Typography variant="h3"` → **36px**.
- **evidence:** Playwright probe on all `/foundation/*` routes — ref **36px**, conv **36px**

## Blocked items

None — both dev servers reachable and all routes rendered.

## Verifier notes

- Iteration 3 confirms DEF-003 remediation: `h3` maps to displayM (36px) as intended.
- Dela deferred sections remain out of scope per playbook.
- **Recommendation:** PASS — zero open defects. Human sign-off required before marking `elements.foundation` `synced`.
