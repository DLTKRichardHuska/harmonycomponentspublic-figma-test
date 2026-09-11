# Badge

Status badge as `<harmony-badge>` (open Shadow DOM).

## Usage

```html
<harmony-badge>Default</harmony-badge>
<harmony-badge variant="success">Success</harmony-badge>
<harmony-badge size="small" icon="check">Done</harmony-badge>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `variant` | default \| primary \| success \| warning \| error \| info \| orange \| pink \| disabled | default |
| `size` | small \| medium \| large | large |
| `icon` | harmony-icon name | — |

Default slot = label. `disabled` is a **visual** variant only (not `aria-disabled`).

## Parts

- `icon` — optional leading icon

## Notes

- NotificationBadge is a separate catalog element — see [NotificationBadge.md](NotificationBadge.md)
- No public document `.badge` recipe
- Forced-colors: shadow-local
