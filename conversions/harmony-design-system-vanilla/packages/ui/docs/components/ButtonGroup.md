# ButtonGroup

Segmented button clusters are **native-first**. Product `styles.css` styles `.btn-group`. Optional `<harmony-button-group>` maps attributes onto the same class recipe (light DOM).

## Native recipe

**Base:** `.btn-group` on a container (`div`, etc.).

| Class | Role |
|-------|------|
| `.btn-group--default` \| `outline` | Variant |
| `.btn-group--sm` \| `md` \| `lg` | Size (sizes child buttons) |
| `.btn-group--horizontal` \| `vertical` | Orientation |

Compose children as Harmony buttons: unclassed `<button>`, button-type `<input>`, `.btn`, or `<harmony-button>`. Use `.btn--primary` / `.btn--selected` for the active segment.

```html
<div class="btn-group btn-group--default btn-group--md btn-group--horizontal" role="group">
  <button type="button" class="btn--primary">Left</button>
  <button type="button">Center</button>
  <button type="button">Right</button>
</div>
```

## Hybrid helper — `<harmony-button-group>`

Light-DOM Custom Element. The host **is** the styled surface (`.btn-group` + modifiers). Sets `role="group"` when missing. Document CSS styles it; Shadow hosts must adopt `buttonGroupSheet` (and usually `buttonSheet`).

| Attribute | Values | Default |
|-----------|--------|---------|
| `variant` | default \| outline | default |
| `size` | sm \| md \| lg | md |
| `orientation` | horizontal \| vertical | horizontal |

Default slot = button children (compose as normal HTML).

```html
<harmony-button-group variant="default" size="md">
  <button type="button" class="btn--selected">Day</button>
  <button type="button">Week</button>
  <button type="button">Month</button>
</harmony-button-group>
```

## Notes

- No Shadow DOM on the helper
- Forced-colors: product CSS / `buttonGroupSheet`
- Adopt `buttonGroupSheet` (+ `buttonSheet`) inside Shadow DOM hosts that render groups
