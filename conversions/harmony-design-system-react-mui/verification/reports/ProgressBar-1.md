# Conversion defect report

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `ProgressBar` |
| iteration | `1` |
| artifactType | `html` |
| generatedAt | `2026-07-08T17:50:00.000Z` |
| referenceVersion | `0.9.0` |
| comparePersona | `designer` |

## Summary

| Status | Count |
|--------|-------|
| open | 1 |
| fixed | 0 |
| blocked | 0 |
| deferred | 0 |
| accepted | 3 |
| **total** | 4 |

**Result:** FAIL

## Artifacts captured

| Role | Path or URI |
|------|-------------|
| reference | Live review `http://localhost:4321/components/progress-bar` (HTTP 200) |
| converted | Live review `http://localhost:5176/components/progress-bar` (HTTP 200) |
| style probe | Playwright `getComputedStyle` + bounding-rect fill probe, CP light mode (2026-07-08) |

Rendered evidence reviewed on both dev servers. Source-only review not used for PASS/FAIL.

## Content parity

| Reference item | Status | Notes |
|----------------|--------|-------|
| Page title + stable badge | present | |
| Page description | present | DemoPageHeader uses correct `textSecondary` |
| Article nav: Examples, Props, Accessibility | accepted | Converted page lacks in-page anchor nav — same accepted gap as Button-2 |
| Section: Examples | present | |
| Section: Basic Progress (4 bars) | present | 25 / 50 / 75 / 100 |
| Section: Sizes (sm, md, lg) | present | |
| Section: Variants (default, success, warning, error) | present | |
| Section: With Label (42%) | present | Label text styling differs — see DEF-001 |
| Section: Props table | present | 5 props match reference |
| Section: Accessibility (4 cards) | present | ARIA Attributes, Screen Reader Support, Color Contrast, Labels |
| Extra: Harmony → MUI mapping table | accepted | Target-specific addition |

**Content gaps (open):** 0

## Visual parity

Rendered appearance matrix — CP product, light mode.

| Item | Reference (rendered) | Converted (rendered) | Status |
|------|----------------------|----------------------|--------|
| Track background | `rgb(191, 198, 212)` | `rgb(191, 198, 212)` | present |
| Default bar fill | `rgb(42, 120, 198)` | `rgb(42, 120, 198)` | present |
| Success bar fill | `rgb(23, 168, 113)` | `rgb(23, 168, 113)` | present |
| Warning bar fill | `rgb(255, 176, 32)` | `rgb(255, 176, 32)` | present |
| Error bar fill | `rgb(216, 49, 72)` | `rgb(216, 49, 72)` | present |
| Height sm / md / lg | 4px / 8px / 12px | 4px / 8px / 12px | present |
| Border radius (track) | 9999px (pill) | 9999px (pill) | present |
| Fill width 25/50/75/100% | Proportional | Proportional (MUI transform clip) | present |
| With Label `42%` text | 14px, `rgb(82, 89, 105)` | 16px, `rgb(55, 63, 78)` | different |
| Example section descriptions | 14px, `rgb(82, 89, 105)` | 16px, `rgb(55, 63, 78)` | different |

**Visual gaps (open):** 1 (DEF-001)

## Defects

### DEF-001

- **status:** open
- **category:** visual
- **reference:** Designer would see With Label percentage and example section descriptions as 14px muted secondary text (`#525969`).
- **converted:** Same text renders as 16px primary body text (`#373F4E`). Theme `text.secondary` token is correct; `Typography` uses invalid `color="text.secondary"` and `variant="body2"` (16px).
- **description:** Secondary helper text on the Progress Bar doc page does not match reference typography — most visible on the `42%` label in With Label.
- **evidence:** Playwright probe on With Label section, CP light — ref label `14px rgb(82,89,105)` vs conv `16px rgb(55,63,78)`; `--mui-palette-text-secondary` is `#525969` on converted page.
- **remediationHint:** Use `color="textSecondary"` (MUI 9 API) and 14px sizing (`sx={{ fontSize: '0.875rem' }}`) in `HarmonyProgress` showLabel and local `ExampleSection` in `ProgressBarDemo.tsx`.

## Blocked items

None.

## Verifier notes

- All catalog dependencies for ProgressBar are satisfied (Icon is `synced`).
- Determinate `LinearProgress` ARIA outcomes match reference for all doc-page examples (`aria-valuenow` / `min` / `max`).
- Progress bar track/bar colors and heights are visually equivalent in CP light mode.
- Remediate DEF-001 and re-verify before marking `elements.ProgressBar` synced.
