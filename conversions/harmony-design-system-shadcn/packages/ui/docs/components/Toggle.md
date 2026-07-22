# Toggle

Radix Switch + Harmony tokens. Prefer **ToggleField** or **Label** for labels — bare Toggle has no `label` prop. Segmented variant is not supported.

## Import

```tsx
import {
  Toggle,
  ToggleField,
  toggleVariants,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<ToggleField label="Enable notifications" name="notifications" />

<Toggle aria-label="Compact" defaultChecked size="sm" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` / `defaultChecked` | `boolean` | — | Controlled / uncontrolled |
| `onCheckedChange` | `(checked: boolean) => void` | — | Radix change handler |
| `disabled` | `boolean` | `false` | Disabled |
| `size` | `'sm' \| 'md'` | `'md'` | Track / thumb size |
| `name` / `id` | `string` | — | Form attributes |
| `className` | `string` | — | Extra classes on root |
| `ref` | — | — | Forwards to Radix Switch root |

### ToggleField

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Required label text |
| `labelVariant` | `'stacked' \| 'inline'` | `'inline'` | Label above or beside |
| `helper` / `required` | — | — | Field helpers |
| … | — | — | All `Toggle` props |

## Events / polymorphism

Radix Switch events (`onCheckedChange`, `onClick` via button semantics). No `asChild`. Presentational thumb; control is the Switch root.

Export `toggleVariants`, `toggleThumbVariants`. Demo: `/components/toggle-switches`.

**Omitted:** `variant="segmented"`, `optionLabelLeft`, `optionLabelRight`.

## If you were about to use stock shadcn Switch / ToggleGroup

| Stock / mistaken | Harmony |
|------------------|---------|
| Lucide icons | N/A for default Toggle; use package `Icon` elsewhere |
| `ToggleGroup` for binary on/off | `Toggle` / `ToggleField` |
| `label` on bare Switch | `ToggleField` or compose `Label` |
| Segmented two-option track | Not supported — callout on demo |

## Do not

- Put `label` on bare `Toggle`
- Import Lucide or invent a segmented Toggle API without AskQuestion
