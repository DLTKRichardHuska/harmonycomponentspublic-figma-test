# Radio

Catalog **RadioButton**. Harmony radios ship a **dual path**:

1. **Native** — product `styles.css` styles unclassed `input[type=radio]` (excludes `.radio__input`)
2. **Custom Element** — `<harmony-radio>` (open Shadow DOM, form-associated) for labeled structure, sizes, error/warning, and form-layout

## Native recipe

Group with a shared `name`:

```html
<label class="label">
  <input type="radio" name="plan" value="basic" checked />
  Basic
</label>
<label class="label">
  <input type="radio" name="plan" value="pro" />
  Pro
</label>
```

## Custom Element — `<harmony-radio>`

| Attribute | Values | Default |
|-----------|--------|---------|
| `name` / `value` / `id` | string | — |
| `checked` / `disabled` / `required` / `error` / `warning` | boolean | false |
| `error-message` / `warning-message` | string | — |
| `label` | string | — |
| `label-variant` | inline \| stacked | stacked (CP kits: inline when unset) |
| `size` | small \| medium \| large | medium |

**Events:** retargeted `input` / `change` (`bubbles`, `composed`).

**Parts:** `control`, `input`, `circle`, `dot`, `label`, `message`.

```html
<harmony-radio name="plan" value="basic" label="Basic" checked></harmony-radio>
<harmony-radio name="plan" value="pro" label="Pro" size="large"></harmony-radio>
```

### Grouping

Use the same `name` on each option (native or CE). Within a form, checking one `harmony-radio` unchecks sibling `harmony-radio` elements that share that `name`.

### Form association

`formAssociated` + `ElementInternals` + `delegatesFocus`. The host is **not** an `HTMLInputElement`. Prefer native radios when built-in form drop-ins matter.

**Inside `harmony-form-layout` the beside-control label hides** — the layout owns the label via `label`. Stacked keeps label above; **inline** (and CP unset) puts the radio before the label. Field `id` is optional; omit it unless you need a JS/CSS hook — label clicks still select.

```html
<form>
  <harmony-form-layout>
    <harmony-radio name="ship" value="std" label="Standard" checked></harmony-radio>
    <harmony-radio name="ship" value="exp" label="Express"></harmony-radio>
  </harmony-form-layout>
</form>
```

## Notes

- Tag is `harmony-radio` (catalog name RadioButton)
- **RadioGroup** is not converted yet — group via shared `name` (same `<form>`, or same tree when not in a form)
- Forced-colors: document CSS for native; **shadow-local** on the CE
- Adopt `radioSheet` in Shadow DOM hosts that need the recipe inside shadow trees
