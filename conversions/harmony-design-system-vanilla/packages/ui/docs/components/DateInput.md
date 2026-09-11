# DateInput

Form-associated date and time field as `<harmony-date-input>` (open Shadow DOM). It composes `<harmony-picker-popup>` and the synced picker widgets. It is not a native `input type="date"`.

Register with the product elements module, then place the field in a form or in `<harmony-form-layout>`.

## Usage

```html
<harmony-date-input id="start" name="start" label="Start" type="date" required></harmony-date-input>

<harmony-date-input type="time" time-format="12" value="14:30"></harmony-date-input>

<form>
  <harmony-form-layout label-layout="inline">
    <harmony-form-row>
      <harmony-input id="name" name="name" label="Name"></harmony-input>
      <harmony-date-input id="start" name="start" label="Start" type="date" required></harmony-date-input>
    </harmony-form-row>
  </harmony-form-layout>
</form>
```

Set `id` yourself. There is no auto-id. Inside `harmony-form-layout`, the layout reads `label` and wires `for` to that id. The field’s own shadow label hides.

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `type` | `date` \| `time` \| `datetime-local` \| `month` \| `week` | `date` |
| `value` | machine string | — |
| `name` | form name | — |
| `id` | consumer id | — |
| `min` / `max` | same shape as `value` | — |
| `disabled` | boolean | false |
| `required` | boolean | false |
| `label` | string | — |
| `label-variant` | `inline` \| `stacked` | stacked (CP kits: inline when unset; ignored inside `harmony-form-layout`) |
| `time-format` | `12` \| `24` | app default (`24`) — omit to inherit |
| `locale` | BCP 47 | app default (`en-US`) — omit to inherit |

Omit `locale` / `time-format` to inherit [app defaults](DateTime.md). Machine `value` stays ISO; use `valueAsDate` or helpers from `/datetime` for `Date` values.

`type` picks the popup widget: `harmony-date-picker`, `harmony-time-picker`, `harmony-datetime-picker`, `harmony-month-picker`, or `harmony-week-picker`. `value`, `min`, `max`, `disabled`, and `locale` are forwarded. `time-format` maps to `format` on the time widget and `time-format` on the datetime widget only.

## Value

The visible field is a readonly text control. Its text is locale-formatted (`Jan 15, 2024`, `14:30`, `Jan 15, 2024 14:30`, `January 2024`, `2024, Week 3`). Placeholders: Select date, Select time, Select date & time, Select month, Select week.

The `value` attribute, the `value` property, and the submitted form value stay the machine string:

| `type` | Machine value |
|--------|----------------|
| `date` | `YYYY-MM-DD` |
| `time` | `HH:MM` |
| `datetime-local` | `YYYY-MM-DDTHH:MM` |
| `month` | `YYYY-MM` |
| `week` | `YYYY-Www` |

`time-format` changes the popup clock only. Field text stays 24-hour.

## Events

| Event | Detail |
|-------|--------|
| `input` | machine value (string), bubbles and composed |
| `change` | machine value (string), bubbles and composed |

There is no second public picker event on the field. Child `date-select` / `time-select` / `datetime-select` / `month-select` / `week-select` stay on the widgets.

The popup opens on field click, icon click, Enter, Space, or ArrowDown. Date, month, and week close after a selection. Time and datetime stay open. Escape and light dismiss stay on the Popover API.

## Parts

- `field` — readonly text control
- `icon` — calendar or clock button (`clock` when `type="time"`)
- `popup` — anchored picker popup

## Form association

`formAssociated` + `ElementInternals` + `delegatesFocus`. The host is **not** an `HTMLInputElement`. The shadow text input has no `name`, so it does not double-submit. `required` sets internals validity (`valueMissing`) and the required mark. `disabled` blocks open and forwards to the widget and icon button.

Inside `<harmony-form-layout>`, this field is detected the same way as `<harmony-input>`. The layout label column and required asterisk line up with other fields.

## Accessibility

The field is a readonly textbox with an accessible name from `label` or the placeholder. The icon button is named `Open` plus that placeholder. Keyboard navigation inside the popup stays on the child widgets.

Forced-colors (shadow-local): focus on the field is `outline: 2px solid Highlight`. Disabled field and icon use `GrayText` and a border, not hue or opacity alone.

## Notes

- Not a native `input type="date"` (or time / datetime-local / month / week)
- No `error` attribute
- No `labelFor` (use `id` plus the layout, or `label`)
- No automatic CP inline labels — set `label-variant` or use `harmony-form-layout`
- Date range pickers are not part of this field
