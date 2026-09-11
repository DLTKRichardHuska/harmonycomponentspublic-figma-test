# WeekPicker

ISO week widget as `<harmony-week-picker>` (open Shadow DOM). Not form-associated.

## Usage

```html
<harmony-week-picker value="2024-W03" min="2024-W01" max="2024-W12"></harmony-week-picker>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `value` | `YYYY-Www` | — |
| `min` / `max` | `YYYY-Www` | — |
| `disabled` | boolean | false |
| `locale` | BCP 47 | app default (`en-US`) — omit to inherit [DateTime.md](DateTime.md) |

## Events

| Event | Detail |
|-------|--------|
| `week-select` | `{ value }` — `YYYY-Www`, bubbles and composed |

## Parts

- `header` — year navigation
- `list` — week listbox

## Accessibility

The list is `role="listbox"`; weeks are `option`s. Arrow keys move between weeks; Home/End jump to the first and last week of the year. Forced-colors: selected week uses Highlight; focus is `outline: 2px solid Highlight`.
