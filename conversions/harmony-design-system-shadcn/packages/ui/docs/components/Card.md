# Card

Harmony content card — stock [shadcn Card](https://ui.shadcn.com/docs/components/card) compound pieces with Harmony tokens and optional convenience `title` / `description`.

## Import

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  cardVariants,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

Requires `HarmonyThemeProvider` and package styles (see Getting Started).

## Props (root `Card`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `elevated` | `boolean` | `false` | Larger shadow |
| `interactive` | `boolean` | `false` | Hover + pointer; default `role="button"` / `tabIndex={0}` |
| `primary` | `boolean` | `false` | 6px top border in theme primary |
| `title` | `string` | — | Convenience — auto `CardHeader`/`CardTitle` when not composing `CardHeader` |
| `description` | `string` | — | Convenience subtitle |
| `asChild` | `boolean` | `false` | Radix Slot |
| `className` | `string` | — | Extra classes |
| `children` | `ReactNode` | — | Body (convenience) or full compound tree |

### Compound exports

| Export | Role |
|--------|------|
| `CardHeader` | Header row |
| `CardTitle` | Title (`h2`; `asChild` supported) |
| `CardDescription` | Subtitle |
| `CardAction` | Top-right actions |
| `CardContent` | Body |
| `CardFooter` | Footer |
| `cardVariants` | `cva` shell |

## Inherited / events

Each piece forwards `ref` + `HTMLAttributes`. Root may use native `onClick` when `interactive`. Prefer `asChild` with `<a>` / `<button>` for navigation.

## Examples

```tsx
{/* Convenience */}
<Card title="Card Title" description="Subtitle" elevated>
  Body content
</Card>

{/* Compound + actions */}
<Card primary>
  <CardHeader>
    <div className="flex flex-1 flex-col gap-1">
      <CardTitle>Featured</CardTitle>
      <CardDescription>Optional description</CardDescription>
    </div>
    <CardAction>
      <Button type="button" variant="ghost" size="sm" icon="x-mark" aria-label="Close" />
    </CardAction>
  </CardHeader>
  <CardContent>Body</CardContent>
  <CardFooter>
    <Button type="button" size="sm">Continue</Button>
  </CardFooter>
</Card>
```

## Behavior notes

- **Precedence:** composing `CardHeader` wins over `title` / `description`.
- **Variants** combine: `elevated` + `interactive` + `primary`.
- **Icons:** use package `Button` `icon` or `<Icon name="…" />` in `CardAction` — no Astro `icon1`/`icon2`/`icon3`.

## If you were about to use stock shadcn / Lucide

- Keep compound names; add Harmony `elevated` / `interactive` / `primary`.
- Do not import Lucide — use Harmony `Icon` name strings via `Button` / `Icon`.

## Do not

- Invent Astro `withHeader` / `headerTitle` / `icon1` props on the React API (use convenience `title`/`description` or compound pieces).
- Deep-import package internals.

## Demo

`/components/cards`
