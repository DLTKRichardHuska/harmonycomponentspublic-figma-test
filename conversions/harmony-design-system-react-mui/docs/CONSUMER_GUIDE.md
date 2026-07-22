# Consumer guide — Harmony Design System (React + MUI)

## Theme

Wrap your app with `ThemeProvider` and `createHarmonyTheme({ product })` from `@dltkrichardhuska/harmony-design-system-react-mui/theme`.

Most catalog elements are **theme-only** (`existing-mui`): keep using `@mui/material/<Component>` with the Harmony theme. Only components without an MUI equivalent ship as package exports — see **Custom components** below.

## Product scope

Harmony spans four products — `cp`, `vp`, `ppm`, `maconomy`. **This package is a single, multi-product bundle**: you select the product **at runtime** via `createHarmonyTheme({ product })`, and can switch it by rebuilding the theme (the demo product picker does exactly this). There are no separate per-product packages — that model belongs to the shadcn conversion, not MUI.

Product affects theme palette and density (see **Text fields**). A few catalog features are also scoped to specific products:

| Scope | Item | Products | Status |
|-------|------|----------|--------|
| Component | `FloatingNav` | `cp` | Not yet converted |
| Component | Kanban Costpoint card (`KanbanCardCostpoint`) | `cp` | Not yet converted |
| Component | `TableCostpointGrid` | `cp` | Not yet converted |
| Variant | `TabStrip` `pill` variant | `vp` | Not converted (accepted gap) |
| Variant | Kanban `costpoint` variant | `cp` | Not yet converted |

Product exclusivity is declared in the reference catalog (`src/data/component-catalog.ts` → `componentProducts` / `componentVariantProducts`) and mirrored in this conversion's `conversion.manifest.json` (`products` / `variantProducts`). Components/variants not scoped here are available in all products.

## Fonts

Harmony fonts are self-hosted through Fontsource and load automatically when you import the theme entry. The package includes Figtree for body text, Lexend for headings and labels, and JetBrains Mono for code.

If your app needs the fonts before creating a Harmony theme, import them explicitly:

```ts
import '@dltkrichardhuska/harmony-design-system-react-mui/fonts';
```

No Google Fonts CDN link is required.

## Text fields

Use `@mui/material/TextField` with the Harmony theme. **`variant="outlined"`** is the default and maps Harmony reference field styles. `filled` and `standard` remain available as stock MUI variants (not Harmony-mapped).

**Product density:** pass `product` into `createHarmonyTheme({ product })`:

| Product | Field height | Font | Radius |
|---------|--------------|------|--------|
| `cp` | 20px (`--input-height-cp`) | `text-xs` | 4px |
| `vp` / `ppm` / `maconomy` | 40px (`--space-10`) | `text-base` | 8px |

Switching the demo product picker rebuilds the theme so inputs update.
## Date pickers

This package depends on `@mui/x-date-pickers` (Community) and `dayjs` so consumers can use MUI X Date/Time Pickers with the Harmony theme.

1. Install peers: `@mui/x-date-pickers`, `dayjs` (and `@mui/material` / Emotion as usual).
2. Wrap your tree (inside `ThemeProvider`) with:

```tsx
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

<LocalizationProvider dateAdapter={AdapterDayjs}>
  {/* app */}
</LocalizationProvider>
```

Use MUI X pickers directly; the Harmony theme supplies outlined field, calendar, popup, and
time-view styling:

| Harmony DateInput type | MUI X equivalent |
|------------------------|------------------|
| `date` | `DatePicker` |
| `time` | `TimePicker` (`ampm` controls 12/24-hour format) |
| `datetime-local` | `DateTimePicker` |
| `month` | `DatePicker` with `views={['year', 'month']}` and `openTo="month"` |

MUI X uses adapter-native `Dayjs` values. Convert ISO strings with `dayjs(value)`, map `min` /
`max` to `minDate` / `maxDate` (or `minTime` / `maxTime`), and configure locale through
`LocalizationProvider adapterLocale`.

Harmony `type="week"` / `WeekPicker` is not supported because MUI X Community does not ship a
week picker component. This is an accepted conversion gap.

Empty fields show MUI X accessible format sections (for example `MMMM DD, YYYY`) rather than the
Harmony whole-field placeholders (`Select date`). Matching those placeholders would require a
custom field wrapper, which this conversion deliberately avoids.

## Custom components

Import from `@dltkrichardhuska/harmony-design-system-react-mui/components`. APIs follow familiar MUI patterns (events, `sx`, refs) plus Harmony-specific props.

### DelaButton

MUI `Button` analog — `DelaButtonProps` extends `Omit<ButtonProps, 'variant'>`.

```tsx
import { DelaButton } from '@dltkrichardhuska/harmony-design-system-react-mui/components';

<DelaButton onClick={handleAsk}>Ask Dela</DelaButton>
<DelaButton pill loading>Thinking…</DelaButton>
```

| Surface | Detail |
|---------|--------|
| Inherited | Full MUI Button events and props except `variant` (`onClick`, `disabled`, `loading`, `href`/`component`, `sx`, `startIcon`/`endIcon`, …) |
| Harmony-only | `pill?: boolean` |
| Notes | Always dela gradient (`variant` forced contained). Default stars icon from app `/Stars.svg` unless `loading` or you pass `startIcon`. |

### StatusBadge

Presentational status pill (not MUI `Chip` / `Badge`). Extends `HTMLAttributes<HTMLSpanElement>` plus MUI `sx`.

```tsx
import { StatusBadge } from '@dltkrichardhuska/harmony-design-system-react-mui/components';

<StatusBadge variant="success" size="medium" icon="check-circle">
  Active
</StatusBadge>
```

| Surface | Detail |
|---------|--------|
| Inherited | Native span attributes/events (`onClick`, `className`, …) and `sx` |
| Harmony-only | `variant`, `size` (`small` \| `medium` \| `large`), `icon` (Harmony icon name), `children` |
| Notes | Non-interactive by default; wrap or attach handlers if you need clicks. |

### HarmonyIcon

MUI `SvgIcon` slot patterns — string-name icons for Harmony catalogs and MUI icon slots.

```tsx
import { HarmonyIcon } from '@dltkrichardhuska/harmony-design-system-react-mui/components';
import Button from '@mui/material/Button';

<HarmonyIcon name="home" size="md" />
<Button startIcon={<HarmonyIcon name="plus" fontSize="inherit" />}>Add</Button>
```

| Surface | Detail |
|---------|--------|
| Inherited | `fontSize`, `color` (SvgIcon-like), `sx`, `className`, `titleAccess`, `ref` |
| Harmony-only | `name` (required), `size` (`xs`–`xl`, optional — falls through to `fontSize`), `variant` (`outline` \| `solid`), `product` |
| Notes | Use `fontSize="inherit"` inside MUI icon slots. When `size` is omitted, sizing uses `fontSize` (default `'medium'`). Decorative (`aria-hidden`); label the interactive parent. |
