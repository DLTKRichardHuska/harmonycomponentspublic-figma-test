# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `foundation` |
| iteration | 1 |
| artifactType | `html` / `image` |
| generatedAt | 2026-07-03T20:20:00Z |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 2 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 0 |
| **total** | 2 |

**Result:** FAIL

Both defects are **critical** and affect **all five foundation routes**. The pages render (routes wired, chrome present, swatch/bar/tile/shadow graphics draw, light-mode swatch colors are pixel-accurate), but a designer cannot read the pages and dark mode does not recolor the palette. Not shippable.

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference (live) | `http://localhost:4321/foundation/{colors,typography,spacing,elevations,dela}` |
| converted (live) | `http://localhost:5176/foundation/{colors,typography,spacing,elevations,dela}` |
| reference screenshots | `verification/artifacts/diag/ref-cp-dark.png`, `ref-typo-light.png`, `ref-spacing-light.png`, `ref-dela-light.png`, `ref-elev-light.png` |
| converted screenshots | `verification/artifacts/diag/conv-cp-dark.png`, `conv-colors-light-v2.png`, `conv-colors-dark-v2.png`, `conv-typo-light.png`, `conv-spacing-light.png`, `conv-elev-light.png`, `conv-dela-light.png` |
| high-res crop | `verification/artifacts/diag/crop-swatch-light.png` (shows sub-pixel label text) |
| swatch audit (stock) | `verification/artifacts/swatch-audit-1783108953000/swatch-audit.md` |
| swatch re-compare (by `data-color-key`) | `verification/artifacts/diag/compare-swatches.mjs` output (see Visual parity) |
| computed-style probe | `verification/artifacts/diag/probe-text.mjs` output (fontSize + color measurements) |

## Content parity

Reference content is **present in the converted DOM and correctly structured** on every route. It is *not readable on screen* because of DEF-001 (text renders at ~1–3 px). Marked `present` for structure, but see DEF-001 for the readability failure.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Colors: page title + description | present | Renders as `Color System` in DOM; ~1.9 px on screen |
| Colors: theme mode indicator chip | present | `Showing CP Semi-Dark Colors` chip present |
| Colors: Semi-Light Palette (light) | present | Light-mode section + swatches correct |
| Colors: CP Semi-Dark Palette (CP dark) | different | Section heading correct, but swatch tiles + printed hex show Semi-Light values (DEF-002) |
| Colors: VP/PPM/Mac Dark Palette | different | Same as above in dark mode (DEF-002) |
| Colors: Semantic Colors | present | Success/Warning/Error/Info swatches present; frozen to light values in dark (DEF-002) |
| Colors: Accent Colors | present | Theme Primary + Accent render **and are readable** (use inline rem `fontSize` string, not the theme scale) |
| Colors: Accessibility (Contrast, Color Blindness) | present | Both callout cards present |
| Typography: Display XL/L/M, Heading XL/L/M/S, Body, Label, Caption, Overline | present | All samples present in DOM; unreadable on screen (DEF-001) |
| Typography: Font families (Lexend/Figtree/JetBrains Mono) | present | Showcase blocks render at correct large size (they set explicit sizes) |
| Typography: Text Styles Reference table | present | Table present; text ~1 px |
| Spacing: Spacing Scale rows | present | Bars render at correct widths; row labels/values ~1 px |
| Spacing: Usage Patterns cards | present | Cards render; text unreadable |
| Spacing: Border Radius tiles | present | Tiles render |
| Spacing: CSS Variables table | present | Present; text unreadable |
| Elevations: Shadow Scale cards | present | Shadows render; card labels unreadable (value strings partly readable) |
| Elevations: Shadow Values (light/dark) | present | Present |
| Elevations: Elevation Hierarchy | present | Present |
| Dela: brand guide link, Star, Launch icon, tokens, panel preview | present | Gradient swatch + icons render; body text unreadable |

**Content gaps (open):** 0 structural — but two `different` rows for dark palette are covered by DEF-002.

## Visual parity

Rendered appearance, judged on screen (not JSON strings).

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| All headings / body / labels (every route) | Legible Lexend/Figtree at design scale (e.g. Heading XL ≈ 30 px, body ≈ 16 px) | ~1–3 px microtext — effectively invisible | **different** (DEF-001) |
| Colors swatch tiles — CP light (13 keys) | Semi-Light values | Match exactly | present |
| Colors swatch tiles — VP/PPM/Maconomy light | Semi-Light values | Match exactly | present |
| Colors swatch tiles — CP dark | `pageBackground #1F252E`, `card #37424D`, `link #ADD0FF`, … (dark) | `#E2E4E9`, `#F7F8FA`, `#005BB3` (Semi-Light, wrong) | **different** (DEF-002) |
| Colors swatch tiles — VP/PPM/Mac dark | dark palette (`#15171A` …) | Semi-Light values (wrong) | **different** (DEF-002) |
| Colors printed hex labels (dark) | dark hex values | Semi-Light hex values (wrong) | **different** (DEF-002) |
| Semantic swatches (dark) | dark semantic (`Success #00E78E`, `Info #00ADFD`) | light semantic (`#17A871`, `#3366FF`) | **different** (DEF-002) |
| Page background + primary text color | switches light/dark | switches correctly (body bg + text color track mode) | present |
| Accent swatch tiles + labels | correct | correct + readable | present |

