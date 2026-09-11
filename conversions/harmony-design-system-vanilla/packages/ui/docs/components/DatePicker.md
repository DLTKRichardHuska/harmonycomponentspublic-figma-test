# DatePicker

Calendar widget as `<harmony-date-picker>` (open Shadow DOM). Not form-associated. Compose it inside `<harmony-picker-popup>` for a custom trigger, or use `<harmony-date-input>` for the form field.

## Usage

```html
<harmony-date-picker value="2024-01-15" min="2024-01-01" max="2024-12-31"></harmony-date-picker>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `value` | `YYYY-MM-DD` | — |
| `min` / `max` | `YYYY-MM-DD` | — |
| `disabled` | boolean | false |
| `locale` | BCP 47 | app default (`en-US`) — omit to inherit [DateTime.md](DateTime.md) |

Also supports `valueAsDate` (`Date | null`). See [DateTime.md](DateTime.md).

## Events

| Event | Detail |
|-------|--------|
| `date-select` | `{ date }` — `YYYY-MM-DD`, bubbles and composed |

## Parts

- `header` — month navigation
- `grid` — day grid

## Accessibility

The day grid is `role="grid"`. Arrow keys move by day or week; Home/End move within the week; Page Up/Page Down change month (Shift changes year). Enter/Space activates the focused day. Forced-colors: selected days use Highlight; focus is `outline: 2px solid Highlight`.

## Notes

- No native `input type="date"` dual path
- Range highlighting (DateRangePicker) is not part of this widget
- No auto-generated id
