# ListMenu

Vertical nav / menu lists are **native-first**. Product `styles.css` styles `.list-menu`. Optional `<harmony-list-menu>` maps attributes and ensures item classes (light DOM).

## Native recipe

**Base:** `.list-menu` on `nav`, `ul`, or `div`.

| Class | Role |
|-------|------|
| `.list-menu--no-borders` | Borderless items |
| `.list-menu__item` | Direct `a` / `button` item |
| `.list-menu__item-icon` | Leading `harmony-icon` inside an item |
| `.is-active` | Selected item |

Compose items as real links or buttons — **no `items[]` JSON**.

```html
<nav class="list-menu" aria-label="Sections">
  <a class="list-menu__item is-active" href="#home">
    <harmony-icon name="home" size="sm" class="list-menu__item-icon"></harmony-icon>
    Home
  </a>
  <a class="list-menu__item" href="#settings">Settings</a>
  <button type="button" class="list-menu__item">Sign out</button>
</nav>
```

## Hybrid helper — `<harmony-list-menu>`

Light-DOM Custom Element. The host **is** the styled surface (`.list-menu` ± `--no-borders`). Adds `.list-menu__item` to direct `a` / `button` children and `.list-menu__item-icon` on nested `harmony-icon` when missing. Document CSS styles it; Shadow hosts must adopt `listMenuSheet`.

| Attribute | Values | Default |
|-----------|--------|---------|
| `variant` | default \| no-borders | default |

Default slot = compose `a` / `button` children.

```html
<harmony-list-menu variant="no-borders" aria-label="Nav">
  <a href="#a">Alpha</a>
  <a class="is-active" href="#b">Beta</a>
  <button type="button">Action</button>
</harmony-list-menu>
```

## Notes

- No Shadow DOM on the helper; no public items API
- Forced-colors: product CSS / `listMenuSheet`
