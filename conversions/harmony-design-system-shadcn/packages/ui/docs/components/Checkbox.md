# Checkbox

Radix Checkbox + Harmony tokens. Indicator uses package **Icon** `check` (not Lucide). Prefer **CheckboxField** or **Label** for labels — bare Checkbox has no `label` prop.

## Import

```tsx
import {
  Checkbox,
  CheckboxField,
  Label,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<CheckboxField label="Email notifications" name="email" defaultChecked />

<div className="inline-flex items-center gap-2">
  <Checkbox id="tos" />
  <Label htmlFor="tos">I agree</Label>
</div>

<Checkbox aria-label="Select row" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` / `defaultChecked` | `boolean` | — | Controlled / uncontrolled |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | — | Radix handler |
| `disabled` | `boolean` | `false` | Disabled |
| `error` / `warning` | `boolean` | `false` | Validation chrome |
| `errorMessage` / `warningMessage` | `string` | — | Message below control |
| `name` / `id` / `value` | `string` | — | Form attributes |
| `asChild` | `boolean` | `false` | Radix Slot |

### CheckboxField

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Required label text |
| `labelVariant` | `'stacked' \| 'inline'` | `'inline'` | Label above or beside |
| `helper` / `required` | — | — | Field helpers |

Export `checkboxVariants`. Demo: `/components/checkboxes`.
