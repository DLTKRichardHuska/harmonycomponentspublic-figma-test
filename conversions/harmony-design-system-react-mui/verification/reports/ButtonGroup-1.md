# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `ButtonGroup` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-07-10T21:10:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 5 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 2 |
| **total** | 7 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/button-groups` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/button-groups` (HTTP 200) |
| reference preview | `http://localhost:4321/preview/button-groups` (HTTP 200) |
| probe JSON | `verification/artifacts/button-group-1/probe.json` |
| mode probe | `verification/artifacts/button-group-1/probe-mode-toggle.json` |
| screenshots | `verification/artifacts/button-group-1/` (`ref-` / `conv-` default, outline, vertical, dark, mobile, icon-only) |

Rendered evidence reviewed on both dev servers (CP product; light + dark). Source-only review not used for PASS.

## Content parity

Inventory of reference `button-groups.astro` vs converted `ButtonGroupsDemo.tsx` at `/components/button-groups`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | present | |
| Article nav: Examples, Props | present | Converted also links Mapping + Accessibility |
| Example: Default Variant (Container with Border) | accepted | Title uses MUI name “Contained Variant…” — same demo content |
| Example: Default Variant - Toggle Example | accepted | Same rename pattern |
| Example: Size Variants (sm/md/lg) | present | |
| Example: Orientation Variants (horizontal/vertical) | present | |
| Example: Disabled State | present | |
| Example: Multiple Button Counts (2/5/10) | present | |
| Example: With icons and text (+ size rows) | present | |
| Example: Default Variant - With Icons (icon-only) | accepted | Title “Contained Variant - With Icons” |
| Example: Outline Variant (Connected Buttons) | accepted | Title “Outlined Variant…” |
| Props table | present | MUI-native props — expected for existing-mui |
| Extra: Harmony → MUI mapping | accepted | Target-specific addition |
| Extra: Accessibility cards | accepted | Target-specific addition |

**Content gaps (open):** 0

Hard dependency check: child `Button` / `Icon` are `synced` in manifest — not dependency-blocked.

## Visual parity

CP product. Light mode primary review; dark mode also browsed.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Contained shell (light) | Gray border, white inset shell, 8px gap, 4px pad, selected primary blue + white label, unselected blue label on white | Matches shell, gap, pad, colors, radii | present |
| Contained toggle Day/Week/Month | Same segmented shell pattern | Matches | present |
| Size sm / md / lg | Heights ~32 / 40 / 48px; font 14 / 16 / 18 | sm/md match; lg ~51px vs 48px (subtle) | present |
| Vertical orientation | Column shell, selected top radii, no internal dividers | Matches | present |
| Multiple counts 2/5/10 | Same shell pattern scales | Matches | present |
| Icons + text rows | Icon + label in segments | Matches structure/colors | present |
| Contained dark mode | Dark charcoal shell (`~#1F252E`), light-blue selected fill (`#59ACFF`) with dark label, light-blue unselected labels | White shell + light-mode primary blue selected with white label on dark page | different |
| Outline strip (light) | Transparent fill, dark gray labels (`rgb(55,63,78)`), connected gray borders | Light gray fill (`#F7F8FA`), primary-blue labels, connected strip | different |
| Outline strip (dark) | Transparent fill, light gray labels on dark page | Pale light fill + light-blue labels (reads as light chip on dark) | different |
| Disabled contained | Selected stays primary blue at 50% opacity; unselected blue text at 50% | Selected becomes gray disabled fill + muted text at 50%; unselected closer | different |
| Icon-only Bold/Italic/Underline | Square ~40×40 segments, zero padding | Wider ~48×40 segments with horizontal padding | different |
| Mobile ≤768px stack | Horizontal groups become full-width column | Same stacking behavior | present |

**Visual gaps (open):** 5

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends FAIL. Human must confirm before any `accepted`/`deferred` or manifest `synced`. |

## Defects

### DEF-001

- **status:** open
- **category:** visual / tokens
- **severity:** high
- **reference:** In CP dark mode, designer sees a dark charcoal segmented shell, selected segment in bright light-blue with dark text, unselected labels in the same light-blue on the dark shell.
- **converted:** On the same dark page, designer sees a white shell with light-mode medium-blue selected segment and white label — reads as a light-mode control dropped on a dark surface.
- **description:** Designer would see ButtonGroup contained (Harmony default) ignore dark mode palette while the page chrome is dark.
- **evidence:** Live `:4321` vs `:5176` CP dark; screenshots `ref-default-dark.png`, `conv-ensure-dark.png`; `probe-mode-toggle.json` (`groupBg` stays `rgb(255,255,255)` while `--mui-palette-primary-main` is `#59ACFF`).
- **remediationHint:** Contained `MuiButtonGroup` overrides should resolve shell/segment colors from dark Harmony tokens and dark primary/contrast (same as reference `--input-bg` / `--theme-primary` / `--text-inverse` in dark). Nested child Button styles must not keep light primary fills when `theme.palette.mode === 'dark'`.

