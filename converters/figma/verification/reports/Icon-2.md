# Conversion defect report

| Field | Value |
|-------|-------|
| target | `figma` |
| scope | `Icon` |
| product | `vp` |
| iteration | `2` |
| artifactType | `image` |
| generatedAt | `2026-07-22T16:20:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 1 |
| blocked | 0 |
| deferred | 2 |
| accepted | 1 |
| **total** | 5 |

**Result:** PASS

> IconGlyph scale/color remediation: all 32 glyphs match canonical `name=plus` structure (GROUP + filled Outline Stroke + `text-primary` + SCALE/SCALE). Set id `4:26` and component ids preserved. Public `Icon` size ladder scales fill uniformly (xs→xl). Host status remains `review`.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| converted (glyphs) | `converters/figma/verification/artifacts/vp-IconGlyph-2.png` (set `4:26`) |
| converted (samples) | `converters/figma/verification/artifacts/vp-Icon-samples-2.png` (node `44:29`) |
| converted (sizes) | `converters/figma/verification/artifacts/vp-Icon-sizes-2.png` (set `44:28`) |

## IconGlyph art (hard)

| Check | Status |
|-------|--------|
| GROUP wraps vector (not Frame) | present — 32/32 |
| Vector constraints SCALE / SCALE | present — 32/32 |
| Outline Stroke → filled (no live stroke) | present — 32/32 |
| Fill bound to Color `text-primary` (`VariableID:2:13`) | present — 32/32 |
| Set id `4:26` preserved (update-in-place) | present |
| Component ids preserved | present |

**Note:** `cog-6-tooth` and `eye` each have 2 filled vectors inside the Group (outline produced multiple paths) — still filled, bound, SCALE; not a defect.

## Size scaling spot-check (public Icon)

| Size | Cell W×H | Vector W×H | Ratio | Status |
|------|----------|------------|-------|--------|
| xs | 12×12 | 8.25×8.25 | 0.6875 | present |
| md | 20×20 | 13.75×13.75 | 0.6875 | present |
| xl | 32×32 | 22×22 | 0.6875 | present |

Fill scales uniformly with size (stroke-weight-at-size defect closed).

## Content / visual / API

Unchanged from Icon-1 Option C PASS: curated 32 names, outline-only, size VARIANT + name INSTANCE_SWAP, samples on `Components / Icons`.

## Defects

| ID | Sev | Summary | Status |
|----|-----|---------|--------|
| DEF-SCALE-001 | high | Glyphs used Frame + live stroke (did not scale / wrong paint) | **fixed** (iteration 2) |
| DEF-001 | low | Sample name labels truncated on Icons page | open (polish) |
| DEF-002 | — | Full Heroicons gallery vs curated 32 | accepted (strategy) |
| DEF-003 | — | solid `variant` | deferred (user) |
| DEF-004 | — | Code Connect rewrite after publish | deferred (needs-publish path) |

## Recommendation

**PASS.** Keep host Icon at `review`. Human may polish labels → `needs-publish` → publish → Code Connect → AskQuestion → `synced`. Do not mark `synced` in this pass. Button remains blocked until Icon is `synced` and Dela is done.
