# TimePicker

Time widget as `<harmony-time-picker>` (open Shadow DOM). Not form-associated. `value` is always 24-hour `HH:MM`, including when `format="12"`.

## Usage

```html
<harmony-time-picker value="14:30" format="12" step="15"></harmony-time-picker>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `value` | `HH:MM` | — |
| `min` / `max` | `HH:MM` | — |
| `disabled` | boolean | false |
| `format` | `12` \| `24` | app default (`24`) — omit to inherit [DateTime.md](DateTime.md) |
| `step` | minutes (> 0) | `1` |

Also supports `valueAsDate` (`Date | null`, clock on `1970-01-01`). See [DateTime.md](DateTime.md).

## Events

| Event | Detail |
|-------|--------|
| `time-select` | `{ time }` — `HH:MM`, bubbles and composed |

## Accessibility

Hour and minute inputs are readonly `spinbutton`s (Arrow Up/Down). AM/PM buttons use `aria-pressed` when `format="12"`. Forced-colors: selected period uses Highlight; focus is `outline: 2px solid Highlight`.

## Notes

- Not a native `input type="time"`
- Not registered with `harmony-form-layout` — use `<harmony-date-input type="time">` for the form field
