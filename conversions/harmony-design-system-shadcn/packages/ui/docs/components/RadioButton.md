# RadioButton

Radix Radio Group **Item** styled as Harmony radio. Must be a child of **RadioGroup**. Prefer **RadioField** or **Label** — no built-in `label` prop. Checked indicator is a CSS dot (not Icon).

## Import

```tsx
import {
  RadioGroup,
  RadioButton,
  RadioField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<RadioGroup defaultValue="a" name="plan">
  <RadioField label="Option A" value="a" />
  <RadioField label="Option B" value="b" size="lg" />
</RadioGroup>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Required item value |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Circle size |
| `disabled` | `boolean` | `false` | Disabled |
| `error` / `warning` | `boolean` | `false` | Per-item validation |
| `errorMessage` / `warningMessage` | `string` | — | Message below item |

### RadioField

Same Hybrid C pattern as CheckboxField (`label`, `labelVariant`, `helper`, `required`).

Export `radioButtonVariants`. Demo: `/components/radio-buttons`.
