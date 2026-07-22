import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Styles child package `Button` elements.
 * Selection = child `variant="primary"` via `data-variant` (not ToggleGroup).
 */
const buttonGroupVariants = cva('inline-flex', {
  variants: {
    variant: {
      default: [
        'gap-2 rounded-[var(--radius-08)] border border-solid',
        'border-border bg-input p-1',
        // Strip child borders — shell provides the only border (reference parity)
        '[&>button]:border-0 [&>a]:border-0',
        '[&>button]:shadow-none [&>a]:shadow-none',
        '[&>button]:rounded-[var(--radius-04)] [&>a]:rounded-[var(--radius-04)]',
        // Unselected (not primary): flat inside shell — :hover on button, not group (Tailwind)
        '[&>button:not([data-variant=primary])]:bg-input',
        '[&>button:not([data-variant=primary])]:text-[var(--theme-btn-secondary-stroke)]',
        '[&>a:not([data-variant=primary])]:bg-input',
        '[&>a:not([data-variant=primary])]:text-[var(--theme-btn-secondary-stroke)]',
        '[&>button:not([data-variant=primary]):hover]:bg-[var(--theme-primary-hover-light)]',
        '[&>a:not([data-variant=primary]):hover]:bg-[var(--theme-primary-hover-light)]',
        // Selected primary keeps filled look; ensure no border
        '[&>button[data-variant=primary]]:border-0 [&>a[data-variant=primary]]:border-0',
        // Disabled (reference: opacity + no pointer events)
        '[&>button:disabled]:cursor-not-allowed [&>button:disabled]:pointer-events-none [&>button:disabled]:opacity-50',
        '[&>a[aria-disabled=true]]:cursor-not-allowed [&>a[aria-disabled=true]]:pointer-events-none [&>a[aria-disabled=true]]:opacity-50',
      ],
      outline: [
        'rounded-[var(--radius-08)]',
        '[&>button]:rounded-none [&>a]:rounded-none',
        '[&>button:first-child]:rounded-l-[var(--radius-08)] [&>a:first-child]:rounded-l-[var(--radius-08)]',
        '[&>button:last-child]:rounded-r-[var(--radius-08)] [&>a:last-child]:rounded-r-[var(--radius-08)]',
        '[&>button:not(:last-child)]:border-r-transparent [&>a:not(:last-child)]:border-r-transparent',
        '[&>button]:-ml-px [&>a]:-ml-px [&>button:first-child]:ml-0 [&>a:first-child]:ml-0',
      ],
    },
    size: {
      sm: '[&>button]:text-sm [&>a]:text-sm',
      md: '',
      lg: '[&>button]:text-base [&>a]:text-base',
    },
    orientation: {
      horizontal: [
        'flex-row items-center',
        // ≤768px: stack full-width (reference responsive)
        'max-md:w-full max-md:flex-col max-md:items-stretch',
        'max-md:[&>button]:w-full max-md:[&>a]:w-full',
        'max-md:[&>button]:rounded-lg max-md:[&>a]:rounded-lg',
        'max-md:[&>button]:ml-0 max-md:[&>a]:ml-0',
        'max-md:[&>button]:-ml-0 max-md:[&>a]:-ml-0',
        'max-md:gap-2',
        // Outline strip → separate bordered buttons on small screens
        'max-md:data-[variant=outline]:[&>button]:border-r-[var(--border-color)]',
        'max-md:data-[variant=outline]:[&>a]:border-r-[var(--border-color)]',
        'max-md:data-[variant=outline]:[&>button]:rounded-lg',
        'max-md:data-[variant=outline]:[&>a]:rounded-lg',
      ],
      vertical: [
        'flex-col items-stretch',
        'data-[variant=default]:gap-0',
        'data-[variant=default]:[&>button]:w-full data-[variant=default]:[&>a]:w-full',
        'data-[variant=outline]:[&>button]:rounded-none data-[variant=outline]:[&>a]:rounded-none',
        'data-[variant=outline]:[&>button:first-child]:rounded-t-[var(--radius-08)] data-[variant=outline]:[&>a:first-child]:rounded-t-[var(--radius-08)]',
        'data-[variant=outline]:[&>button:last-child]:rounded-b-[var(--radius-08)] data-[variant=outline]:[&>a:last-child]:rounded-b-[var(--radius-08)]',
        'data-[variant=outline]:[&>button:not(:last-child)]:border-b-transparent data-[variant=outline]:[&>a:not(:last-child)]:border-b-transparent',
        'data-[variant=outline]:[&>button]:ml-0 data-[variant=outline]:[&>a]:ml-0',
        'data-[variant=outline]:[&>button]:-mt-px data-[variant=outline]:[&>a]:-mt-px',
        'data-[variant=outline]:[&>button:first-child]:mt-0 data-[variant=outline]:[&>a:first-child]:mt-0',
      ],
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    orientation: 'horizontal',
  },
});

export type ButtonGroupVariant = NonNullable<VariantProps<typeof buttonGroupVariants>['variant']>;
export type ButtonGroupSize = NonNullable<VariantProps<typeof buttonGroupVariants>['size']>;
export type ButtonGroupOrientation = NonNullable<
  VariantProps<typeof buttonGroupVariants>['orientation']
>;

export interface ButtonGroupProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {
  /** Shell style: segmented default or connected outline strip. */
  variant?: ButtonGroupVariant;
  /** Applied as hint for child Button sizes (pass matching `size` on children). */
  size?: ButtonGroupSize;
  /** Layout direction. Horizontal stacks full-width below 768px. */
  orientation?: ButtonGroupOrientation;
  /** Package `Button` children. */
  children?: ReactNode;
}

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  {
    variant = 'default',
    size = 'md',
    orientation = 'horizontal',
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      data-variant={variant}
      data-size={size}
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ variant, size, orientation }), className)}
      {...rest}
    >
      {children}
    </div>
  );
});

export { buttonGroupVariants };
