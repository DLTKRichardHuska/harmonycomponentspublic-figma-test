import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const toggleVariants = cva(
  [
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-0',
    'bg-[var(--border-color)] transition-colors',
    'focus-visible:outline-none focus-visible:shadow-[var(--focus-ring-primary)]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-primary',
  ],
  {
    variants: {
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const toggleThumbVariants = cva(
  [
    'pointer-events-none block rounded-full bg-white shadow-sm',
    'transition-transform',
    'data-[state=unchecked]:translate-x-[var(--space-0-5)]',
  ],
  {
    variants: {
      size: {
        sm: [
          'h-4 w-4',
          'data-[state=checked]:translate-x-[calc(var(--space-9)-var(--space-4)-var(--space-0-5))]',
        ],
        md: [
          'h-5 w-5',
          'data-[state=checked]:translate-x-[calc(var(--space-11)-var(--space-5)-var(--space-0-5))]',
        ],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type ToggleSize = NonNullable<VariantProps<typeof toggleVariants>['size']>;

export interface ToggleProps
  extends Omit<ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'asChild'>,
    VariantProps<typeof toggleVariants> {}

export const Toggle = forwardRef<ElementRef<typeof SwitchPrimitive.Root>, ToggleProps>(
  function Toggle({ className, size = 'md', ...rest }, ref) {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        className={cn(toggleVariants({ size }), className)}
        {...rest}
      >
        <SwitchPrimitive.Thumb className={cn(toggleThumbVariants({ size }))} />
      </SwitchPrimitive.Root>
    );
  },
);

export { toggleVariants, toggleThumbVariants };
