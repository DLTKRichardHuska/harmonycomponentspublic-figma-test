import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  Children,
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button } from '../button';
import { Icon } from '../icon';

/** Root — Radix Dialog (shadcn pattern). */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-[var(--z-modal)] bg-[var(--overlay-backdrop-opacity)]',
        className,
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva(
  [
    'fixed left-1/2 top-1/2 z-[var(--z-modal)] flex max-h-[var(--dialog-max-height)]',
    'w-[var(--dialog-width-percentage)] min-w-[min(100%,var(--dialog-min-width))]',
    'max-w-[var(--dialog-max-width-default)] -translate-x-1/2 -translate-y-1/2',
    'flex-col overflow-hidden rounded-xl border border-solid',
    'border-border bg-card shadow-xl',
    'md:max-w-[var(--dialog-max-width-default)]',
    'max-md:w-[calc(100vw-var(--dialog-margin-horizontal))] max-md:max-w-full',
    'max-md:max-h-[calc(100vh-var(--dialog-margin-vertical))]',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
);

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {
  /** Show the default top-right close control (Icon x-mark). */
  showCloseButton?: boolean;
}

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent(
  {
    className,
    children,
    showCloseButton = true,
    ...props
  },
  ref,
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        className={cn(dialogContentVariants(), 'group/dialog', className)}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close
            className={cn(
              'absolute right-4 top-4 z-10 inline-flex',
              'items-center justify-center rounded-sm border-0',
              'bg-transparent p-1 text-muted-foreground',
              'transition-colors hover:text-foreground',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
              'focus-visible:outline-primary',
              'group-has-[[data-dialog-header-variant=primary]]/dialog:text-primary-foreground',
              'group-has-[[data-dialog-header-variant=primary]]/dialog:hover:text-primary-foreground',
              'group-has-[[data-dialog-header-variant=primary]]/dialog:hover:opacity-80',
            )}
            aria-label="Close"
          >
            <Icon name="x-mark" size="sm" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header background — Harmony `default` | `primary`. */
  variant?: 'default' | 'primary';
  children?: ReactNode;
}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(
  { className, variant = 'default', children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="dialog-header"
      data-variant={variant}
      data-dialog-header-variant={variant}
      className={cn(
        'flex shrink-0 items-center justify-between gap-3',
        'border-b border-solid border-border',
        'px-6 py-4 pr-[calc(var(--space-6)+var(--space-8))]',
        'bg-card',
        variant === 'primary' &&
          'border-primary bg-primary text-primary-foreground',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
DialogHeader.displayName = 'DialogHeader';

export interface DialogTitleProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        'm-0 font-display text-lg',
        'font-[number:var(--font-semibold)] text-foreground',
        '[[data-variant=primary]_&]:text-primary-foreground',
        '[[data-dialog-header-variant=primary]_&]:text-primary-foreground',
        className,
      )}
      {...props}
    />
  );
});
DialogTitle.displayName = DialogPrimitive.Title.displayName;

export interface DialogDescriptionProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('m-0 text-sm text-secondary', className)}
      {...props}
    />
  );
});
DialogDescription.displayName = DialogPrimitive.Description.displayName;

/** Scrollable body region when you need a non-Description container. */
export interface DialogBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(function DialogBody(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-slot="dialog-body"
      className={cn(
        'flex-1 min-h-0 max-h-[600px] overflow-y-auto px-6 py-6',
        'text-secondary',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
DialogBody.displayName = 'DialogBody';

export type DialogButtonAlignment = 'left' | 'right';

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Button row alignment — Harmony `left` (default) | `right`. */
  buttonAlignment?: DialogButtonAlignment;
  /** Convenience — primary confirm label (renders when no children). */
  confirmLabel?: string;
  /** Convenience — confirm click (then closes via DialogClose unless prevented). */
  onConfirm?: () => void;
  /** Convenience — cancel label (default `"Cancel"` when confirmLabel set). */
  cancelLabel?: string;
  /** Convenience — cancel click. */
  onCancel?: () => void;
  /** Convenience — tertiary / link-style button label. */
  tertiaryLabel?: string;
  /** Convenience — tertiary click. */
  onTertiary?: () => void;
  children?: ReactNode;
}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(function DialogFooter(
  {
    className,
    buttonAlignment = 'left',
    confirmLabel,
    onConfirm,
    cancelLabel = 'Cancel',
    onCancel,
    tertiaryLabel,
    onTertiary,
    children,
    ...rest
  },
  ref,
) {
  const hasChildren = Children.count(children) > 0;
  const useConvenience = !hasChildren && Boolean(confirmLabel);

  const actions = useConvenience ? (
    <div className="flex flex-wrap gap-3">
      {buttonAlignment === 'left' ? (
        <>
          <DialogClose asChild>
            <Button buttonType="theme" type="button" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button buttonType="theme" variant="secondary" type="button" onClick={onCancel}>
              {cancelLabel}
            </Button>
          </DialogClose>
          {tertiaryLabel ? (
            <DialogClose asChild>
              <Button buttonType="theme" variant="tertiary" type="button" onClick={onTertiary}>
                {tertiaryLabel}
              </Button>
            </DialogClose>
          ) : null}
        </>
      ) : (
        <>
          {tertiaryLabel ? (
            <DialogClose asChild>
              <Button buttonType="theme" variant="tertiary" type="button" onClick={onTertiary}>
                {tertiaryLabel}
              </Button>
            </DialogClose>
          ) : null}
          <DialogClose asChild>
            <Button buttonType="theme" variant="secondary" type="button" onClick={onCancel}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button buttonType="theme" type="button" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </DialogClose>
        </>
      )}
    </div>
  ) : (
    children
  );

  return (
    <div
      ref={ref}
      data-slot="dialog-footer"
      className={cn(
        'flex shrink-0 gap-3 border-t border-solid border-border',
        'bg-[var(--elevated-bg)] px-6 py-4',
        buttonAlignment === 'right' ? 'justify-end' : 'justify-start',
        className,
      )}
      {...rest}
    >
      {actions}
    </div>
  );
});
DialogFooter.displayName = 'DialogFooter';

export { dialogContentVariants };
