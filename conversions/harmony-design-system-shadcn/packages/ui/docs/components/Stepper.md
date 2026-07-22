# Stepper + Step

Progress through numbered/logical steps. Custom compound (no Radix primitive) using `cva` state variants + Harmony tokens. `Stepper` clones its `Step` children to inject index/state via context. State icons use the package **Icon**.

## Import

```tsx
import {
  Stepper,
  Step,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## Usage

```tsx
<Stepper activeStep={1}>
  <Step completed success>Account</Step>
  <Step>Profile</Step>
  <Step>Review</Step>
</Stepper>

{/* Non-linear: every step clickable; wire onStepClick */}
<Stepper activeStep={active} nonLinear onStepClick={setActive}>
  <Step icon="home">Overview</Step>
  <Step icon="user">Profile</Step>
  <Step disabled description="Temporarily unavailable">Payment</Step>
</Stepper>
```

## Props

### Stepper

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeStep` | `number` | `0` | Zero-based active step index |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `nonLinear` | `boolean` | `false` | All steps clickable (no auto-disable) |
| `onStepClick` | `(index: number) => void` | — | Replaces the Astro `stepper:step-clicked` event |
| `className` / `ref` | — | — | On the container div |

### Step

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `completed` / `disabled` | `boolean` | `false` | Step state |
| `error` / `warning` / `success` | `boolean` | `false` | Semantic state (priority: error > warning > success > completed) |
| `icon` | `string` | — | Harmony Icon name; replaces the number |
| `description` | `ReactNode` | — | Text below the label (replaces Astro `slot="description"`) |
| `children` | `ReactNode` | — | Step label |
| `className` / `ref` | — | — | On the step div |

## Divergences (not skips)

- Linear auto-disable + auto-numbering run in React (context/clone), not an Astro `data-*` init script.
- `stepper:step-clicked` DOM event → `onStepClick(index)`.
- `slot="description"` → `description` prop.

Demo: `/components/stepper`.

## If you were about to use stock shadcn

| Stock / mistaken | Harmony |
|------------------|---------|
| MUI-style `steps={[]}` array | Compose `Step` children |
| Lucide state icons | Package `Icon` (`check`, `exclamation-circle`, …) |
| DOM `stepper:step-clicked` | `onStepClick` callback |

## Do not

- Invent a `steps[]` package API without Consumer API sign-off
- Import Lucide for state icons
