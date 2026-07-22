# Plan: Checkbox, CheckboxGroup, RadioButton, RadioGroup

**Status:** approved  
**Conversion:** harmony-design-system-react-mui  
**Scope:** Checkbox, CheckboxGroup, RadioButton, RadioGroup  
**Approved by:** plan execute  
**Date:** 2026-07-14

## Element strategy

| Element | Strategy | Target |
|---------|----------|--------|
| Checkbox | existing-mui | `@mui/material/Checkbox` + `mapCheckboxToTheme.ts` |
| CheckboxGroup | existing-mui | `FormControl` + `FormLabel` + `FormGroup` |
| RadioButton | existing-mui | `@mui/material/Radio` + `mapRadioToTheme.ts` |
| RadioGroup | existing-mui | `@mui/material/RadioGroup` inside `FormControl` |

## Prop mappings

See `conversion.manifest.json` per element. Validation colors come from parent `FormControl` (`error` / `color="warning"`). Messages via `FormHelperText` + `HarmonyIcon`.

## Composite equivalents

- Label → `FormControlLabel`
- Validation → `FormControl` + `FormHelperText`
- Groups → fieldset `FormControl` + `FormGroup` / `RadioGroup`

## Skipped props

None.

## Blocking dependencies

None (`Icon` synced).

## User decisions

- Strategy: existing-mui for all four
- Validation colors from parent FormControl (no per-control color in demos)
- Keep default MUI hover/ripple on Checkbox and Radio
- No skipped Harmony props
- Radio `size="large"` via theme variants
- No custom Harmony* package exports for these controls
