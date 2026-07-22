# RadioGroup

`@radix-ui/react-radio-group` root with Harmony fieldset legend and group validation. **Radix propagates `name`** to items (unlike Astro, where group `name` was unused).

## Import

```tsx
import {
  RadioGroup,
  RadioField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<RadioGroup legend="Shipping" defaultValue="standard" name="ship">
  <RadioField label="Standard" value="standard" />
  <RadioField label="Express" value="express" />
</RadioGroup>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Propagated to items |
| `value` / `defaultValue` | `string` | — | Controlled / uncontrolled |
| `onValueChange` | `(value: string) => void` | — | Selection change |
| `legend` | `string` | — | Fieldset legend |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout |
| `error` / `warning` | `boolean` | `false` | Group chrome |
| `errorMessage` / `warningMessage` | `string` | — | Group message |

Export `radioGroupVariants`. Demo: `/components/radio-groups`.
