# Plan: TabStrip, Stepper, Step

**Status:** approved
**Conversion:** harmony-design-system-react-mui
**Scope:** TabStrip, Stepper, Step
**Approved by:** user (execute this plan)
**Date:** 2026-07-20

## Element strategy (user confirmed)

| Element | Strategy | Target |
|---------|----------|--------|
| Step | existing-mui | `@mui/material/Step` + `StepLabel` (+ `StepButton` / `StepIcon`) + `mapStepperToTheme.ts` |
| Stepper | existing-mui | `@mui/material/Stepper` + default `StepConnector` + `mapStepperToTheme.ts` |
| TabStrip | existing-mui | `@mui/material/Tabs` + `Tab` + `mapTabsToTheme.ts` |

No package exports / Consumer API — consumers keep `@mui/material` APIs unchanged.

## Prop mappings

### Stepper

| Harmony | MUI |
|---------|-----|
| `activeStep` | `Stepper.activeStep` |
| `orientation` horizontal / vertical | `orientation` |
| `nonLinear` | `nonLinear` + clickable `StepButton` in demo |
| labels below indicators | `alternativeLabel` (horizontal) |
| connector line | theme `MuiStepConnector` |

### Step

| Harmony | MUI |
|---------|-----|
| label slot | `StepLabel` children |
| description slot | `StepLabel optional` |
| `completed` / `disabled` | `Step` props |
| `error` | `StepLabel.error` / `StepIcon` error |
| `icon` | `StepLabel icon` / `StepButton icon` + `HarmonyIcon` |

### TabStrip

| Harmony | MUI |
|---------|-----|
| `tabs[].id` + active | controlled `Tabs value` + `Tab value` |
| `tabs[].label` | `Tab label` |
| `tabs[].icon` + `iconPosition` left/right/top | `Tab icon` + `iconPosition` start/end/top + `HarmonyIcon` |
| `tabs[].disabled` | `Tab disabled` |
| `tabs[].href` | `Tab component="a" href` |
| `iconPosition` (component-level) | same `iconPosition` on every `Tab` |
| scrollable overflow | `Tabs variant="scrollable" scrollButtons="auto"` (MUI native; not Harmony More menu) |

## Skipped props (UnsupportedEquivalentCallout)

**TabStrip:**
- `showAddTab` / `addTabLabel`
- `overflowMode` / `overflowTabs` (More dropdown + auto ResizeObserver overflow)
- `showTabOpenInNew` / `showTabClose` / `showTabOverflowMenu` + per-tab toolbar
- `variant` `compact` and `pill`

**Step:**
- distinct `warning` status (no MUI Step status)
- distinct `success` status (use `completed`; no separate success API)

## Composite equivalents (demo-only)

- Stepper non-linear clickable → `Step` + `StepButton onClick`
- Step description → `StepLabel optional={<Typography variant="caption">…</Typography>}`
- Step/Tab icons → `HarmonyIcon` in MUI icon slots

## Blocking dependencies

None. Icon synced; Step and Stepper converted together (Step before Stepper `synced`).

## User decisions

- Strategy: existing-mui for all three; no Harmony* package exports.
- TabStrip browser-tab chrome (add/close/⋮/More) and compact/pill variants → skip with callout.
- Step warning/success distinct statuses → skip with callout; completed/error themed.

## Execute sequence

1. `mapStepperToTheme.ts` + `SteppersDemo.tsx` + App route → verify → human accept → `synced`.
2. `mapTabsToTheme.ts` + `TabStripsDemo.tsx` + App route → verify → human accept → `synced`.
3. `compute_coverage.mjs --write` after each status change.
