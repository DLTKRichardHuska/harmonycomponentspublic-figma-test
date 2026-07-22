# Plan: Toggle, Dropdown, Accordion

**Status:** approved  
**Conversion:** harmony-design-system-react-mui  
**Scope:** Toggle, Dropdown, Accordion  
**Approved by:** plan execute  
**Date:** 2026-07-20  
**Executed:** 2026-07-20 — verifier PASS Toggle-2 / Dropdown-2 / Accordion-1; elements marked synced

## Element strategy

| Element | Strategy | Target |
|---------|----------|--------|
| Toggle | existing-mui | `@mui/material/Switch` + `FormControlLabel` + `mapSwitchToTheme.ts` |
| Dropdown | existing-mui | `Select` + `MenuItem` (+ `FormControl` as needed) + `mapSelectToTheme.ts` |
| Accordion | existing-mui | `Accordion` + `AccordionSummary` + `AccordionDetails` + `mapAccordionToTheme.ts` |

## Prop mappings

### Toggle

| Harmony | MUI |
|---------|-----|
| default switch | `Switch` |
| `label` | `FormControlLabel label` |
| `checked` / `disabled` / `name` / `id` | Switch props |
| `size` sm/md | `size` small/medium + theme |

### Dropdown

| Harmony | MUI |
|---------|-----|
| options[] | `MenuItem` children |
| `value` / `disabled` / `name` / `id` | Select props |
| `placeholder` | `displayEmpty` + empty `MenuItem` / `renderValue` |
| `label` + `labelVariant` stacked | `Stack` + `FormLabel` above Select |
| `label` + `labelVariant` inline | `Stack direction="row"` + `FormLabel` + Select |

### Accordion

| Harmony | MUI |
|---------|-----|
| item title | `AccordionSummary` children |
| item content / slots | `AccordionDetails` children |
| `defaultOpen` | `defaultExpanded` |
| `disabled` | Accordion `disabled` |
| `allowMultiple` | uncontrolled multi vs controlled exclusive in demo |
| field `label` | Typography/FormLabel above group |

## Composite equivalents

- Toggle label → `FormControlLabel` + `Switch`
- Dropdown stacked/inline labels → `FormLabel` + `Stack` (same as Input)
- Accordion expand icon → `HarmonyIcon name="chevron-down"`
- Accordion field label → Typography + `role="group"` wrapper
- Accordion rich bodies → React children in `AccordionDetails`

## Skipped props

- Toggle `variant="segmented"` (+ `optionLabelLeft` / `optionLabelRight`) — no stock MUI Switch equivalent; `UnsupportedEquivalentCallout`
- Dropdown Astro `trigger` / `option-0…9` slots — MUI uses `MenuItem` children; `UnsupportedEquivalentCallout`

## Blocking dependencies

None (Icon synced, Label synced).

## User decisions

- Strategy: existing-mui for all three; no Harmony* package exports
- Toggle segmented → skip with callout
- Toggle sizes sm/md → Switch size small/medium + theme
- Dropdown → Select + MenuItem; slots skipped; hybrid labels like Input
- Accordion → demo-only composition; children in AccordionDetails; no items[] package API
