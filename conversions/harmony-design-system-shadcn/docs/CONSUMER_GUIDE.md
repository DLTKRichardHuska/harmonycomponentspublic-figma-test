# Consumer guide — Harmony shadcn conversion

Package: `@dltkrichardhuska/harmony-design-system-shadcn`

Stack: **shadcn/ui patterns + Tailwind + Radix**. Optimized for AI coding systems and greenfield apps.

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
2. Styles: import `.../styles/globals.css` once — it pulls in Tailwind, the bundled fonts, and the tokens (no `@fontsource`).
3. Provider: wrap with `HarmonyThemeProvider`. In a product-fixed build it is **mode-only** (`defaultMode`); the unsuffixed dev source also takes `defaultProduct` **once** (`cp` | `ppm` | `vp` | `maconomy`).

```tsx
import { HarmonyThemeProvider } from '@dltkrichardhuska/harmony-design-system-shadcn/theme';
import '@dltkrichardhuska/harmony-design-system-shadcn/styles/globals.css';

export function Root({ children }: { children: React.ReactNode }) {
  return (
    <HarmonyThemeProvider defaultProduct="cp" defaultMode="light">
      {children}
    </HarmonyThemeProvider>
  );
}
```

Product is a one-time implementation choice. Light/dark may still toggle.

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

After Getting Started, each converted demo page shows element-specific package imports only.

## Icons

Use package `Icon` with Harmony **name strings** only:

```tsx
import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Icon name="home" />
<Icon name="check-circle" size="lg" />
```

If you were about to import `lucide-react`, use Harmony names instead (`home`, `check-circle`, `x-mark`, `magnifying-glass`, `chevron-down`). Heroicons/Tabler are internal resolvers — do not import them at call sites.

### `components.json` / shadcn CLI

Omit stock `iconLibrary` (or leave unset). It cannot emit Harmony `Icon`.

**Prefer npm package imports** for app code:

```tsx
import { Button, Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

**Harmony registry (complete):** the package ships `registry.json` + thin re-export shims under `registry/new-york/` — **one per component**, auto-generated from `components/index.ts`. Point `components.json` `registries` at the published package registry URL when using `shadcn add`. Shims re-export the npm package — they use Harmony `Icon` name strings, never Lucide. Official `shadcn add button` (stock registry) still installs Lucide — do not use it for Harmony apps.

## AI

Read package `AGENTS.md` and `llms.txt`. Prefer package exports; do not invent off-stack components or parallel token systems. Follow the **catalog → export map** (Dropdown → `Select`; Hybrid C `*Field` for labels). Style with Tailwind **theme utilities**; use `var(--…)` only when no utility exists.

### Optional Cursor rule snippet

```md
# Harmony shadcn
- Read node_modules/@dltkrichardhuska/harmony-design-system-shadcn/AGENTS.md (catalog→export map)
- Tailwind v4, zero config: styles/globals.css does @import "tailwindcss" + @theme; no preset/content
- Prefer theme utilities (bg-card, gap-2, rounded-lg, transition-colors); var(--…) only when unmapped
- Icons: package Icon with name strings only — never lucide-react / heroicons / tabler at call sites
- Omit components.json iconLibrary
- Hybrid C: no label on bare Input/Checkbox/Toggle/Select — use *Field or Label
- Catalog Dropdown → import Select (no Dropdown export)
- Do not invent off-stack UI kits or parallel token JSON
```
