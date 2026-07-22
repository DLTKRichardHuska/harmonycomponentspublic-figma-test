# Plan: Dialog

**Status:** approved  
**Conversion:** harmony-design-system-react-mui  
**Scope:** Dialog  
**Approved by:** plan execute  
**Date:** 2026-07-20

## Element strategy

| Element | Strategy | Target |
|---------|----------|--------|
| Dialog | existing-mui | `@mui/material/Dialog` + `DialogTitle` / `DialogContent` / `DialogActions` + `IconButton` close + `mapDialogToTheme.ts` |

## Prop mappings

| Harmony | MUI |
|---------|-----|
| overlay + `.dialog` | `Dialog` (`open` / `onClose`; React state replaces `openDialog` / `closeDialog`) |
| `title` + close | `DialogTitle` with trailing `IconButton` + `HarmonyIcon` (`x-mark`) |
| body slot | `DialogContent` (`scroll="paper"`) |
| footer slot / default Confirm·Cancel·tertiary | Compose `DialogActions` + `Button` |
| `buttonAlignment="left"` (default) | Theme `MuiDialogActions` `justifyContent: flex-start` |
| Width tokens (min 600 / max 700 / 90%) | Theme paper: `fullWidth` + `maxWidth={false}`; paper min/max/width from dialog tokens |
| Radius / shadow / card bg | Theme paper: `radius-xl`, `shadow-xl`, paper background |
| Header border + padding | Theme `MuiDialogTitle` |
| Footer elevated bg + top border | Theme `MuiDialogActions` |

## Composite equivalents

- **Close control:** `IconButton` + `HarmonyIcon` in `DialogTitle`
- **Default / custom footers:** `Button` children in `DialogActions`
- **Three-button footer:** Confirm + Cancel + tertiary `text` button
- **Confirmation / destructive:** `Button` `color="error"`

## Skipped props

- `resizable` — no stock MUI Dialog resize grip; `UnsupportedEquivalentCallout`
- `headerVariant="primary"` — no MUI DialogTitle primary-header prop; `UnsupportedEquivalentCallout` (includes Combined Variants)
- `buttonAlignment="right"` — no MUI DialogActions align prop; example `sx` to emulate is forbidden fidelity styling; `UnsupportedEquivalentCallout`

## Blocking dependencies

None (Button synced, Icon synced).

## User decisions

- Strategy: existing-mui
- `resizable` → skip with callout
- `headerVariant="primary"` → skip with callout
- `buttonAlignment="right"` → skip with callout (purity cleanup 2026-07-20; do not use DialogActions sx)
- `buttonAlignment` left → theme default
- No custom `HarmonyDialog` export
