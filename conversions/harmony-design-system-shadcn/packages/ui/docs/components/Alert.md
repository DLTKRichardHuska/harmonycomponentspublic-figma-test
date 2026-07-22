# Alert

Harmony inline alert — stock [shadcn Alert](https://ui.shadcn.com/docs/components/alert) compound pieces (`AlertTitle` / `AlertDescription` / `AlertAction`) with Harmony severity tokens. Layout uses `appearance` (not Astro `style`).

## Import

```tsx
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
  alertVariants,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

Requires `HarmonyThemeProvider` and package styles (see Getting Started).

## Props (convenience `Alert`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Severity |
| `appearance` | `'default' \| 'enhanced'` | `'default'` | Layout — Astro used `style`; stack uses `appearance` |
| `title` | `string` | — | Title text (renders `AlertTitle`) |
| `dismissible` | `boolean` | `false` | Show dismiss control |
| `onDismiss` | `() => void` | — | Dismiss activated — **controlled** (does not unmount) |
| `icon` | `string` | severity default | Harmony `Icon` name override |
| `primaryAction` | `{ label, onClick?, href? }` | — | Enhanced primary `Button` |
| `secondaryAction` | `{ label, onClick?, href? }` | — | Enhanced secondary `Button` |
| `linkText` | `string` | — | Enhanced inline link label |
| `linkHref` | `string` | — | Enhanced inline link href |
| `progressValue` | `number` | — | Enhanced — composes package `ProgressBar` (0–100) |
| `className` | `string` | — | Extra classes |
| `children` | `ReactNode` | — | Body (wrapped in `AlertDescription`) |

### Compound exports

| Export | Role |
|--------|------|
| `AlertTitle` | Title slot |
| `AlertDescription` | Body slot |
| `AlertAction` | Actions row slot |
| `alertVariants` | `cva` shell |

## Inherited / events

Root is `<div role="alert">` with forwarded `ref` + `HTMLAttributes` (`title` / `style` omitted from the HTML attribute set so Harmony `title` / no inline style collision). Dismiss uses `onDismiss` — not automatic removal from the tree.

```tsx
<Alert variant="success" title="Saved">Your changes were stored.</Alert>

<Alert
  appearance="enhanced"
  variant="warning"
  title="Syncing"
  dismissible
  onDismiss={() => setOpen(false)}
  progressValue={45}
  primaryAction={{ label: 'Retry', onClick: () => retry() }}
  linkText="Learn more"
  linkHref="/docs"
>
  Upload in progress.
</Alert>
```

## Behavior notes

- **Default icons:** `info→information-circle`, `success→check-circle`, `warning→exclamation-triangle`, `error→exclamation-circle`.
- **Enhanced:** left accent bar, optional actions / link / `ProgressBar` (`size="sm"`; maps `info` → ProgressBar `default`).
- **Dismiss:** calls `onDismiss` only — parent must hide/remove the alert.
- **Compound:** you can compose `AlertTitle` / `AlertDescription` / `AlertAction` when building custom layouts; convenience props cover the common Astro-shaped API.

## Composition recipes

```tsx
{/* Controlled dismiss */}
{open ? (
  <Alert variant="error" title="Failed" dismissible onDismiss={() => setOpen(false)}>
    Could not save.
  </Alert>
) : null}

{/* Progress compose (same as progressValue) */}
<Alert appearance="enhanced" variant="info" title="Import">
  Working…
</Alert>
{/* or nest: */}
import { ProgressBar } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
<ProgressBar value={60} size="sm" />
```

## If you were about to use stock shadcn Alert

| Stock shadcn | Harmony |
|--------------|---------|
| `Alert` + `AlertTitle` + `AlertDescription` | Same + `AlertAction` + convenience props |
| No severity tokens / Lucide icon child | `variant` + default / `icon` Harmony names |
| Manual action row | `primaryAction` / `secondaryAction` / `linkText`+`linkHref` or `AlertAction` |
| No progress | `progressValue` → package `ProgressBar` |
| Astro `style="enhanced"` | `appearance="enhanced"` |

## Do not

- Pass Astro `style` for layout — use `appearance`
- Expect dismiss to unmount the alert — handle with `onDismiss` state
- Import Lucide for alert icons — use defaults or `icon` + Harmony names
