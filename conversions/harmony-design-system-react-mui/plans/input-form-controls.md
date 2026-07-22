# Plan: Input, Textarea, Label, NumberInput, RangeInput

**Status:** approved  
**Conversion:** harmony-design-system-react-mui  
**Scope:** Input, Textarea, Label, NumberInput, RangeInput  
**Out of scope:** Toggle (separate plan); DateInput / pickers element sync (dependency only)  
**Approved by:** plan execute  
**Date:** 2026-07-15

## Element strategy

| Element | Strategy | Target |
|---------|----------|--------|
| Input | existing-mui | `@mui/material/TextField` — default `variant="outlined"` maps Harmony; `filled` / `standard` remain MUI defaults |
| Textarea | existing-mui | `TextField` `multiline` — same variant rules |
| Label | existing-mui | `InputLabel` / `FormLabel` |
| NumberInput | existing-mui | `TextField` + start/end `InputAdornment` + `IconButton` steppers (no custom export) |
| RangeInput | existing-mui | `@mui/material/Slider` + value `Typography` |

## Prop mappings

See `conversion.manifest.json` per element. Harmony field chrome targets **outlined** only.

## Composite equivalents

- Built-in `label` → `FormControl` + `InputLabel`/`FormLabel` + control
- `labelVariant` stacked/inline → layout composites (`Stack` / row); no Harmony `labelVariant` prop on TextField
- NumberInput steppers → `InputAdornment` start/end wrapping `IconButton` + `HarmonyIcon` (`minus` / `plus`)
- Range value → Slider + sibling Typography (`showPercent` / `prefix` / `suffix`)
- Input icons / trailing slot → `InputAdornment` + `HarmonyIcon` or arbitrary end node

## Skipped props

- Auto IDs when `id` omitted → consumer responsibility (SSR guidance); not a callout

## Blocking dependencies

- `Icon` — synced
- `Label` — in this batch

## Dependency: `@mui/x-date-pickers`

Provision only: add `@mui/x-date-pickers` + `dayjs` + `LocalizationProvider` / `AdapterDayjs` in demo root. Do **not** sync DateInput or picker elements.

## User decisions

- Strategy: existing-mui for all five; no Harmony* package exports
- TextField default `outlined`; Harmony styles only on outlined; filled/standard stay stock MUI
- NumberInput = TextField + InputAdornment IconButtons composite
- Toggle and DateInput out of scope
- Label `helper` = secondary text beside the label
