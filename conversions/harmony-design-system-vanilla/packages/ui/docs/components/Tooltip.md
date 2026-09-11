# Tooltip

Informational popup on hover/focus as `<harmony-tooltip>` (open Shadow DOM).

## Usage

```html
<harmony-tooltip text="This is a tooltip">
  <harmony-button variant="outline">Hover me</harmony-button>
</harmony-tooltip>

<harmony-tooltip position="bottom">
  <harmony-button variant="outline">Hover me</harmony-button>
  <span slot="content">More <strong>detail</strong></span>
</harmony-tooltip>
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `text` | string | — |
| `position` | top \| bottom \| left \| right | top |
| `corner-variant` | top \| bottom \| left \| right | — |

## Slots

- **default** — trigger element (button, icon control, text, …)
- **`content`** — rich HTML tip body; wins over `text`

## Parts

`content` — tip bubble (absolute positioned; decorative `aria-hidden`)

## Accessibility

- Shows on `:host(:hover)` and `:host(:focus-within)`
- **Escape** dismisses until the next hover/focus (WCAG 1.4.13)
- Trigger associated via `ariaDescribedByElements` when supported, plus a light-DOM description node for `aria-describedby` IDREFs
- Forced-colors: shadow-local border/Canvas colors

## Notes

- No public document `.tooltip` recipe (CE-only)
- Absolute CSS positioning (reference parity) — not Popover / CSS anchor this version
- No show delay, click-to-pin, or touch-only open
