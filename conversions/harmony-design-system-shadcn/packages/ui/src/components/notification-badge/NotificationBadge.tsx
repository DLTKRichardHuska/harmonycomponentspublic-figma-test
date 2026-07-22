import {
  Children,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const notificationBadgeVariants = cva(
  [
    'inline-flex items-center justify-center',
    'font-sans font-medium text-[10px] leading-none',
    'text-[var(--text-inverse,#ffffff)] rounded-full whitespace-nowrap box-border',
  ],
  {
    variants: {
      type: {
        dot: 'aspect-square rounded-full',
        number: 'min-h-[15px]',
        overflow: 'min-h-[15px]',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
      variant: {
        error: 'bg-[var(--notification-badge-error)]',
        primary: 'bg-primary',
      },
      border: {
        true: 'border border-solid border-[var(--text-inverse,#ffffff)]',
        false: '',
      },
    },
    compoundVariants: [
      { type: 'dot', size: 'sm', border: false, class: 'w-[var(--badge-dot-size-sm)] h-[var(--badge-dot-size-sm)]' },
      { type: 'dot', size: 'md', border: false, class: 'w-[var(--badge-dot-size-sm)] h-[var(--badge-dot-size-sm)]' },
      { type: 'dot', size: 'lg', border: false, class: 'w-[var(--badge-dot-size-sm)] h-[var(--badge-dot-size-sm)]' },
      { type: 'dot', size: 'sm', border: true, class: 'w-[var(--badge-dot-size-md)] h-[var(--badge-dot-size-md)]' },
      { type: 'dot', size: 'md', border: true, class: 'w-[var(--badge-dot-size-md)] h-[var(--badge-dot-size-md)]' },
      { type: 'dot', size: 'lg', border: true, class: 'w-[var(--badge-dot-size-md)] h-[var(--badge-dot-size-md)]' },
      {
        type: 'number',
        size: 'sm',
        border: false,
        class: 'min-w-[var(--badge-dot-size-lg)] px-1',
      },
      {
        type: 'overflow',
        size: 'sm',
        border: false,
        class: 'min-w-[var(--badge-dot-size-lg)] px-1',
      },
      {
        type: 'number',
        size: 'md',
        border: false,
        class: 'min-w-[var(--badge-dot-size-lg)] px-1',
      },
      {
        type: 'overflow',
        size: 'md',
        border: false,
        class: 'min-w-[var(--badge-dot-size-lg)] px-1',
      },
      { type: 'number', size: 'lg', border: false, class: 'px-[5px]' },
      { type: 'overflow', size: 'lg', border: false, class: 'px-[5px]' },
      {
        type: 'number',
        size: 'sm',
        border: true,
        class:
          'min-h-[var(--badge-height-sm)] min-w-[var(--badge-min-width-sm)] py-1 px-1.5',
      },
      {
        type: 'overflow',
        size: 'sm',
        border: true,
        class:
          'min-h-[var(--badge-height-sm)] min-w-[var(--badge-min-width-sm)] py-1 px-1.5',
      },
      {
        type: 'number',
        size: 'md',
        border: true,
        class:
          'min-h-[var(--badge-height-md)] min-w-[var(--badge-min-width-md)] py-1 px-1.5',
      },
      {
        type: 'overflow',
        size: 'md',
        border: true,
        class:
          'min-h-[var(--badge-height-md)] min-w-[var(--badge-min-width-md)] py-1 px-1.5',
      },
      {
        type: 'number',
        size: 'lg',
        border: true,
        class:
          'min-h-[var(--badge-height-lg)] min-w-[var(--badge-min-width-lg)] py-1 px-2',
      },
      {
        type: 'overflow',
        size: 'lg',
        border: true,
        class:
          'min-h-[var(--badge-height-lg)] min-w-[var(--badge-min-width-lg)] py-1 px-2',
      },
    ],
    defaultVariants: {
      type: 'number',
      size: 'md',
      variant: 'primary',
      border: false,
    },
  },
);

export type NotificationBadgeType = NonNullable<VariantProps<typeof notificationBadgeVariants>['type']>;
export type NotificationBadgeSize = NonNullable<VariantProps<typeof notificationBadgeVariants>['size']>;
export type NotificationBadgeVariant = NonNullable<
  VariantProps<typeof notificationBadgeVariants>['variant']
>;

type NotificationBadgeBase = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** Indicator size. */
  size?: NotificationBadgeSize;
  /** Color variant. */
  variant?: NotificationBadgeVariant;
  /** White border for contrast on dark anchors. */
  border?: boolean;
  /**
   * Optional anchor (Icon, Button, Avatar, …).
   * When set, the badge auto-positions at the top-right — no manual absolute wrapper.
   * Omit for a standalone indicator.
   */
  children?: ReactNode;
};

export type NotificationBadgeProps =
  | (NotificationBadgeBase & {
      /** Dot indicator — no value. */
      type: 'dot';
      value?: never;
    })
  | (NotificationBadgeBase & {
      /** Numeric count. */
      type?: 'number';
      /** Displayed count. */
      value?: string | number;
    })
  | (NotificationBadgeBase & {
      /** Overflow text (e.g. `99+`). */
      type: 'overflow';
      /** Overflow label. */
      value?: string | number;
    });

export const NotificationBadge = forwardRef<HTMLSpanElement, NotificationBadgeProps>(
  function NotificationBadge(
    {
      type = 'number',
      size = 'md',
      variant = 'primary',
      border = false,
      value = 1,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const displayValue = type === 'dot' ? '' : String(value ?? 1);
    const ariaLabel =
      type === 'dot' ? 'Notification indicator' : `${displayValue} notifications`;

    const pill = (
      <span
        ref={children ? undefined : ref}
        className={cn(
          notificationBadgeVariants({ type, size, variant, border: border ? true : false }),
          children && 'absolute -right-1 -top-1 z-[1]',
          !children && className,
        )}
        aria-label={ariaLabel}
        {...(children ? {} : rest)}
      >
        {displayValue}
      </span>
    );

    if (Children.count(children) > 0) {
      return (
        <span
          ref={ref}
          className={cn('relative inline-flex shrink-0', className)}
          {...rest}
        >
          {children}
          {pill}
        </span>
      );
    }

    return pill;
  },
);

export { notificationBadgeVariants };
