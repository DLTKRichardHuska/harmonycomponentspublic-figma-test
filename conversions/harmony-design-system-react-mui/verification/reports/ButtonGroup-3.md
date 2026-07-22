# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `ButtonGroup` |
| iteration | `3` |
| artifactType | `html` |
| generatedAt | `2026-07-14T19:10:56.000Z` |
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
| probe JSON | `verification/artifacts/button-group-3/probe.json` |
| screenshots | `verification/artifacts/button-group-3/` (`ref-` / `conv-` light+dark contained, outline, disabled, icon-only, vertical; mobile contained) |

Rendered evidence reviewed on both dev servers (CP product; light + dark). Source-only review not used for PASS. Probe/CSS used as evidence only — visual rows judged from screenshot pairs + live browse appearance.

## Content parity

Inventory of reference `button-groups.astro` vs converted `ButtonGroupsDemo.tsx` at `/components/button-groups`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | present | |
| Article nav: Examples, Props | present | Converted also links Mapping + Accessibility |
| Example: Default Variant (Container with Border) | accepted | Title uses MUI name "Contained Variant…" — same demo content |
| Example: Default Variant - Toggle Example | accepted | Same rename pattern |
| Example: Size Variants (sm/md/lg) | present | |
| Example: Orientation Variants (horizontal/vertical) | present | |
| Example: Disabled State | present | |
| Example: Multiple Button Counts (2/5/10) | present | |
| Example: With icons and text (+ size rows) | present | |
| Example: Default Variant - With Icons (icon-only) | accepted | Title "Contained Variant - With Icons" |
| Example: Outline Variant (Connected Buttons) | accepted | Title "Outlined Variant…" |
| Props table | present | MUI-native props — expected for existing-mui |
| Extra: Harmony → MUI mapping | accepted | Target-specific addition |
| Extra: Accessibility cards | accepted | Target-specific addition |

**Content gaps (open):** 0

Hard dependency check: child `Button` and `Icon` are `synced` in manifest — not dependency-blocked.

## Visual parity

CP product. Light + dark browsed. Side-by-side clips + full pages under `button-group-3/`.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Contained shell (light) | White inset shell, gray border, 4px pad / 8px gap; selected primary blue + white label; unselected blue labels on white | Same shell, gap, pad, colors, radii, segment sizes (310×50) | present |
| Contained shell (dark) | Charcoal shell, dark border; selected light-blue with dark label; unselected light-blue labels | Same charcoal shell, light-blue selected + dark label, light-blue unselected labels | present |
| Outline strip (light) | Transparent fill, dark gray labels, connected gray shared borders, ~40px height | Transparent fill, same dark gray labels, connected gray borders; ~42px height (1–2px taller — not designer-noticeable at page scale) | present |
| Outline strip (dark) | Transparent on dark page, light gray labels, dark-mode shared borders | Same transparent strip, light labels, dark border — no light chip | present |
| Disabled contained (light) | Selected stays primary blue at 50% opacity; unselected blue text at 50% | Same washed primary selection + blue text at 50% — not gray disabled fill | present |
| Icon-only Bold/Italic/Underline | Square 40×40 segments, zero padding inside white shell | Same 40×40 squares, zero padding, matching shell | present |
| Vertical orientation | Column shell 105×130, selected top segment, blue unselected labels | Matches size, colors, stack rhythm | present |
| Sizes / toggle / counts / icons+text | Segmented shell scales across examples | Matches (regression browse) | present |
| Mobile ≤768px stack | Horizontal group becomes full-width column of segments | Same column stack behavior (height 146); content-column width follows demo chrome | present |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Verifier recommends PASS (iteration 3 re-verify). Human must confirm via AskQuestion before manifest `synced`. Prior accepted framing items (DEF-006, DEF-007) remain accepted from iter 1–2. |

## Defects

### DEF-001

- **status:** fixed
- **category:** visual / tokens
- **severity:** high
- **reference:** CP dark: charcoal segmented shell; selected bright light-blue with dark text; unselected light-blue labels.
- **converted:** Same dark shell and dark primary segment colors.
- **description:** Dark-mode contained ButtonGroup follows dark Harmony palette (re-confirmed iter 3).
- **evidence:** Live CP dark `:4321` vs `:5176`; `ref-dark-contained.png` / `conv-dark-contained.png`; `probe.json` selected `rgb(89,172,255)` on both.

### DEF-002

- **status:** fixed
- **category:** visual
- **severity:** high
- **reference:** Outline strip: transparent fills, dark gray labels.
- **converted:** Transparent fills + dark gray labels (no pale paper fill / primary-blue text).
- **description:** Outline connected strip reads as neutral outlined control in light mode (re-confirmed).
- **evidence:** `ref-light-outline.png` / `conv-light-outline.png`; probe outline buttons `bg: rgba(0,0,0,0)`, `color: rgb(55,63,78)`.

### DEF-003

- **status:** fixed
- **category:** visual / tokens
- **severity:** high
- **reference:** Outline dark: transparent with light labels on dark page.
- **converted:** Transparent fill + light labels + dark border — no light chip.
- **description:** Outline ButtonGroup does not glow as a light block in dark mode (re-confirmed).
- **evidence:** `ref-dark-outline.png` / `conv-dark-outline.png`.

### DEF-004

- **status:** fixed
- **category:** visual
- **severity:** medium
- **reference:** Disabled selected stays primary blue at 50% opacity.
- **converted:** Disabled selected keeps primary blue + white label at opacity 0.5.
- **description:** Disabled selected still reads as washed-out primary selection (re-confirmed).
- **evidence:** `ref-light-disabled.png` / `conv-light-disabled.png`; probe `opacity: 0.5`.

### DEF-005

- **status:** fixed
- **category:** visual
- **severity:** medium
- **reference:** Icon-only segments square ~40×40, zero padding.
- **converted:** Icon-only segments 40×40 with `padding: 0`.
- **description:** Icon-only ButtonGroup segments read as square icon buttons (re-confirmed).
- **evidence:** `ref-light-icon-only.png` / `conv-light-icon-only.png`.

### DEF-006 (accepted — target framing)

- **status:** accepted
- **category:** structure
- **severity:** low
- **reference:** Example titles say "Default Variant…" / "Outline Variant…".
- **converted:** Titles say "Contained Variant…" / "Outlined Variant…".
- **description:** Naming follows MUI mapping; example content matches. Not treated as a content gap.
- **evidence:** Content inventory titles.

### DEF-007 (accepted — target framing)

- **status:** accepted
- **category:** structure
- **severity:** low
- **reference:** Doc ends at Props.
- **converted:** Adds Harmony → MUI mapping table and Accessibility cards.
- **description:** Target-specific educational sections; same pattern accepted on Button.
- **evidence:** Live converted page sections.

## Blocked items

None — both review surfaces reachable.

## Verifier notes

- Designer compare completed per DESIGNER_COMPARE / VISUAL_MATCH_GATE with three-column visual matrix; PASS not closed from CSS/probe alone — screenshot pairs reviewed side-by-side.
- Iteration 3 is a re-verify of the existing conversion after iter 2 PASS; no new open visual or content gaps found.
- Demo purity: `ButtonGroupsDemo.tsx` imports MUI `ButtonGroup`/`Button` directly + `HarmonyIcon`; only export is `ButtonGroupsDemo` — no file-local wrappers in the example zone; layout uses `Stack`/`Box`/`Typography` + neutral `gap` sx only.
- Manifest strategy `existing-mui`; element still `in-progress` until human accepts PASS for `synced`.
- Recommend **PASS: zero conversion defects.** AskQuestion before marking `synced`.
