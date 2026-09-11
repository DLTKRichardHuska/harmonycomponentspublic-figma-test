# MonthPicker

Month and year widget as `<harmony-month-picker>` (open Shadow DOM). Not form-associated.

## Usage

```html
<harmony-month-picker value="2024-06" min="2024-01" max="2024-12"></harmony-month-picker>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `value` | `YYYY-MM` | — |
| `min` / `max` | `YYYY-MM` | — |
| `disabled` | boolean | false |
| `locale` | BCP 47 | app default (`en-US`) — omit to inherit [DateTime.md](DateTime.md) |

## Events

| Event | Detail |
|-------|--------|
| `month-select` | `{ value }` — `YYYY-MM`, bubbles and composed |

## Parts

- `header` — year navigation
- `grid` — month grid

## Accessibility

Month buttons are grid cells. Arrow keys move by month (up/down by three); Page Up/Page Down change year. Forced-colors: selected month uses Highlight; focus is `outline: 2px solid Highlight`.
