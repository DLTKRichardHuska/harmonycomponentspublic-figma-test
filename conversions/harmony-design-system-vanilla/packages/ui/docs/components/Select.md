# Select

Catalog **Dropdown** ships as **Select**. Harmony has no `harmony-dropdown`.

Two paths:

1. **Native** — product `styles.css` styles `<select>` by default (and `.select` when a class is needed). Closed-field chrome matches text inputs. The open list is the operating-system picker — options and optgroups are not restyled.
2. **Custom Element** — `<harmony-select>` (open Shadow DOM, form-associated) for `label`, errors, and the same form-layout participation as `<harmony-input>`.

## Native recipe

```html
<label class="label" for="country">Country</label>
<select id="country" name="country">
  <option value="" disabled selected>Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>
```

`.select` is the same look when an explicit class is needed. `.select--error` sets the error border.

Do not restyle `<option>` or `<optgroup>`. Checkbox, radio, and other input types are not part of this recipe.

## Custom Element — `<harmony-select>`

| Attribute | Values | Default |
|-----------|--------|---------|
| `name` / `value` / `id` | string | — |
| `placeholder` | string (disabled empty first option) | — |
| `disabled` / `required` / `error` | boolean | false |
| `error-message` | string | — |
| `label` | string (stacked shadow label when standalone) | — |
| `label-variant` | inline \| stacked | stacked (CP kits: inline when unset; **ignored inside `harmony-form-layout`**) |

**Default slot:** `<option>` and `<optgroup>` (source of truth; copied into the shadow control, not moved).

**Events:** retargeted `input` / `change` (`bubbles`, `composed`).

**Parts:** `label`, `control`, `error`.

```html
<harmony-select id="country" name="country" label="Country" placeholder="Select a country">
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</harmony-select>

<harmony-select id="priority" name="priority" value="medium" label="Priority">
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
</harmony-select>
```

### Form association

`formAssociated` + `ElementInternals` + `delegatesFocus`. The host is **not** an `HTMLSelectElement`. `querySelector('select')` will not find the CE host.

Single-select submits the current value. `multiple` is not a `harmony-select` feature — a `multiple` attribute on the host is removed. Native `<select multiple>` remains a platform control and is not styled as a Harmony field.

Standalone `label` renders the field’s shadow label. Inside `harmony-form-layout`, that shadow label is hidden and the layout inserts a light-DOM label from the `label` attribute — the same contract as `harmony-input`.

```html
<form>
  <harmony-form-layout label-layout="inline">
    <harmony-form-row>
      <harmony-input id="first" name="first" label="First Name" required></harmony-input>
      <harmony-select id="country" name="country" label="Country" placeholder="Select a country" required>
        <option value="us">United States</option>
        <option value="ca">Canada</option>
      </harmony-select>
    </harmony-form-row>
  </harmony-form-layout>
  <button type="submit">Send</button>
</form>
```

## Accessibility

- Native `<select>` semantics (keyboard, name, required, disabled) — not a custom listbox
- Associate labels with `for` / `id`, or use the CE `label` attribute / form-layout
- `error` sets `aria-invalid`; `error-message` links via `aria-describedby`
- `required` uses ElementInternals `valueMissing` when nothing is selected
- Forced-colors: document CSS restores OS select chrome (the CSS chevron is a background image). Shadow-local HC on the CE does the same for the inner control
- Provide an explicit `id` (no Astro-style auto-id)

## Skipped (accepted)

- Custom Astro dropdown menu, trigger slot, and `option-0`…`option-9` slots
- Kanban CP menu positioning

## Docs / AI

Catalog map: **Dropdown → native `select` + `harmony-select`**. Adopt `inputSheet` so native select styles apply inside Shadow DOM demo hosts.
