# Spinner conversion plan — harmony-design-system-shadcn

status: synced (human accepted visual match 2026-07-18)  
scope: Spinner  
strategy: `component` (user signed off)  
created: 2026-07-18  
approved: 2026-07-18  
updated: 2026-07-18 (Spinner-1 PASS → synced)

## Element strategy

| Element | Strategy | Notes |
|---------|----------|-------|
| Spinner | `component` | Stock shadcn Spinner pattern; Harmony border-ring default; optional `icon` via package Icon |

## Approach & stack fit (locked)

1. **Export `Spinner`** from `@dltkrichardhuska/harmony-design-system-shadcn/components`.
2. **Default visual:** CSS border ring (reference parity) — not Lucide `LoaderIcon`.
3. **Props:** `size` (`sm` \| `md` \| `lg`, default `md`), optional `icon` (Harmony Icon name string) replaces ring with spinning Icon, `className`, a11y defaults, HTML attribute forward + `ref`.
4. **Button dual patterns (docs/demo):** keep `loading` + private spinner; also support nesting `<Spinner />` as children when `loading` is false. Do not replace private spinner with catalog Spinner for `loading`.
5. **Demo:** `/components/spinner` with ImportSnippet; AI docs updated.

### Stack leverage

- Prefer-order step 1 (stock Spinner pattern + file layout)
- Compose synced package `Icon` for override
- Tailwind + `cva` for sizes

### Stack friction

| Item | Mitigation |
|------|------------|
| Stock uses Lucide `LoaderIcon` | Default = Harmony ring; override = Harmony `Icon` |
| Stock sizes via `size-*` only | Keep Harmony `size` prop |
| Stock Button nests Spinner only | Harmony also keeps `loading` prop (dual pattern) |

## Consumer API (user confirmed)

| Field | Value |
|-------|-------|
| Export | `Spinner` |
| Base / analog | Stock shadcn Spinner |
| Harmony props | `size?: 'sm' \| 'md' \| 'lg'`; `icon?: string` |
| Inherited | `className`, `ref`, `aria-label` (default `"Loading"`), safe HTML attrs on root |
| Omissions | No Lucide; no `asChild` |
| Docs | Demo, `docs/components/Spinner.md`, AGENTS / llms; Button docs delta for dual loading |

## Blocking dependencies

None (`Icon` synced; Spinner has no catalog deps).

## Prop mappings / skipped props / composites

- Prop mappings: identity (+ stack `icon` addition)
- Skipped props: none
- Composite equivalents: none
- Gaps: none planned

## Execute checklist

- [x] Record strategy / userDecision; status in-progress
- [x] Implement `packages/ui` Spinner + exports
- [x] Button compose check + Button/Spinner docs dual patterns
- [x] Demo `/components/spinner`
- [x] AGENTS / llms / docs/components/Spinner.md
- [x] Verify Spinner-1 PASS (`verification/reports/Spinner-1.md`)
- [x] Human accept → synced + coverage
