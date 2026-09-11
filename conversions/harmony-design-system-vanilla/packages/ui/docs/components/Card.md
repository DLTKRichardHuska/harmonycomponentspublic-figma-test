# Card

Harmony content cards are **native-first**. Product `styles.css` styles the BEM `.card` recipe. Optional `<harmony-card>` maps attributes and light-DOM slot markers onto the same classes (light DOM).

## Native recipe

**Base:** `.card` on `article`, `div`, or `a`. When the host is an `<a>`, the recipe sets `color: inherit` and `text-decoration: none` so link defaults do not restyle the card.

**Modifiers** (combinable):

| Class | Role |
|-------|------|
| `.card--elevated` | Larger shadow |
| `.card--interactive` | Hover + pointer (CSS only — make the host a real control yourself) |
| `.card--primary` | 6px top border in theme primary |

**Regions:**

| Class | Role |
|-------|------|
| `.card__header` | Header row |
| `.card__header-content` | Title / subtitle column |
| `.card__header-title` | Title (`h2`) |
| `.card__header-subtitle` | Subtitle |
| `.card__header-actions` | Action row |
| `.card__body` | Body |
| `.card__footer` | Footer action row (`display: flex`; `gap: var(--space-2)`) |
| `.card__title` / `.card__subtitle` | Alternate title styles (body use) |

Header actions **compose catalog Button** — ghost icon-only xs. There is **no** `.card__icon-btn`.

```html
<article class="card card--elevated card--primary">
  <div class="card__header">
    <div class="card__header-content">
      <h2 class="card__header-title">Featured Card</h2>
      <p class="card__header-subtitle">Optional description</p>
    </div>
    <div class="card__header-actions">
      <button class="btn--ghost btn--icon-xs" type="button" aria-label="Close">
        <harmony-icon name="x-mark" size="sm"></harmony-icon>
      </button>
    </div>
  </div>
  <div class="card__body"><p>Body</p></div>
  <div class="card__footer">
    <button type="button">Continue</button>
  </div>
</article>

<a class="card card--interactive" href="/details">
  <div class="card__body">Whole card as a link</div>
</a>

<div
  class="card card--interactive"
  role="button"
  tabindex="0"
  aria-label="Open details"
>
  <div class="card__body">Button-like host — handle Enter/Space in your app</div>
</div>
```

## Hybrid helper — `<harmony-card>`

Light-DOM Custom Element. The host **is** the styled surface (`.card` + modifiers). Document CSS styles it; Shadow hosts must adopt `cardSheet` (and usually `buttonSheet` when rendering header actions).

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `elevated` | boolean | false | Larger shadow |
| `interactive` | boolean | false | Hover CSS **plus** `role="button"`, focus, Enter/Space → `click` |
| `primary` | boolean | false | Primary top border |
| `title` | string | — | Header title when no `slot="header"` (also HTML tooltip) |
| `subtitle` | string | — | Header subtitle when no `slot="header"` |

**Light-DOM slot markers** (same names as Astro; not Shadow DOM assignment):

| Marker | Destination |
|--------|-------------|
| (unmarked) | `.card__body` |
| `slot="header"` | Custom header (wins over `title` / `subtitle`) |
| `slot="header-actions"` | `.card__header-actions` |
| `slot="footer"` | `.card__footer` |

```html
<harmony-card elevated primary title="Featured Card" subtitle="Optional description">
  <button slot="header-actions" class="btn--ghost btn--icon-xs" type="button" aria-label="Close">
    <harmony-icon name="x-mark" size="sm"></harmony-icon>
  </button>
  <p>Body</p>
  <button slot="footer" type="button">Continue</button>
</harmony-card>

<harmony-card interactive title="Click Me">
  <p>Keyboard activates the host.</p>
</harmony-card>
```

### Interactive a11y

When `interactive` is set, the helper applies button semantics (`role="button"`, `tabindex="0"` unless already set, Enter/Space → `click`). Clearing `interactive` removes helper-owned role/tabindex. **Do not** nest header/footer controls inside an interactive card.

### `title` attribute note

`title` is also the HTML global tooltip attribute — the heading string appears as a browser tooltip unless you use `slot="header"` instead.

## Shadow DOM hosts

```js
import {
  typographySheet,
  buttonSheet,
  cardSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';

class MyPanel extends HarmonyElement {
  static styles = [typographySheet, buttonSheet, cardSheet, ownSheet];
}
```

## Accessibility

- Heading hierarchy in the header
- Native interactive cards must be a real control: `<a class="card card--interactive">` for navigation, or `role="button"` + `tabindex="0"` (and Enter/Space handlers) on a non-link host
- Icon-only header actions need `aria-label`
- Forced-colors: product `styles.css` / `cardSheet` keep borders when shadows drop

## Omissions / gaps

- No Astro `icon1` / `icon2` / `icon3` — compose ghost icon-only buttons
- No `.card__icon-btn` (muted Astro chrome delta accepted)
- Kanban Card / CP Kanban are separate catalog elements
