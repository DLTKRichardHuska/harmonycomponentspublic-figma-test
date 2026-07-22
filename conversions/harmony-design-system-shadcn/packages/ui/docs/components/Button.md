# Button

Harmony button — shadcn-style `cva` + Tailwind tokens + package `Icon`, matching reference Astro `Button` props and visuals.

## Import

```tsx
import { Button, buttonVariants } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

Requires `HarmonyThemeProvider` and package styles (see Getting Started).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'outline' \| 'ghost' \| 'destructive' \| 'dela' \| 'dela-pill'` | `'primary'` | Visual style |
| `buttonType` | `'theme' \| 'pageHeader'` | `'theme'` | Theme vs page-header token set (ignored for dela) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Height / padding via `--button-height-*` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Icon/label layout |
| `disabled` | `boolean` | `false` | Disables interaction |
| `loading` | `boolean` | `false` | Spinner replaces content; forces disabled |
| `loadingText` | `string` | — | Optional text beside spinner |
| `icon` | `string` | — | Harmony `Icon` name |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon placement when label present |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type (ignored with `href`) |
| `fullWidth` | `boolean` | `false` | `width: 100%` |
| `href` | `string` | — | Renders `<a>` with button styles |
| `asChild` | `boolean` | `false` | Radix `Slot` — merge classes onto a single child |
| `className` | `string` | — | Extra classes (`cn` / `buttonVariants`) |
| `children` | `ReactNode` | — | Label; omit with `icon` for icon-only |

## Events and polymorphism

Native DOM / React handlers are inherited — do not look for custom Harmony event props. The component forwards `ref` to the root (`<button>`, `<a>`, or the `asChild` child).

| Mode | Element | Inherited surface |
|------|---------|-------------------|
| Default | `<button>` | `ButtonHTMLAttributes` — `onClick`, `onFocus`, `onBlur`, `onKeyDown`, `type`, `disabled`, `aria-*`, … |
| `href` set | `<a>` | `AnchorHTMLAttributes` (minus conflicting `type`) — `onClick`, `target`, `rel`, … |
| `asChild` | child element | Classes/props merged via Radix `Slot` onto a single child |

```tsx
<Button variant="primary" onClick={() => save()}>Save</Button>
<Button href="/docs" target="_blank" rel="noreferrer">Docs</Button>
<Button asChild>
  <Link to="/settings">Settings</Link>
</Button>
```

Also export `buttonVariants` for composing the same styles onto custom elements.

## Behavior notes

- **Icon-only:** `icon` set, no children, not loading → square icon button sizes.
- **Icon size map:** `xs→xs`, `sm→sm`, `md→sm`, `lg→md` (same as reference).
- **Loading (prop):** inline SVG spinner (not catalog `Spinner`); replaces content; `aria-busy`.
- **Loading (compose):** nest package `<Spinner />` as children when `loading` is false (stock shadcn pattern). Prefer `size="sm"` on Spinner inside buttons.
- **Dela:** foundation tokens — `bg-dela` / `text-dela-foreground` (`--gradient-dela`, `--dela-header-content-fg`); default Stars graphic from app `public` (`/Stars.svg`). See foundation demo `/foundation/dela`.

## Examples

```tsx
<Button variant="primary">Save</Button>
<Button variant="secondary" buttonType="pageHeader">Edit</Button>
<Button variant="dela">Ask Dela</Button>
<Button icon="plus" aria-label="Add" />
<Button loading loadingText="Saving…">Save</Button>
<Button disabled>
  <Spinner size="sm" />
  Please wait
</Button>
<Button href="/docs">Docs</Button>
```

```tsx
import { Button, Spinner } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## If you were about to use stock shadcn Button

| Stock shadcn | Harmony |
|--------------|---------|
| `variant="default"` | `variant="primary"` |
| `variant="secondary"` | `variant="secondary"` (Harmony tokens, not muted fill) |
| `variant="destructive"` | `variant="destructive"` |
| `variant="outline"` / `ghost` | same names |
| `size="sm" \| "default" \| "lg"` | `size="xs" \| "sm" \| "md" \| "lg"` |
| Lucide child icons | `icon="plus"` (package `Icon` names) |
| No page-header / dela | `buttonType="pageHeader"`, `variant="dela"` |

Prefer package `Button` over copying a CLI `button.tsx` that uses Lucide and stock variant names.

## Figma / cross-converter Consumer surface

Figma (and Code Connect) must mirror this Props table **identity** — not a reduced `variant` × `size` subset. Suggested Figma property kinds:

| Prop | Figma kind | Notes |
|------|------------|-------|
| `variant` | VARIANT | All 8 values |
| `buttonType` | VARIANT | `theme` \| `pageHeader` (ignored for dela in code; still expose) |
| `size` | VARIANT | `xs` \| `sm` \| `md` \| `lg` |
| `orientation` | VARIANT | `horizontal` \| `vertical` |
| `iconPosition` | VARIANT | `left` \| `right` |
| `disabled` | BOOLEAN | Must change paint / opacity — not an unused def |
| `loading` | BOOLEAN | Show spinner layer; hide default content |
| `loadingText` | TEXT | Visible when loading |
| `fullWidth` | BOOLEAN or deferred | Prefer deferred + instance resize unless VARIANT stretch cells exist |
| `icon` | INSTANCE_SWAP | Package `Icon` |
| label (`children`) | TEXT | Linked to label text node |
| `asChild`, `className`, `href`, DOM `type`, events | deferred | Out of Figma component chrome; document in plan |
| *(HTML)* `:hover` / `:focus-visible` / `:active` | VARIANT `state` | Figma-only: `default` + confirmed values (`hover`, `focus`, …). **While Hovering** → Change to `hover`. Confirm in plan before build — multiplies the grid. Omit from Code Connect. |

**Paint tokens (do not alias away):** secondary/tertiary use `--theme-btn-*`; outline/ghost use foreground/border; dela uses `--gradient-dela` + `--dela-header-content-fg` (not `primary`). Hover/focus paints must match the corresponding `hover:*` / `focus-visible:*` token classes.

## Do not

- Import Lucide icons into buttons — use `icon` + Harmony names
- Rename Harmony variants to stock shadcn-only set for “compatibility”
- Skip `aria-label` on icon-only buttons
