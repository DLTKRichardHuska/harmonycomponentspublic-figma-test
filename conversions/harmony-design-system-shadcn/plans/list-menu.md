# Plan: ListMenu — harmony-design-system-shadcn

status: approved
scope: ListMenu
strategy: `component`
created: 2026-07-20
approved: 2026-07-20

## Element strategy

| Element | Strategy | Analog |
|---------|----------|--------|
| ListMenu | `component` | Stock **SidebarMenu** compound shape (standalone — not inside Sidebar); Tailwind + `cva`; no Radix |

## Approach & stack fit (locked)

- Mirror stock shadcn **SidebarMenu** shape, keep Harmony catalog names:
  - `ListMenu` ↔ `SidebarMenu` (`<ul>`)
  - `ListMenuItem` ↔ `SidebarMenuItem` (`<li>`)
  - `ListMenuButton` ↔ `SidebarMenuButton` (interactive control)
- **No Radix** — static list, not a portal menu. Use Radix `Slot` for `asChild` (same as `Button`).
- **No Astro `items[]`** — compose children (Accordion / Select pattern).
- Icons: optional `icon?: string` on `ListMenuButton` → package `Icon`, or compose `Icon` / `<img>` as children (custom images).
- Tokens: match reference `.list-menu` rules (`src/styles/components.css`) via Tailwind / `cva`. Separators applied by the container `variant` (`[&>li:not(:last-child)]:border-b`), removed for `no-borders`.
- Modern shadcn markers: `data-slot`, `data-active={isActive || undefined}` (Tailwind v4-safe — attribute absent when false).
- Export `listMenuVariants` + `listMenuButtonVariants`.
- Package under `packages/ui/`; demo under `apps/demo/` by package name.

## Consumer API (user confirmed)

1. **Base / stack pattern**
   - Compound: `ListMenu` | `ListMenuItem` | `ListMenuButton`
   - `listMenuVariants` / `listMenuButtonVariants` via `cva`
   - `asChild` + Slot on `ListMenuButton`
   - `data-slot="list-menu" | "list-menu-item" | "list-menu-button"`
   - Semantic: `ul` / `li` / default `button`
2. **Inherited props / events**
   - `ListMenu`: `HTMLAttributes<HTMLUListElement>` + ref; `variant`
   - `ListMenuItem`: `HTMLAttributes<HTMLLIElement>` + ref
   - `ListMenuButton`: `ButtonHTMLAttributes<HTMLButtonElement>` (or Slot child attrs) + ref; `onClick`; with `asChild`, child supplies `href` / router `Link`
3. **Harmony-specific**
   - `ListMenu.variant?: "default" | "no-borders"` (default separators)
   - `ListMenuButton.isActive?: boolean`
   - `ListMenuButton.icon?: string` → package `Icon` (muted; hover → theme primary; active → white)
   - `ListMenuButton.disabled` via native attrs
4. **Omissions / divergences**
   - No Astro `items[]`, root `as`, `MenuItem.active` / `isCustom` / `customSrc`
   - Not named `SidebarMenu*` (catalog stays ListMenu; docs map stock → Harmony)
   - No sidebar collapse / tooltip / `useSidebar` coupling; no stock `size` variants (single reference size)
5. **Docs / AI artifacts**
   - `docs/components/ListMenu.md` with "If you were about to use stock shadcn SidebarMenu…" mapping table
   - `AGENTS.md` / `llms.txt` / `docs/components/README.md`; catalog ListMenu → `ListMenu` / `ListMenuItem` / `ListMenuButton`
   - Demo `/components/list-menu` with element-specific `ImportSnippet`

## Blocking dependencies

None — **Icon** is `synced`.

## Skipped / gaps

None (composition replaces Astro data API; no `UnsupportedEquivalentCallout`).

## Execute order

1. Package `packages/ui/src/components/list-menu/` — `ListMenu` / `ListMenuItem` / `ListMenuButton`, variants, `data-slot` / `data-active`, barrel; export from components index.
2. Demo `apps/demo/src/demo/converted/ListMenu/ListMenusDemo.tsx` (+ index) — Basic, Without icons, With Links (`asChild` + `<a>`), No Borders, props, a11y, ImportSnippet; route `/components/list-menu`.
3. AI artifacts: `docs/components/ListMenu.md`, README index, `AGENTS.md`, `llms.txt`.
4. Manifest `ListMenu` → strategy/userDecision.
5. Verify → human accept → `synced` → `compute_coverage.mjs --write`.

## Key reference

- Source: `src/components/ui/ListMenu.astro`
- Docs: `src/pages/components/list-menu.astro`
- Stock analog: shadcn SidebarMenu (`SidebarMenu` / `Item` / `Button`, `isActive`, `asChild`)
