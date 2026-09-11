# Icon

`<harmony-icon>` renders the bundled Heroicons 24/outline set and Harmony-owned custom SVGs. It uses `currentColor`, so set `color` on the host or an ancestor.

```html
<harmony-icon name="home"></harmony-icon>
<harmony-icon name="check-circle" size="lg"></harmony-icon>
<harmony-icon name="information-circle" label="Information"></harmony-icon>
```

## API

- `name`: bundled or app-registered icon name.
- `size`: `xs` (12px), `sm` (16px), `md` (20px, default), `lg` (24px), or `xl` (32px).
- `label`: optional accessible name. Without it, the host is decorative (`aria-hidden="true"`).
- Native host `class`, `className`, and `classList` work normally; classes are not copied into Shadow DOM.
- Default slot: raw SVG override, with precedence over `name`.
- CSS parts: `svg`, `fallback`.

```html
<harmony-icon name="home" class="navigation-icon"></harmony-icon>
<harmony-icon size="lg" label="Custom status">
  <svg viewBox="0 0 24 24"><path d="..." /></svg>
</harmony-icon>
```

## `registerIcons(map)`

Use this helper for **app-owned glyphs that should resolve by `name`**. It is the production path for extra icons (brand marks, domain glyphs, a local replacement for a bundled name). Do **not** put `heroicons` or Node in the consumer app — the kit already ships the outline set.

Call it once at app startup, after importing the product `/elements` module (or after the static `elements.js` script). A `Map` or a plain object is accepted.

```js
import {
  registerHarmonyElements,
  registerIcons,
} from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';

registerHarmonyElements();
registerIcons({
  'my-glyph':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3 21 12 12 21 3 12Z"/></svg>',
});
```

Static kit (relative ESM, no package specifier):

```js
import { registerIcons } from '/vendor/harmony/elements.js';

registerIcons({
  'my-glyph': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3 21 12 12 21 3 12Z"/></svg>',
});
```

Then:

```html
<harmony-icon name="my-glyph" size="lg"></harmony-icon>
```

### Lookup order

1. Default slot (raw SVG) — wins even if `name` is set  
2. `registerIcons()` map  
3. Bundled Harmony custom SVGs  
4. Bundled Heroicons 24/outline  
5. `?` fallback (`part="fallback"`)

Registering `home` therefore replaces the bundled Heroicon for every `<harmony-icon name="home">` on the page. Slotted SVG still wins for that instance.

### Markup rules

- Each value must be a **string** of SVG markup whose first SVG element is `<svg>`. Fragments without an `<svg>` root throw `TypeError`.
- Empty names, non-string values, and invalid markup throw `TypeError` (`Icon "<name>" must be a name mapped to valid SVG markup.`).
- Prefer `viewBox="0 0 24 24"` and `currentColor` for `fill` / `stroke` so size tokens and host `color` apply. Width/height on the SVG are stripped at render time.
- Markup is treated as **trusted but sanitized**: `script`, `foreignObject`, `iframe`, `object`, `embed`, `on*` handlers, and `javascript:` hrefs are removed. Do not register untrusted user-authored SVG.
- Register only glyphs you own or are licensed to redistribute. Heroicons remain MIT-attributed in this package; app glyphs are the app’s responsibility.

### Runtime behavior

- Later calls **merge**. The same name **replaces** the previous app registration.
- Connected `<harmony-icon>` instances refresh immediately after a successful call.
- Registration is **global to the document** (one map for all product stylesheets on the page).
- There is no unregister API; replace a name with new markup, or stop using that `name`.

Choose **slot** when the SVG is one-off markup in the template. Choose **`registerIcons`** when many instances should share a name.

## Accessibility and forced colors

Icons are presentational and not focusable. Keep icons inside controls decorative and put the accessible name on the control. Use `label` only when the icon itself conveys standalone content. The Shadow DOM uses `currentColor` and maps to `CanvasText` in forced-colors mode.

## Intentional omissions

Outline only: there is no `variant`, Tabler webfont, runtime `heroicons` dependency, or `product` attribute.

Heroicons is MIT licensed: https://github.com/tailwindlabs/heroicons
