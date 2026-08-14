# Figma Make + Harmony (shadcn) — consumption guide

How Figma Make (and other AI vibe-coding tools) turn a Harmony **Figma design** into a working app built on the Harmony shadcn package. This is the consumer end of the `figma` converter's Code Connect pipeline.

See also [PRODUCT_BUILDS.md](../packages/ui/docs/PRODUCT_BUILDS.md) (choosing/importing a product) and the figma converter's [code-connect plan](../../../converters/figma/playbook/plans/code-connect.md).

## The pipeline

```
Figma design (one product per file)
  → Figma Make reads Code Connect mappings on each component
  → installs @dltkrichardhuska/harmony-design-system-shadcn
  → implements the design with @dltkrichardhuska/harmony-design-system-shadcn/<product>
```

Each Harmony Figma file is a **single product** (CP / VP / PPM / Maconomy). Every component in a file is Code-Connected to that product's subpath, so the import is unambiguous — Make does not have to guess the product.

## What Make should do

### 1. Determine the product from the file

The design's Figma file **is** the product. CP file → `/cp`, VP file → `/vp`, PPM file → `/ppm`, Maconomy file → `/maconomy`. Product is fixed at the import subpath; there is no runtime product switch (no `data-product`, no `defaultProduct`).

### 2. Read Code Connect and pick components

Each Figma component maps (via Code Connect) to a shadcn export with an **identity** prop mapping (the Figma property names and variant values match the shadcn Consumer API). Use the mapped export and props directly; use `Icon` name strings for icons (never Lucide/Tabler/Heroicons).

### 3. Configure private-registry auth (required today)

The package is private (GitHub Packages, `access: restricted`). Before install, authenticate the `@dltkrichardhuska` scope:

```ini
# .npmrc
@dltkrichardhuska:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}   # PAT with read:packages
```

> A public-package option is a planned future enhancement that will remove this step.

### 4. Install the package

```bash
npm install @dltkrichardhuska/harmony-design-system-shadcn
```

### 5. Emit global setup

- Import the product-baked styles **once**, package-scoped (Tailwind v4 — **no** preset, `tailwind.config`, or `content` globs):

```tsx
import '@dltkrichardhuska/harmony-design-system-shadcn/<product>/styles/globals.css';
```

- Wrap the app in the **mode-only** provider (fonts are bundled; do not add `@fontsource`):

```tsx
import { HarmonyThemeProvider, Button } from '@dltkrichardhuska/harmony-design-system-shadcn/<product>';

export function App() {
  return (
    <HarmonyThemeProvider defaultMode="light">
      <Button variant="primary">Save</Button>
    </HarmonyThemeProvider>
  );
}
```

There is no `defaultProduct`/`setProduct`. `<ShellHeader />` renders the product's baked name + logo automatically.

## Notes for the agent

- Treat the design system as fixed: one geometry, one palette, one component set. Do not emit `data-product`, product conditionals, or "not available in this product" fallbacks.
- If a component is missing from the product-subpath import, it genuinely does not exist for that product (e.g. CP-only components exist only on `/cp`).
- Each product subpath ships its own `AGENTS.md`, `llms.txt`, `docs/`, and `registry.json` — wire the agent to `@dltkrichardhuska/harmony-design-system-shadcn/<product>/AGENTS.md`.
