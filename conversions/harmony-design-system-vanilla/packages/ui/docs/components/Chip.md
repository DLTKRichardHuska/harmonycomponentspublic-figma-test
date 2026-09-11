# Chip

Chip for tags/filters as `<harmony-chip>` (open Shadow DOM).

## Usage

```html
<harmony-chip>Chip</harmony-chip>
<harmony-chip variant="outline" selected>Selected</harmony-chip>
<harmony-chip icon="tag" removable>Tagged</harmony-chip>
<harmony-chip type="overflow" overflow-count="12"></harmony-chip>
```

```js
chip.addEventListener('click', () => {
  chip.selected = !chip.selected; // controlled
});
chip.addEventListener('remove', () => chip.remove());
```

## Attributes

| Attribute | Values | Default |
|-----------|--------|---------|
| `size` | sm \| md \| lg | md |
| `variant` | fill \| outline | fill |
| `type` | chip \| horiz-dots \| vert-dots \| overflow | chip |
| `overflow-count` | number | 10 |
| `selected` | boolean | false |
| `removable` | boolean | false |
| `icon` | harmony-icon name | — |
| `disabled` | boolean | false |

Default slot = label (defaults to “Chip” when empty for type `chip`).

## Events

- `click` — chip body (filter/select). Remove control does **not** fire body click.
- `remove` — `CustomEvent`, bubbles + composed, when remove is activated.

## Parts

- `icon`, `remove`, `dots`

## Notes

- `selected` is controlled — consumer toggles the attribute
- No Astro `state` attribute — use `:hover` / `:focus-visible` / `:active`
- No public document `.chip` recipe
- Forced-colors: shadow-local
