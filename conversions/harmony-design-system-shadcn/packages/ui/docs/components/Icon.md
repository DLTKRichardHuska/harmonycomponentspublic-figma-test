# Icon

Harmony icon primitive — string-name API matching the reference Astro `Icon`.

## Import

```tsx
import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

Requires `HarmonyThemeProvider` (product theme for curated manifest icons).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Icon identifier |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Maps to `--icon-*` tokens (12–32px) |
| `variant` | `'outline' \| 'solid'` | `'outline'` | Heroicons outline/solid; Tabler outline/filled |
| `className` | `string` | — | Extra classes on the root |
| `product` | `'cp' \| 'ppm' \| 'vp' \| 'maconomy'` | provider product | Override manifest product |

## Resolution order

1. Product `icon-manifest` curated entry (when source hints hero/tabler/custom SVG)
2. Heroicons (`@heroicons/react/24/{outline|solid}`)
3. Tabler (`@tabler/icons-react`)
4. Custom SVG from app `public/{name}.svg`
5. `?` fallback (`--icon-fallback-*` tokens)

## Examples

```tsx
<Icon name="home" />
<Icon name="check-circle" size="lg" />
<Icon name="star" variant="solid" />
<Icon name="gantt-chart" /> {/* custom */}

<button aria-label="Edit">
  <Icon name="pencil" />
</button>
```

## Events

`Icon` is **presentational** — it does not accept or forward click handlers as a button API. It forwards `ref` to the root `<span>`. Put interaction on a parent:

```tsx
<button type="button" aria-label="Edit" onClick={onEdit}>
  <Icon name="pencil" />
</button>
```

Or use package `Button` with `icon="pencil"`.

## Accessibility

Icons render with `aria-hidden="true"`. Label the interactive parent when there is no visible text.

## If you were about to import Lucide

| Instead of Lucide… | Use Harmony `name` |
|--------------------|--------------------|
| `Home` | `home` |
| `CheckCircle` / `CircleCheck` | `check-circle` |
| `X` | `x-mark` |
| `Search` | `magnifying-glass` |
| `ChevronDown` | `chevron-down` |

Do not set stock shadcn `components.json` `iconLibrary` to `lucide` or `tabler` for Harmony apps — the CLI cannot emit this `Icon` component. Prefer package components (and, when available, a Harmony registry) that already use `<Icon name="…" />`.

## Do not

- Remap Harmony names to Lucide — shapes and identifiers differ
- Import `lucide-react`, `@heroicons/react`, or `@tabler/icons-react` at app call sites (Heroicons/Tabler are internal resolvers only)
- Assume every name is Heroicons — check Tabler / custom / manifest
