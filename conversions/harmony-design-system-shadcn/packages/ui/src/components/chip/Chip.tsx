import {
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';

const chipVariants = cva(
  [
    'inline-flex items-center justify-center font-sans font-normal',
    'rounded-[var(--radius-04)] border border-solid border-transparent',
    'transition-all whitespace-nowrap select-none',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 px-2 py-1 gap-1 text-[length:var(--overline)] leading-4',
        md: 'h-6 px-2 py-1 gap-1 text-sm leading-5',
        lg: 'h-8 px-2 py-1.5 gap-1 text-base leading-5',
      },
      variant: {
        fill: [
          'bg-primary border-primary text-primary-foreground',
          'hover:bg-[var(--theme-primary-hover)] hover:border-[var(--theme-primary-hover)]',
          'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--card-bg)]',
          'focus-visible:shadow-[var(--focus-ring-primary)]',
          'active:bg-primary',
        ],
        outline: [
          'bg-transparent border-primary text-primary',
          'hover:bg-hover',
          'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--card-bg)]',
          'focus-visible:bg-hover focus-visible:shadow-[var(--focus-ring-primary)]',
          'active:bg-primary active:text-primary-foreground',
        ],
      },
      disabled: {
        true: 'cursor-not-allowed pointer-events-none',
        false: 'cursor-pointer',
      },
      chipType: {
        chip: '',
        'horiz-dots': '',
        'vert-dots': '',
        overflow: '',
      },
    },
    compoundVariants: [
      {
        variant: 'fill',
        disabled: true,
        class:
          'bg-[var(--alert-chip-disabled-bg)] border-[var(--alert-chip-disabled-bg)] text-[var(--alert-chip-disabled-fg)] hover:bg-[var(--alert-chip-disabled-bg)]',
      },
      {
        variant: 'outline',
        disabled: true,
        class:
          'bg-transparent border-[var(--alert-chip-disabled-border)] text-[var(--alert-chip-disabled-fg)] hover:bg-transparent',
      },
      { chipType: 'vert-dots', size: 'sm', class: 'w-4 min-w-4 px-2' },
      { chipType: 'vert-dots', size: 'md', class: 'w-6 min-w-6 px-2' },
      { chipType: 'vert-dots', size: 'lg', class: 'w-8 min-w-8 px-2' },
      { chipType: 'horiz-dots', size: 'sm', class: 'min-w-[14px] px-2' },
      { chipType: 'horiz-dots', size: 'md', class: 'min-w-[18px] px-2' },
      { chipType: 'horiz-dots', size: 'lg', class: 'min-w-6 px-2' },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'fill',
      disabled: false,
      chipType: 'chip',
    },
  },
);

const chipIconSizeMap = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
} as const;

export type ChipSize = NonNullable<VariantProps<typeof chipVariants>['size']>;
export type ChipVariant = NonNullable<VariantProps<typeof chipVariants>['variant']>;
export type ChipType = 'chip' | 'horiz-dots' | 'vert-dots' | 'overflow';

type ChipBase = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** Chip height / padding. */
  size?: ChipSize;
  /** Fill or outline. */
  variant?: ChipVariant;
  /** Disabled appearance and interaction. */
  disabled?: boolean;
  /** Harmony Icon name. */
  icon?: string;
  /** Show remove control. */
  removable?: boolean;
  /** Called when remove is clicked. */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Label when no children (default `"Chip"`). */
  label?: string;
  children?: ReactNode;
};

export type ChipProps =
  | (ChipBase & {
      type?: 'chip';
      overflowCount?: never;
    })
  | (ChipBase & {
      type: 'overflow';
      /** Count shown as `+N`. */
      overflowCount?: number;
    })
  | (ChipBase & {
      type: 'horiz-dots' | 'vert-dots';
      overflowCount?: never;
      onClick?: never;
      onRemove?: never;
      removable?: never;
      icon?: never;
    });

function HorizDots({ size }: { size: ChipSize }) {
  const dims =
    size === 'sm'
      ? 'w-3.5 h-[3px]'
      : size === 'md'
        ? 'w-[18px] h-1'
        : 'w-6 h-[5.333px]';
  return (
    <span className="flex h-full w-full items-center justify-center" aria-label="More options">
      <svg viewBox="0 0 18 4" fill="none" className={cn(dims)} aria-hidden>
        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
        <circle cx="9" cy="2" r="1.5" fill="currentColor" />
        <circle cx="16" cy="2" r="1.5" fill="currentColor" />
      </svg>
    </span>
  );
}

function VertDots({ size }: { size: ChipSize }) {
  const dims =
    size === 'sm'
      ? 'w-0.5 h-[9px]'
      : size === 'md'
        ? 'w-[3.111px] h-[14px]'
        : 'w-[4.148px] h-[18.667px]';
  return (
    <span className="flex h-full w-full items-center justify-center" aria-label="More options">
      <svg viewBox="0 0 4 18" fill="none" className={cn(dims)} aria-hidden>
        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
        <circle cx="2" cy="9" r="1.5" fill="currentColor" />
        <circle cx="2" cy="16" r="1.5" fill="currentColor" />
      </svg>
    </span>
  );
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(props, ref) {
  const {
    size = 'md',
    variant = 'fill',
    disabled = false,
    type = 'chip',
    icon,
    removable = false,
    onRemove,
    label = 'Chip',
    overflowCount = 10,
    className,
    children,
    onClick,
    onKeyDown,
    ...rest
  } = props;

  const classes = cn(chipVariants({ size, variant, disabled, chipType: type }), className);

  if (type === 'horiz-dots' || type === 'vert-dots') {
    return (
      <span ref={ref} className={classes} {...(rest as HTMLAttributes<HTMLSpanElement>)}>
        {type === 'horiz-dots' ? <HorizDots size={size} /> : <VertDots size={size} />}
      </span>
    );
  }

  const interactive = Boolean(onClick) && !disabled;

  return (
    <span
      ref={ref as Ref<HTMLSpanElement>}
      className={classes}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (!interactive) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e as unknown as MouseEvent<HTMLSpanElement>);
        }
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} size={chipIconSizeMap[size]} /> : null}
      {type === 'overflow' ? <span>+{overflowCount ?? 10}</span> : (children ?? label)}
      {removable ? (
        <button
          type="button"
          aria-label="Remove"
          disabled={disabled}
          className={cn(
            'ml-1 inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0 text-inherit',
            size === 'sm' ? 'h-3 w-3' : 'h-4 w-4',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80',
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onRemove?.(e);
          }}
        >
          <Icon name="x-mark" size={chipIconSizeMap[size]} />
        </button>
      ) : null}
    </span>
  );
});

export { chipVariants };
