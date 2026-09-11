# Consumer guide — Harmony Design System (Vanilla Web)

Frameworkless Harmony: **native HTML + CSS recipes**, optional **hybrid** Custom Element helpers, encapsulated **Custom Elements** when needed, native ESM. Built for **humans and AI**. Targets **WCAG 2.3 AA**.

## Choose a product once

| Product | npm | Static |
|---------|-----|--------|
| Costpoint | `.../cp` | `harmony-design-system-vanilla-cp.zip` |
| Vantagepoint | `.../vp` | `harmony-design-system-vanilla-vp.zip` |
| PPM | `.../ppm` | `...-ppm.zip` |
| Maconomy | `.../maconomy` | `...-maconomy.zip` |

Do **not** switch products at runtime. Toggle **light/dark** with `html.dark` or Theme JS (`initColorScheme` / `setColorScheme`).

## Install — npm

```bash
npm install @dltkrichardhuska/harmony-design-system-vanilla
```

```js
import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';
import { initColorScheme } from '@dltkrichardhuska/harmony-design-system-vanilla/theme';
initColorScheme();
```

Import the product stylesheet always. Register `/elements` when you use Custom Elements (e.g. `harmony-icon`) or hybrid helpers (see Getting Started).

## Install — static (no npm)

1. Download/build the product zip from `packages/ui/dist-static/`.
2. Copy the folder into your site (e.g. `/vendor/harmony/`).
3. Link CSS and load the module entry:

```html
<link rel="stylesheet" href="/vendor/harmony/styles.css" />
<script type="module" src="/vendor/harmony/elements.js"></script>
```

## Foundation tokens

Colors, typography, spacing, and elevations ship as **CSS custom properties** on the product stylesheet (`:root` / `.dark`). Use `var(--page-bg)`, `var(--heading-l)`, `var(--space-4)`, `var(--shadow-md)`, etc. See package `docs/foundation/`.

The same stylesheet is the app’s **CSS reset** (box-sizing, margin/padding, links, forms, tables, focus-visible, `.sr-only`) plus Harmony type styles. This kit is meant to be the project’s sole CSS — do not layer another reset on top.

Lists keep their markers: `ul` is disc, `ol` is decimal, both indented by `--space-6`. If you use a list for structure rather than content — a nav, a tab strip, a menu — set `list-style: none` on it in your own styles.

Use its semantic color tokens (`--page-bg`, `--card-bg`, `--text-*`, `--border-color`, `--theme-primary`) and spacing primitives (`--space-*`, `--radius-*`, `--border-width-*`) in app-owned CSS rather than literal color or spacing values.

There is **no** JS/JSON token module and **no** foundation Custom Elements.

## Fonts

Load **Figtree**, **Lexend**, and **JetBrains Mono** in the host page.

## Color scheme

- CSS SSOT: class `dark` on `html`.
- `initColorScheme()` uses `prefers-color-scheme` when no saved preference exists.
- After a user choice, call `persistColorScheme(mode)` so the override wins over the OS.
- Storage key: `harmony-color-scheme`.

## Forced colors / Windows High Contrast

Product `styles.css` includes an `@media (forced-colors: active)` layer that remaps semantic tokens to CSS system colors (`Canvas`, `CanvasText`, `Highlight`, `LinkText`, `GrayText`, …).

- **No Theme JS call** — the OS media query is enough.
- Host apps inherit HC support by loading the product stylesheet.
- Custom host CSS must not hard-code colors that fight system colors under forced-colors.
- Keep non-color state cues (borders, outlines, icons, text) for selected / disabled / error.
- Native HTML and light-DOM hybrid helpers inherit HC from the product stylesheet.
- Shadow DOM components need **local** `@media (forced-colors: active)` rules; document styles do not pierce shadow roots.

## Icons

`<harmony-icon>` includes the full Heroicons 24/outline set and Harmony custom SVGs without a runtime dependency. It inherits `currentColor`.

```html
<harmony-icon name="home"></harmony-icon>
<harmony-icon name="check-circle" size="lg"></harmony-icon>
```

Add app-owned names with `registerIcons` from the chosen product `/elements` subpath (or from the static kit’s `elements.js`). Register **trusted** SVG strings that include an `<svg>` root; prefer `currentColor` and a 24×24 `viewBox`. Lookup order is: slotted SVG → `registerIcons` → Harmony custom → Hero outline → `?`.

```js
import { registerIcons } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';

registerIcons({
  'my-glyph':
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3 21 12 12 21 3 12Z"/></svg>',
});
```

Full helper contract (markup rules, merge/replace, errors): package `docs/components/Icon.md`.

Heroicons is distributed under the MIT License: https://github.com/tailwindlabs/heroicons

## Buttons

Product `styles.css` styles `<button>` and `input[type=button|submit|reset]` by default (primary + md). Use `.btn` on other tags (chiefly `<a class="btn">`). Optional `<harmony-button>` maps attributes to the same classes (light DOM, formAssociated). Dela variants are deferred until foundation Dela ships.

```html
<button type="button">Save</button>
<a class="btn btn--secondary" href="/docs">Docs</a>
<harmony-button variant="primary" icon="plus">Add</harmony-button>
```

Shadow hosts that render buttons must adopt `buttonSheet`. Full contract: package `docs/components/Button.md`.

## Cards

Product `styles.css` styles the BEM `.card` recipe. Optional `<harmony-card>` maps attributes and light-DOM slot markers (`header`, `header-actions`, `footer`) onto the same classes. Header actions compose ghost icon-only buttons. `interactive` on the CE sets `role="button"` and Enter/Space activation.

```html
<article class="card card--elevated">
  <div class="card__body">Native card</div>
</article>
<harmony-card primary title="Featured">Body</harmony-card>
```

Shadow hosts that render cards must adopt `cardSheet`. Full contract: package `docs/components/Card.md`.

## AI agents

Point Cursor/agents at `AGENTS.md` in the package or unzipped kit. Thin rule:

```text
Use Harmony Vanilla from AGENTS.md (product subpath or static kit). Prefer native HTML + CSS recipes; use Custom Elements when the catalog map says so; no React/Lit; WCAG 2.3 AA.
```

## App-level a11y (your responsibility)

Shipped surfaces target WCAG 2.3 AA. Your page still needs `lang`, skip links, document title, and correct landmark structure.
