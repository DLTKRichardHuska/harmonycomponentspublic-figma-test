# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `foundation` (except Dela — accepted gap) |
| iteration | 2 |
| artifactType | `html` / `image` / `json` |
| generatedAt | 2026-07-18T00:10:00Z |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 4 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 5 |

**Result:** PASS

Designer side-by-side re-verify after remediation: DEF-001…004 from foundation-1 are **fixed** on the live review surfaces. Colors (light/dark including alpha), type scale (including Heading Small medium/snug), spacing bars + radius + CSS Variables, and elevation cards + Shadow Values + Hierarchy match designer-visible reference content. Dela remains PlaceholderPage (accepted). Do **not** mark `elements.foundation` synced — human acceptance via AskQuestion still required.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/foundation/{colors,typography,spacing,elevations}` |
| converted (live) | `http://localhost:5177/foundation/{colors,typography,spacing,elevations}` |
| dela (converted, expected placeholder) | `http://localhost:5177/foundation/dela` |
| screenshots | `verification/artifacts/foundation-2/ref-*-cp-light.png`, `conv-*-cp-light.png`, `ref-colors-cp-dark.png`, `conv-colors-cp-dark.png`, `conv-dela-placeholder.png` |
| rendered probe | `verification/artifacts/foundation-2/probe.json` (Playwright content + computed styles) |

Both servers returned HTTP 200. Compare used live browse + full-page screenshots + probe of computed styles on review surfaces (not source-only).

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Colors: title + description | present | "Color System" + same blurb |
| Colors: mode indicator | present | Semi-Light / CP Semi-Dark / Dark Mode labels track product×mode |
| Colors: Semi-Light Palette (keys + alpha) | present | Includes `tableTotal` / `hover` rgba |
| Colors: CP Semi-Dark / Dark Mode palettes | present | Shown for active product×dark |
| Colors: Semantic + Accent | present | Success/Warning/Error/Info + Theme Primary + Accent |
| Colors: Accessibility callouts | present | Contrast + Color Blindness |
| Colors: ImportSnippet | present | Extra vs reference; required by shadcn VERIFICATION.md |
| Typography: Display / Headings / Body / Supporting / Fonts | present | "Supporting" vs "Supporting Styles" — equivalent |
| Typography: Style table | present | Equivalent to Type Scale Reference |
| Typography: Usage Guidelines | **present** | DEF-001 fixed — two cards (Visuals vs Semantics; Accessibility) |
| Spacing: Spacing Scale bars + values + cssVar labels | present | Widths match reference scale |
| Spacing: Usage Patterns | present | Tight / Default / Relaxed / Loose |
| Spacing: Border Radius | present | radius-04…100 |
| Spacing: CSS Variables section | **present** | DEF-002 fixed — radius var table (same content as reference) |
| Elevations: Shadow Scale cards | present | none→2xl; dark mode strengthens shadows |
| Elevations: Shadow Values (light/dark) | **present** | DEF-003 fixed |
| Elevations: Elevation Hierarchy | present | Title now matches reference wording |
| Dela page | **accepted** | PlaceholderPage; manifest `gaps` + userDecision |

**Content gaps (open):** 0. **Accepted:** 1 (Dela).

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Colors CP light palette tiles | Semi-Light tiles (`#E2E4E9` page bg, rgba tableTotal, etc.) | Same perceived colors + printed values | present |
| Colors CP dark palette tiles | Semi-Dark tiles (`#1F252E`, `#37424D`, cool link blue, etc.) | Same dark values; page chrome `#1F252E` | present |
| Colors VP dark palette tiles | Dark Mode palette (`#15171A`…) | Same when Product=VP + Dark | present |
| Colors semantic dark | `#00E78E` / `#F9AF00` / `#F46286` / `#00ADFD` | Same | present |
| Colors page title size | ~36px Lexend page header | ~30px (`text-3xl`) | different (minor chrome; not filed) |
| Typography Display XL/L/M | 60 / 48 / 36px Lexend bold | 60 / 48 / 36px Lexend bold | present |
| Typography Heading XL/L/M sizes | 30 / 24 / 20px semibold | 30 / 24 / 20px semibold | present |
| Typography Heading Small weight/leading | medium (500), snug (~24.75px LH) | medium (500), snug (~24.75px LH) | **present** (DEF-004 fixed) |
| Typography Usage Guidelines cards | Two educational cards at page end | Same two cards with matching copy | present |
| Typography body / fonts showcase | Figtree / Lexend / JetBrains Mono legible | Same families; legible | present |
| Spacing scale bar widths | 0→96px (+ halves) | Identical widths | present |
| Spacing CSS Variables table | Radius vars listed | Same radius vars + values | present |
| Spacing radius tiles | 4 / 8 / 12 / 16 / 24 / full | Same radii | present |
| Elevations light shadows | Soft slate-tinted elevation steps | Matching soft elevation steps on cards | present |
| Elevations Shadow Values docs | Light/dark CSS strings per shadow | Same section with light/dark code blocks | present |
| Elevations dark shadows | Stronger black shadows | Stronger black shadows when Dark toggled | present |
| Dela | Full brand/guide content | Placeholder "not converted yet" | **accepted** |

