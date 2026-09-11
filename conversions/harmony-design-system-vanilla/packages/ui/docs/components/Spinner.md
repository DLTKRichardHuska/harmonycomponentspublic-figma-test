# Spinner

Loading indicator as `<harmony-spinner>` (open Shadow DOM).

## Usage

```html
<harmony-spinner></harmony-spinner>
<harmony-spinner size="sm"></harmony-spinner>
<harmony-spinner size="lg" label="Loading content"></harmony-spinner>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `size` | sm \| md \| lg | md |
| `label` | string | Loading |

## Parts

- `spinner` — animated ring

## Accessibility

`ElementInternals` sets `role="status"` and `aria-label` from `label`. Screen-reader text announces loading. Forced-colors: CanvasText ring with Highlight top segment.

## Notes

- No public document `.spinner` recipe — CE is the surface
- Determinate progress uses `<harmony-progress>` instead
- Adopt `spinnerSheet` only if another Shadow host needs the same visuals
