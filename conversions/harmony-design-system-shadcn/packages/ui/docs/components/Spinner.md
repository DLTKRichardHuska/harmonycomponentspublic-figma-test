# Spinner

Harmony loading indicator — stock [shadcn Spinner](https://ui.shadcn.com/docs/components/base/spinner) pattern with Harmony border-ring default and optional package `Icon` override.

## Import

```tsx
import { Spinner } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

Requires `HarmonyThemeProvider` and package styles (see Getting Started).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ring size via `--space-4` / `--space-6` / `--space-10` |
| `icon` | `string` | — | Harmony `Icon` name — replaces the border ring with a spinning icon |
| `className` | `string` | — | Extra classes on the root |
| `aria-label` | `string` | `'Loading'` | Accessible name for `role="status"` |

## Inherited / stack surface

Forwards `ref` and other safe `HTMLAttributes` on the root `<span>` (e.g. `id`, `data-*`, `aria-*`). Presentational — no custom Harmony events or `asChild`.

```tsx
<Spinner />
<Spinner size="lg" aria-label="Loading content" />
<Spinner icon="arrow-path" size="sm" />
```

## Behavior notes

- **Default:** CSS border ring (`--border-color` track, `--theme-primary` accent) matching reference Astro Spinner.
- **`icon`:** package `<Icon name={icon} />` + `animate-spin` (stock customization without Lucide).
- **Reduced motion:** `motion-reduce:animate-none`.

## With Button

Two supported patterns:

```tsx
{/* Reference-style: private inline spinner via loading prop */}
<Button loading loadingText="Saving…">Save</Button>

{/* Stock-style: nest catalog Spinner as children (when loading is false) */}
<Button disabled>
  <Spinner size="sm" />
  Please wait
</Button>
```

When `loading={true}`, Button replaces children with its private spinner — nested `<Spinner />` is not shown in that mode.

## If you were about to use stock shadcn Spinner

| Stock shadcn | Harmony |
|--------------|---------|
| Lucide `LoaderIcon` | Border ring by default |
| Replace icon by editing component / Lucide | `icon="arrow-path"` (package `Icon` names) |
| Size via `className="size-*"` | `size="sm" \| "md" \| "lg"` (+ optional `className`) |

## Do not

- Import Lucide for spinner glyphs — use default ring or `icon` + Harmony names
- Expect Button `loading` to render catalog `Spinner` — that prop keeps a private inline SVG
