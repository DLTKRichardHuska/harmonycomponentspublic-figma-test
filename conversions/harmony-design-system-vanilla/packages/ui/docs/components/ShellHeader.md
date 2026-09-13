# ShellHeader

Application header via `<harmony-shell-header>` (open Shadow DOM). Brand mark comes from the **product kit** file `assets/logo.svg` (loaded as an image) — there is no `logo-src` attribute.

## Usage

```html
<harmony-shell-header product-name="Costpoint" gradient-color="#FF507B">
  <div slot="actions">
    <harmony-company-picker company-name="Acme Corporation" company-id="acme-corp" company-color="#FF507B">
      <button type="button" data-company-option data-company-id="acme-corp" data-company-color="#FF507B">Acme Corporation</button>
      <button type="button" data-company-option data-company-id="ocean" data-company-color="#285F8C">Ocean Industries</button>
    </harmony-company-picker>
    <harmony-user-menu name="Jane Doe">
      <button type="button" data-icon="user">Profile</button>
      <button type="button" data-icon="arrow-right-on-rectangle">Sign out</button>
    </harmony-user-menu>
  </div>
</harmony-shell-header>
```

Compose any controls in `slot="actions"`. Swap or omit CompanyPicker / UserMenu as needed. Listen for `company-change` on the picker (bubbles) and set `gradient-color` on the header.

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `product-name` | string | Harmony |
| `gradient-color` | CSS color | product `--theme-primary` |
| `href` | brand link URL | `/` |

## Slots / parts

- Slot `actions` — right-side controls
- Parts: `header`, `brand`, `brand-link`, `logo`, `title`, `actions`, `gradient`

## Accessibility

Host is a banner-style header. Brand link uses `product-name` for its accessible name. Forced-colors: shadow-local border/gradient fallbacks.
