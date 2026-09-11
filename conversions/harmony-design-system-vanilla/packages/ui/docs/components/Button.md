# Button

Harmony buttons are **native-first**. Product `styles.css` styles built-in button controls by default; `.btn` is the opt-in class for other tags. Optional `<harmony-button>` maps attributes onto the same class recipe (light DOM).

## Native recipe

**Default-styled (no `.btn` required):**

- `<button>`
- `<input type="button">`
- `<input type="submit">`
- `<input type="reset">`

Unclassed controls look like Astro **primary** + **md**.

**Opt-in `.btn`:** other tags that should look like a button — chiefly `<a class="btn" href="…">`.

**Modifiers** work on built-ins **without** also adding `.btn`:

| Class | Role |
|-------|------|
| `.btn--primary` \| `secondary` \| `tertiary` \| `outline` \| `ghost` \| `destructive` | Variant |
| `.btn--page-header` | Page-header color set (combine with a variant) |
| `.btn--xs` \| `sm` \| `md` \| `lg` | Size |
| `.btn--icon-xs` … `icon-lg` | Icon-only square |
| `.btn--loading` | Loading (compose spinner markup yourself on native path) |
| `.btn--full` | Full width |
| `.btn--vertical` | Icon above label |
| `.btn--disabled` / `[disabled]` | Disabled |

```html
<button type="button">Save</button>
<input type="button" value="Save" />
<input type="submit" value="Submit" />
<button type="button" class="btn--secondary">Cancel</button>
<a class="btn btn--secondary" href="/docs">Docs</a>
<button type="button" class="btn--ghost btn--icon-md" aria-label="Edit">
  <harmony-icon name="pencil" size="sm"></harmony-icon>
</button>
```

### Composition notes

- Icons: compose `<harmony-icon>` (size map xs→xs, sm→sm, md→sm, lg→md).
- Loading (native): add `.btn--loading`, disable the control, set `aria-busy`, and include `.btn__spinner` SVG + optional text.
- `<input type="button|submit|reset">`: label is `value`. No children — no icons / spinner / vertical layout on those tags.
- Links: always use `<a class="btn …">` — do not put `href` on `<harmony-button>`.

## Hybrid helper — `<harmony-button>`

Light-DOM Custom Element. The host **is** the styled surface (`.btn` + modifiers). Document CSS styles it; Shadow hosts must adopt `buttonSheet`.

| Attribute | Values | Default |
|-----------|--------|---------|
| `variant` | primary \| secondary \| tertiary \| outline \| ghost \| destructive | primary |
| `button-type` | theme \| pageHeader | theme |
| `size` | xs \| sm \| md \| lg | md |
| `orientation` | horizontal \| vertical | horizontal |
| `disabled` | boolean | false |
| `loading` | boolean | false |
| `loading-text` | string | — |
| `icon` | harmony-icon name | — |
| `icon-position` | left \| right | left |
| `type` | button \| submit \| reset | button |
| `full-width` | boolean | false |

Default slot / light-DOM text = label. Empty label + `icon` → icon-only. `loading` injects the private spinner and disables the control.

```html
<harmony-button variant="primary">Save</harmony-button>
<harmony-button variant="ghost" icon="pencil" aria-label="Edit"></harmony-button>
<harmony-button loading loading-text="Saving…">Save</harmony-button>
```

### Form association

`formAssociated` + `ElementInternals`. This is **not** a real `HTMLButtonElement` / `HTMLInputElement`:

- `querySelector('button')` and `input[type=submit]` miss it
- Prefer native `<button type="submit">` or `<input type="submit">` when built-in form drop-ins matter
- `type="submit"` / `reset` on the helper call `requestSubmit()` / `reset()` on the associated form

No `href`. No Shadow DOM. No customized built-ins (`is=""`).

## Shadow DOM

Document `styles.css` covers light DOM. For Custom Element chrome that renders buttons inside Shadow DOM, adopt `buttonSheet` (and usually `typographySheet` first):

```js
import { typographySheet, buttonSheet } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';

class MyPanel extends HarmonyElement {
  static styles = [typographySheet, buttonSheet, ownSheet];
}
```

## Deferred

`dela` / `dela-pill` and the Stars graphic wait until foundation **Dela** is synced.

## Accessibility

- Prefer native button / input semantics
- Icon-only controls need an accessible name (`aria-label`)
- Visible `:focus-visible`; forced-colors via product CSS / `buttonSheet`
- Honor `prefers-reduced-motion` on `.btn__spinner`
