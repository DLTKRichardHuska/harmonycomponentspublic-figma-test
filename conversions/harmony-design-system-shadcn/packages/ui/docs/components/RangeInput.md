# RangeInput

Slider for numeric ranges — Radix/shadcn Slider with Harmony tokens and a live value label. **No built-in label** — compose or use `RangeField`.

## Import

```tsx
import { RangeInput, RangeField, rangeInputVariants } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Controlled value |
| `defaultValue` | `number` | `50` | Uncontrolled initial |
| `onChange` | `(value: number) => void` | — | Change handler |
| `min` / `max` / `step` | `number` | `0` / `100` / `1` | Range |
| `showPercent` | `boolean` | `false` | Display as % of range |
| `prefix` / `suffix` | `string` | `''` | Value label adornments |
| `disabled` | `boolean` | `false` | Disable slider |
| `id` / `name` | `string` | — | Passed to Radix root |
| `className` | `string` | — | Extra classes on wrapper |

## Inherited / stack surface

Forwards `ref` and remaining `HTMLAttributes` on the outer wrapper `<div>`. Value API is Harmony-shaped (number + `onChange`), not native `input` events.

## RangeField

```tsx
<RangeField label="Volume" labelVariant="inline" value={75} showPercent onChange={setVolume} />
```

## Do not

- Put `label` on bare `RangeInput`
- Expect a native `<input type="range">` DOM — Radix Slider is intentional
