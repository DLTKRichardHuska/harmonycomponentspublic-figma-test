# Conversion defect report

| Field | Value |
|-------|-------|
| target | `figma` |
| scope | `Icon` |
| product | `vp` |
| iteration | `1` |
| artifactType | `image` |
| generatedAt | `2026-07-22T02:45:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 0 |
| blocked | 0 |
| deferred | 2 |
| accepted | 1 |
| **total** | 4 |

**Result:** PASS (with deferred/accepted items)

> Option C hybrid applied per approved strategy. Public `Icon` (`44:28`) exposes `size` VARIANT + `name` INSTANCE_SWAP; glyph library `IconGlyph` (`4:26`) kept update-in-place; `Components / Icons` samples replace Placeholder.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | `converters/figma/verification/artifacts/reference-Icon.png` (shadcn demo `/components/icons`, VP) |
| converted | `converters/figma/verification/artifacts/vp-Icon.png` (Figma samples node `44:29`) |

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Size ladder xs–xl | present | Public Icon size variants + page size row |
| Name / glyph catalog | present (curated) | 32 curated names — not full Heroicons gallery (accepted strategy) |
| outline only | present | No solid VARIANT (confirmed) |
| Page samples (not placeholder) | present | Placeholder removed |

**Content gaps (open):** 0 blocking

## Visual parity

| Item | Reference | Converted | Status |
|------|-----------|-----------|--------|
| Size progression | Distinct icon sizes | xs→xl ladder visible | present |
| Glyph readability | Outline strokes | Outline glyphs in grid | present |
| Label truncation | Full names in demo | Some Figma labels truncated with … | different (low) |

## Consumer API + wiring

| Prop | Figma | Status |
|------|-------|--------|
| `name` | INSTANCE_SWAP on public Icon (`name#44:0`), preferredValues → IconGlyph | present / wired |
| `size` | VARIANT xs–xl | present |
| icon/* FLOAT vars | Bound on size cells width/height | present |
| `variant` (solid) | omitted | deferred (user) |
| `className` / `product` | omitted | deferred |

## Update-in-place

| Check | Status |
|-------|--------|
| Glyph set id `4:26` preserved (renamed IconGlyph) | present |
| Public Icon new set `44:28` | present (expected) |

## Defects

| ID | Sev | Summary | Status |
|----|-----|---------|--------|
| DEF-001 | low | Sample name labels truncated on Icons page | open (polish) |
| DEF-002 | — | Full Heroicons gallery vs curated 32 | accepted (strategy) |
| DEF-003 | — | solid `variant` | deferred (user) |
| DEF-004 | — | Code Connect rewrite after publish | deferred (needs-publish path) |

## Recommendation

**PASS** for Option C structure + page samples + wiring. Mark host status `review`. Human may tweak label truncation, then `needs-publish` → publish → Code Connect → AskQuestion → `synced`.
