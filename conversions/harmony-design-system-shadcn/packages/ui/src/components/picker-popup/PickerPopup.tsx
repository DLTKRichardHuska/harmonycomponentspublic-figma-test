import * as PopoverPrimitive from '@radix-ui/react-popover';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';

/** Root — Radix Popover (shadcn pattern). */
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;

export const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(function PopoverContent(
  { className, align = 'start', sideOffset = 4, ...props },
  ref,
) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-auto rounded-lg border border-solid border-border',
          'bg-[var(--elevated-bg)] p-3 text-foreground shadow-md',
          'outline-none data-[state=open]:animate-in data-[state=closed]:animate-out',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});

export interface PickerPopupProps {
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Default open (uncontrolled). */
  defaultOpen?: boolean;
  /** Trigger element (wrapped as PopoverTrigger). */
  trigger: ReactNode;
  /** Optional dialog title with close button. */
  title?: string;
  children?: ReactNode;
  contentClassName?: string;
  align?: 'start' | 'center' | 'end';
}

/**
 * Harmony catalog shell for picker panels — Radix Popover with optional titled header.
 * Prefer composing `Popover` / `PopoverTrigger` / `PopoverContent` directly when building custom UIs.
 */
export function PickerPopup({
  open,
  onOpenChange,
  defaultOpen,
  trigger,
  title,
  children,
  contentClassName,
  align = 'start',
}: PickerPopupProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align={align} className={cn('min-w-[280px]', contentClassName)}>
        {title ? (
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="m-0 text-sm font-semibold text-foreground">{title}</h3>
            <PopoverPrimitive.Close asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon="x-mark"
                aria-label="Close picker"
                className="text-muted-foreground"
              />
            </PopoverPrimitive.Close>
          </div>
        ) : null}
        {children}
      </PopoverContent>
    </Popover>
  );
}

export type { PopoverPrimitive as PopoverPrimitives };
