import { forwardRef, type HTMLAttributes } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const progressBarVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-[var(--border-color)]',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
      },
      variant: {
        default: '[&_[data-slot=indicator]]:bg-primary',
        success: '[&_[data-slot=indicator]]:bg-success',
        warning: '[&_[data-slot=indicator]]:bg-warning',
        error: '[&_[data-slot=indicator]]:bg-error',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
);

export type ProgressBarSize = NonNullable<VariantProps<typeof progressBarVariants>['size']>;
export type ProgressBarVariant = NonNullable<VariantProps<typeof progressBarVariants>['variant']>;

export interface ProgressBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof progressBarVariants> {
  /** Current progress value. */
  value: number;
  /** Maximum value. */
  max?: number;
  /** Progress bar height. */
  size?: ProgressBarSize;
  /** Color variant. */
  variant?: ProgressBarVariant;
  /** Show percentage label below the bar. */
  showLabel?: boolean;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  {
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showLabel = false,
    className,
    ...rest
  },
  ref,
) {
  const safeMax = max <= 0 ? 100 : max;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const percentage = (clamped / safeMax) * 100;

  return (
    <div className={cn('w-full', showLabel && 'space-y-1')} ref={ref} {...rest}>
      <ProgressPrimitive.Root
        value={clamped}
        max={safeMax}
        className={cn(progressBarVariants({ size, variant }), className)}
      >
        <ProgressPrimitive.Indicator
          data-slot="indicator"
          className="h-full w-full rounded-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
      {showLabel ? (
        <span className="mt-1 block text-sm text-secondary">
          {Math.round(percentage)}%
        </span>
      ) : null}
    </div>
  );
});

export { progressBarVariants };
