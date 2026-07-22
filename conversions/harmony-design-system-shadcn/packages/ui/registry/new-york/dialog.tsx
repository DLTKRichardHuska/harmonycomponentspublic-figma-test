/**
 * Harmony registry shim — re-exports the package Dialog.
 * Do not replace with stock shadcn components or Lucide icons.
 *
 * Preferred (apps): import from the package directly:
 *   import { … } from '@dltkrichardhuska/harmony-design-system-shadcn'
 */
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  dialogContentVariants,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type DialogBodyProps,
  type DialogFooterProps,
  type DialogButtonAlignment,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
