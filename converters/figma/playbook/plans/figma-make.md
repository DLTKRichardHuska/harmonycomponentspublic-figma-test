# Figma Make — consuming Harmony via Code Connect

How Figma Make should implement designs from a Harmony product file using the matching shadcn per-product package. Authoring details live in [`code-connect.md`](code-connect.md).

## Pick the package from the file

Each Figma file is **one product**. Install exactly that product’s package:

| Figma file | Package |
|------------|---------|
| Harmony Design System (VP) | `@dltkrichardhuska/harmony-design-system-shadcn-vp` |
| Harmony Design System (PPM) | `@dltkrichardhuska/harmony-design-system-shadcn-ppm` |
| Harmony Design System (Maconomy) | `@dltkrichardhuska/harmony-design-system-shadcn-maconomy` |
| Harmony Design System (CP) | `@dltkrichardhuska/harmony-design-system-shadcn-cp` |

Do **not** install the unsuffixed `@dltkrichardhuska/harmony-design-system-shadcn` multi-product source in Make apps.

## Private registry auth

Packages are `access: restricted` on GitHub Packages under `@dltkrichardhuska`. Configure Make / the generated project’s npm auth for that scope (e.g. `.npmrc` with a GitHub Packages token that can `read:packages`). Public packages are a planned future enhancement.

## App bootstrap (every Make project)

1. Install the product package for this file (table above).
2. Import Tailwind v4 globals (no preset, no `tailwind.config`, no `content` globs):

```ts
import '@dltkrichardhuska/harmony-design-system-shadcn-<product>/styles/globals.css'
```

3. Wrap the app in a **mode-only** provider (`defaultMode` only — **no** `defaultProduct`):

```tsx
import { HarmonyThemeProvider } from '@dltkrichardhuska/harmony-design-system-shadcn-<product>'

export function App({ children }: { children: React.ReactNode }) {
  return (
    <HarmonyThemeProvider defaultMode="light">
      {children}
    </HarmonyThemeProvider>
  )
}
```

4. Prefer Harmony `<Icon name="…" size="…" />` from Code Connect. Use Harmony `Icon` with **name strings** — never Lucide / Tabler / Heroicons directly in app code.
5. When a parent component has an `icon` **string** prop (Button, Badge, Chip, Spinner, …), pass the **glyph component name** from the nested Icon’s `name` INSTANCE_SWAP (e.g. `icon="plus"`), not `icon={<Icon … />}`.
6. Icons-library glyphs in Figma are visual swap targets only; generated code always goes through the product package `Icon`.

## Code Connect

Dev Mode / Make read Code Connect mappings authored by the figma converter (`add_code_connect_map`, parserless templates). Props on Figma components mirror the shadcn Consumer API (identity maps). Figma-only HTML `state` variants are **omitted** from generated React snippets. Icon mapping: `getInstanceSwap('name').name` + `getEnum('size')` → `<Icon name size />`. See [`code-connect.md`](code-connect.md).

**Gates before a mapping exists:** element verify/publish-ready → `needs-publish` → human library publish (`CURRENT`) → mapping write. Unused Figma props block publish; do not expect Code Connect on unpublished or orphan-prop components.

## Custom instructions (paste into mappings / Make)

Use per product file (swap the package suffix):

- Install `@dltkrichardhuska/harmony-design-system-shadcn-<product>` for **this file’s product**.
- `import '@dltkrichardhuska/harmony-design-system-shadcn-<product>/styles/globals.css'` (Tailwind v4 — no preset/config/content globs).
- Wrap the app in a mode-only `HarmonyThemeProvider` (`defaultMode` only).
- Prefer Harmony `<Icon name="…" size="…" />`; never Lucide/Tabler/Heroicons directly.
- For string `icon` props, pass the glyph component name (nested Icon `name` swap), not JSX.
- Icons-library glyphs are visual-only; code uses package `Icon`.
- Configure `@dltkrichardhuska` private-registry auth against GitHub Packages.

## Related

- Consumer packages / builds: [`conversions/harmony-design-system-shadcn/packages/ui/docs/PRODUCT_BUILDS.md`](../../../../conversions/harmony-design-system-shadcn/packages/ui/docs/PRODUCT_BUILDS.md)
- Code Connect authoring: [`code-connect.md`](code-connect.md)
- Converter overview: [`../../README.md`](../../README.md)
