# Label

Harmony labels are **native `<label class="label">`**. There is no `harmony-label` Custom Element.

## Usage

```html
<label class="label" for="email">Email</label>
<input id="email" type="email" />

<label class="label label--required" for="name">First Name</label>
<input id="name" required />

<label class="label" for="phone">
  Phone <span class="label__helper">(optional)</span>
</label>
<input id="phone" type="tel" />
```

## Classes

| Class | Role |
|-------|------|
| `.label` | Base form label |
| `.label--required` | Appends a red `*` via `::after` |
| `.label__helper` | Muted helper text (usually parentheses) |

## Composition

- Always set native `for` to the associated control `id`
- Pair `.label--required` with the control’s `required` attribute
- For aligned multi-field forms, prefer `<harmony-form-layout>` with field `label` attrs (see Input docs)
- Manual stacks: `.field-stack` for one label+field; nest those in `.field-stack-list` for `--space-4` between fields (label→field stays `--space-1-5` via label margin)
- Form wrappers `.input-form-wrapper--inline|stacked` remain available for sibling label + field composition

## Accessibility

Native `<label>`. Forced-colors via document CSS. Helper text is part of the accessible name.
