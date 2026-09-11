# Elevations — Harmony Vanilla foundation

Shadow tokens for depth. Light and dark values live in `:root` / `.dark` of the product stylesheet.

## Consume

```css
box-shadow: var(--shadow-md);
```

Tokens: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-2xl`, plus `--shadow-dropdown` where needed.

## Don’t

- Do not hard-code shadow RGBA that diverges from the product kit.
- Toggle mode via `html.dark` / Theme JS — not a separate elevation API.
