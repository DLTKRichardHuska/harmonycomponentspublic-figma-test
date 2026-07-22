# CheckboxGroup

Fieldset shell for related checkboxes. Children are package **Checkbox** / **CheckboxField**. Author owns each child’s `name` / `value` / `checked`.

## Import

```tsx
import {
  CheckboxGroup,
  CheckboxField,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<CheckboxGroup legend="Preferences" orientation="vertical">
  <CheckboxField label="Email" name="email" defaultChecked />
  <CheckboxField label="SMS" name="sms" />
</CheckboxGroup>

<CheckboxGroup legend="Required" error errorMessage="Select at least one">
  <CheckboxField label="A" name="a" />
  <CheckboxField label="B" name="b" />
</CheckboxGroup>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `legend` | `string` | — | Fieldset legend |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Child layout (horizontal stacks ≤768px) |
| `error` / `warning` | `boolean` | `false` | Group chrome (propagates to faces) |
| `errorMessage` / `warningMessage` | `string` | — | Message below group |
| `children` | `ReactNode` | — | Checkbox children |

Export `checkboxGroupVariants`. Demo: `/components/checkbox-groups`.
