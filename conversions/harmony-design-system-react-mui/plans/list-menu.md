# Plan: ListMenu

**Status:** approved  
**Conversion:** harmony-design-system-react-mui  
**Scope:** ListMenu  
**Approved by:** plan execute  
**Date:** 2026-07-20

## Element strategy

| Element | Strategy | Target |
|---------|----------|--------|
| ListMenu | existing-mui | `@mui/material/List` + `ListItemButton` + `ListItemIcon` + `ListItemText` + `mapListToTheme.ts` |

## Prop mappings

| Harmony | MUI |
|---------|-----|
| `.list-menu` | `List` (theme: card bg, border, `radius-lg`, overflow; `disablePadding`) |
| `.list-menu__item` | `ListItemButton` |
| `as="button"` | `ListItemButton` (default) |
| `as="link"` | `ListItemButton component="a" href={…}` |
| `item.active` | `selected` |
| `item.label` | `ListItemText` |
| `item.icon` | `ListItemIcon` + `HarmonyIcon` (`fontSize="inherit"`) |
| `item.isCustom` + `customSrc` | `ListItemIcon` + `<img alt={label}>` |
| `items[]` | Consumer maps to `ListItemButton` children |
| `variant="default"` | `ListItemButton` `divider` on all but last item |
| `variant="no-borders"` | Omit `divider` prop |

## Composite equivalents

- Icon row: `ListItemIcon` + `HarmonyIcon`
- Custom image icon: `ListItemIcon` + `<img>`
- Link items: `ListItemButton` with `component="a"`
- Separators: documented `ListItemButton` `divider` prop (preferred over separate `Divider` nodes)

## Skipped props

None.

## Blocking dependencies

None (Icon synced).

## User decisions

- Strategy: existing-mui
- `no-borders` → composition (omit `divider`), not skip/callout
- Custom icons → composition with `<img>`; no callout required
- No package export / Consumer API N/A
