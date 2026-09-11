# Checkbox

Harmony checkboxes ship a **dual path**:

1. **Native** — product `styles.css` styles unclassed `input[type=checkbox]` (excludes `.checkbox__input`)
2. **Custom Element** — `<harmony-checkbox>` (open Shadow DOM, form-associated) for labeled structure, error/warning, and form-layout

## Native recipe

```html
<label class="label" for="agree">
  <input id="agree" type="checkbox" name="agree" />
  I agree
</label>
```

## Custom Element — `<harmony-checkbox>`

| Attribute | Values | Default |
|-----------|--------|---------|
| `name` / `value` / `id` | string | value `on` |
| `checked` / `disabled` / `required` / `error` / `warning` | boolean | false |
| `error-message` / `warning-message` | string | — |
| `label` | string | — |
| `label-variant` | inline \| stacked | stacked (CP kits: inline when unset) |

**Property:** `indeterminate` (boolean) — not an attribute; sets the inner control’s indeterminate state.

**Events:** retargeted `input` / `change` (`bubbles`, `composed`).

**Parts:** `control`, `input`, `box`, `label`, `message`.

```html
<harmony-checkbox id="terms" name="terms" label="Accept terms" required></harmony-checkbox>

<harmony-checkbox
  id="bad"
  error
  error-message="Required"
  label="Confirm"
></harmony-checkbox>
```

```js
const cb = document.querySelector('harmony-checkbox');
cb.indeterminate = true;
```

### Form association

`formAssociated` + `ElementInternals` + `delegatesFocus`. The host is **not** an `HTMLInputElement` — prefer the native path when you need a real checkbox in the light DOM.

Standalone `label` renders beside the control. **Inside `harmony-form-layout` the beside-control label hides** — the layout owns the label via the `label` attribute. Stacked keeps label above the control; **inline** (and CP unset) puts the checkbox before the label. Field `id` is optional; omit it unless you need a JS/CSS hook — label clicks still toggle.

```html
<form>
  <harmony-form-layout label-layout="stacked">
    <harmony-checkbox name="opt" label="Email me updates"></harmony-checkbox>
  </harmony-form-layout>
  <harmony-form-layout label-layout="inline">
    <harmony-checkbox name="opt2" label="Email me updates"></harmony-checkbox>
  </harmony-form-layout>
</form>
```

## Notes

- **CheckboxGroup** is not converted yet — group manually or wait for that surface
- Forced-colors: document CSS for native; **shadow-local** on the CE
- Adopt `checkboxSheet` in Shadow DOM hosts that need the native/BEM recipe inside shadow trees
