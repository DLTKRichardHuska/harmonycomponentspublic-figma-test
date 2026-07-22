# Icon conversion plan — harmony-design-system-shadcn

status: completed  
scope: Icon  
strategy: `component` (user signed off)  
created: 2026-07-18  
approved: 2026-07-18  
updated: 2026-07-18 (human accepted Icon-1 PASS → synced)  

## Element strategy

| Element | Strategy | Notes |
|---------|----------|-------|
| Icon | `component` | Ship in `packages/ui`; unblocks later Button/Alert/Chip/etc. |

## Approach & stack fit (locked)

1. **Export `Icon`** from `@dltkrichardhuska/harmony-design-system-shadcn/components` (not `HarmonyIcon`).
2. **Props (full parity, no skips):** `name`, `size` (`xs`–`xl`, default `md`), `variant` (`outline` \| `solid`, default `outline`), `className?`. Forward `ref` to root.
3. **Sizes:** `cva` + foundation tokens `--icon-xs`…`--icon-xl` / `--icon-stroke-width`.
4. **Resolution:** manifest (product) → Heroicons → Tabler → custom public SVG → `?` fallback. No Lucide remap.
5. **Render:** inline SVG, `currentColor`, `aria-hidden`, `data-icon`. Tailwind + `cva`, no Radix.
6. **Demo:** `/components/icons` with ImportSnippet; AI docs updated.

### Stack leverage

- Prefer-order step 3 (Tailwind-only presentation)
- shadcn-style folder `packages/ui/src/components/icon/`
- Token sizes already synced in foundation

### Stack friction

| Item | Mitigation |
|------|------------|
| Stock shadcn uses Lucide | Keep Harmony name-string API; document for AI |
| Name resolution ≠ Lucide imports | Document in AGENTS/docs |

## Blocking dependencies

None (foundation synced).

## Prop mappings / skipped props / composites

- Prop mappings: identity
- Skipped props: none
- Composite equivalents: none
- Gaps: none planned

## Execute checklist

- [x] Record strategy / userDecision; status in-progress
- [x] Implement `packages/ui` Icon + deps
- [x] Demo `/components/icons`
- [x] AGENTS / llms / docs/components/Icon.md
- [x] Verify Icon-1 PASS (`verification/reports/Icon-1.md`)
- [x] Human accept → synced + coverage
