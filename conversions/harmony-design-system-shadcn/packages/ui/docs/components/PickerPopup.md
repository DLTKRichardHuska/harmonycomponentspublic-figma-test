# PickerPopup

Catalog shell for picker panels — Radix Popover with optional titled header.

Prefer composing `Popover` / `PopoverTrigger` / `PopoverContent` / `PopoverAnchor` for custom UIs (shadcn pattern).

## Import

```tsx
import {
  PickerPopup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
```

## PickerPopup props

| Prop | Type | Description |
|------|------|-------------|
| `trigger` | `ReactNode` | Trigger element (`asChild` wrapped) |
| `open` / `onOpenChange` / `defaultOpen` | controlled / uncontrolled | Open state |
| `title` | `string` | Optional header with close button |
| `children` | `ReactNode` | Panel content |
| `align` | `'start' \| 'center' \| 'end'` | Content alignment |

Escape and outside click dismiss via Radix Popover.
