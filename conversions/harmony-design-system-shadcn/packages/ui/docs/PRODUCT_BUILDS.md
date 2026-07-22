# Product builds — choosing and installing a Harmony (shadcn) product

Harmony's look and **density** differ per product. To keep consumption simple, the design system is delivered as **one package per product**, each a self-contained, single-product shadcn + Tailwind + Radix library. You choose a product **once, up front**; after that there is no product switching, no `data-product`, and no other-product code in your app.

## The products

| Product | Package | Notes |
|---------|---------|-------|
| Costpoint | `@dltkrichardhuska/harmony-design-system-shadcn-cp` | Compact/dense fields (20px, 4px radius, inline labels); includes CP-only components (e.g. FloatingNav) |
| Vantagepoint | `@dltkrichardhuska/harmony-design-system-shadcn-vp` | Standard density (40px fields, 8px radius) |
| PPM | `@dltkrichardhuska/harmony-design-system-shadcn-ppm` | Standard density |
| Maconomy | `@dltkrichardhuska/harmony-design-system-shadcn-maconomy` | Standard density |

> The unsuffixed `@dltkrichardhuska/harmony-design-system-shadcn` is the **development source** (all four palettes + a product switcher used only by the internal review demo). Applications should not depend on it.

## For people (manual install)

1. Decide the product for your app (e.g. Costpoint → `-cp`).
2. Authenticate npm to the `@dltkrichardhuska` GitHub Packages scope, then install the one product package. Use **either** a personal access token or your existing GitHub CLI login:

```ini
# .npmrc — common to both methods
@dltkrichardhuska:registry=https://npm.pkg.github.com
```

```ini
# Method A — personal access token (classic PAT with read:packages)
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
# Method B — reuse the GitHub CLI login (no PAT to manage)
gh auth login --scopes read:packages
npm config set //npm.pkg.github.com/:_authToken "$(gh auth token)"
```

```bash
npm install @dltkrichardhuska/harmony-design-system-shadcn-cp
```

3. **Tailwind v4 — nothing to configure.** Make sure your build runs Tailwind v4 (the `@tailwindcss/vite` plugin, or `@tailwindcss/postcss`). You do **not** write a `tailwind.config`, a preset, or `content` globs: the package's `globals.css` does `@import "tailwindcss"`, maps the design tokens to utilities with `@theme`, turns on `.dark` mode, and registers its own component classes with `@source`.

4. Import the (already product-baked) styles once and wrap with the **mode-only** provider. Fonts are bundled — no `@fontsource` imports:

```tsx
import '@dltkrichardhuska/harmony-design-system-shadcn-cp/styles/globals.css';
import { HarmonyThemeProvider, Button, Input } from '@dltkrichardhuska/harmony-design-system-shadcn-cp';

export function App() {
  return (
    <HarmonyThemeProvider defaultMode="light">
      <Input placeholder="Search" />
      <Button variant="primary">Save</Button>
    </HarmonyThemeProvider>
  );
}
```

There is no `defaultProduct` and no `setProduct` — product is fixed by the package you installed. Only light/dark mode is a runtime concern.

The shell is brand-aware out of the box: `<ShellHeader />` renders the installed product's name and logo, and `<LeftSidebar />` / `<RightSidebar />` default to the product's variant — you do not pass `productName`, `logoSrc`, or `variant` unless you want to override the brand. The logo ships as an inline data URI, so there is no `/logos/*` asset to host.

Because Tailwind v4 is fully configured by `globals.css`, your **own** app markup can use the same design system for custom styling: utilities like `bg-primary`, `text-foreground`, `border-border`, `shadow-md`, `text-heading-xl`, and `dark:*` variants are all available, and follow the same light/dark switch as the components.

## For AI systems

Point the agent/tool at the **product package the app uses** and treat it as the single source of truth:

- Each product package ships its own `AGENTS.md`, `llms.txt`, `docs/`, and `registry.json`, all scoped to that one product (a single-product banner is prepended to `AGENTS.md` / `llms.txt`).
- The agent should reason about the design system as fixed: one geometry, one palette, one component set. Do **not** emit `data-product`, `defaultProduct`, product conditionals, or “not available in this product” fallbacks.
- Components that do not apply to the product are **not exported** by that package — if an import is missing, it genuinely does not exist for that product.
- Wire the agent’s rules/registry to the installed product package path (e.g. reference `@dltkrichardhuska/harmony-design-system-shadcn-cp/AGENTS.md`).

## How the builds are produced (maintainers)

One source, N builds. From `packages/ui`:

```bash
npm run build:products         # all four → dist-products/<product>/
npm run build:product cp       # a single product
```

The flatten build (`scripts/build-product.mjs`) resolves the chosen product's tokens into `:root`/`.dark`, strips other products and all `data-product` selectors, emits a mode-only provider with the product's brand (name + logo data URI from `src/data/product-meta.json`) baked in and the metadata JSON pruned to that product, makes the icon subsystem product-less (prunes `icon-manifest.json` to the product and drops the product arg from the resolver), filters product-excluded component exports, regenerates a product-scoped shadcn registry (shims import the product package name), and specializes the AI artifacts. The bundled Tailwind v4 `globals.css` and fonts are carried through unchanged. Product exclusivity is declared once in the reference catalog (`src/data/component-catalog.ts` → `componentProducts` / `componentVariantProducts`) and mirrored in `conversion.manifest.json`.

Fonts are committed to the source package (`src/styles/fonts/` + `src/styles/fonts.css`, produced by `npm run sync:fonts`), so the flatten build just copies them. The registry is regenerated from `components/index.ts` by `npm run gen:registry` (source) and automatically per product during the flatten build.
