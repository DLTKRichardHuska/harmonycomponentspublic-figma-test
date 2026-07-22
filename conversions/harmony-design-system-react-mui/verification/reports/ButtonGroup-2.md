# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `ButtonGroup` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-07-10T21:15:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 5 |
| blocked | 0 |
| deferred | 0 |
| accepted | 2 |
| **total** | 7 |

**Result:** PASS

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/button-groups` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/button-groups` (HTTP 200) |
| probe JSON | `verification/artifacts/button-group-2/probe.json` |
| screenshots | `verification/artifacts/button-group-2/` (`ref-` / `conv-` light+dark contained, outline, disabled, icon-only) |

Rendered evidence reviewed on both dev servers (CP product; light + dark). Source-only review not used for PASS.

## Content parity

Inventory of reference `button-groups.astro` vs converted `ButtonGroupsDemo.tsx` at `/components/button-groups` (unchanged from iteration 1).

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

CP product. Light + dark browsed. Focus: DEF-001–005 remediation + light contained regression.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Contained shell (light) | Gray border, white inset shell, 8px gap, 4px pad, selected primary blue + white label, unselected blue label on white | Same shell, gap, pad, colors, radii, segment sizes | present |
| Contained dark mode | Dark charcoal shell, selected light-blue (`#59ACFF`) with dark label, unselected light-blue labels on dark shell | Same charcoal shell, light-blue selected + dark label, light-blue unselected labels | present |
| Outline strip (light) | Transparent fill, dark gray labels (`rgb(55,63,78)`), connected gray borders | Transparent fill, same dark gray labels, connected gray borders | present |
| Outline strip (dark) | Transparent fill, light gray labels, dark-mode border on dark page | Transparent fill, light labels, dark border — no light chip | present |
| Disabled contained | Selected stays primary blue at 50% opacity; unselected blue text at 50% | Selected primary blue + white at 50%; unselected blue text at 50% — not gray disabled fill | present |
| Icon-only Bold/Italic/Underline | Square ~40×40 segments, zero padding | Square 40×40 segments, zero padding | present |
| Contained toggle / sizes / vertical / counts | Segmented shell pattern scales | Matches (regression check) | present |
| Mobile ≤768px stack | Horizontal groups become full-width column | Same stacking behavior (iter 1) | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS. Human must confirm via AskQuestion before manifest `synced`. |

## Defects

### DEF-001

- **status:** fixed
- **category:** visual / tokens
- **severity:** high
- **reference:** CP dark: charcoal segmented shell; selected bright light-blue with dark text; unselected light-blue labels.
- **converted:** Same dark shell and dark primary segment colors (no longer white shell / light-mode blue).
- **description:** Dark-mode contained ButtonGroup now follows dark Harmony palette.
- **evidence:** Live CP dark `:4321` vs `:5176`; `ref-dark-contained.png` / `conv-dark-contained.png`; `probe.json` `refDark.contained` / `convDark.contained` (groupBg `rgb(31,37,46)`, selected `rgb(89,172,255)`).

### DEF-002

- **status:** fixed
- **category:** visual
- **severity:** high
- **reference:** Outline strip: transparent fills, dark gray labels.
- **converted:** Transparent fills + `text.primary` dark gray labels (no pale paper fill / primary-blue text).
- **description:** Outline connected strip reads as neutral outlined control in light mode.
- **evidence:** `ref-light-outline.png` / `conv-light-outline.png`; `probe.json` outline buttons `bg: rgba(0,0,0,0)`, `color: rgb(55,63,78)`.

### DEF-003

- **status:** fixed
- **category:** visual / tokens
- **severity:** high
- **reference:** Outline dark: transparent with light labels on dark page.
- **converted:** Transparent fill + light labels + dark border — no light chip on dark page.
- **description:** Outline ButtonGroup no longer glows as a light block in dark mode.
- **evidence:** `ref-dark-outline.png` / `conv-dark-outline.png`; `probe.json` `convDark.outline`.

### DEF-004

- **status:** fixed
- **category:** visual
- **severity:** medium
- **reference:** Disabled selected stays primary blue at 50% opacity.
- **converted:** Disabled selected keeps primary blue + white label at opacity 0.5 (not gray disabled fill).
- **description:** Disabled selected still reads as washed-out primary selection.
- **evidence:** `ref-light-disabled.png` / `conv-light-disabled.png`; `probe.json` disabled selected `bg: rgb(42,120,198)`, `opacity: 0.5`.

### DEF-005

- **status:** fixed
- **category:** visual
- **severity:** medium
- **reference:** Icon-only segments square ~40×40, zero padding.
- **converted:** Icon-only segments 40×40 with `padding: 0` (was ~48×40).
- **description:** Icon-only ButtonGroup segments read as square icon buttons.
- **evidence:** `ref-light-icon-only.png` / `conv-light-icon-only.png`; `probe.json` icon-only buttons `w:40`, `h:40`, `padding: 0px`.

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

- Designer compare completed per DESIGNER_COMPARE / VISUAL_MATCH_GATE with three-column visual matrix; PASS not closed from CSS/probe alone — screenshots reviewed side-by-side.
- Iteration 2 remediation of DEF-001–005 verified on CP light + dark.
- Light contained regression: still matches reference shell/segment colors and sizing.
- Demo purity: `ButtonGroupsDemo.tsx` imports MUI `ButtonGroup`/`Button` directly + `HarmonyIcon`; no file-local wrapper components in example zone.
- Manifest strategy `existing-mui`; element still `in-progress` until human accepts PASS.
- Recommend **PASS** — AskQuestion before marking `synced`.
