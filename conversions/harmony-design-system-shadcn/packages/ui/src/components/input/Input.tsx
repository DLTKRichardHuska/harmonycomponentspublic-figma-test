import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';
import { FieldError } from '../label';

/** Gutter width reserved for leading/trailing adornments (matches input pl/pr). */
const ADORNMENT_GUTTER = 'w-[var(--field-icon-gutter)]';

const inputVariants = cva(
  [
    'peer w-full h-[var(--field-height)] px-[var(--field-padding-x)]',
    'font-sans text-[length:var(--field-font-size)] text-foreground',
    'bg-input border border-solid border-border',
    'rounded-[var(--field-radius)] transition-all',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[var(--focus-ring-primary)]',
    'disabled:bg-[var(--input-disabled-bg)] disabled:text-muted-foreground disabled:cursor-not-allowed',
    'aria-[invalid=true]:border-error',
    'aria-[invalid=true]:focus-visible:shadow-[var(--focus-ring-error)]',
    'max-md:min-h-11 max-md:px-[var(--field-padding-x-mobile)] max-md:text-base',
  ],
  {
    variants: {
      // Re-assert the gutter inside max-md so it wins over max-md:px-* (which
      // would otherwise reset padding-left/right to the mobile field padding and
      // let text slide under a leading/trailing icon).
      withIcon: {
        true: 'pl-[var(--field-icon-gutter)] max-md:pl-[var(--field-icon-gutter)]',
        false: '',
      },
      withTrailing: {
        true: 'pr-[var(--field-icon-gutter)] max-md:pr-[var(--field-icon-gutter)]',
        false: '',
      },
    },
    defaultVariants: {
      withIcon: false,
      withTrailing: false,
    },
  },
);

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'url'
  | 'search'
  | 'tel';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    VariantProps<typeof inputVariants> {
  type?: InputType;
  /** Shows error border / aria-invalid. */
  error?: boolean;
  /** Error message below the input (linked via aria-describedby). */
  errorMessage?: string;
  /** Leading Harmony Icon name. */
  icon?: string;
  /** Trailing decorative Icon name; ignored when `trailing` is set. */
  trailingIcon?: string;
  /**
   * Trailing ReactNode (actions); wins over `trailingIcon`.
   * Prefer icon-only `Button` `variant="ghost"` sized to fill the right gutter
   * (`h-full w-full` inside this slot) with muted icon colors.
   */
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    type = 'text',
    error = false,
    errorMessage,
    icon,
    trailingIcon,
    trailing,
    id,
    disabled,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const errorId = `${inputId}-error`;
  const hasTrailing = Boolean(trailing) || Boolean(trailingIcon);

  return (
    <div className="w-full">
      {/* Adornments position against the control only — not the error message. */}
      <div className="relative w-full">
        {icon ? (
          <span
            className={cn(
              'pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center justify-center text-muted-foreground',
              ADORNMENT_GUTTER,
            )}
          >
            <Icon name={icon} size="sm" />
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && errorMessage ? errorId : undefined}
          className={cn(
            inputVariants({
              withIcon: Boolean(icon),
              withTrailing: hasTrailing,
            }),
            className,
          )}
          {...rest}
        />
        {trailing ? (
          <div
            className={cn(
              'absolute top-px bottom-px right-px z-10 flex items-center justify-center',
              'w-[calc(var(--field-icon-gutter)-1px)]',
            )}
          >
            {trailing}
          </div>
        ) : trailingIcon ? (
          <span
            className={cn(
              'pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center justify-center text-muted-foreground',
              ADORNMENT_GUTTER,
            )}
          >
            <Icon name={trailingIcon} size="sm" />
          </span>
        ) : null}
      </div>
      {error && errorMessage ? (
        <FieldError id={errorId}>{errorMessage}</FieldError>
      ) : null}
    </div>
  );
});

export { inputVariants };
