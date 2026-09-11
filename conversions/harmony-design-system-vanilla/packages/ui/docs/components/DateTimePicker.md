# DateTimePicker

Combined date and time widget as `<harmony-datetime-picker>` (open Shadow DOM). Not form-associated. It composes `<harmony-date-picker>` and `<harmony-time-picker>`. The form field that opens this widget is `<harmony-date-input type="datetime-local">`.

## Usage

```html
<harmony-datetime-picker value="2024-01-15T14:30" time-format="12"></harmony-datetime-picker>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `value` | `YYYY-MM-DDTHH:MM` | — |
| `min` / `max` | datetime, or date-only | — |
| `disabled` | boolean | false |
| `time-format` | `12` \| `24` | app default (`24`) — omit to inherit |
| `locale` | BCP 47 (date picker only) | app default (`en-US`) — omit to inherit |

Also supports `valueAsDate`. See [DateTime.md](DateTime.md).

`value`, `min`, and `max` split on `T`. The date half goes to the calendar. The time half is `HH:MM` (seconds are dropped). A date-only bound still limits the calendar and does not set a time bound.

## Events

| Event | Detail |
|-------|--------|
| `datetime-select` | `{ datetime }` — `YYYY-MM-DDTHH:MM`, bubbles and composed |

Fires when either half changes and the other half is already known, including a value that was set up front. Choosing only a date (or only a time) does not emit.

Child `date-select` and `time-select` still bubble and compose. They are not stopped.

## Parts

- `date` — calendar section
- `time` — time spinner section

## Accessibility

Keyboard navigation and forced-colors stay on the child widgets. The divider between date and time uses `CanvasText` under forced-colors so the sections remain distinct. This element is not a form control and has no accessible name of its own.

## Notes

- Not a form field — do not register it in `harmony-form-layout`
- No native `input type="datetime-local"` dual path
- No auto-generated id
- Same-day min/max is not tightened beyond the split (a time bound applies to every day, matching the reference split)
