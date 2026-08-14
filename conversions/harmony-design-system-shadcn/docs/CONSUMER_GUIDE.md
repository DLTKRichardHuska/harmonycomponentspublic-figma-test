# Consumer guide — Harmony shadcn conversion

Package: `@dltkrichardhuska/harmony-design-system-shadcn`

Stack: **shadcn/ui patterns + Tailwind + Radix**. Optimized for AI coding systems and greenfield apps.

Apps install the one package, then import a **product subpath** (`/cp`, `/vp`, `/ppm`, `/maconomy`). The unsuffixed specifier is the multi-product review demo only. See [PRODUCT_BUILDS.md](../packages/ui/docs/PRODUCT_BUILDS.md).

## Install

Configure GitHub Packages for `@dltkrichardhuska`, then:

```bash
npm install @dltkrichardhuska/harmony-design-system-shadcn
# peers: React + Tailwind v4 (clsx/tailwind-merge/cva ship with the package; fonts are bundled)
npm install react react-dom
npm install -D tailwindcss @tailwindcss/vite
```

## Bootstrap

1. Tailwind v4 — **zero config**: no preset, no `content`, no `tailwind.config`. `globals.css` does `@import "tailwindcss"` + `@theme`. Just add the Tailwind v4 plugin (`@tailwindcss/vite` or `@tailwindcss/postcss`).
2. Styles: import `.../cp/styles/globals.css` once — it pulls in Tailwind, the bundled fonts, and the product-baked tokens (no `@fontsource`).
3. Provider: wrap with `HarmonyThemeProvider`. A product subpath is **mode-only** (`defaultMode`). There is no `defaultProduct`.

```tsx
import { HarmonyThemeProvider } from '@dltkrichardhuska/harmony-design-system-shadcn/cp';
import '@dltkrichardhuska/harmony-design-system-shadcn/cp/styles/globals.css';

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <HarmonyThemeProvider defaultMode="light">
      {children}
    </HarmonyThemeProvider>
  );
}
```

Product is a one-time import-path choice. Light/dark may still toggle.

## Tokens (single source)

- Runtime: CSS variables in `styles/tokens.css` (via `globals.css`)
- Utilities: the Tailwind v4 `@theme` block in `globals.css` maps `bg-background`, `text-primary`, spacing, radii, shadows → those vars (spacing/radius/text already match Tailwind defaults)
- There is **no** `@…/tokens` JSON export — do not invent one

### Dela brand tokens

| Use | Prefer |
|-----|--------|
| Gradient fill | `className="bg-dela"` or `var(--gradient-dela)` |
| On-gradient text | `className="text-dela-foreground"` or `var(--dela-header-content-fg)` |
| Hover wash | `var(--gradient-dela-hover-bg)` |
| Ask Dela CTA | `<Button variant="dela">` / `dela-pill` |

## Element usage

After Getting Started, each converted demo page shows element-specific package imports only (demo uses the unsuffixed specifier). Apps should import from the product subpath.

## Icons

Use package `Icon` with Harmony **name strings** only:

```tsx
import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/cp/components';

<Icon name="home" />
<Icon name="check-circle" size="lg" />
```

If you were about to import `lucide-react`, use Harmony names instead (`home`, `check-circle`, `x-mark`, `magnifying-glass`, `chevron-down`). Heroicons/Tabler are internal resolvers — do not import them at call sites.

### `components.json` / shadcn CLI

Omit stock `iconLibrary` (or leave unset). It cannot emit Harmony `Icon`.

**Prefer npm package imports** for app code:

```tsx
import { Button, Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/cp/components';
```

**Harmony registry (complete):** each product subpath ships `registry.json` + thin re-export shims under `registry/new-york/` — **one per component**, auto-generated from `components/index.ts`. Point `components.json` `registries` at the published package registry URL when using `shadcn add`. Shims re-export `@pkg/<product>` — they use Harmony `Icon` name strings, never Lucide. Official `shadcn add button` (stock registry) still installs Lucide — do not use it for Harmony apps.

## AI

Read `@dltkrichardhuska/harmony-design-system-shadcn/cp/AGENTS.md` and `.../cp/llms.txt`. Prefer product-subpath exports; do not invent off-stack components or parallel token systems. Follow the **catalog → export map** (Dropdown → `Select`; Hybrid C `*Field` for labels). Style with Tailwind **theme utilities**; use `var(--…)` only when no utility exists.

### Optional Cursor rule snippet

```md
# Harmony shadcn
- Read @dltkrichardhuska/harmony-design-system-shadcn/cp/AGENTS.md (catalog→export map)
- Product is fixed by the import subpath — no product switching, no data-product/defaultProduct
- Tailwind v4, zero config: styles/globals.css does @import "tailwindcss" + @theme; no preset/content
- Prefer theme utilities (bg-card, gap-2, rounded-lg, transition-colors); var(--…) only when unmapped
- Icons: package Icon with name strings only — never lucide-react / heroicons / tabler at call sites
- Omit components.json iconLibrary
- Hybrid C: no label on bare Input/Checkbox/Toggle/Select — use *Field or Label
- Catalog Dropdown → import Select (no Dropdown export)
- Do not invent off-stack UI kits or parallel token JSON
```
