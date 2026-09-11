# NotificationBadge

Count / status indicator as `<harmony-notification-badge>` (open Shadow DOM). Wrap-target API: the host wraps the anchor; the badge sits absolutely (default `top-end`).

## Usage

```html
<harmony-notification-badge type="number" value="3">
  <harmony-button variant="ghost" icon="bell" aria-label="Notifications"></harmony-button>
</harmony-notification-badge>

<harmony-notification-badge type="dot" variant="error">
  <harmony-avatar initials="RH"></harmony-avatar>
</harmony-notification-badge>

<!-- Standalone badge (no wrap target) -->
<harmony-notification-badge type="overflow" value="99+"></harmony-notification-badge>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `type` | dot \| number \| overflow | number |
| `size` | sm \| md \| lg | md |
| `variant` | error \| primary | primary |
| `value` | string | `1` |
| `border` | boolean | false |
| `position` | top-end | top-end |

Default slot = optional wrap target. Empty slot → standalone badge (`data-empty`).

## Parts

- `badge` — the indicator span

## Notes

- Separate from catalog Badge (`harmony-badge`)
- No public document `.notification-badge` recipe
- Forced-colors: shadow-local
