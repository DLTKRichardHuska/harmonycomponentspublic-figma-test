# ListMenu

Vertical list menu for navigation or selection. Compound API shaped like stock shadcn **SidebarMenu** (`ListMenu` / `ListMenuItem` / `ListMenuButton`) but standalone — no Sidebar, collapse, or `useSidebar` coupling. Tailwind + `cva`, no Radix (Radix `Slot` powers `asChild`). Icons use the package **Icon** (name strings), not Lucide.

## Import

```tsx
import {
  ListMenu,
  ListMenuItem,
  ListMenuButton,
  Icon,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<ListMenu>
  <ListMenuItem>
    <ListMenuButton isActive icon="home">Dashboard</ListMenuButton>
  </ListMenuItem>
  <ListMenuItem>
    <ListMenuButton icon="user">Profile</ListMenuButton>
  </ListMenuItem>
</ListMenu>

{/* Links: asChild swaps the button for an <a> (or router Link) */}
<ListMenu>
  <ListMenuItem>
    <ListMenuButton asChild isActive>
      <a href="/docs">
        <Icon name="document" size="md" />
        <span>Documents</span>
      </a>
    </ListMenuButton>
  </ListMenuItem>
</ListMenu>

{/* No separators */}
<ListMenu variant="no-borders">
  <ListMenuItem>
    <ListMenuButton icon="home">Dashboard</ListMenuButton>
  </ListMenuItem>
</ListMenu>
```

## Props

### ListMenu

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'no-borders'` | `'default'` | Show or hide separators between items |
| `className` | `string` | — | Merged onto the `ul` |
| `...rest` | `HTMLAttributes<HTMLUListElement>` | — | Native `ul` attributes + `ref` |

Export `listMenuVariants`.

### ListMenuItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...rest` | `HTMLAttributes<HTMLLIElement>` | — | Native `li` attributes + `ref` |

### ListMenuButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isActive` | `boolean` | `false` | Active row; sets `data-active` for styling |
| `icon` | `string` | — | Harmony Icon name rendered before the label (ignored when `asChild`) |
| `asChild` | `boolean` | `false` | Render the child element (e.g. `<a>` / router Link) via Radix Slot |
| `disabled` | `boolean` | `false` | Disable the button row |
| `className` | `string` | — | Merged onto the control |
| `...rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `onClick` and native button attributes + `ref` |

Export `listMenuButtonVariants`.

## Events / polymorphism

- `ListMenuButton` renders a `<button type="button">` by default; native `onClick` and button attributes are forwarded.
- With `asChild`, the single child element receives the classes, `data-slot`, and `data-active`; supply `href` / router `Link` on the child. The `icon` prop is not injected in `asChild` mode — compose `<Icon />` (and a `<span>` label) as children.
- `data-slot` values: `list-menu`, `list-menu-item`, `list-menu-button`. Active state uses `data-active` (attribute absent when inactive — Tailwind v4-safe).
- Icon color states (via the `icon` prop) match the reference: muted by default, theme primary on hover, white when active. When composing icons as children (`asChild`), replicate with `text-[var(--text-muted)] group-hover:text-[var(--theme-primary)]` (or `text-white` for the active row).

Demo: `/components/list-menu`.

**Omitted (vs Astro):** `items[]` data prop, root `as`, and `MenuItem.isCustom` / `customSrc` — compose `ListMenuItem` / `ListMenuButton` children (and `<img>` for custom images) instead.

## If you were about to use stock shadcn SidebarMenu

| Stock / mistaken | Harmony |
|------------------|---------|
| `SidebarMenu` / `SidebarMenuItem` / `SidebarMenuButton` | `ListMenu` / `ListMenuItem` / `ListMenuButton` (same shape, no Sidebar) |
| `useSidebar` / collapse / tooltip props | Not applicable — ListMenu is a standalone list |
| Lucide icon child | `icon` name prop or `<Icon name="…" />` child |
| Astro `items={[{ icon, label, href }]}` | Compose `ListMenuItem` + `ListMenuButton` children |
| `active` (Astro) | `isActive` |

## Do not

- Invent an `items[]` package API without Consumer API sign-off
- Import Lucide (or `@heroicons/react` / `@tabler/icons-react`) for row icons — use package `Icon`
- Reach for `SidebarMenu` from stock shadcn for a plain navigation/selection list
