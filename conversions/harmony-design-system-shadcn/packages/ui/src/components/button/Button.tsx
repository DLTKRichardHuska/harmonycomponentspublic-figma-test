import {
  Children,
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';
import { buttonIconSizeMap, type HarmonyButtonSize } from '../icon/iconSizes';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center font-sans font-medium no-underline',
    'rounded-lg transition-all',
    'border-0 cursor-pointer select-none',
    'hover:no-underline',
    'disabled:cursor-not-allowed disabled:pointer-events-none',
    'aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none',
    'data-[loading=true]:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-primary-foreground',
          'hover:bg-[var(--theme-primary-hover)]',
          'active:[box-shadow:var(--shadow-inset-md)] active:focus-visible:[box-shadow:var(--shadow-inset-md)]',
          'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--card-bg)] focus-visible:outline-offset-0',
          'focus-visible:shadow-[var(--focus-ring-primary)]',
          'disabled:bg-[var(--theme-btn-primary-disabled-bg)] disabled:text-[var(--theme-btn-primary-disabled-fg)] disabled:opacity-100',
          'aria-disabled:bg-[var(--theme-btn-primary-disabled-bg)] aria-disabled:text-[var(--theme-btn-primary-disabled-fg)] aria-disabled:opacity-100',
        ],
        secondary: [
          'bg-[var(--elevated-bg)] text-[var(--theme-btn-secondary-stroke)]',
          'border border-solid border-[var(--theme-btn-secondary-stroke)]',
          'hover:bg-[var(--theme-btn-secondary-hover-bg)] hover:text-[var(--theme-btn-secondary-hover-fg)] hover:border-[var(--theme-btn-secondary-hover-stroke)]',
          'active:[box-shadow:var(--shadow-inset-sm)] active:focus-visible:[box-shadow:var(--shadow-inset-sm)]',
          'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--card-bg)] focus-visible:outline-offset-0',
          'focus-visible:shadow-[var(--focus-ring-primary)]',
          'disabled:bg-[var(--elevated-bg)] disabled:text-[var(--theme-btn-secondary-disabled-fg)] disabled:border-[var(--theme-btn-secondary-disabled-fg)] disabled:opacity-50',
          'aria-disabled:bg-[var(--elevated-bg)] aria-disabled:text-[var(--theme-btn-secondary-disabled-fg)] aria-disabled:border-[var(--theme-btn-secondary-disabled-fg)] aria-disabled:opacity-50',
        ],
        tertiary: [
          'bg-transparent text-[var(--theme-btn-tertiary-fg)] border-0',
          'hover:bg-[var(--theme-btn-tertiary-hover-bg)]',
          'active:[box-shadow:var(--shadow-inset-sm)] active:focus-visible:[box-shadow:var(--shadow-inset-sm)]',
          'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--card-bg)] focus-visible:outline-offset-0',
          'focus-visible:shadow-[var(--focus-ring-primary)]',
          'disabled:bg-transparent disabled:text-[var(--theme-btn-tertiary-disabled-fg)] disabled:opacity-100',
          'aria-disabled:bg-transparent aria-disabled:text-[var(--theme-btn-tertiary-disabled-fg)] aria-disabled:opacity-100',
        ],
        outline: [
          'bg-transparent text-foreground border border-solid border-border',
          'hover:bg-hover',
          'active:[box-shadow:var(--shadow-inset-sm)] active:focus-visible:[box-shadow:var(--shadow-inset-sm)]',
          'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--card-bg)] focus-visible:outline-offset-0',
          'focus-visible:shadow-[var(--focus-ring-primary)]',
          'disabled:opacity-50',
          'aria-disabled:opacity-50',
        ],
        ghost: [
          'bg-transparent text-foreground border-0',
          'hover:bg-hover',
          'active:[box-shadow:var(--shadow-inset-sm)] active:focus-visible:[box-shadow:var(--shadow-inset-sm)]',
          'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--card-bg)] focus-visible:outline-offset-0',
          'focus-visible:shadow-[var(--focus-ring-primary)]',
          'disabled:opacity-50',
          'aria-disabled:opacity-50',
        ],
        destructive: [
          'bg-error text-primary-foreground',
          'hover:brightness-90',
          'active:[box-shadow:var(--shadow-inset-md)] active:focus-visible:[box-shadow:var(--shadow-inset-md)]',
          'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--card-bg)] focus-visible:outline-offset-0',
          'focus-visible:shadow-[var(--focus-ring-error)]',
        ],
        dela: [
          'relative isolate overflow-hidden border-0 rounded-sm',
          'bg-dela [background-image:var(--gradient-dela)] text-dela-foreground text-[var(--dela-header-content-fg)]',
          'before:pointer-events-none before:absolute before:inset-0 before:rounded-sm before:bg-transparent before:content-[""]',
          'hover:before:bg-[var(--gradient-dela-hover-bg)]',
          'active:[box-shadow:var(--shadow-inset-md)] active:focus-visible:[box-shadow:var(--shadow-inset-md)]',
          'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--card-bg)] focus-visible:outline-offset-0',
          'focus-visible:shadow-[var(--focus-ring-primary)]',
          'disabled:opacity-60',
          'aria-disabled:opacity-60',
          '[&>*]:relative [&>*]:z-[1]',
        ],
        'dela-pill': [
          'relative isolate overflow-hidden border-0 rounded-full',
          'bg-dela [background-image:var(--gradient-dela)] text-dela-foreground text-[var(--dela-header-content-fg)]',
          'before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-transparent before:content-[""]',
          'hover:before:bg-[var(--gradient-dela-hover-bg)]',
          'active:[box-shadow:var(--shadow-inset-md)] active:focus-visible:[box-shadow:var(--shadow-inset-md)]',
          'focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--card-bg)] focus-visible:outline-offset-0',
          'focus-visible:shadow-[var(--focus-ring-primary)]',
          'disabled:opacity-60',
          'aria-disabled:opacity-60',
          '[&>*]:relative [&>*]:z-[1]',
        ],
      },
      buttonType: {
        theme: '',
        pageHeader: '',
      },
      size: {
        xs: [
          'h-[var(--button-height-xs)] px-2 text-xs gap-1',
          '[--btn-spinner-size:var(--spinner-size-xs)] [--btn-spinner-stroke-width:var(--spinner-stroke-width-xs)]',
        ],
        sm: [
          'h-[var(--button-height-sm)] px-3 text-sm gap-1.5',
          '[--btn-spinner-size:var(--spinner-size-sm)] [--btn-spinner-stroke-width:var(--spinner-stroke-width-sm)]',
        ],
        md: [
          'h-[var(--button-height-md)] px-4 text-base gap-2',
          '[--btn-spinner-size:var(--spinner-size-md)] [--btn-spinner-stroke-width:var(--spinner-stroke-width-md)]',
        ],
        lg: [
          'h-[var(--button-height-lg)] px-6 text-lg gap-2',
          '[--btn-spinner-size:var(--spinner-size-lg)] [--btn-spinner-stroke-width:var(--spinner-stroke-width-lg)]',
        ],
      },
      iconOnly: {
        true: 'p-0',
        false: '',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col h-auto',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      {
        buttonType: 'pageHeader',
        variant: 'primary',
        class: [
          'bg-[var(--page-header-btn-primary)] text-[var(--page-header-btn-primary-fg,var(--text-inverse))]',
          'hover:bg-[var(--page-header-btn-primary-hover)]',
          'focus-visible:shadow-[var(--focus-ring-page-header)]',
          'disabled:bg-[var(--page-header-btn-primary-disabled-bg)] disabled:text-[var(--page-header-btn-primary-disabled-fg)]',
          'aria-disabled:bg-[var(--page-header-btn-primary-disabled-bg)] aria-disabled:text-[var(--page-header-btn-primary-disabled-fg)]',
        ],
      },
      {
        buttonType: 'pageHeader',
        variant: 'secondary',
        class: [
          'bg-[var(--elevated-bg)] text-[var(--page-header-btn-secondary-default-fg)]',
          'border border-solid border-[var(--page-header-btn-secondary-stroke)]',
          'hover:bg-[var(--page-header-btn-secondary-hover-bg)] hover:text-[var(--page-header-btn-secondary-hover-fg)] hover:border-[var(--page-header-btn-secondary-hover-stroke)]',
          'focus-visible:shadow-[var(--focus-ring-page-header)]',
          'disabled:bg-[var(--elevated-bg)] disabled:text-[var(--page-header-btn-secondary-disabled-fg)] disabled:border-[var(--page-header-btn-secondary-disabled-fg)] disabled:opacity-100',
          'aria-disabled:bg-[var(--elevated-bg)] aria-disabled:text-[var(--page-header-btn-secondary-disabled-fg)] aria-disabled:border-[var(--page-header-btn-secondary-disabled-fg)] aria-disabled:opacity-100',
        ],
      },
      {
        buttonType: 'pageHeader',
        variant: 'tertiary',
        class: [
          'bg-transparent text-[var(--page-header-btn-tertiary-fg)] border-0',
          'hover:bg-[var(--page-header-btn-tertiary-hover-bg)]',
          'focus-visible:shadow-[var(--focus-ring-page-header)]',
          'disabled:bg-transparent disabled:text-[var(--page-header-btn-tertiary-disabled-fg)]',
          'aria-disabled:bg-transparent aria-disabled:text-[var(--page-header-btn-tertiary-disabled-fg)]',
        ],
      },
      {
        iconOnly: true,
        size: 'xs',
        class: 'h-[var(--button-height-xs)] w-[var(--button-height-xs)]',
      },
      {
        iconOnly: true,
        size: 'sm',
        class: 'h-[var(--button-height-sm)] w-[var(--button-height-sm)]',
      },
      {
        iconOnly: true,
        size: 'md',
        class: 'h-[var(--button-height-md)] w-[var(--button-height-md)]',
      },
      {
        iconOnly: true,
        size: 'lg',
        class: 'h-[var(--button-height-lg)] w-[var(--button-height-lg)]',
      },
      {
        orientation: 'vertical',
        size: 'xs',
        class: 'min-h-[var(--button-height-xs)] px-2 py-1.5',
      },
      {
        orientation: 'vertical',
        size: 'sm',
        class: 'min-h-[var(--button-height-sm)] px-2.5 py-2',
      },
      {
        orientation: 'vertical',
        size: 'md',
        class: 'min-h-[var(--button-height-md)] px-3 py-2',
      },
      {
        orientation: 'vertical',
        size: 'lg',
        class: 'min-h-[var(--button-height-lg)] px-4 py-2.5',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      buttonType: 'theme',
      size: 'md',
      iconOnly: false,
      orientation: 'horizontal',
      fullWidth: false,
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>;
export type ButtonType = NonNullable<VariantProps<typeof buttonVariants>['buttonType']>;
export type ButtonSize = HarmonyButtonSize;
export type ButtonOrientation = NonNullable<VariantProps<typeof buttonVariants>['orientation']>;

type SharedProps = {
  variant?: ButtonVariant;
  buttonType?: ButtonType;
  size?: ButtonSize;
  orientation?: ButtonOrientation;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  /** Harmony icon name (resolved via package Icon). */
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
  asChild?: boolean;
};

export type ButtonProps = SharedProps &
  (
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'type'>)
  );

