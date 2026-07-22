# AI consumer artifacts — harmony-design-system-shadcn

Converter: `harmony-design-system-shadcn`  
Status: **shipped** (required set + complete auto-generated registry)  
Updated: 2026-07-21

## Goal

Machine-readable / agent-oriented artifacts for `@dltkrichardhuska/harmony-design-system-shadcn` so AI coding systems consume Harmony on the shadcn/ui + Tailwind + Radix stack.

## Deliverable set (required)

| Artifact | Location | Role |
|----------|----------|------|
| **`AGENTS.md`** | `packages/ui/` | Install, peers, imports, catalog→export map, Hybrid C, theme-utility styling, Do/Don’t |
| **`llms.txt`** | `packages/ui/` | Compact export barrel + catalog map + component summaries |
| **`docs/components/*.md`** | `packages/ui/docs/components/` | Per-component API (Harmony + stack props/events) + stock-shadcn Don’t |
| **`docs/components/README.md`** | same | Index of all component docs |
| **Cursor rule snippet** | Getting Started + `docs/CONSUMER_GUIDE.md` | Thin pointer to AGENTS.md (not a second source of truth) |
| **`registry.json` (complete)** | `packages/ui/registry.json` + `registry/new-york/` | One shim per component, **auto-generated** from `components/index.ts` (`npm run gen:registry`); package re-export shims; Harmony Icon; omit `iconLibrary` |

**Hosted MCP:** deferred.

## Per-product delivery

Artifacts are authored once against the multi-product source, then **specialized per product** by the flatten build (`packages/ui/scripts/build-product.mjs`) into `dist-products/<product>/`:

- `AGENTS.md` / `llms.txt` get a prepended **single-product banner** (fixed product, mode-only provider, no product switching, product-excluded components not exported).
- `docs/` is copied into each product build; `registry.json` + `registry/new-york/` are **regenerated** per product (shims import the product package name; excluded components dropped). The bundled Tailwind v4 `globals.css` + fonts carry through unchanged.
- Product-exclusive components (`componentProducts` in the reference catalog → `products` in `conversion.manifest.json`) are excluded from the product builds where they do not apply; when their docs become product-specific, drop the corresponding `docs/components/*.md` in non-matching builds.
- Authoring stays in `packages/ui/`; never hand-maintain four parallel artifact copies.

## Maintenance checklist (every `component` sync)

On execute / before `synced`, update in the **same** change set:

1. [ ] `docs/components/<Name>.md` — full skeleton (Title, Import, Props both slices, Events/polymorphism, Examples, stock-shadcn Don’t)
2. [ ] `docs/components/README.md` — index row
3. [ ] `AGENTS.md` — section if needed; catalog→export map if names diverge
4. [ ] `llms.txt` — barrel line + short section
5. [ ] Public TypeScript / `*Variants` match Consumer API + docs
6. [ ] Prefer Tailwind v4 `@theme` utilities in component classes (no new `--transition-*`)
7. [ ] Icons via package `Icon` name strings only
8. [ ] Registry auto-syncs from `components/index.ts` — run `npm run gen:registry` after adding/removing a component (never Lucide; omit `iconLibrary`)
9. [ ] **Figma Code Connect:** if the component's public consumer surface or product exclusivity changed and a Code Connect mapping exists, set `codeConnect.mappingStatus: "stale"` on the element in `conversion.manifest.json` so the figma converter revalidates it (see figma [code-connect plan](../../../figma/playbook/plans/code-connect.md))

## Required `docs/components/<Name>.md` skeleton

1. **Title + one-line summary**
2. **Import** — package-name snippet
3. **Props** — Harmony-specific **and** stack/code-added
4. **Events / polymorphism**
5. **Examples**
6. **If you were about to use stock shadcn…** / **Do not**

## Registry rules (complete, auto-generated)

- The registry is **generated**, not hand-maintained: `scripts/gen-registry.mjs` (source) and `build-product.mjs` (per product) parse `components/index.ts` via `scripts/lib/registry.mjs` and emit one shim per component. Run `npm run gen:registry` after changing exports; do not hand-edit `registry.json` or `registry/new-york/*.tsx`.
- Items re-export the package `/components` (thin shims under `registry/new-york/`), so `npx shadcn add <name>` never forks a stale component.
- Prefer **npm package imports** in apps; registry is alternate discovery for shadcn CLI/MCP.
- Consumer `components.json`: omit `iconLibrary`; point `registries` at Harmony when using CLI.
- Stock `shadcn add button` (official registry) still installs Lucide — do not use for Harmony apps.

## Styling standard (AI-recognizable)

- Prefer: `bg-card`, `text-foreground`, `border-border`, `gap-2`, `rounded-lg`, `shadow-md`, `transition-colors`, …
- Allowlist `var(--…)`: focus rings, `--icon-*`, `--z-*`, `--dropdown-*`, rare product washes
- Never: `--transition-*` tokens or `duration-[var(--transition-*)]`

## Anti-patterns

- Deep-importing package internals from demo
- Hand-editing generated `registry.json` / `registry/new-york/*.tsx` instead of running `gen:registry`
- Lucide / stock `iconLibrary` in components, demos, or registry
- Prop-only docs omitting events / polymorphism (or the reverse)
- AI artifacts disagreeing with Consumer API / `userDecision`
- Leaving unused tokens that confuse agents (`--transition-*` removed)
- Catalog name invented as import (`Dropdown` instead of `Select`)
