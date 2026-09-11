# Typography — Harmony Vanilla foundation

Three ways to apply a type style, all shipped in the product stylesheet: **HTML tags**, **`.text-*` classes**, and **CSS variables**.

## Consume

Load **Figtree**, **Lexend**, and **JetBrains Mono** in the host document, then the product stylesheet. That file is the reset plus Harmony type — plain HTML is styled for you.

```html
<h1>Page title</h1>            <!-- Heading XL -->
<p>Body copy.</p>              <!-- Body Default -->
<div class="text-overline">Featured</div>
<span class="text-caption">Updated 2 hours ago</span>
```

```css
/* Or compose the variables in your own rule */
.custom-title {
  font-family: var(--font-display);
  font-size: var(--heading-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}
```

## Type styles

| Type style | Tag | Class | Size | Weight | Line height | Font |
|------|-----|-------|------|--------|-------------|------|
| Display XL | — | `.text-display-xl` | `--display-xl` | `--font-bold` | `--leading-tight` | `--font-display` |
| Display L | — | `.text-display-l` | `--display-l` | `--font-bold` | `--leading-tight` | `--font-display` |
| Display M | — | `.text-display-m` | `--display-m` | `--font-bold` | `--leading-tight` | `--font-display` |
| Heading XL | `<h1>` | `.text-heading-xl` | `--heading-xl` | `--font-semibold` | `--leading-snug` | `--font-display` |
| Heading L | `<h2>` | `.text-heading-l` | `--heading-l` | `--font-semibold` | `--leading-snug` | `--font-display` |
| Heading M | `<h3>` | `.text-heading-m` | `--heading-m` | `--font-semibold` | `--leading-snug` | `--font-display` |
| Heading S | `<h4>` `<h5>` `<h6>` | `.text-heading-s` | `--heading-s` | `--font-medium` | `--leading-snug` | `--font-display` |
| Body Default | `<p>` | `.text-body-default` | `--body-default` | `--font-normal` | `--leading-normal` | `--font-sans` |
| Body Emphasized | — | `.text-body-emphasized` | `--body-emphasized` | `--font-semibold` | `--leading-normal` | `--font-sans` |
| Label | `<label>` | `.text-label` | `--label` | `--font-normal` | `--leading-normal` | `--font-display` |
| Caption | `<small>` | `.text-caption` | `--caption` | `--font-normal` | `--leading-normal` | `--font-sans` |
| Overline | — | `.text-overline` | `--overline` | `--font-semibold` | `--leading-normal` | `--font-sans` |

Display styles are class-only, so hero type never lands on a page by accident. `<body>` is Body Default; `<code>`, `<pre>`, `<kbd>`, and `<samp>` are `--font-mono` at `--text-sm`; `<strong>` and `<b>` are `--font-semibold`.

Also shipped: `.font-sans|display|mono`, `.text-xs|sm|base|lg|xl|2xl|3xl|4xl|5xl`, `.font-light|normal|medium|semibold|bold`, `.leading-none|tight|normal|relaxed`.

## Shadow DOM

Document CSS does not pierce Shadow DOM. Adopt `typographySheet` to get the same tag defaults and classes inside an element, listing it first so element styles win:

```js
import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';

class MyPanel extends HarmonyElement {
  static styles = [typographySheet, ownSheet];
}
```

## Don’t

- Do not assume fonts are bundled in the CSS kit — apps must load them.
- Do not pick a tag for its size. Pick the tag for meaning, then add a class: `<h1 class="text-heading-m">` is fine.
