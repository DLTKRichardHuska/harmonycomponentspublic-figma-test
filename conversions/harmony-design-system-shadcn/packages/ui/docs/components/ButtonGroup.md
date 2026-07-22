# ButtonGroup

Harmony button shell — groups package `Button` children with default (segmented) or outline (connected strip) layout. Not stock ToggleGroup.

## Import

```tsx
import { ButtonGroup, Button, buttonGroupVariants } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

Requires `HarmonyThemeProvider` and package styles (see Getting Started).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'outline'` | `'default'` | Segmented shell vs connected outline strip |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Hint for child text size (also pass matching `size` on each `Button`) |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `className` | `string` | — | Extra classes on the group |
| `children` | `ReactNode` | — | Package `Button` elements |

## Inherited / stack surface

Forwards `ref` and `HTMLAttributes` on the root `<div role="group">`. No custom Harmony events. Selection is expressed by child `Button` variants (e.g. selected = `variant="primary"`), not by a ToggleGroup value API.

```tsx
<ButtonGroup variant="default">
  <Button variant="primary" size="sm">Day</Button>
  <Button variant="ghost" size="sm">Week</Button>
  <Button variant="ghost" size="sm">Month</Button>
</ButtonGroup>
```

Also export `buttonGroupVariants` for composing the same shell styles.

## Behavior notes

- **Children:** intended for package `Button` (`button` / `a` roots). Group CSS targets `&>button` / `&>a` via `data-variant`.
- **Default:** padded bordered shell; **child borders are stripped** — only the shell has a border. Unselected (non-`primary`) children use flat `input-bg` + secondary text; selected = `variant="primary"`.
- **Outline:** connected strip (shared edges). Horizontal stacks to full-width column below 768px (reference responsive).
- **Do not use ToggleGroup** for Harmony segmented selection.
- **Outline:** flush connected borders; first/last corners rounded; vertical orientation adjusts join edges.
- **Not ToggleGroup:** do not import Radix/shadcn ToggleGroup for this pattern.

## Composition recipes

```tsx
<ButtonGroup variant="outline" size="md" orientation="horizontal">
  <Button variant="outline" size="md">Left</Button>
  <Button variant="outline" size="md">Center</Button>
  <Button variant="outline" size="md">Right</Button>
</ButtonGroup>

<ButtonGroup variant="default" orientation="vertical">
  <Button variant="primary" size="sm">List</Button>
  <Button variant="ghost" size="sm">Board</Button>
</ButtonGroup>
```

## If you were about to use stock shadcn Button Group / ToggleGroup

| Stock shadcn | Harmony |
|--------------|---------|
| `ToggleGroup` + `ToggleGroupItem` | `ButtonGroup` + child `Button` variants |
| Pressed/selected on the group | Child `variant="primary"` (or outline styling) |
| `ButtonGroup` CLI (if present) with Lucide | Package `ButtonGroup` + package `Button` `icon` |
| Orientation / size on items only | Group `orientation` / `size` + matching child `Button` `size` |

## Do not

- Use ToggleGroup / ToggleGroupItem for Harmony segmented controls
- Put non-`Button` interactive children and expect joined styling
- Expect the group to manage selection state — keep that in your app and set child variants
