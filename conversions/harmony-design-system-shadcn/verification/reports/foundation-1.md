# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-shadcn` |
| scope | `foundation` (except Dela — accepted gap) |
| iteration | 1 |
| artifactType | `html` / `image` / `json` |
| generatedAt | 2026-07-18T00:15:00Z |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 4 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 1 |
| **total** | 5 |

**Result:** FAIL

Designer side-by-side on Colors / Typography / Spacing / Elevations: token colors (including dark + alpha), type scale sizes, spacing bars, and shadow cards largely match. Failures are **missing doc sections** a designer sees on the reference pages, plus **Heading Small** rendered too bold. Dela intentionally remains PlaceholderPage (accepted). Do **not** mark `elements.foundation` synced — human acceptance required.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/foundation/{colors,typography,spacing,elevations}` |
| converted (live) | `http://localhost:5177/foundation/{colors,typography,spacing,elevations}` |
| dela (converted, expected placeholder) | `http://localhost:5177/foundation/dela` |
| screenshots | `verification/artifacts/foundation-1/ref-*-cp-light.png`, `conv-*-cp-light.png`, `ref-colors-cp-dark.png`, `conv-colors-cp-dark.png`, `conv-dela-placeholder.png` |
| rendered probe | `verification/artifacts/foundation-1/probe.json` (Playwright content + computed styles) |

Both servers returned HTTP 200. Compare used live browse + probe of computed styles on review surfaces (not source-only).

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Colors: title + description | present | "Color System" + same blurb |
| Colors: mode indicator | present | Semi-Light / CP Semi-Dark / Dark Mode labels track product×mode |
| Colors: Semi-Light Palette (13 keys) | present | Includes alpha `tableTotal` / `hover` |
| Colors: CP Semi-Dark / Dark Mode palettes | present | Shown for active product×dark (same UX as reference section swap) |
| Colors: Semantic + Accent | present | Success/Warning/Error/Info + Theme Primary + Accent |
| Colors: Accessibility callouts | present | Contrast + Color Blindness |
| Colors: ImportSnippet | present | Extra vs reference; required by shadcn VERIFICATION.md |
| Typography: Display / Headings / Body / Supporting / Fonts | present | "Supporting" naming vs "Supporting Styles" — equivalent |
| Typography: Style table (13 rows) | present | Equivalent to Type Scale Reference |
| Typography: Usage Guidelines | **missing** | DEF-001 |
| Spacing: Spacing Scale bars + values + cssVar labels | present | Widths match reference scale |
| Spacing: Usage Patterns | present | Tight / Default / Relaxed / Loose |
| Spacing: Border Radius | present | radius-04…100 |
| Spacing: CSS Variables section | **missing** | DEF-002 |
| Elevations: Shadow Scale cards | present | none→2xl; dark mode strengthens shadows |
| Elevations: Shadow Values (light/dark tables) | **missing** | DEF-003 |
| Elevations: Hierarchy | present | Titled "Hierarchy" vs "Elevation Hierarchy" |
| Dela page | **accepted** | PlaceholderPage; manifest `gaps` + userDecision |

**Content gaps (open):** 3 (DEF-001…003). **Accepted:** 1 (Dela).

## Visual parity

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Colors CP light palette tiles | Semi-Light tiles (`#E2E4E9` page bg, `rgba(0,115,230,0.15)` tableTotal, etc.) | Same perceived colors + printed values | present |
| Colors CP dark palette tiles | Semi-Dark tiles (`#1F252E`, `#37424D`, link cool blue, etc.) | Same dark values; page chrome `#1F252E` | present |
| Colors VP dark palette tiles | Dark Mode palette (`#15171A`…) | Same when Product=VP + Dark | present |
| Colors semantic dark | `#00E78E` / `#F9AF00` / `#F46286` / `#00ADFD` | Same | present |
| Colors page title size | ~36px Lexend page header | ~30px (`text-3xl`) | different (minor chrome; not filed separately) |
| Typography Display XL/L/M | 60 / 48 / 36px Lexend bold | 60 / 48 / 36px Lexend bold | present |
| Typography Heading XL/L/M sizes | 30 / 24 / 20px | 30 / 24 / 20px | present |
| Typography Heading Small weight | medium (500), snug line-height | semibold (600), taller line-height | **different** (DEF-004) |
| Typography body / fonts showcase | Figtree / Lexend / JetBrains Mono legible | Same families; legible (not microtext) | present |
| Spacing scale bar widths | 0→96px (+ halves) | Identical widths | present |
| Spacing radius tiles | 4 / 8 / 12 / 16 / 24 / full | Same radii (tile box slightly larger) | present |
| Elevations light shadows | Soft slate-tinted elevation steps | Matching soft elevation steps on cards | present |
| Elevations dark shadows | Stronger black shadows | Stronger black shadows when Dark toggled | present |
| Dela | Full brand/guide content | Placeholder "not converted yet" | **accepted** |

