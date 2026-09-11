# CompanyPicker

Company selector via `<harmony-company-picker>` (open Shadow DOM). Used in shell header actions or standalone.

## Usage

```html
<harmony-company-picker
  company-name="Acme Corporation"
  company-id="acme-corp"
  company-color="#FF507B"
>
  <button type="button" data-company-option data-company-id="acme-corp" data-company-color="#FF507B">
    Acme Corporation
  </button>
  <button type="button" data-company-option data-company-id="ocean" data-company-color="#285F8C">
    Ocean Industries
  </button>
</harmony-company-picker>
```

```js
picker.addEventListener('company-change', (e) => {
  const { id, name, color } = e.detail;
  header.gradientColor = color;
});
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `company-name` | string | — |
| `company-id` | string | — |
| `company-color` | CSS color | — |

## Events

- `company-change` — `detail: { id, name, color }` (bubbles, composed)

## Parts

- `button`, `indicator`, `name`, `menu`

## Accessibility

Trigger is a button with `aria-haspopup="listbox"` / `aria-expanded`. Options use `role="option"`. Escape and outside click dismiss. Forced-colors: shadow-local focus and menu border.
