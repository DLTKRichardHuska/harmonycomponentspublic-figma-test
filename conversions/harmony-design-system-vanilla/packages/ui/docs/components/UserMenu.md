# UserMenu

User avatar menu via `<harmony-user-menu>` (open Shadow DOM). Image when `src` is set; otherwise initials from `name`. Full name is the tooltip.

## Usage

```html
<harmony-user-menu name="Jane Doe">
  <button type="button" data-icon="user">Profile</button>
  <a href="/settings" data-icon="cog-6-tooth">Settings</a>
  <button type="button" data-icon="arrow-right-on-rectangle">Sign out</button>
</harmony-user-menu>

<harmony-user-menu name="Jane Doe" src="/photo.jpg">
  <button type="button" data-icon="arrow-right-on-rectangle">Sign out</button>
</harmony-user-menu>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `name` | string (required for a11y / initials / tooltip) | — |
| `src` | image URL | — |

## Slots / parts

- Default slot — menu items (`a` / `button`); same visual recipe as CompanyPicker options (padding, type size, hover) without a color indicator
- Optional `data-icon` on each item — injects a leading `<harmony-icon>` (or put `<harmony-icon>` in the markup yourself)
- Parts: `trigger`, `avatar`, `menu`, `list`

## Accessibility

Avatar is interactive (`role=button`). Tooltip text is the full `name`. Menu items get `role="menuitem"`. Escape and outside click dismiss. Forced-colors: shadow-local menu border and focus.
