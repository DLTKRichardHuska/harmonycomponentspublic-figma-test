# Chip

Harmony filter / tag control — fill or outline chips, overflow `+N`, and decorative dots types. No stock shadcn Chip.

## Import

```tsx
import { Chip, chipVariants } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

Requires `HarmonyThemeProvider` and package styles (see Getting Started).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height / padding |
| `variant` | `'fill' \| 'outline'` | `'fill'` | Visual style |
| `type` | `'chip' \| 'horiz-dots' \| 'vert-dots' \| 'overflow'` | `'chip'` | Content mode |
| `overflowCount` | `number` | `10` | Shown as `+N` when `type="overflow"` |
| `label` | `string` | `'Chip'` | Label when no `children` (`type="chip"`) |
| `icon` | `string` | — | Harmony `Icon` name (chip / overflow only) |
| `removable` | `boolean` | `false` | Show remove control (`x-mark`) |
| `onRemove` | `(event) => void` | — | Remove control handler |
| `disabled` | `boolean` | `false` | Disables interaction / muted styles |
| `onClick` | handler | — | Native click on chip button (`chip` / `overflow`) |
| `className` | `string` | — | Extra classes |
| `children` | `ReactNode` | — | Label override for `type="chip"` |

## Inherited / events / polymorphism

| Mode | Element | Surface |
|------|---------|---------|
| `type="chip"` / `"overflow"` | `<button type="button">` | `ButtonHTMLAttributes` — `onClick`, `onFocus`, … (Harmony `type` is chip mode, not native `type`) |
| `type="horiz-dots"` / `"vert-dots"` | `<span>` | Presentational — no `onClick` / `removable` / `icon` |

```tsx
<Chip label="Filters" icon="funnel" onClick={() => open()} />
<Chip type="overflow" overflowCount={5} variant="outline" />
<Chip type="horiz-dots" size="sm" />
```

Also export `chipVariants` for composition.

## Behavior notes

- **Removable:** stopPropagation so remove does not fire chip `onClick`; keyboard Enter/Space on the remove control calls `onRemove`.
- **Dots types:** decorative “more” glyphs only — not interactive.
- **Selected / static:** not part of this API — omit those Astro states; drive selection in the parent (e.g. swap `variant` or surrounding layout).

## Composition recipes

```tsx
<div className="flex flex-wrap gap-2">
  <Chip variant="fill" label="Active" />
  <Chip variant="outline" icon="tag" label="Tag" removable onRemove={() => {}} />
  <Chip type="overflow" overflowCount={12} />
  <Chip type="vert-dots" size="md" />
</div>
```

## If you were about to use stock shadcn…

There is no stock shadcn Chip. Do not substitute stock `Badge` or Lucide pills.

| Need | Component |
|------|-----------|
| Interactive filter / removable tag | `Chip` |
| Status label | `Badge` |
| Unread count on an icon | `NotificationBadge` |

## Do not

- Import Lucide for chip glyphs — use `icon` + Harmony names (remove uses package `x-mark`)
- Expect `selected` / `static` props — not exported
- Use `Badge` for clickable filter chips
