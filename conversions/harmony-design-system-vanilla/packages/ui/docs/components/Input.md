# Input

Harmony text inputs ship a **dual path**:

1. **Native** — product `styles.css` styles text-like `<input>` by default (and `.input` when a class is needed)
2. **Custom Element** — `<harmony-input>` (open Shadow DOM, form-associated) for icons, trailing actions, errors, and a stacked `label` attribute

## Native recipe

**Default-styled (no `.input` required):**

- `input` with omitted `type`
- `input[type=text|email|password|number|url|search|tel]`

**Not styled by this recipe:** checkbox, radio, file, hidden, range, date/time, color, button/submit/reset (Button owns those).

```html
<label class="label" for="email">Email</label>
<input id="email" type="email" placeholder="you@example.com" />
```

### Composition helpers

| Class | Role |
|-------|------|
| `.input` | Same look when an explicit class is needed |
| `.input--error` | Error border |
| `.input--with-icon` / `.input--with-trailing` | Extra padding for adornments |
| `.input-wrapper` | Relative wrapper for icons / trailing gutter |
| `.input-wrapper__icon` (+ `--trailing`) | Decorative icon placement |
| `.input-wrapper__trailing` | Trailing action gutter |
| `.input-wrapper__error` | Error message under the field |
| `.input-form-wrapper--inline\|stacked` | Sibling label + field layout |

## Custom Element — `<harmony-input>`

| Attribute | Values | Default |
|-----------|--------|---------|
| `type` | text \| email \| password \| number \| url \| search \| tel | text |
| `name` / `value` / `placeholder` / `id` | string | — |
| `disabled` / `required` / `readonly` / `error` | boolean | false |
| `error-message` | string | — |
| `icon` / `trailing-icon` | `harmony-icon` name | — |
| `label` | string (stacked shadow label when standalone) | — |

**Slot:** `trailing` — prefer icon-only ghost `<harmony-button>` / `.btn--ghost`. Slot wins over `trailing-icon`.

**Events:** retargeted `input` / `change` (`bubbles`, `composed`).

**Parts:** `label`, `control`, `icon`, `trailing-icon`, `trailing`, `error`.

```html
<harmony-input
  id="search"
  name="q"
  icon="magnifying-glass"
  placeholder="Search"
></harmony-input>

<harmony-input type="password" id="pwd" placeholder="Password">
  <harmony-button slot="trailing" variant="ghost" size="sm" icon="eye" aria-label="Show password"></harmony-button>
</harmony-input>

<harmony-input
  id="bad"
  error
  error-message="Please enter a valid value"
  value="Invalid"
></harmony-input>
```

### Form association

`formAssociated` + `ElementInternals` + `delegatesFocus`. The host is **not** an `HTMLInputElement` — prefer the native dual path when you need a real input node in the light DOM. `querySelector('input')` will not find the CE host.

Standalone `label` renders the field’s shadow label. `label-variant` is `inline` or `stacked` (default stacked; CP kits default unset to inline). **Inside `harmony-form-layout` it is ignored** — the layout owns label position.

```html
<harmony-input id="email" label="Email" label-variant="inline" type="email"></harmony-input>
```

## Form layout — `<harmony-form-layout>` + `<harmony-form-row>`

Conversion helpers (not catalog elements). Place **inside** a native `<form>`. The layout reads child `label` attributes on `harmony-input`, `harmony-textarea`, `harmony-select`, and `harmony-date-input`, and inserts aligned light-DOM labels. Field shadow labels hide via `:host-context`.

| Tag | Attribute | Values | Default |
|-----|-----------|--------|---------|
| `harmony-form-layout` | `label-layout` | inline \| stacked | stacked (CP kits: inline when unset) |
| `harmony-form-row` | `columns` | number | 2 |

Wrap fields in `<harmony-form-row>` so they share a horizontal row (e.g. First / Last Name). In **inline** mode the parent uses a 4-track grid and the row uses **`display: contents`**, so First/Last labels share tracks with Email while sitting on one row. Fields **not** in a row span the full width (Email / Message each on their own row).

**Responsive multi-field rows** (`data-compact` on `harmony-form-layout`)
- Pair min width: **160px** stacked, **200px** inline (via `--harmony-form-field-pair-min`)
- When the layout is narrower than `columns × min + gaps`, stacked rows become one column; inline switches to a 2-track label|field grid so every field (including wrapped Last Name) shares the same alignment and `--space-4` row gap
- `columns` is a normal attribute (`1`–`4`); no inline styles on `harmony-form-row`

```html
<form>
  <harmony-form-layout label-layout="inline">
    <harmony-form-row>
      <harmony-input id="first" name="first" label="First Name" required></harmony-input>
      <harmony-input id="last" name="last" label="Last Name" required></harmony-input>
    </harmony-form-row>
    <harmony-input id="email" name="email" type="email" label="Email" required></harmony-input>
    <harmony-textarea id="msg" name="message" label="Message" rows="4"></harmony-textarea>
  </harmony-form-layout>
  <button type="submit">Send</button>
</form>
```

There is no separate wrapper required for a single inline label — set `label-variant`. Use `harmony-form-layout` (+ optional `harmony-form-row`) when several fields must share columns.

### Stacked spacing (conversion)

- **Label → field:** `--space-1-5` (cell gap / `.label` margin inside `.field-stack`)
- **Between fields / rows:** `--space-4` (layout gap between cells, or `.field-stack-list`)

`harmony-form-layout` wraps each field in `.harmony-form-layout__cell` so stacked mode does not apply the same `--space-4` gap between a label and its field. Manual stacks: use `.field-stack` (one label+field; gap `0`, label margin owns label→field) inside `.field-stack-list` (gap `--space-4` between pairs). Do not add a parent gap on top of label margin for the same label→field interval.

## Accessibility

- Associate labels with `for` / `id`, or use the CE `label` attribute / form-layout
- `error` sets `aria-invalid`; `error-message` links via `aria-describedby`
- Forced-colors: document CSS for native fields; **shadow-local** HC on the CE
- Provide an explicit `id` (no Astro-style auto-id)

## Docs / AI

Adopt `inputSheet` / `labelSheet` in Shadow DOM demo hosts so native recipes apply inside shadow trees. Catalog map: AGENTS.md.
