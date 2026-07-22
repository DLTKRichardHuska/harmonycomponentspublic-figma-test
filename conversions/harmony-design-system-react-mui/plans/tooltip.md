# Plan: Tooltip

**Status:** approved  
**Conversion:** harmony-design-system-react-mui  
**Scope:** Tooltip

## Element strategy

| Element | Strategy | Target |
|---------|----------|--------|
| Tooltip | existing-mui | `@mui/material/Tooltip` + `mapTooltipToTheme.ts` |

## Prop mappings

| Harmony | MUI Tooltip |
|---------|-------------|
| text | title |
| position (top/bottom/left/right) | placement (same values) |
| slot / children | Tooltip children (must forward ref) |
| (visual arrow) | arrow via theme defaultProps |

Theme defaults: `placement: 'top'`, `arrow: true`, near-instant enter/leave delay.

## Composite equivalents

None.

## Skipped props

- `cornerVariant` — no MUI equivalent (sharp one-side corners + hidden arrow)

## Blocking dependencies

- Button — synced
- Icon — synced

## User decisions

- Strategy: existing-mui (`@mui/material/Tooltip`)
- `cornerVariant`: skip with `UnsupportedEquivalentCallout`
