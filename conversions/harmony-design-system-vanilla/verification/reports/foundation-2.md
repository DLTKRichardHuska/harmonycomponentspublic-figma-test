# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-vanilla` |
| scope | `foundation` (Colors, Typography, Spacing, Elevations; Dela out of scope) |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-09-04T02:00:00.000Z` |
| referenceVersion | `0.9.0-in-progress` |
| comparePersona | `designer` |
| priorReport | `foundation-1.md` (FAIL) |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 6 |
| blocked | 0 |
| deferred | 1 |
| accepted | 0 |
| **total** | 7 |

**Result:** PASS

**PASS: zero conversion defects.**

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live `http://localhost:4321/foundation/{colors,typography,spacing,elevations}` |
| converted | Live `http://localhost:5178/foundation/{colors,typography,spacing,elevations}` |

Rendered evidence: Playwright side-by-side browse (pierce `demo-app` shadow). Both servers HTTP 200.

## Approved non-defects (unchanged)

- CSS tokens only (no foundation Custom Elements / no JS token modules)
- Demo product compare via flattened stylesheet swap; never `data-product` (verified null + href swap; primaries match CP/VP `#2A78C6`, PPM/Mac `#4C92D9`)
- Decorative Icons as inline SVG until Icon synced
- Theme JS / `.dark` SSOT
- Dela intentionally not-started
- Multi-palette Colors sections → live CSS-var swatches (accepted)

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Colors: Semantic surface / Semantic / Accent / Accessibility | present | Live vars; approved palette approach |
| Typography: Display / Headings / Body / Supporting samples | present | Computed metrics match reference |
| Typography: Font Families (Lexend / Figtree / JetBrains showcases) | present | Alphabet samples present |
| Typography: Type Scale Reference table | present | 12 rows match reference text/values |
| Typography: Usage Guidelines (Separate Visuals + Accessibility) | present | Both guideline cards present |
| Spacing: Scale bars + Usage Patterns + Border Radius | present | Bar widths match; zero width diffs |
| Spacing: CSS Variables table | present | All 6 radius tokens; values correct |
| Elevations: Shadow Scale cards | present | box-shadow match light + dark |
| Elevations: Elevation Hierarchy levels 0–4 | present | Ground / Raised / Floating / Overlay / Prominent |
| Dela | deferred | Out of scope |

**Content gaps (open):** 0

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Color tokens CP/VP/PPM/Mac × light/dark | Product palette on `:root`/`.dark` | Same computed vars (0 diffs incl. alpha composite) | present |
| Display XL/L/M | Lexend 60/48/36 bold, tight leading | Identical | present |
| Heading XL/L/M | Semibold + snug (41.25 / 33 / 27.5) | Identical | present |
| Heading S | Lexend medium 500, snug 24.75 | Identical | present |
| Label | Lexend normal 400 | Identical | present |
| Overline | Figtree semibold, ~1px tracking | Identical (`1px`) | present |
| Spacing bars | Correct px widths for full scale | Identical widths | present |
| Elevation cards light/dark | Slate / black shadow ladder | Identical computed box-shadow | present |
| Hierarchy Level 0–4 | Ground→Prominent with shadow badges | Same level names + roles | present |

**Visual gaps (open):** 0

## Prior FAIL remediation (foundation-1)

| Prior defect | Status |
|--------------|--------|
| DEF-001 Heading leading-snug | fixed |
| DEF-002 Heading S medium weight | fixed |
| DEF-003 Label Lexend normal | fixed |
| DEF-004 Overline letter-spacing 0.1em | fixed |
| DEF-005 Font Families / Type Scale / Usage Guidelines | fixed |
| DEF-006 Spacing CSS Variables + Elevation Hierarchy | fixed |
| DEF-007 Multi-palette Colors sections | deferred (approved) |

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS; human must confirm before marking foundation elements `synced` |

## Defects

None open.

## Blocked items

None.

## Verifier notes

- Designer compare completed on live `:4321` vs `:5178` for all four foundation routes (Dela excluded).
- Consume npm/static snippets remain intentional extras on converted pages.
- Spacing CSS Variables “Computed value” column shows `token · value` (vs reference plain value) — values match; not filed as a designer-visible defect.
- Do **not** mark manifest `synced` from this report alone.

**Recommendation:** PASS — zero open conversion defects.
