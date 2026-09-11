# PickerPopup

Anchored picker popover as `<harmony-picker-popup>` (open Shadow DOM, Popover API). Not a form control and not `<harmony-dialog>`.

## Usage

```html
<button type="button" id="open-date">Choose date</button>
<harmony-picker-popup for="open-date" title="Select date">
  <harmony-date-picker></harmony-date-picker>
</harmony-picker-popup>
```

The `for` attribute is the trigger element’s id in the same document or shadow root. `popover="auto"` supplies Escape and light dismiss. The popup anchors under the trigger (`anchor-name`); if CSS anchor positioning is unavailable, it uses fixed positioning.

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `for` | trigger element id | — |
| `open` | boolean (reflected) | false |
| `title` | string | — (hides the header when empty) |

## Methods

- **`show()`** — open the popover and focus the slotted picker
- **`hide()`** — close the popover

## Events

| Event | Detail |
|-------|--------|
| `toggle` | `{ open }` — bubbles and composed |

## Slots and parts

- Default slot — picker content (`harmony-date-picker`, and so on)
- `panel` — popup surface

## Accessibility

`role="dialog"` without `aria-modal` (the popover is non-modal). The trigger gets `aria-haspopup`, `aria-controls`, and `aria-expanded`. Forced-colors: shadow-local Canvas/CanvasText panel; close control uses Highlight focus.

## Notes

- No public `.picker-popup` document recipe
- Do not hardcode a date-field wrapper — any id can be the trigger
- The form field is `<harmony-date-input>`, which places this popup in its own shadow root
