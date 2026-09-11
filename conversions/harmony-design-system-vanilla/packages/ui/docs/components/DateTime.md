# Date and time defaults

App-wide locale and 12/24-hour defaults, plus `Date` helpers for Harmony date controls. Machine values on the wire stay ISO strings (`YYYY-MM-DD`, `HH:MM`, `YYYY-MM-DDTHH:MM`, `YYYY-MM`, `YYYY-Www`).

## Defaults

```js
import {
  setDateTimeDefaults,
  getDateTimeDefaults,
  initDateTimeDefaults,
} from '@dltkrichardhuska/harmony-design-system-vanilla/datetime';

setDateTimeDefaults({ locale: 'fr-FR', timeFormat: '12' });
// or seed from <html data-harmony-locale="fr-FR" data-harmony-time-format="12">
initDateTimeDefaults();
```

Optional document attributes on `<html>`:

| Attribute | Values |
|-----------|--------|
| `data-harmony-locale` | BCP 47 |
| `data-harmony-time-format` | `12` \| `24` |

Resolution on each control (do not write the resolved default back onto the element attribute):

1. Explicit element attribute (`locale`, `time-format`, or TimePicker `format`)
2. `setDateTimeDefaults()`
3. Document `data-harmony-*`
4. Built-in `en-US` / `24`

Changing defaults dispatches `harmony-datetime-defaults` on `document`. Connected date elements re-paint.

Omit `locale` / `time-format` / `format` on controls to inherit the app default. Per-control attrs still win.

## `valueAsDate` and helpers

Every date control exposes HTMLInputElement-like `valueAsDate` (`Date | null`):

- `harmony-date-input`
- `harmony-date-picker`
- `harmony-time-picker` — local calendar day `1970-01-01` plus the clock
- `harmony-datetime-picker`
- `harmony-month-picker` — first of the month
- `harmony-week-picker` — Monday of the ISO week

```js
import {
  getDateValue,
  setDateValue,
  getMachineValue,
  setMachineValue,
  formatDisplay,
} from '@dltkrichardhuska/harmony-design-system-vanilla/datetime';

const field = document.querySelector('harmony-date-input');
field.valueAsDate = new Date(2024, 0, 15);
const d = getDateValue(field); // same as field.valueAsDate
setMachineValue(field, '2024-01-15');
formatDisplay('2024-01-15', 'date', 'en-US'); // "Jan 15, 2024"
```

Setting `valueAsDate` / `setDateValue` updates `value`. On `harmony-date-input` it also updates form association and emits `input` / `change`. On widgets it emits the matching `*-select` event when the machine value changes.

## Adapter (future libraries)

The first ship uses native `Date` + `Intl` only. Swap later without changing markup:

```js
import { setDateTimeAdapter, createNativeAdapter } from '@dltkrichardhuska/harmony-design-system-vanilla/datetime';

setDateTimeAdapter({
  toDate(machine, type) { /* Date | null */ },
  fromDate(date, type) { /* machine string */ },
  formatDisplay(machine, type, locale) { /* display string */ },
});

// restore built-in:
setDateTimeAdapter(createNativeAdapter());
```

Luxon, Day.js, and date-fns adapters are **not** shipped in this package yet.

## Static kit

Product `elements.js` / `index.js` re-export the same helpers from `./datetime.js` (copied next to `theme.js`).
