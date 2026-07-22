import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 box-border',
    'font-display font-normal leading-normal rounded-full',
    'border border-solid',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-[var(--elevated-bg)] text-secondary border-border',
        primary:
          'bg-[var(--alert-chip-blue-bg)] text-[var(--alert-chip-blue-fg)] border-[var(--alert-chip-blue-fg)]',
        success:
          'bg-[var(--alert-chip-success-bg)] text-[var(--alert-chip-success-fg)] border-[var(--alert-chip-success-fg)]',
        warning:
          'bg-[var(--alert-chip-warning-bg)] text-[var(--alert-chip-warning-fg)] border-[var(--alert-chip-warning-fg)]',
        error:
          'bg-[var(--alert-chip-error-bg)] text-[var(--alert-chip-error-fg)] border-[var(--alert-chip-error-fg)]',
        info: 'bg-[var(--alert-chip-info-bg)] text-[var(--alert-chip-info-fg)] border-[var(--alert-chip-info-fg)]',
        orange:
          'bg-[var(--alert-chip-orange-bg)] text-[var(--alert-chip-orange-fg)] border-[var(--alert-chip-orange-fg)]',
        pink: 'bg-[var(--alert-chip-pink-bg)] text-[var(--alert-chip-pink-fg)] border-[var(--alert-chip-pink-fg)]',
        disabled:
          'bg-[var(--alert-chip-disabled-bg)] text-[var(--alert-chip-disabled-fg)] border-[var(--alert-chip-disabled-border)]',
      },
      size: {
        sm: 'h-[var(--badge-height-sm)] min-h-[var(--badge-height-sm)] px-1.5 text-[0.625rem] leading-none',
        md: 'h-[var(--badge-height-md)] min-h-[var(--badge-height-md)] px-1.5 text-xs leading-tight',
        lg: 'h-[var(--badge-height-lg)] min-h-[var(--badge-height-lg)] px-2 text-[0.875rem] leading-normal',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'lg',
    },
  },
);

const badgeIconSizeMap = {
  sm: 'xs',
  md: 'xs',
  lg: 'sm',
} as const;

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;
export type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>['size']>;

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Visual style (Alert Chip colors). */
  variant?: BadgeVariant;
  /**
   * Size — stack `sm` | `md` | `lg` (maps Astro `small` | `medium` | `large`).
   * Default `lg` matches reference default large.
   */
  size?: BadgeSize;
  /** Harmony Icon name for a leading icon. */
  icon?: string;
  /** Badge label. */
  children?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'default', size = 'lg', icon, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...rest}>
      {icon ? <Icon name={icon} size={badgeIconSizeMap[size]} /> : null}
      {children}
    </span>
  );
});

export { badgeVariants };
