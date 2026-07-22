# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `foundation` |
| iteration | 2 |
| artifactType | `html` |
| generatedAt | 2026-07-06T18:35:00Z |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 2 |
| blocked | 0 |
| deferred | 5 |
| accepted | 0 |
| **total** | 8 |

**Result:** FAIL

Foundation-1 blockers (unreadable typography, frozen dark palette) are resolved. One open visual defect remains: page titles render at 30px instead of reference 36px on all five routes.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | `http://localhost:4321/foundation/{colors,typography,spacing,elevations,dela}` |
| converted | `http://localhost:5176/foundation/{colors,typography,spacing,elevations,dela}` |
| swatch audit (stock) | `verification/artifacts/swatch-audit-1783362760994/swatch-audit.md` |
| swatch re-compare | `verification/artifacts/diag/compare-swatches.mjs` output |
| typography probe | `verification/artifacts/diag/probe-text.mjs` output |
| semantic probe | `verification/artifacts/diag/probe-semantic-i3.mjs` output |

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

| Item | Reference | Converted | Status |
|------|-----------|-----------|--------|
| Palette swatches (all products × modes) | match | match | present |
| Semantic swatches | match | match | present |
| Typography samples | match | match | present |
| **Page titles (all routes)** | **36px** | **30px** | **different** |
| Spacing bars + radius tiles | match | match | present |
| Elevations shadows | match | match | present |

**Visual gaps (open):** 1

## Defects

### DEF-001 — Foundation text ~1px (iteration 1)

- **status:** fixed
- **category:** visual
- **reference:** Legible typography at design scale on every foundation route.
- **converted:** Typography now renders at correct sizes.
- **evidence:** `probe-text.mjs` — article h1 30px, swatch labels 16px, display samples 60/48/36px (was ~1–3px in foundation-1)

### DEF-002 — Dark palette frozen to light (iteration 1)

- **status:** fixed
- **category:** tokens
- **reference:** Dark-mode swatch tiles and printed hex show dark palette values per product.
- **converted:** Swatches now track active product × mode.
- **evidence:** `compare-swatches.mjs` — 104/104 palette keys match (13 keys × 4 products × 2 modes); `probe-semantic-i3.mjs` — semantic colors match CP light/dark

### DEF-003 — Page titles 30px vs reference 36px

- **status:** open
- **category:** visual
- **reference:** Foundation page titles use `page-header__title--sm` → `--text-4xl` → **36px** (e.g. "Color System", "Typography").
- **converted:** `DemoPageHeader` uses `Typography variant="h4"` → `headingXL` → **30px**.
- **description:** Designer would see noticeably smaller page titles on every foundation route.
- **evidence:** Computed styles on `/foundation/colors` and `/foundation/typography` — ref **36px**, conv **30px**
- **remediationHint:** Map page title to `displayM` / `--text-4xl` (36px), not `h4` / `headingXL` (30px), in `DemoPageHeader.tsx`

## Blocked items

None — both dev servers reachable (`:4321` and `:5176` returned 200) and all routes rendered.

## Verifier notes

- DEF-001 and DEF-002 from foundation-1 verified fixed on current rendered state.
- Stock `audit-palette-swatches.mjs` reported 104 mismatches with converted values all `null` — tooling selector issue (script looks for `.MuiPaper-root`; conversion uses `[data-color-key]` on `MuiBox`). Real comparison via `compare-swatches.mjs` shows zero palette mismatches. Recommend updating audit script selector for this target.
- Dela deferred sections (Live Demo, Panel Usage, AI Guidelines, Accessibility) documented per playbook — not counted as open defects.
- **Recommendation:** FAIL — fix DEF-003 (page title sizing), then re-run iteration 3. Do not mark `elements.foundation` `synced` until zero open defects and human sign-off.