**Visual gaps (open):** 2 (DEF-001 all-route microtext; DEF-002 dark palette frozen to light).

## Defects

### DEF-001 — Foundation text renders at ~1–3 px (all pages unreadable)

- **status:** open
- **category:** visual
- **severity:** critical
- **reference:** Every foundation page shows legible typography at the design scale — page titles, section headings, swatch names + hex values, spacing rows, shadow labels, type samples, and reference tables are all readable.
- **converted:** On every foundation route, virtually all text is rendered at roughly 1–3 px, so a designer sees blank pages with colored tiles/bars/shadows and no legible labels. In the high-res crop (`crop-swatch-light.png`) the "Page Background" label and "#E2E4E9" value are present but sub-pixel. The only readable text on the Colors page is the Accent section (Theme Primary / Accent), which happens to set its size with an inline rem string.
- **evidence:** `conv-colors-light-v2.png`, `conv-typo-light.png`, `conv-spacing-light.png`, `conv-elev-light.png`, `conv-dela-light.png` vs reference counterparts. `probe-text.mjs` computed styles: article `h1` (`Heading XL`) `fontSize: 1.875px` (expected ~30 px); swatch label (`body2`) `fontSize: 1px` (expected ~14 px); `color` and `opacity` are correct (`#373F4E` light / `#E9ECEF` dark, opacity 1) — the defect is size, not color.
- **remediationHint:** `src/theme/mapTypographyToTheme.ts` → `buildVariant()` sets `fontSize: pxToNumber(style.fontSize)`. The token `fontSize` is a rem string (e.g. `"1.875rem"`), and `pxToNumber` runs `Number.parseFloat("1.875rem") → 1.875`. MUI treats a **numeric** typography `fontSize` as **pixels**, so 1.875rem becomes 1.875 px. Either keep the rem unit (`fontSize: style.fontSize` as a string) or convert rem→px (`parseFloat(value) * 16`). This one change should restore legibility across all foundation and demo pages. (This is the regression introduced by "converted typography fontSize strings to numeric values for MUI v9.")

### DEF-002 — Dark mode does not recolor the Colors swatches (shows Semi-Light values)

- **status:** open
- **category:** tokens
- **severity:** critical
- **reference:** In CP dark the "CP Semi-Dark Palette" tiles and printed hex show the dark values (`#1F252E`, `#37424D`, link `#ADD0FF`, …); VP/PPM/Maconomy dark show the dark palette; semantic swatches show dark-mode semantic colors.
- **converted:** In every product's dark mode, the palette (and semantic) swatch tiles and their printed hex values still show the **Semi-Light / light** values, even though the section heading correctly reads "CP Semi-Dark Palette" and the page chrome (background + text) does switch to dark. So a designer sees a page labelled "Semi-Dark" filled with light swatches on a dark background.
- **evidence:** `compare-swatches.mjs` output — every dark-mode row mismatches with converted equal to the light value (e.g. `cp/dark/pageBackground: ref #1F252E vs conv #E2E4E9`; `cp/dark/link: ref #ADD0FF vs conv #005BB3`). Screenshot `conv-cp-dark.png` / `conv-colors-dark-v2.png` vs `ref-cp-dark.png`. All 4 products × dark mode affected; light mode is fully correct.
- **remediationHint:** Swatch values come from `buildHarmonyPaletteSwatches`/`buildSemanticSwatches`/`buildAccentSwatches` (`foundationTokenHelpers.ts`) reading `theme.palette.harmony[*]` / `theme.palette.[semantic].main` and stringifying to a literal. With the single `cssVariables` theme (`createHarmonyTheme` builds light+dark `colorSchemes` once) these JS reads resolve to the **default (light)** colorScheme and never change; `useMemo([theme])` keyed on the stable theme reference never recomputes when the mode class toggles. Drive swatch values from the active mode (e.g. read `getHarmonyPaletteTokens(product, mode)` / `mapColorsToPalette(product, mode)` using the live `mode` from `useDemoPreferences`, or reference the switching CSS variables) instead of the frozen `theme.palette` literals.

## Blocked items

None — both dev servers reachable (`:4321` and `:5176` returned 200) and all routes rendered.

## Verifier notes

- Content inventory and visual matrix completed per DESIGNER_COMPARE.md across all five foundation routes, at CP/VP/PPM/Maconomy × light/dark.
- **Positive:** The recent App.tsx change works — converted foundation demo routes render even while `elements.foundation.status = in-progress`, so QA could review. Light-mode palette swatches match reference exactly for all four products (13 keys each). `theme.spacing()` and page background/text-color mode switching work.
- **Tooling note (not a conversion defect):** The mandatory `audit-palette-swatches.mjs` reported 104 mismatches with converted values all `null`. Its converted reader looks for a `.MuiPaper-root` inside the label's parent, but this conversion renders swatches as `<div data-color-key=… class="MuiBox-root">` (see `ColorSwatchGrid.tsx`). The stock audit therefore cannot read this target's swatches; I re-ran the comparison against `[data-color-key]` (which both sides expose) in `compare-swatches.mjs` to obtain the real rendered deltas above. Recommend updating the audit selector (or the converted swatch markup) so the standard audit is meaningful on future runs.
- **Recommendation:** FAIL. Fix DEF-001 first (single-line unit fix, unblocks readability everywhere), then DEF-002, then re-run the foundation verifier walkthrough. Do not mark `elements.foundation` `synced`.
