import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';

const spinnerVariants = cva('inline-block shrink-0 rounded-full', {
  variants: {
    size: {
      sm: 'h-4 w-4 border-[length:var(--border-width-standard)]',
      md: 'h-6 w-6 border-[length:var(--border-width-medium)]',
      lg: 'h-10 w-10 border-[length:var(--border-width-thick)]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const spinnerIconSizeMap = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const;

export type SpinnerSize = NonNullable<VariantProps<typeof spinnerVariants>['size']>;

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof spinnerVariants> {
  /** Harmony Icon name — replaces the default border ring (stock Spinner customization). */
  icon?: string;
  size?: SpinnerSize;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', icon, className, 'aria-label': ariaLabel = 'Loading', ...rest },
  ref,
) {
  if (icon) {
    return (
      <span
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={cn('inline-flex shrink-0 items-center justify-center', className)}
        {...rest}
      >
        <Icon
          name={icon}
          size={spinnerIconSizeMap[size]}
          className="animate-spin motion-reduce:animate-none"
        />
        <span className="sr-only">{ariaLabel}</span>
      </span>
    );
  }

  return (
    <span
      ref={ref}
      role="status"
      aria-label={ariaLabel}
      className={cn(
        spinnerVariants({ size }),
        'animate-spin border-solid border-[color:var(--border-color)] [border-top-color:var(--theme-primary)] motion-reduce:animate-none',
        className,
      )}
      {...rest}
    >
      <span className="sr-only">{ariaLabel}</span>
    </span>
  );
});

export { spinnerVariants };
