# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `Tooltip` |
| iteration | `2` |
| artifactType | `html` |
| generatedAt | `2026-07-10T16:38:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 0 |
| fixed | 1 |
| blocked | 0 |
| deferred | 0 |
| accepted | 2 |
| **total** | 3 |

**Result:** PASS

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/tooltips` (HTTP 200, CP light + dark) |
| converted | Live review `http://localhost:5176/components/tooltips` (HTTP 200, CP light + dark) |
| screenshots (light) | `verification/artifacts/diag/tooltip-conv-basic-cp-light-iter2.png`, `tooltip-ref-content-cp-light-iter2.png` |
| screenshots (dark) | `verification/artifacts/diag/tooltip-conv-basic-cp-dark-iter2.png`, `tooltip-ref-content-cp-dark-iter2.png` |
| style probe | `verification/artifacts/diag/tooltip-dark-check-iter2.json`, `tooltip-ref-content-iter2.json` |

Rendered evidence reviewed on both dev servers (hover Basic + Positions; CP dark reload). Source-only review not used for PASS/FAIL. Visual rows judged from live screenshots, not CSS/probe alone.

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

Rendered appearance matrix — CP product. Light mode and dark mode checked via `localStorage.theme` reload + hover.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Basic tooltip (CP light): fill + text | Dark charcoal bubble with white “This is a tooltip” | Same charcoal bubble with white text | present |
| Basic tooltip: padding / radius / shadow | Compact padded tip, soft 6px corners, flat (no shadow) | Same padding, radius, no shadow | present |
| Basic tooltip: arrow | CSS triangle under tip, same fill as bubble | MUI arrow present, same fill as bubble | present |
| Basic tooltip: placement + gap | Above trigger with small gap | Above trigger with small gap | present |
| Positions: top / bottom / left / right | Tip appears on named side with matching copy | Same placements and copy (“Appears on top/bottom/left/right”) | present |
| On Different Elements: icon + text triggers | Tooltip on icon button and dotted “Hover for info” | Same texts and triggers | present |
| Corner Variants examples | Four sharp-corner tooltip demos | Callout only (no live demos) | accepted |
| Dark mode tooltip colors (CP dark) | Light gray bubble with dark text and matching light arrow on dark page | Light gray bubble with dark text and matching light arrow — inverts correctly | present |
| Focus / keyboard show | CSS hover-only (no focus show) | Tooltip shows on focus | accepted |

**Visual gaps (open):** 0

## Human confirmation

| Field | Value |
|-------|-------|
| Status | pending |
| Confirmed by | — |
| Notes | Custom instructions already accept `cornerVariant` skip and MUI focus/keyboard improvement. DEF-001 dark-mode inversion verified fixed on rendered surfaces — recommend PASS; conversion-agent should AskQuestion before marking manifest `synced`. |

## Defects

### DEF-001 — Dark mode tooltip does not invert colors

- **status:** fixed
- **category:** visual / tokens
- **reference:** In CP dark mode, designer sees a light gray tooltip bubble with dark text and a matching light arrow — high contrast against the dark page.
- **converted (iter 1):** Still dark charcoal bubble with white text — no inversion.
- **converted (iter 2):** Light gray bubble with dark text and matching light arrow — matches reference.
- **description:** Iteration 1 FAIL. Remediation switched tooltip fill/text/arrow to CSS variables (`var(--mui-palette-text-primary)` / `var(--mui-palette-primary-contrastText)`). Re-verify confirms CP dark mode inverts correctly on screen.
- **evidence:** Live `:4321` vs `:5176` after dark reload; `tooltip-ref-content-cp-dark-iter2.png` vs `tooltip-conv-basic-cp-dark-iter2.png`; probe `tooltip-dark-check-iter2.json` / `tooltip-ref-content-iter2.json` (supporting only).

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
- **evidence:** Custom instructions; MUI Tooltip focus behavior.

## Blocked items

None — both review surfaces reachable; Button and Icon dependencies are `synced`.

## Verifier notes

**Mapping / demo checks (iteration 2):**

- Strategy `existing-mui` — demo imports `@mui/material/Tooltip` (and Button/IconButton/Typography) directly; no Harmony prop wrapper; no file-local React components in `TooltipsDemo.tsx`.
- Theme wired via `mapTooltipToTheme` → CSS vars for scheme-aware fill/text/arrow.
- Manifest prop coverage: `text`/`position`/children/arrow mapped; `cornerVariant` in `skippedProps` + `gaps` with `userDecision`.
- Examples purity: neutral layout `sx` only; dotted-underline text uses presentation styles matching reference demo, not invented catalog props.
- Composite dependencies: none. Hard deps Button + Icon are synced.
- Light-mode visual parity unchanged and still designer-equivalent.
- **DEF-001 fixed** — CP dark mode light bubble + dark text matches reference side-by-side.
- **PASS:** `open == 0`. Recommend human confirm before manifest `synced`.

**PASS: zero conversion defects.**
