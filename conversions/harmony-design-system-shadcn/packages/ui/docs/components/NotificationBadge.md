# NotificationBadge

Harmony count / dot indicator. Prefer wrapping an anchor as `children` (auto top-right placement) — the AI-friendly pattern. Standalone when no children.

## Import

```tsx
import {
  NotificationBadge,
  notificationBadgeVariants,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

Requires `HarmonyThemeProvider` and package styles (see Getting Started).

## Props

Discriminated by `type`:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'dot' \| 'number' \| 'overflow'` | `'number'` | Dot (no value) vs count vs overflow label |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Indicator size |
| `variant` | `'error' \| 'primary'` | `'primary'` | Fill color |
| `value` | `string \| number` | `1` | Count / overflow text — **not allowed** when `type="dot"` |
| `border` | `boolean` | `false` | White border for contrast on dark anchors |
| `children` | `ReactNode` | — | Optional anchor; when set, badge auto-positions (no absolute wrapper) |
| `className` | `string` | — | On wrapper when children present; else on the pill |

## Inherited / stack surface

Forwards `ref` and `HTMLAttributes` on the root (`relative` wrapper when children, else the pill). Default `aria-label` on the pill (`Notification indicator` or `N notifications`).

```tsx
{/* Preferred */}
<NotificationBadge type="number" value={3} variant="error">
  <Icon name="bell" />
</NotificationBadge>

{/* Standalone */}
<NotificationBadge type="dot" variant="primary" />
<NotificationBadge type="overflow" value="99+" size="lg" border />
```

Also export `notificationBadgeVariants` for composition.

## Composition recipes

```tsx
import { Button, Icon, NotificationBadge } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<NotificationBadge type="number" value={12} variant="error" border>
  <Button icon="bell" aria-label="Notifications" variant="ghost" />
</NotificationBadge>

<NotificationBadge type="dot" variant="error">
  <Icon name="inbox" size="md" />
</NotificationBadge>
```

Do **not** invent a `relative` + `absolute` wrapper — that is built in when `children` is set.

## If you were about to use stock shadcn…

There is no stock shadcn NotificationBadge. Do not reuse stock `Badge` for unread counts.

| Need | Component |
|------|-----------|
| Status / severity label | `Badge` |
| Unread count / overflow / dot on an anchor | `NotificationBadge` with `children` |

Closest mental model: MUI `Badge` / shadcn-style overlay — wrap the control, pass count props on the badge.

## Do not

- Pass `value` with `type="dot"`
- Hand-roll `relative` / `absolute` positioning for normal on-anchor use
- Use `Badge` variants for notification dots/counts
- Import Lucide for the anchor — use package `Icon` / `Button` `icon`
