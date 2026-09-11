# Link

Harmony links are **native `<a>`**. Product reset styles unclassed anchors (color + hover underline). There is no base `.link` class and no size modifiers.

## Usage

```html
<a href="/docs">Documentation</a>

<a href="/privacy" class="link--muted">Privacy</a>

<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External
  <harmony-icon name="arrow-top-right-on-square" class="link__external-icon" size="xs"></harmony-icon>
</a>

<!-- sizes via typography -->
<a href="/docs" class="text-xs">Small</a>
<a href="/docs" class="text-sm">Medium</a>
<a href="/docs" class="text-base">Large</a>
```

## Classes

| Class | Role |
|-------|------|
| `.link--muted` | Muted color; hover → primary text |
| `.link__external-icon` | Spacing/align for composed external icon |

## Composition

- Icons inside `a` inherit `currentColor`
- Button-styled links: `<a class="btn …">` (button recipe wins; no text-link underline)
- No `harmony-link` Custom Element

## Accessibility

Native `<a>`. Forced-colors via document CSS (`LinkText`). External: announce new-tab via visible icon and/or accessible name as needed.
