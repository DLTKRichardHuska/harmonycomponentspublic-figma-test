# Accordion

Collapsible sections as `<harmony-accordion>` + `<harmony-accordion-item>` (open Shadow DOM).

## Usage

```html
<harmony-accordion label="Settings">
  <harmony-accordion-item title="Profile" open>
    Profile content…
  </harmony-accordion-item>
  <harmony-accordion-item title="Billing">
    Billing content…
  </harmony-accordion-item>
</harmony-accordion>

<harmony-accordion allow-multiple>
  <harmony-accordion-item title="One" open>A</harmony-accordion-item>
  <harmony-accordion-item title="Two" open>B</harmony-accordion-item>
</harmony-accordion>
```

## Attributes

### `harmony-accordion`

| Attribute | Values | Default |
|-----------|--------|---------|
| `allow-multiple` | boolean | false |
| `label` | string | — |

### `harmony-accordion-item`

| Attribute | Values | Default |
|-----------|--------|---------|
| `title` | string | — |
| `open` | boolean | false |
| `disabled` | boolean | false |

## Events

- `toggle` on item — `{ open: boolean }` (bubbles, composed). Parent closes siblings when not `allow-multiple`.

## Parts

- Accordion: `label`, `surface`
- Item: `trigger`, `icon`, `panel`

## Accessibility

Item trigger is a button with `aria-expanded` / `aria-controls`. Optional accordion `label` sets `role="group"` + `aria-label`. Forced-colors: shadow-local.

## Notes

- No Astro `items[]` / named slots — nest items and use the default slot for body
- No public document `.accordion` recipe
