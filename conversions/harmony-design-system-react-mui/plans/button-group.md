# Plan: ButtonGroup

**Status:** approved  
**Conversion:** harmony-design-system-react-mui  
**Scope:** ButtonGroup

## Element strategy

| Element | Strategy | Target |
|---------|----------|--------|
| ButtonGroup | existing-mui | `@mui/material/ButtonGroup` + `mapButtonGroupToTheme.ts` |

## Prop mappings

| Harmony | MUI ButtonGroup |
|---------|-----------------|
| variant default | variant="contained" (segmented shell via theme) |
| variant outline | variant="outlined" (connected strip) |
| size sm/md/lg | size="small" \| "medium" \| "large" |
| orientation | orientation (same values) |
| selected segment | child Button variant="contained" |
| unselected segment | child Button variant="outlined" |
| slot / children | ButtonGroup children |

Theme defaults: `variant: 'contained'`, `size: 'medium'`, `orientation: 'horizontal'`, `disableElevation: true`.

## Composite equivalents

None.

## Skipped props

None.

## Blocking dependencies

- Button — synced
- Icon — synced

## User decisions

- Strategy: existing-mui (`@mui/material/ButtonGroup`)
- Harmony `default` → MUI `contained` with theme overrides for segmented shell
- Harmony `outline` → MUI `outlined` connected strip
- Selection: consumer-managed via child Button variants (not ToggleButtonGroup)
- No custom package export
