# Toggle

Switch control as `<harmony-toggle>` only (open Shadow DOM, form-associated). No public document `.toggle` recipe and no native checkbox restyle as a switch.

## Usage

```html
<harmony-toggle id="notify" name="notify" label="Notifications"></harmony-toggle>

<harmony-toggle
  variant="segmented"
  option-label-left="Off"
  option-label-right="On"
  aria-label="Power"
></harmony-toggle>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `name` / `id` | string | — |
| `checked` / `disabled` / `required` | boolean | false |
| `label` | string | — (default variant) |
| `label-variant` | inline \| stacked | stacked (CP kits: inline when unset) |
| `variant` | default \| segmented | default |
| `option-label-left` / `option-label-right` | string | Item 1 / Item 2 (segmented) |
| `size` | sm \| md | md |

**Events:** retargeted `input` / `change` (`bubbles`, `composed`).

**Parts:** `control`, `input`, `track`, `thumb`, `label` (default); segmented also `segment-left`, `segment-right`.

### Form association

`formAssociated` + `ElementInternals` + `delegatesFocus`. Form value is `'on'` when checked, otherwise `null`.

Works with `<harmony-form-layout>` / `<harmony-form-row>` like other field CEs — the layout owns the label via `label` when present. Stacked keeps label above; **inline** (and CP unset) puts the toggle before the label. Field `id` is optional; omit it unless you need a JS/CSS hook — label clicks still toggle.

```html
<form>
  <harmony-form-layout label-layout="inline">
    <harmony-toggle name="dark" label="Dark mode"></harmony-toggle>
  </harmony-form-layout>
</form>
```

## Notes

- Inner control is `role="switch"`
- Segmented: set `aria-label` (or rely on left/right option text)
- Forced-colors: shadow-local
- Adopt `toggleSheet` only if embedding the same styles in another Shadow host