function ButtonSpinner() {
  return (
    <svg
      className="shrink-0 animate-spin h-[var(--btn-spinner-size)] w-[var(--btn-spinner-size)] max-h-[var(--btn-spinner-size)] max-w-[var(--btn-spinner-size)]"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        style={{ strokeWidth: 'var(--btn-spinner-stroke-width)' }}
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const {
      variant = 'primary',
      buttonType = 'theme',
      size = 'md',
      orientation = 'horizontal',
      disabled = false,
      loading = false,
      loadingText,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      children,
      asChild = false,
      ...rest
    } = props;

    const href = 'href' in props ? props.href : undefined;
    const isDela = variant === 'dela' || variant === 'dela-pill';
    const effectiveButtonType = isDela ? 'theme' : buttonType;
    const hasChildren = Children.count(children) > 0;
    const isIconOnly = Boolean(icon && !hasChildren && !loading);
    const iconSize = buttonIconSizeMap[size];
    const isDisabled = disabled || loading;

    const classes = cn(
      buttonVariants({
        variant,
        buttonType: effectiveButtonType,
        size,
        iconOnly: isIconOnly,
        orientation,
        fullWidth,
      }),
      className,
    );

    const content = loading ? (
      <>
        <ButtonSpinner />
        {loadingText ? <span>{loadingText}</span> : null}
      </>
    ) : (
      <>
        {isDela ? (
          <img src="/Stars.svg" alt="" className="h-5 w-5 shrink-0 brightness-0 invert" />
        ) : null}
        {icon && iconPosition === 'left' ? <Icon name={icon} size={iconSize} /> : null}
        {children}
        {icon && iconPosition === 'right' ? <Icon name={icon} size={iconSize} /> : null}
      </>
    );

    if (asChild) {
      return (
        <Slot
          ref={ref as never}
          className={classes}
          data-variant={variant}
          data-loading={loading || undefined}
          aria-busy={loading || undefined}
          aria-disabled={isDisabled || undefined}
          {...(rest as Record<string, unknown>)}
        >
          {children}
        </Slot>
      );
    }

    if (href) {
      const { type: _omitType, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
        type?: string;
      };
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={isDisabled ? undefined : href}
          className={classes}
          data-variant={variant}
          data-loading={loading || undefined}
          aria-busy={loading || undefined}
          aria-disabled={isDisabled || undefined}
          tabIndex={isDisabled ? -1 : undefined}
          {...anchorRest}
        >
          {content}
        </a>
      );
    }

    const { type = 'button', ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        disabled={isDisabled}
        data-variant={variant}
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
        {...buttonRest}
      >
        {content}
      </button>
    );
  },
);

export { buttonVariants };
