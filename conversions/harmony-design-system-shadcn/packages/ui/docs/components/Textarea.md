# Textarea

Harmony multi-line text input — shadcn Textarea pattern. **No error API** (reference parity). **No built-in label** — compose or use `TextareaField`.

## Import

```tsx
import { Textarea, TextareaField, textareaVariants } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `number` | `4` | Visible rows |
| `className` | `string` | — | Extra classes |

## Inherited / stack surface

Forwards `ref` and `TextareaHTMLAttributes` (`value`, `defaultValue`, `onChange`, `disabled`, `placeholder`, `required`, …).

## TextareaField

```tsx
<TextareaField label="Message" labelVariant="inline" rows={4} />
```

Same `label` / `labelVariant` / `helper` pattern as `InputField`.

## Do not

- Expect `error` / `errorMessage` on Textarea (use Field + FieldError if needed)
- Put `label` on bare Textarea