### DEF-002

- **status:** open
- **category:** visual
- **severity:** high
- **reference:** Outline group is a connected strip with transparent button fills and dark gray label text (`rgb(55, 63, 78)` in CP light).
- **converted:** Outline group has pale gray fills (`rgb(247, 248, 250)`) and primary-blue label text (`rgb(42, 120, 198)`).
- **description:** Designer would see the outline/connected strip as a filled primary-tinted control instead of a neutral outlined strip.
- **evidence:** `ref-outline-group.png` vs `conv-outline-group.png`; `probe.json` group index 16.
- **remediationHint:** For `variant="outlined"`, keep transparent (or page) fills and map label color to Harmony secondary/stroke text used by outline buttons — not theme primary; border color already close (`tokens.border`).

### DEF-003

- **status:** open
- **category:** visual / tokens
- **severity:** high
- **reference:** Outline strip in dark mode stays transparent with light gray labels and dark-mode border.
- **converted:** Outline strip keeps a light pale fill on the dark page (high-contrast light chip).
- **description:** Designer would see outline ButtonGroup glow as a light block in dark mode.
- **evidence:** `ref-outline-dark.png` vs `conv-outline-ensure-dark.png`; `probe-mode-toggle.json` `outlineDark`.
- **remediationHint:** Same as DEF-002 — mode-aware outlined child backgrounds/borders (transparent fill; dark border/label tokens).

### DEF-004

- **status:** open
- **category:** visual
- **severity:** medium
- **reference:** Disabled contained group keeps selected segment as primary blue (faded to 50% opacity) and unselected as blue text at 50% opacity.
- **converted:** Disabled selected segment switches to gray disabled fill (`rgb(224, 228, 235)`) and muted gray text, then also at 50% opacity — selected no longer reads as faded primary.
- **description:** Designer would see disabled selected state as a gray chip instead of a washed-out primary selection.
- **evidence:** `probe.json` group index 7 (ref vs conv button styles).
- **remediationHint:** In contained group disabled styles, prefer opacity on the normal selected/unselected colors (as reference `.btn-group--default .btn:disabled`) rather than swapping to standalone Button disabled gray fills.

### DEF-005

- **status:** open
- **category:** visual
- **severity:** medium
- **reference:** Icon-only segments are square (~40×40) with zero padding so the glyph sits in a compact hit target.
- **converted:** Icon-only segments are wider (~48×40) with `8px 16px` padding — look like short text buttons with a single glyph.
- **description:** Designer would see icon-only ButtonGroup segments as stretched rather than square icon buttons.
- **evidence:** `ref-icon-only.png` vs `conv-icon-only.png`; `probe-dark-icons.json` `refIcons` / `convIcons`.
- **remediationHint:** Theme rule targeting `startIcon:only-child` does not apply — demo uses icon as direct child. Zero-pad / square sizing for icon-only grouped buttons (match reference `btn--icon-md`), or demo with a pattern that the theme already styles.

### DEF-006 (accepted — target framing)

- **status:** accepted
- **category:** structure
- **reference:** Example titles say “Default Variant…” / “Outline Variant…”.
- **converted:** Titles say “Contained Variant…” / “Outlined Variant…”.
- **description:** Naming follows MUI mapping; example content matches. Not treated as a content gap.
- **evidence:** Content inventory titles.

### DEF-007 (accepted — target framing)

- **status:** accepted
- **category:** structure
- **reference:** Doc ends at Props.
- **converted:** Adds Harmony → MUI mapping table and Accessibility cards.
- **description:** Target-specific educational sections; same pattern accepted on Button.
- **evidence:** Live converted page sections.

## Blocked items

None — both review surfaces reachable.

## Verifier notes

- Designer compare completed per DESIGNER_COMPARE / VISUAL_MATCH_GATE with three-column visual matrix.
- Demo purity: `ButtonGroupsDemo.tsx` imports MUI `ButtonGroup`/`Button` directly + `HarmonyIcon`; no file-local wrapper components in example zone; layout-only `Stack`/`Typography` captions OK.
- Manifest strategy `existing-mui` matches implementation.
- Light-mode contained shell is strong parity; FAIL driven by dark mode, outline strip, disabled selected, and icon-only sizing.
- Recommend **FAIL** — do not mark `synced` until open defects remediated or human accepts gaps via AskQuestion.
