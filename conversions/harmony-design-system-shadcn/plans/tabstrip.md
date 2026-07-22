---
scope: TabStrip
conversion: harmony-design-system-shadcn
status: done
referenceVersion: 0.9.0
strategy: component
blockedBy: []
---

# Plan: TabStrip -> shadcn

Full parity, composition-first. Reference `src/components/ui/TabStrip.astro` (doc `/components/tab-strip`, 12 example sections). Base: `@radix-ui/react-tabs`.

## Element strategy

- **TabStrip** -- `component` (exported as compound `Tabs` family).

## Dependency gate

Catalog dependency: `Icon` (`synced`). `Button` (`synced`) used by composition for actions/add-tab. Gate passes.

## Approach & stack fit

Replace the Astro data-driven `tabs[]` array + baked-in overflow/menus with an idiomatic Radix **compound** API so consumers compose buttons/menus into the list and triggers.

- `Tabs` = `Tabs.Root` (`value`/`defaultValue`/`onValueChange`, `orientation`, `activationMode`).
- `TabsList` = styled `Tabs.List`; `cva` `variant: 'default' | 'compact' | 'pill'` (pill gated to product `vp`); `overflow?: 'none' | 'scroll' | 'menu'`; accepts composed children (add-tab button, overflow menu).
- `TabsTrigger` = `Tabs.Trigger`; `value`, `icon?: string`, `iconPosition?: 'left' | 'right' | 'top'`, `disabled`; children = label; optional `actions?: ReactNode` per-tab toolbar slot.
- `TabsContent` = `Tabs.Content` (optional panels; replaces Astro `tab-0..9` named slots).

## Advanced functionality (phased)

1. **2a core** -- variants, icons + iconPosition, disabled, keyboard (Radix roving focus).
2. **2b actions + add-tab** -- per-tab close/open-new/kebab and add-tab via composition (`TabsTrigger.actions` slot + composed `Button`/`DropdownMenu`); reference custom events -> React callbacks (documented mapping table).
3. **2c overflow** -- `overflow="scroll"` (Tailwind overflow-x-auto) and `overflow="menu"` (auto): `useTabOverflow` ResizeObserver hook hides overflowing triggers into a `DropdownMenu`, mirroring Astro auto mode; manual mode = consumer-provided overflow items.

## Menu dependency (confirmed)

Kebab/overflow menus use `@radix-ui/react-dropdown-menu` (new package + internal `DropdownMenu` component), NOT `Select`. The `DropdownMenu` file **independently inlines the same Tailwind token utilities as `Select`** so all popovers look identical: content `rounded-lg border border-solid border-border bg-card shadow-lg` + `z-[var(--z-dropdown)]` + `max-h-[var(--dropdown-menu-max-height)]`; item `flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-4 py-2 text-sm text-foreground outline-none transition-colors focus:bg-hover data-[highlighted]:bg-hover`. Consistency comes from shared **theme tokens**, not a shared class module. Do NOT extract `menuStyles.ts` or refactor `Select` (idiomatic shadcn copy-paste files).

## Divergences (not skips)

- `tabs[]` data array -> compound children.
- named content slots -> `TabsContent`.
- custom DOM events (`tab-strip:tab-selected`, `close-tab`, `open-new-window`, `set-default`, `add-tab`) -> React props/callbacks.

## Files

- `packages/ui/src/components/tabs/{Tabs.tsx,useTabOverflow.ts,index.ts}`
- `packages/ui/src/components/dropdown-menu/{DropdownMenu.tsx,index.ts}`
- barrel export in `packages/ui/src/components/index.ts`
- demo `apps/demo/src/demo/converted/TabStrip/{TabStripsDemo.tsx,index.ts}` (12 sections; VP pill gated)
- route + nav already present in `demoNavigation.ts`; wire `App.tsx`
- AI artifacts: `docs/components/TabStrip.md`, `docs/components/DropdownMenu.md`, `docs/components/README.md`, `AGENTS.md`, `llms.txt`, `registry.json`
- deps: `@radix-ui/react-tabs`, `@radix-ui/react-dropdown-menu`
- manifest: set `TabStrip` strategy/status
