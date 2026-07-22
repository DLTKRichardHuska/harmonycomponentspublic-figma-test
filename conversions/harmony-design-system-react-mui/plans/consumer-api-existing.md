# Conversion plan

| Field | Value |
|-------|-------|
| target | `harmony-design-system-react-mui` |
| scope | `consumer-api-existing` (DelaButton, StatusBadge, HarmonyIcon) |
| status | `approved` (parent plan: Consumer API converters; recommended packets) |
| createdAt | `2026-07-18T18:45:00.000Z` |
| referenceVersion | (current conversion manifest) |
| coverageAtPlan | n/a — API remediation only |

## Summary

Lock and document Consumer public APIs for existing custom package exports. Prefer MUI-familiar surfaces; additive fixes only (`sx` on StatusBadge, `titleAccess` on HarmonyIcon). No `existing-mui` theme components in scope.

## Element strategy (user confirmed)

| Element | Strategy | recommendedTarget | userDecision |
|---------|----------|-------------------|--------------|
| Button (Dela sub-export) | existing-mui + custom sub-export | `DelaButton` | Keep DelaButton as custom sub-export |
| Badge | custom | `StatusBadge` | Keep custom StatusBadge (not Chip/Badge) |
| Icon | custom | `HarmonyIcon` | Keep custom HarmonyIcon |

## Consumer API (user confirmed)

### DelaButton

| Field | Value |
|-------|-------|
| Export name | `DelaButton` |
| Base / analog | MUI `Button` |
| Inherited props / events / slots | `Omit<ButtonProps, 'variant'>` — full MUI Button events (`onClick`, `onFocus`, …), `disabled`, `loading`, `startIcon`/`endIcon`, `href`/`component`, `sx`, `ref`, etc. |
| Harmony-specific props | `pill?: boolean` |
| Omissions / divergences | No public `variant` (always contained + dela gradient); default stars icon from `/Stars.svg` unless `loading` or consumer `startIcon` |
| TypeScript surface | `DelaButtonProps`; `forwardRef<HTMLButtonElement>` |
| Docs | `docs/CONSUMER_GUIDE.md` Custom components |

### StatusBadge

| Field | Value |
|-------|-------|
| Export name | `StatusBadge` |
| Base / analog | Presentational `span` (not MUI Chip/Badge — intentional) with MUI `sx` |
| Inherited props / events / slots | `React.HTMLAttributes<HTMLSpanElement>` (`onClick`, `className`, `id`, …) + `sx?: SxProps<Theme>` + `ref` |
| Harmony-specific props | `variant`, `size` (`small`\|`medium`\|`large`), `icon` (Harmony icon name), `children` |
| Omissions / divergences | Not interactive by default; not Chip delete/avatar API; Harmony status color set |
| TypeScript surface | `StatusBadgeProps`, `StatusBadgeVariant`, `StatusBadgeSize` |
| Docs | `docs/CONSUMER_GUIDE.md` Custom components |

### HarmonyIcon

| Field | Value |
|-------|-------|
| Export name | `HarmonyIcon` |
| Base / analog | MUI `SvgIcon` slot patterns |
| Inherited props / events / slots | `fontSize`, `color` (SvgIcon-like), `sx`, `className`, `ref`; `titleAccess` for tooltip/title; decorative `aria-hidden` by default |
| Harmony-specific props | `name` (required), `size` (`xs`–`xl`), `variant` (`outline`\|`solid`), `product` |
| Omissions / divergences | String-name resolution (not Lucide/MUI icon imports); use `fontSize="inherit"` in MUI icon slots |
| TypeScript surface | `HarmonyIconProps`, `IconSize` |
| Docs | `docs/CONSUMER_GUIDE.md` Custom components |

## Scope

| In scope | Out of scope |
|----------|--------------|
| Consumer API docs + manifest `userDecision` | `existing-mui` theme APIs |
| Additive `sx` / `titleAccess` | Breaking renames |

## Approval

**Status: approved** — remediate under Consumer API packets above (plan execute for API/docs only).

| Approved by | Date | Notes |
|-------------|------|-------|
| plan execute | 2026-07-18 | Recommended packets from audit; additive-compatible |
