# ProgressBar

Determinate progress indicator as `<harmony-progress>` (open Shadow DOM).

## Usage

```html
<harmony-progress value="42"></harmony-progress>
<harmony-progress value="60" size="sm" variant="success"></harmony-progress>
<harmony-progress value="42" show-label></harmony-progress>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `value` | number | `0` |
| `max` | number (> 0) | `100` |
| `size` | sm \| md \| lg | md |
| `variant` | default \| success \| warning \| error | default |
| `show-label` | boolean | false |

## Parts

- `track` — background track
- `bar` — filled portion (`--harmony-progress` width)
- `label` — percentage text when `show-label`

## Accessibility

`ElementInternals` sets `role="progressbar"` with `aria-valuenow` / `min` / `max`. Forced-colors: shadow-local track border + Highlight bar.

## Notes

- No HTML `<progress>` element
- No public document `.progress` recipe — CE is the surface
- Adopt `progressSheet` only if another Shadow host needs the same visuals
