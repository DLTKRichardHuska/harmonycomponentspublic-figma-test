# Code Connect to shadcn per-product packages

How each product file's Figma components are Code-Connected to `@dltkrichardhuska/harmony-design-system-shadcn-<product>` so Figma Make implements designs with the right package. Based on the Phase 0 rerun ([`phase-0-findings.md`](phase-0-findings.md)).

## Gates (all required per element)

1. **Verify / remediate gate** — element has verifier PASS including **publish-ready** checks (no unused component properties; every declared non-deferred prop wired). Element status must have reached `needs-publish` (or the human is publishing immediately after that). Do **not** attempt Code Connect from `in-progress` / `review`, or while orphan props would block publish.
2. **shadcn-synced gate** — the element's shadcn counterpart is `synced` in [`conversions/harmony-design-system-shadcn/conversion.manifest.json`](../../../../conversions/harmony-design-system-shadcn/conversion.manifest.json). Otherwise block Code Connect (visual Figma sync may still proceed) and tell the user which shadcn component to convert first.
3. **Publish gate (manual)** — the product file's library is **published** (Assets panel) and the target component's `getPublishStatusAsync()` is `CURRENT`. Local edits after publish (e.g. variant grid rearrange, prop deletes) revert status to `UNPUBLISHED` — set element back to `needs-publish` until the human re-publishes. The Plugin API cannot publish.

## Authoring — MCP parserless (primary)

No `@figma/code-connect` install, npm auth, or `tsconfig` types needed. `codeConnect.committedMirror` is `false` by default (a committed `.figma.ts` mirror in the shadcn repo is optional, for review/history).

1. Identify the shadcn export (the Figma component is already named for it).
2. `get_context_for_code_connect` on the node; read the shadcn component's exported prop unions / `docs/components/<Name>.md`.
3. Author a parserless template. Because Figma props mirror the shadcn Consumer API, maps are mostly **identity**: `getEnum` value→value, `getBoolean`, `getString`. **Icons:** see § Icon and § String `icon` props below — do **not** nest `<Icon>` JSX into string `icon` props. `example` imports from the file's product package. **Omit Figma-only `state`** (HTML hover/focus variants) — it must not appear in the React snippet.
4. Write via `add_code_connect_map` (single) / `send_code_connect_mappings` (bulk).
5. Add **custom instructions** for Make (below).
6. Verify with `get_code_connect_map`. Set `codeConnectStatus: "published"` in the node registry.

### Identity template shape (proven)

```ts
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { primary: 'primary', secondary: 'secondary' })
const size = instance.getEnum('size', { sm: 'sm', md: 'md' })
const disabled = instance.getBoolean('disabled')
const label = instance.getString('label')
export default {
  example: figma.code`<Button variant="${variant}" size="${size}" ${disabled ? 'disabled' : ''}>${label}</Button>`,
  imports: ["import { Button } from '@dltkrichardhuska/harmony-design-system-shadcn-vp/components'"],
  id: 'button',
  metadata: { nestable: true },
}
```

Swap the `-vp` import segment for each product file (`-cp` / `-ppm` / `-maconomy`). CP-only components are mapped in the CP file only.

### Icon (public product component)

Glyphs live in the shared Icons library; product `Icon` exposes `size` + INSTANCE_SWAP `name`. Glyph **component name** = shadcn `name` string.

```ts
import figma from 'figma'
const instance = figma.selectedInstance
const size = instance.getEnum('size', { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' })
const glyph = instance.getInstanceSwap('name')
const name = glyph && glyph.type === 'INSTANCE' ? glyph.name : 'plus'
export default {
  example: figma.code`<Icon name="${name}" size="${size}" />`,
  imports: ["import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn-vp/components'"],
  id: 'icon',
  metadata: { nestable: true },
}
```

Hard rules:

- Use `getInstanceSwap('name').name` as the string prop (identity map). Do **not** import Lucide / Tabler / Heroicons.
- Do **not** `executeTemplate()` on the glyph unless glyphs are separately Code-Connected to return strings.
- Omit `variant` while Figma is outline-only.
- If existing maps show `hasTemplate: false`, rewrite the template after the next library publish (`CURRENT`).

### String `icon` props (Button, Badge, Chip, Spinner, …)

When shadcn takes `icon?: string` (Harmony name), Figma still INSTANCE_SWAPs to **public Icon**. Emit the **glyph name string**, not nested JSX:

```ts
const iconInst = instance.getInstanceSwap('icon')
let iconName: string | undefined
if (iconInst && iconInst.type === 'INSTANCE') {
  const glyph = iconInst.getInstanceSwap('name')
  if (glyph && glyph.type === 'INSTANCE') iconName = glyph.name
}
// … in example:
// ${iconName ? figma.code` icon="${iconName}"` : ''}
```

**Wrong:** `icon={<Icon name="plus" size="md" />}`. **Right:** `icon="plus"`.

## Make custom instructions (per mapping)

Full Make bootstrap: [`figma-make.md`](figma-make.md).

Tell Figma Make to:
- Install `@dltkrichardhuska/harmony-design-system-shadcn-<product>` for **this file's product** (unambiguous — one product per file).
- `import '@dltkrichardhuska/harmony-design-system-shadcn-<product>/styles/globals.css'` (Tailwind v4 — **no** preset, `tailwind.config`, or `content` globs).
- Wrap the app in a **mode-only** `HarmonyThemeProvider` (`defaultMode` only — no `defaultProduct`).
- Prefer Harmony `<Icon name="…" size="…" />` from Code Connect; use `Icon` name strings — never Lucide/Tabler/Heroicons directly.
- When a parent has an `icon` **string** prop, pass the glyph component name (from the nested Icon’s `name` swap), not JSX.
- Icons-library glyphs are visual-only in Figma; generated code always uses the product package `Icon`.
- Configure `@dltkrichardhuska` private-registry auth against GitHub Packages (packages are `access: restricted`). Public packages are a planned future enhancement.

## Maintenance (reverse dependency)

The shadcn converter flags a mapping **stale** on Consumer-API delta or version bump (see its playbook). The figma converter then re-authors + republishes and resets `codeConnectStatus` to `published`. Re-run both gates before republishing. On a shadcn version bump, treat all mappings stale until each component is re-`synced` and revalidated. If a shadcn export is removed/renamed, remove/redirect the mapping so Dev Mode / Make never points at a missing export.
