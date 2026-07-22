# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Tooltip` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-07-10T16:05:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 2 |
| **total** | 3 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/tooltips` (HTTP 200, CP light + dark) |
| converted | Live review `http://localhost:5176/components/tooltips` (HTTP 200, CP light + dark) |
| screenshots (light) | `verification/artifacts/diag/tooltip-ref-basic-cp-light.png`, `tooltip-conv-basic-cp-light.png` |
| screenshots (dark) | `verification/artifacts/diag/tooltip-ref-dark-reload.png`, `tooltip-conv-dark-reload.png` |
| style probe | `verification/artifacts/diag/tooltip-probe-1.json`, `tooltip-dark-check.json` |

Rendered evidence reviewed on both dev servers (hover + dark reload). Source-only review not used for PASS/FAIL.

## Content parity

Inventory of reference `tooltips.astro` vs converted `TooltipsDemo.tsx` at `/components/tooltips`.

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title Tooltips + stable badge | present | |
| Page description | present | Same copy |
| Article nav: Examples, Props, Accessibility | present | Converted adds Harmony mapping link — target framing |
| Section: Basic Tooltip | present | Same label/copy; hover shows tooltip |
| Section: Positions (top/bottom/left/right) | present | Same four triggers and tooltip texts |
| Section: On Different Elements (icon + dotted text) | present | IconButton + dotted underline span |
| Section: Corner Variants | accepted | `UnsupportedEquivalentCallout` for `cornerVariant` per userDecision / custom instructions |
| Section: Props table | present | MUI-native props; Harmony mapping table added |
| Section: Accessibility (4 a11y cards) | present | Equivalent topics; ARIA card notes MUI `describeChild` |
| Extra: Harmony → MUI mapping | accepted | Target-specific addition |

**Content gaps (open):** 0

## Visual parity

Rendered appearance matrix — CP product. Light mode primary; dark mode checked via reload with `localStorage.theme=dark`.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic tooltip (CP light): fill + text | Dark charcoal bubble `rgb(55,63,78)`, white text, Figtree 12px | Same charcoal fill, white text, Figtree 12px | present |
| Basic tooltip: padding / radius / shadow | `8px 12px`, `6px` radius, no shadow | Same padding, radius, no shadow | present |
| Basic tooltip: arrow | CSS triangle under tip, same fill as bubble | MUI arrow present, same fill color | present |
| Basic tooltip: placement + gap | Above trigger, ~8px gap | Above trigger, ~8px gap | present |
| Positions: top / bottom / left / right | Tip appears on named side with matching copy | Same placements and copy | present |
| On Different Elements: icon + text triggers | Tooltip on icon button and dotted “Hover for info” | Same texts and triggers | present |
| Corner Variants examples | Four sharp-corner tooltip demos | Callout only (no live demos) | accepted |
| Dark mode tooltip colors (CP dark) | Light bubble `rgb(233,236,239)` with dark text `rgb(31,37,46)` | Still dark bubble `rgb(55,63,78)` with white text — does not invert | different |
| Focus / keyboard show | CSS hover-only (no focus show) | Tooltip shows on focus | accepted |

**Visual gaps (open):** 1 (DEF-001)

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Custom instructions already accept `cornerVariant` skip and MUI focus/keyboard improvement. Dark-mode color defect remains open — needs remediate or explicit human accept. |

## Defects

### DEF-001 — Dark mode tooltip does not invert colors

- **status:** open
- **category:** visual / tokens
- **reference:** In CP dark mode, designer sees a light gray tooltip bubble (`rgb(233, 236, 239)`) with dark text (`rgb(31, 37, 46)`) and a matching light arrow — high contrast against the dark page.
- **converted:** In CP dark mode (page chrome correctly dark; `--mui-palette-text-primary` is `#E9ECEF`), the tooltip still renders as the light-mode charcoal bubble with white text — low contrast inversion missing.
- **description:** Designer would see dark-mode tooltips looking identical to light-mode tooltips on conversion, while reference clearly inverts fill/text. Side-by-side dark screenshots make the gap obvious.
- **evidence:** Live `:4321` vs `:5176` after `localStorage.theme=dark` reload; `tooltip-ref-dark-reload.png` vs `tooltip-conv-dark-reload.png`; probe `tooltip-dark-check.json` / `tooltip-probe-1.json`. CSS var `--mui-palette-text-primary` switches correctly in dark, but tooltip computed `backgroundColor` stays `rgb(55, 63, 78)`.
- **remediationHint:** In `mapTooltipToTheme.ts`, avoid baking light-scheme `theme.palette.text.primary` / `getTextInverse(..., theme.palette.mode)` at style-build time. Prefer scheme-aware CSS variables (e.g. `var(--mui-palette-text-primary)`) and a mode-aware inverse text token so dark scheme picks light fill + dark text.

### DEF-002 — cornerVariant skipped

- **status:** accepted
- **category:** mapping / api
- **reference:** Corner Variants section with four sharp-corner tooltip demos.
- **converted:** `UnsupportedEquivalentCallout` explaining no MUI equivalent.
- **description:** Intentional gap per plan `userDecision` and verify custom instructions — do not fail.
- **evidence:** Live converted Corner Variants section; manifest `skippedProps` / `gaps` / `userDecision`.

### DEF-003 — Focus/keyboard tooltip affordance (MUI improvement)

- **status:** accepted
- **category:** behavior / a11y
- **reference:** Tooltip visibility is CSS `:hover` only — no focus trigger.
- **converted:** MUI Tooltip appears on keyboard focus (and touch delays configured).
- **description:** Accepted intentional improvement per custom instructions — not a defect against conversion fidelity.
- **evidence:** Converted focus probe shows tooltip on focus; reference Astro usage pattern documents CSS-hover-only.

## Blocked items

None — both review surfaces reachable; Button and Icon dependencies are `synced`.

## Verifier notes

**Mapping / demo checks (iteration 1):**

- Strategy `existing-mui` — demo imports `@mui/material/Tooltip` (and Button/IconButton/Typography) directly; no Harmony prop wrapper; no file-local React components in `TooltipsDemo.tsx`.
- Theme wired via `mapTooltipToTheme` → `mapFoundationTokens`.
- Manifest prop coverage: `text`/`position`/children/arrow mapped; `cornerVariant` in `skippedProps` + `gaps` with `userDecision`.
- Examples purity: neutral layout `sx` only; dotted-underline text uses presentation styles matching reference demo, not invented catalog props.
- Composite dependencies: none. Hard deps Button + Icon are synced.
- Light-mode visual parity (colors, padding, radius, arrow, placements, no shadow) is designer-equivalent.
- **FAIL** solely on dark-mode color inversion (DEF-001). Remediate and re-verify iteration 2.

**PASS bar not met:** `open == 1`.
