# Select (Dropdown)

Radix Select + Harmony tokens. Catalog element is **Dropdown**; package export is **Select** (shadcn pattern). Prefer **SelectField** for labeled layouts — compose **SelectItem** children (no Astro `options[]`).

## Import

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectField,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<SelectField label="Country" placeholder="Select a country" name="country">
  <SelectItem value="us">United States</SelectItem>
  <SelectItem value="ca">Canada</SelectItem>
</SelectField>

<Select defaultValue="medium">
  <SelectTrigger>
    <SelectValue placeholder="Priority" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="low">Low</SelectItem>
    <SelectItem value="medium">Medium</SelectItem>
  </SelectContent>
</Select>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` / `defaultValue` | `string` | — | Controlled / uncontrolled |
| `onValueChange` | `(value: string) => void` | — | Radix change handler |
| `disabled` / `name` | — | — | Root attributes |
| `open` / `onOpenChange` | — | — | Radix open state (when used) |
| `SelectValue.placeholder` | `string` | — | Empty state text |
| `SelectItem.value` | `string` | — | Option value |
| `className` | `string` | — | On Trigger / Content / Item as applicable |

### SelectField

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Required label |
| `labelVariant` | `'stacked' \| 'inline'` | product default | stacked or inline (cp → inline) |
| `placeholder` | `string` | `'Select an option'` | Trigger placeholder |
| `helper` / `required` | — | — | Field helpers |
| `children` | `ReactNode` | — | `SelectItem` (etc.) inside Content |
| … | — | — | Select root props |

## Events / polymorphism

Radix Select controlled API (`value` / `onValueChange` / `open` / `onOpenChange`). Chevron uses package `Icon` `chevron-down` — not Lucide.

Demo: `/components/dropdowns`.

**Omitted:** Astro `options[]`, `trigger` / `option-*` slots.

## If you were about to use stock shadcn Select / invent Dropdown

| Stock / mistaken | Harmony |
|------------------|---------|
| `import { Dropdown }` | **Does not exist** — use `Select` |
| Lucide `ChevronDown` | Package `<Icon name="chevron-down" />` (built into Trigger) |
| Astro `options={[]}` API | Compose `SelectItem` children |
| `label` on bare Select root | `SelectField` or Label + Trigger `id` |

## Do not

- Export or invent a `Dropdown` component name
- Import Lucide for the chevron
- Put `label` on the Select root — use `SelectField`
