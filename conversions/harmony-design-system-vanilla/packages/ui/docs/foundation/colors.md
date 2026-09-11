# Colors — Harmony Vanilla foundation

Semantic color tokens for the chosen product stylesheet.

## Consume

**npm**

```js
import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';
```

**static zip**

```html
<link rel="stylesheet" href="/vendor/harmony/styles.css" />
```

Use CSS variables: `var(--page-bg)`, `var(--text-primary)`, `var(--theme-primary)`, `var(--color-success)`, …

## Mode

Dark tokens apply when `html` has class `dark`. Prefer `initColorScheme()` so the OS `prefers-color-scheme` is used until the user overrides.

## Windows High Contrast / forced-colors

When the OS enables forced colors (e.g. Windows Contrast Themes), the product stylesheet remaps semantic variables to system colors. No Theme API call is required. Under forced-colors:

- Surfaces use `Canvas`; text uses `CanvasText` / `GrayText`
- Actions and focus use `Highlight` / `HighlightText` and outlines
- Shadows and gradients collapse; rely on borders for elevation and state
- Pair critical meaning with icons or labels — not hue alone

## Don’t

- Do not import multi-product source `tokens.css` in apps — use a product subpath or static kit.
- Do not switch products at runtime in consumer apps.
- There is no JS color object export.
- Do not override forced-colors with hard-coded hex that removes system-color adaptation.