**Visual gaps (open):** 1 (DEF-004). Page-title 30 vs 36 noted as minor chrome only.

## Defects

### DEF-001 — Typography missing Usage Guidelines section

- **status:** open
- **category:** structure
- **severity:** major
- **reference:** Typography ends with Usage Guidelines cards (Separate Visuals from Semantics; Accessibility heading hierarchy).
- **converted:** No Usage Guidelines section after the style table.
- **evidence:** Live headings — ref includes `Usage Guidelines`; conv headings stop at `Style table`. Screenshots `ref-typography-cp-light.png` vs `conv-typography-cp-light.png`.
- **remediationHint:** Port the two educational cards from `src/pages/foundation/typography.astro` into `TypographyDemo.tsx` (or accept as educational gap via AskQuestion + `userDecision`).

### DEF-002 — Spacing missing CSS Variables section

- **status:** open
- **category:** structure
- **severity:** major
- **reference:** Final section lists spacing CSS variables in a table/list.
- **converted:** Scale rows already print `--space-*` beside bars, but the dedicated **CSS Variables** section is absent.
- **evidence:** Ref headings include `CSS Variables`; conv does not (`probe.json` spacing.*headings).
- **remediationHint:** Add a CSS Variables section mirroring reference, or record accepted gap if the inline cssVar labels are judged enough.

### DEF-003 — Elevations missing Shadow Values section

- **status:** open
- **category:** structure
- **severity:** major
- **reference:** After Shadow Scale, a Shadow Values section shows each shadow’s light-mode and dark-mode CSS strings.
- **converted:** Shadow Scale + Hierarchy only; no light/dark value documentation block.
- **evidence:** Ref headings `Shadow Scale`, `Shadow Values`, `Elevation Hierarchy` vs conv `Shadow Scale`, `Hierarchy`.
- **remediationHint:** Add Shadow Values cards from `elevations.astro` using `elevations.shadows[*].value` / `valueDark`.

### DEF-004 — Heading Small sample renders semibold instead of medium

- **status:** open
- **category:** visual
- **severity:** major
- **reference:** Heading Small at 18px Lexend **medium (500)** with snug line-height (~24.75px).
- **converted:** Same size/family but **semibold (600)** and ~27px line-height — visibly heavier.
- **evidence:** `probe.json` typography measured `.text-heading-s` fontWeight `500` vs `600`. Source: `TypographyDemo.tsx` uses `font-semibold` on the Heading Small sample while tokens say `headingS.fontWeight: "medium"`.
- **remediationHint:** Use `font-medium` (or rely on preset weight from `text-heading-s`) and align line-height with the token / reference sample.

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

Approach A (multi-product `tokens.css` + `data-product` / `.dark`, Tailwind preset → CSS vars, `HarmonyThemeProvider`) observed on demo chrome. No undocumented foreign UI libraries flagged. DOM/HTML differences from Astro are expected and **not** defects.

## Blocked items

None — review surfaces reachable; screenshots + probe captured.

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends FAIL until DEF-001…004 remediated or explicitly accepted. Do not set `elements.foundation.status = synced` without AskQuestion. |

## Verifier notes

- Routed via `converters/harmony-design-system-shadcn/playbook/VERIFIER.md` + `VERIFICATION.md` (no dedicated Task agent id for shadcn; compare executed against that playbook).
- **Positive:** Dark-mode palette recolor works for CP and VP (unlike early react-mui foundation fails). Alpha swatches preserve rgba. Typography samples are legible at design scale. Spacing bar widths match. Elevation cards adapt light/dark.
- **Not defects:** Different DOM/Radix/Tailwind markup; ImportSnippet section; section title wording ("Hierarchy" vs "Elevation Hierarchy"); Dela placeholder.
- **Recommendation:** FAIL. Remediate DEF-004 (quick) and missing sections DEF-001…003, then re-verify iteration 2 — or AskQuestion to accept educational/doc sections as gaps. Human must confirm before sync.
