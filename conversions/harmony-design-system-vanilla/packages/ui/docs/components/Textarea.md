# Textarea

Harmony textareas ship a **dual path**:

1. **Native** — product `styles.css` styles all `<textarea>` by default (and `.textarea` when a class is needed)
2. **Custom Element** — `<harmony-textarea>` (open Shadow DOM, form-associated) for errors and a stacked `label` attribute

## Native recipe

```html
<label class="label" for="msg">Message</label>
<textarea id="msg" rows="4" placeholder="Enter your message..."></textarea>
```

### Composition helpers

| Class | Role |
|-------|------|
| `.textarea` | Same look when an explicit class is needed |
| `.textarea-form-wrapper--inline\|stacked` | Sibling label + field layout |

## Custom Element — `<harmony-textarea>`

| Attribute | Values | Default |
|-----------|--------|---------|
| `name` / `value` / `placeholder` / `id` | string | — |
| `rows` | number | 4 |
| `disabled` / `required` / `readonly` / `error` | boolean | false |
| `error-message` | string | — |
| `label` | string (stacked when standalone) | — |

**Events:** retargeted `input` / `change`.

**Parts:** `label`, `control`, `error`.

No icon / trailing APIs (use Input for adornments).

```html
<harmony-textarea
  id="msg"
  name="message"
  label="Message"
  rows="4"
  placeholder="How can we help?"
  required
></harmony-textarea>
```

### Form association

Same as Input: `formAssociated` + `ElementInternals` + `delegatesFocus`. Not a real `HTMLTextAreaElement`.

Use `<harmony-form-layout>` for aligned multi-field labels — see [Input.md](Input.md).

## Accessibility

Same contract as Input (label association, error ARIA, forced-colors). Provide an explicit `id`.
