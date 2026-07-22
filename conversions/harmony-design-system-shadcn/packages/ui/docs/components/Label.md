# Label

Harmony form label — stock [shadcn Label](https://ui.shadcn.com/docs/components/label) + [Field](https://ui.shadcn.com/docs/components/field) composition helpers.

## Import

```tsx
import {
  Label,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  labelVariants,
  fieldVariants,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Prefer Field composition

```tsx
<Field orientation="stacked">
  <FieldLabel htmlFor="email" required>Email</FieldLabel>
  <FieldDescription>We’ll never share it.</FieldDescription>
  <Input id="email" type="email" />
  <FieldError>Invalid email</FieldError>
</Field>
```

Use bare `Label` for simple cases. Use `InputField` / `TextareaField` / `NumberField` / `RangeField` for one-shot labeled controls.

## Label props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `htmlFor` | `string` | — | Associated control id (not Astro `for`) |
| `required` | `boolean` | `false` | Required asterisk |
| `helper` | `string` | — | Parenthetical helper text |
| `children` | `ReactNode` | — | Label text |
| `className` | `string` | — | Extra classes |

## Field props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'stacked' \| 'horizontal'` | `'stacked'` | Label above vs beside |
| `data-invalid` | `boolean` | — | Invalid field styling hook |
| `children` | `ReactNode` | — | FieldLabel + control + description/error |

## Inherited / stack surface

`Label` / `FieldLabel` forward `ref` and label HTML attributes via Radix Label. `Field`, `FieldDescription`, `FieldError` forward `ref` + HTML attrs on their roots.

## If you were about to use stock shadcn Field

| Stock shadcn | Harmony |
|--------------|---------|
| `FieldLabel` | `FieldLabel` (wraps Harmony `Label`) |
| `FieldDescription` / `FieldError` | Same names |
| `orientation="horizontal"` | `orientation="horizontal"` (Astro `inline`) |

## Do not

- Put `label` / `labelVariant` on bare `Input` — use Field or `*Field`
- Import Lucide for form chrome
