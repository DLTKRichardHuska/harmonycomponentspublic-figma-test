# NumberInput

Number field with − / + steppers. Steppers use package `Button` + `Icon` (`minus` / `plus`). **No built-in label** — compose or use `NumberField`.

## Import

```tsx
import { NumberInput, NumberField, numberInputVariants } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Controlled value |
| `defaultValue` | `number` | `0` | Uncontrolled initial |
| `onChange` | `(value: number) => void` | — | Change handler |
| `min` / `max` / `step` | `number` | `step` default `1` | Constraints |
| `disabled` | `boolean` | `false` | Disable control + steppers |
| `className` | `string` | — | Extra classes on shell |

## Inherited / stack surface

Forwards `ref` and remaining input HTML attrs (`id`, `name`, `required`, …) onto the inner `<input type="number">`. `onChange` is Harmony-shaped `(value: number) => void`, not the native event.

## NumberField

```tsx
<NumberField label="Quantity" labelVariant="inline" value={1} min={0} max={99} onChange={setQty} />
```

## Do not

- Put `label` on bare `NumberInput`
- Import Lucide for stepper glyphs
