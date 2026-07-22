# Dialog

Harmony modal — [shadcn Dialog](https://ui.shadcn.com/docs/components/dialog) on **`@radix-ui/react-dialog`** with Harmony sticky header/footer, token widths, and optional confirm/cancel footer convenience.

## Import

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Button,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

Requires `HarmonyThemeProvider` and package styles (see Getting Started).

## Composition

```text
Dialog
├── DialogTrigger (prefer asChild + Button)
└── DialogContent
    ├── DialogHeader (variant default|primary)
    │   ├── DialogTitle
    │   └── DialogDescription? (optional / sr-only)
    ├── DialogBody (scrollable)
    └── DialogFooter (buttonAlignment; optional confirm convenience)
```

## Props

### `Dialog` (Radix Root)

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Controlled open |
| `onOpenChange` | `(open: boolean) => void` | Open change |
| `defaultOpen` | `boolean` | Uncontrolled default |

### `DialogContent`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showCloseButton` | `boolean` | `true` | Top-right `Icon name="x-mark"` close |
| `className` | `string` | — | Extra classes |

Also forwards Radix Content props (`onOpenAutoFocus`, `onEscapeKeyDown`, …).

### `DialogHeader`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary'` | `'default'` | Header background |

### `DialogFooter`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttonAlignment` | `'left' \| 'right'` | `'left'` | Action alignment |
| `confirmLabel` | `string` | — | Convenience primary (when **no** children) |
| `onConfirm` | `() => void` | — | Confirm handler |
| `cancelLabel` | `string` | `'Cancel'` | Convenience cancel |
| `onCancel` | `() => void` | — | Cancel handler |
| `tertiaryLabel` | `string` | — | Tertiary / link-style |
| `onTertiary` | `() => void` | — | Tertiary handler |

**Precedence:** footer `children` win over convenience props. Convenience buttons use package `Button` `buttonType="theme"` and wrap `DialogClose`.

## Examples

```tsx
{/* Convenience footer */}
<Dialog>
  <DialogTrigger asChild>
    <Button type="button">Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm</DialogTitle>
    </DialogHeader>
    <DialogBody>Are you sure?</DialogBody>
    <DialogFooter confirmLabel="Confirm" cancelLabel="Cancel" onConfirm={() => save()} />
  </DialogContent>
</Dialog>

{/* Composed footer + primary header */}
<Dialog>
  <DialogTrigger asChild>
    <Button type="button">Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader variant="primary">
      <DialogTitle>Primary Header</DialogTitle>
    </DialogHeader>
    <DialogBody>…</DialogBody>
    <DialogFooter buttonAlignment="right">
      <DialogClose asChild>
        <Button buttonType="theme" variant="secondary" type="button">Cancel</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button buttonType="theme" type="button">Confirm</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Behavior notes

- Sticky header/footer; only `DialogBody` scrolls (`max-height` ~600px).
- Width tokens: `--dialog-min-width` (600px), `--dialog-max-width-default` (700px).
- Close icon is package `Icon` — never Lucide.
- **Skipped:** Astro `resizable` resize grip — see demo callout / manifest gap.
- **Skipped:** Astro `openDialog` / `closeDialog` globals and `confirmCallbackName` — use Radix controlled API.

## If you were about to use stock shadcn / Lucide / openDialog

- Use package Dialog + `Button` + `Icon name="x-mark"`.
- Prefer `DialogTrigger asChild` wrapping package `Button`.
- Do **not** call `window.openDialog` / `closeDialog`.

## Do not

- Import Lucide for the close control.
- Rely on Astro `id`-based overlays or global callback name strings.

## Demo

`/components/dialogs`
