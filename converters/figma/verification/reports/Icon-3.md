# Conversion defect report

| Field | Value |
|-------|-------|
| target | `figma` |
| scope | `Icon` |
| product | `vp` |
| iteration | `3` |
| artifactType | `image` |
| generatedAt | `2026-07-22T16:45:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 1 |
| blocked | 0 |
| deferred | 2 |
| accepted | 2 |
| **total** | 6 |

**Result:** PASS

> Scope expansion test: all shadcn **Custom Icons** (40 names incl. already-present `keyboard`) added to `IconGlyph` (`4:26`) in place — **71** total name variants. Glyph art follows hard rules (GROUP + Outline Stroke fill + `text-primary` + SCALE). Samples page gained a **Custom Icons** section. Host status remains `review`.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| converted (glyphs) | `converters/figma/verification/artifacts/vp-IconGlyph-3.png` (set `4:26`) |
| converted (samples) | `converters/figma/verification/artifacts/vp-Icon-samples-3.png` (node `44:29`) |

## Scope (Custom Icons)

Source: shadcn demo `iconCategories.ts` → `customIconCategories` (matches Astro Icons page Custom section).

| Check | Status |
|-------|--------|
| All 40 custom names present on IconGlyph | present (0 missing) |
| `keyboard` already in curated seed — not duplicated as new id | present |
| Set id `4:26` preserved | present |
| Public Icon `44:28` unchanged (size wrapper) | present |
| Samples Custom Icons grid (40 public Icon instances) | present |

## IconGlyph art (hard)

| Check | Status |
|-------|--------|
| GROUP wraps geometry (not Frame) | present — 71/71 |
| SCALE / SCALE | present — 71/71 (cog/eye fixed this iter) |
| Filled paths / no live stroke | present — 71/71 |
| Fill bound to `text-primary` | present — 71/71 |

**Process notes (converter test):** `clone()` of a set variant lands on the page — must `set.appendChild(clone)`. SVGs with `clip-path` need stripping before `createNodeFromSvg`. Brand SVG `Dela D in dark circle 1` was simplified to monochrome paths for IconGlyph rules.

## Defects

| ID | Sev | Summary | Status |
|----|-----|---------|--------|
| DEF-001 | low | Sample name labels truncated | open (polish) |
| DEF-002 | — | Full Heroicons gallery vs curated+custom | accepted (strategy: custom expanded; full Heroicons still out of scope) |
| DEF-003 | — | solid `variant` | deferred (user) |
| DEF-004 | — | Code Connect rewrite after publish | deferred (needs-publish) |
| DEF-CUSTOM-ART | — | Bulk fallback art briefly wrong; replaced in place with real SVGs | **fixed** |
| DEF-DELA-SIMP | low | Dela custom uses simplified monochrome (gradients dropped for text-primary rule) | accepted (IconGlyph color rule) |

## Recommendation

**PASS** for Custom Icons scope expansion + art rules. Keep Icon at `review`. Human publish path unchanged → `needs-publish` → Code Connect → `synced`. Button still blocked until Icon `synced` + Dela done.
