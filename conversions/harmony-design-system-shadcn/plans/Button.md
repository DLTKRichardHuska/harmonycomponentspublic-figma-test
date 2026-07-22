# Button conversion plan — harmony-design-system-shadcn

status: synced (human accepted visual match 2026-07-18)  
scope: Button  
strategy: `component` (user signed off)  
created: 2026-07-18  
approved: 2026-07-18  
updated: 2026-07-18 (Button-1 PASS)

## Element strategy

| Element | Strategy | Notes |
|---------|----------|-------|
| Button | `component` | Ship in `packages/ui`; shadcn-style `cva` for AI recognition |

## Approach & stack fit (locked)

1. **Export `Button`** + `buttonVariants` from `@dltkrichardhuska/harmony-design-system-shadcn/components`.
2. **Props (full parity, no skips):** `variant`, `buttonType`, `size` (`xs`–`lg`), `orientation`, `disabled`, `loading`, `loadingText`, `icon`, `iconPosition`, `type`, `fullWidth`, `href`, `className`, children. Optional `asChild` via Radix `Slot`.
3. **Styles:** `cva` + Tailwind utilities mapped to foundation button/theme/dela tokens (`--button-height-*`, `--theme-primary`, page-header / dela tokens).
4. **Icons:** package `Icon` + existing `buttonIconSizeMap`; icon-only when `icon` and no children (and not loading).
5. **Loading:** inline SVG spinner (reference parity; not catalog Spinner); replaces content; `aria-busy`; disabled when loading.
6. **Polymorphic:** `href` → `<a>`; else `<button>`; optional `asChild` → Radix `Slot`.
7. **Demo:** `/components/buttons` with ImportSnippet; AI docs updated.

### Stack leverage

- Prefer-order step 1–2 (shadcn/`cva` + Radix Slot + Tailwind tokens)
- Folder `packages/ui/src/components/button/`
- Package `Icon` already synced

### Stack friction

| Item | Mitigation |
|------|------------|
| Harmony variants ≠ stock shadcn (`primary`/`dela` vs `default`) | Keep Harmony props; document in AGENTS / docs |
| `buttonType` / dela stars graphic | Harmony-specific; document for AI |

## Blocking dependencies

None (`Icon` synced; Spinner not a catalog dependency — inline SVG).

## Prop mappings / skipped props / composites

- Prop mappings: identity (Harmony API)
- Skipped props: none
- Composite equivalents: none
- Gaps: none planned

## Execute checklist

- [x] Record strategy / userDecision; status in-progress
- [x] Implement `packages/ui` Button + exports
- [x] Demo `/components/buttons`
- [x] AGENTS / llms / docs/components/Button.md
- [x] Verify Button-1 PASS (`verification/reports/Button-1.md`)
- [ ] Human accept → synced + coverage
