---
scope: Stepper + Step
conversion: harmony-design-system-shadcn
status: done
referenceVersion: 0.9.0
strategy: component
blockedBy: []
---

# Plan: Stepper + Step -> shadcn

`Stepper` and `Step` share one reference doc page (`/components/stepper`), so they ship together as one compound component family.

## Element strategy

- **Stepper** -- `component`
- **Step** -- `component`

## Dependency gate

Only catalog dependency is `Icon` (`synced`). Gate passes. `Button` is not required.

## Approach & stack fit

No Radix primitive exists for a stepper. Build a custom compound component with `cva` state variants + Tailwind token utilities, mirroring the reference DOM/CSS (`src/styles/components.css` ~4463-4960). State derivation (linear auto-disable, auto-numbering, connector activation) moves from the Astro `data-*` init script into React: `Stepper` clones its `Step` children to inject resolved index/state via a `StepperContext`.

## Consumer API (user confirmed)

- `Stepper`
  - `activeStep?: number` (default `0`, zero-based)
  - `orientation?: 'horizontal' | 'vertical'` (default `'horizontal'`)
  - `nonLinear?: boolean` (default `false`)
  - `onStepClick?: (index: number) => void` (fires only in non-linear mode)
  - `className`, native `div` props; children are `Step`s.
- `Step`
  - `completed?`, `disabled?`, `error?`, `warning?`, `success?` (booleans)
  - `icon?: string` (Harmony Icon name, overrides the number)
  - `description?: ReactNode` (replaces the Astro `slot="description"`)
  - children = label; `className`.
- State-icon priority: error > warning > success > completed > number. Custom `icon` overrides all.

## Divergences (not skips)

- Linear auto-disable + auto-numbering handled via React context/clone instead of the Astro init script.
- `stepper:step-clicked` custom DOM event -> `onStepClick(index)` callback.
- `slot="description"` -> `description` prop.

## Files

- `packages/ui/src/components/stepper/{Stepper.tsx,Step.tsx,index.ts}`
- barrel export in `packages/ui/src/components/index.ts`
- demo `apps/demo/src/demo/converted/Stepper/{SteppersDemo.tsx,index.ts}` (7 reference sections)
- route + nav already present in `demoNavigation.ts`; wire `App.tsx`
- AI artifacts: `docs/components/Stepper.md`, `docs/components/Step.md`, `docs/components/README.md`, `AGENTS.md`, `llms.txt`, `registry.json`
- manifest: set `Stepper` + `Step` strategy/status
