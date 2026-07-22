# Plan: ButtonGroup finish + Spinner + Avatar

**Status:** approved  
**Conversion:** harmony-design-system-react-mui  
**Scope:** ButtonGroup (finish), Spinner, Avatar  
**Approved by:** user (execute plan)  
**Date:** 2026-07-14

## Element strategy

| Element | Strategy | Target |
|---------|----------|--------|
| ButtonGroup | existing-mui (finish) | `@mui/material/ButtonGroup` — accept ButtonGroup-3 PASS → synced |
| Spinner | existing-mui | `@mui/material/CircularProgress` + `mapSpinnerToTheme.ts` |
| Avatar | existing-mui | `@mui/material/Avatar` + `mapAvatarToTheme.ts` |

## Spinner prop mappings

| Harmony | MUI |
|---------|-----|
| (default indeterminate) | `variant="indeterminate"` |
| size sm / md / lg | `size={16}` / `{24}` / `{40}` |
| track + accent | theme track + `color="primary"` |
| Loading a11y | `aria-label="Loading"` |

## Avatar prop mappings

| Harmony | MUI |
|---------|-----|
| (default shape) | `variant="rounded"` via theme default |
| — (MUI-only) | `variant="circular"` \| `"square"` (superset) |
| content icon/initials/image | children / src / alt |
| size sm / md / lg | `sx` width/height 24 / 32 / 40 (+ matching borderRadius) |
| interactive | `<ButtonBase><Avatar /></ButtonBase>` |
| disabled | `ButtonBase disabled` |

## Composite equivalents

| Harmony feature | MUI composition |
|-----------------|-----------------|
| interactive Avatar | ButtonBase wrapping Avatar (MUI Avatar-upload pattern, no file input required) |

## Skipped props

None.

## Blocking dependencies

- ButtonGroup: Button, Icon — synced
- Spinner: foundation — synced
- Avatar: Icon — synced

## User decisions

- ButtonGroup: human accept PASS → synced
- Spinner: existing-mui CircularProgress; numeric sizes
- Avatar: default `rounded`; MUI shape variants are a superset; interactive via ButtonBase
