import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipContentProps
  extends ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /** Convenience body text (children win when both set). */
  text?: string;
  /** Harmony position → Radix `side`. */
  position?: TooltipPosition;
}

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(function TooltipContent(
  { className, text, position = 'top', side, sideOffset = 8, children, ...rest },
  ref,
) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        side={side ?? position}
        sideOffset={sideOffset}
        className={cn(
          'z-[var(--z-tooltip)] max-w-xs rounded-md px-3 py-2',
          'bg-[var(--text-primary)] text-xs text-primary-foreground',
          'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1',
          'data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
          className,
        )}
        {...rest}
      >
        {children ?? text}
        <TooltipPrimitive.Arrow className="fill-[var(--text-primary)]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});
