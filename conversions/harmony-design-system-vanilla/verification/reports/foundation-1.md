# Foundation verify — foundation-1

| Field | Value |
|-------|-------|
| Scope | Colors, Typography, Spacing, Elevations |
| Result | **FAIL** (pre-remediation) |
| Reference | `http://localhost:4321/foundation/*` |
| Converted | `http://localhost:5178/foundation/*` |
| Artifacts | `verification/artifacts/foundation-1/` |

## Side-by-side

| Area | Verdict |
|------|---------|
| Colors | Match rendered CSS tokens (product stylesheet swap). Multi-palette layout deferred (approved). |
| Typography | **Fail** — heading leading/weights, Label face/weight, Overline tracking; missing Font Families / Type Scale / Usage Guidelines |
| Spacing | Bars match; CSS Variables table missing |
| Elevations | Shadows match; Hierarchy section missing |

## Defects

1. Heading XL/L/M line-height missing `--leading-snug`
2. Heading S weight 600 vs reference 500 (`--font-medium`)
3. Label Figtree/medium vs Lexend/normal
4. Overline tracking `0.08em` vs `0.1em`
5. Missing Typography: Font Families, Type Scale Reference, Usage Guidelines
6. Missing Spacing CSS Variables table + Elevations Hierarchy

## Approved non-defects

CSS tokens only; stylesheet swap; inline SVG icons; `.dark` SSOT + `initColorScheme`; Dela not-started.
