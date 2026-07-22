# Plan: Card

**Status:** approved  
**Conversion:** harmony-design-system-react-mui  
**Scope:** Card  
**Approved by:** plan execute  
**Date:** 2026-07-14

## Element strategy

| Element | Strategy | Target |
|---------|----------|--------|
| Card | existing-mui | `@mui/material/Card` + `CardHeader` / `CardContent` / `CardActions` / `CardActionArea` + `mapCardToTheme.ts` |

## Prop mappings

| Harmony | MUI |
|---------|-----|
| root `.card` | `Card` (theme: paper bg, border, radius-xl, shadow-sm) |
| body slot | `CardContent` |
| footer slot | `CardActions` |
| header / `headerTitle` / `headerSubtitle` / `withHeader` | Compose `CardHeader` (`title`, `subheader`) |
| `icon1`–`icon3` | Compose `CardHeader` `action` + `IconButton` + `HarmonyIcon` |
| `elevated` | `raised` (theme maps to shadow-lg) |
| `interactive` | Wrap content in `CardActionArea` (theme hover border/shadow) |

## Composite equivalents

- **Interactive card:** `Card` → `CardActionArea` wrapping header/content (supplemental header icons stay outside the action area when needed)
- **Header icons:** `CardHeader` `action` slot

## Skipped props

- `primary` — no documented MUI Card prop for 6px top primary border; `UnsupportedEquivalentCallout`

## Blocking dependencies

None (Button synced, Icon synced).

## User decisions

- Strategy: existing-mui
- `interactive` → `CardActionArea` composite (not skip)
- `elevated` → `raised`
- `primary` → skip with callout
- Header title/subtitle/icons → `CardHeader` composition
- No custom `HarmonyCard` export