**Visual gaps (open):** 0. Page-title 30 vs 36 noted as minor chrome only (same as foundation-1).

## Defects

### DEF-001 — Typography missing Usage Guidelines section

- **status:** fixed
- **category:** structure
- **severity:** major
- **reference:** Typography ends with Usage Guidelines cards (Separate Visuals from Semantics; Accessibility heading hierarchy).
- **converted:** Usage Guidelines section with both cards now present after Style table.
- **evidence:** Live headings include `Usage Guidelines` on both; `conv-typography-cp-light.png`; `probe.json` typography.conv.headings.
- **remediationHint:** —

### DEF-002 — Spacing missing CSS Variables section

- **status:** fixed
- **category:** structure
- **severity:** major
- **reference:** Final section lists border-radius CSS variables in a table.
- **converted:** CSS Variables section present with `--radius-*` rows (matches reference content).
- **evidence:** Live headings include `CSS Variables`; `conv-spacing-cp-light.png`; `probe.json` spacing.conv.headings.
- **remediationHint:** —

### DEF-003 — Elevations missing Shadow Values section

- **status:** fixed
- **category:** structure
- **severity:** major
- **reference:** After Shadow Scale, Shadow Values shows light/dark CSS strings per shadow.
- **converted:** Shadow Values section with light/dark code blocks for sm→2xl.
- **evidence:** Live headings `Shadow Scale`, `Shadow Values`, `Elevation Hierarchy`; `conv-elevations-cp-light.png`.
- **remediationHint:** —

### DEF-004 — Heading Small sample renders semibold instead of medium

- **status:** fixed
- **category:** visual
- **severity:** major
- **reference:** Heading Small at 18px Lexend **medium (500)** with snug line-height (~24.75px).
- **converted:** Same — fontWeight `500`, lineHeight `24.75px` (was 600 / ~27px).
- **evidence:** `probe.json` typography measured `.text-heading-s` on both surfaces; sample uses `font-medium leading-snug`.
- **remediationHint:** —

### DEF-A01 — Dela foundation page left as placeholder

- **status:** accepted
- **category:** structure
- **severity:** —
- **reference:** Full Dela foundation docs.
- **converted:** PlaceholderPage explaining not converted yet.
- **evidence:** Manifest `elements.foundation.gaps` + `userDecision`; `conv-dela-placeholder.png`.
- **userDecision:** Out of scope for this foundation execute (except Dela).

## Docs / import checks

| Check | Result |
|-------|--------|
| ImportSnippet on converted foundation pages | present (`Usage from npm`) |
| Package import name `@dltkrichardhuska/harmony-design-system-shadcn/...` | present in snippets |
| No full Getting Started dump on foundation pages | pass (snippets are element-scoped) |

## Stack elegance

Approach A (multi-product `tokens.css` + `data-product` / `.dark`, Tailwind preset → CSS vars) observed on demo chrome. No undocumented foreign UI libraries flagged. DOM/HTML differences from Astro are expected and **not** defects.

## Blocked items

None — review surfaces reachable; screenshots + probe captured.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS. AskQuestion before setting `elements.foundation.status = synced`. Accepted gap: Dela placeholder remains. |

## Verifier notes

- Routed via `converters/harmony-design-system-shadcn/playbook/VERIFIER.md` + `VERIFICATION.md` (no dedicated Task agent id for shadcn; compare executed against that playbook).
- Visual matrix uses three rendered columns; closure based on live browse + screenshots, not CSS-only probes (probe used as supporting measurement for Heading Small).
- **Positive:** All four foundation-1 open defects remediated and re-verified. Dark-mode palette recolor works for CP and VP. Alpha swatches preserve rgba. Spacing bar widths match. Elevation cards adapt light/dark. Missing doc sections restored.
- **Not defects:** Different DOM/Radix/Tailwind markup; ImportSnippet section; Dela placeholder; minor page-title chrome size.
- **Recommendation:** PASS. Human must confirm via AskQuestion before sync. Do not auto-sync.
