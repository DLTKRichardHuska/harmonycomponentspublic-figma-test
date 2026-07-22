# Input

Harmony text input — shadcn Input pattern with Harmony tokens, optional icons via package `Icon`, and error messaging.

**No built-in `label` prop.** Compose with `Label` / `Field`, or use `InputField`.

## Import

```tsx
import { Input, InputField, inputVariants } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'url' \| 'search' \| 'tel'` | `'text'` | Input type |
| `error` | `boolean` | `false` | Error border / `aria-invalid` |
| `errorMessage` | `string` | — | Message below control (`aria-describedby`) |
| `icon` | `string` | — | Leading Harmony Icon name |
| `trailingIcon` | `string` | — | Trailing decorative Icon |
| `trailing` | `ReactNode` | — | Trailing slot (wins over `trailingIcon`) |
| `className` | `string` | — | Extra classes |

## Trailing actions

The trailing slot is a **full-height, `space-10`-wide gutter** on the right (same width as `pr` when adorned). Prefer an icon-only package **`Button`**:

```tsx
<Input
  type="password"
  trailing={
    <Button
      type="button"
      variant="ghost"
      size="sm"
      icon="eye"
      aria-label="Show password"
      className="h-full w-full text-[var(--text-muted)] hover:text-[var(--text-primary)]"
    />
  }
/>
```

- Pattern: `variant="ghost"` + `icon` (icon-only) + `h-full w-full` so the hit target fills the gutter
- Colors: muted icon, hover to primary text; ghost `hover:bg-[var(--hover-bg)]` applies as usual
- Leading / decorative trailing icons are centered in the same gutter via flex

## Inherited / stack surface

Forwards `ref` and `InputHTMLAttributes` (`value`, `defaultValue`, `onChange`, `disabled`, `placeholder`, `required`, …).

## InputField (convenience)

```tsx
<InputField label="Email" labelVariant="stacked" type="email" />
<InputField label="Email" labelVariant="inline" type="email" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Required label text |
| `labelVariant` | `'stacked' \| 'inline'` | product default (`inline` for `cp`) | Field orientation |
| `helper` | `string` | — | Description text |
| … | | | All `Input` props |

## Do not

- Add `label` on bare `Input`
- Import Lucide for adornment icons — use `icon` / `trailingIcon` name strings
