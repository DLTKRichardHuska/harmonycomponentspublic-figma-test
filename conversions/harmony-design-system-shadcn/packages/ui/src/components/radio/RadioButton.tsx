import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import {
  SelectionMessage,
  useSelectionMessageIds,
  type SelectionValidationProps,
} from '../checkbox/SelectionMessage';

const radioButtonVariants = cva(
  [
    'aspect-square shrink-0 rounded-full border-2 border-solid border-border',
    'bg-input transition-all',
    'focus-visible:outline-none focus-visible:shadow-[var(--focus-ring-primary)]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:border-primary',
  ],
  {
    variants: {
      size: {
        sm: 'h-[14px] w-[14px]',
        md: 'h-[18px] w-[18px]',
        lg: 'h-[22px] w-[22px]',
      },
      error: {
        true: [
          'border-error',
          'data-[state=checked]:shadow-[0_0_0_2px_var(--color-error)]',
          'focus-visible:shadow-[var(--focus-ring-error)]',
          'data-[state=checked]:focus-visible:shadow-[var(--focus-ring-error-checked)]',
        ],
        false: '',
      },
      warning: {
        true: [
          'border-warning',
          'data-[state=checked]:shadow-[0_0_0_1px_var(--color-warning)]',
          'focus-visible:shadow-[var(--focus-ring-warning)]',
          'data-[state=checked]:focus-visible:shadow-[var(--focus-ring-warning-checked)]',
        ],
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
      warning: false,
    },
  },
);

const radioDotVariants = cva('rounded-full bg-primary', {
  variants: {
    size: {
      sm: 'h-[6px] w-[6px]',
      md: 'h-2 w-2',
      lg: 'h-[10px] w-[10px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type RadioButtonSize = NonNullable<VariantProps<typeof radioButtonVariants>['size']>;

export interface RadioButtonProps
  extends Omit<ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'asChild'>,
    SelectionValidationProps,
    Omit<VariantProps<typeof radioButtonVariants>, 'error' | 'warning'> {
  size?: RadioButtonSize;
  /** When true, skip built-in message row (e.g. RadioField lays out messages). */
  hideMessage?: boolean;
}

export const RadioButton = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioButtonProps
>(function RadioButton(
  {
    className,
    size = 'md',
    error = false,
    warning = false,
    errorMessage,
    warningMessage,
    id,
    disabled,
    hideMessage = false,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const { controlId, messageId, showError, showWarning } = useSelectionMessageIds(id, {
    error,
    warning,
    errorMessage,
    warningMessage,
  });
  const effectiveWarning = warning && !error;
  const describedBy = hideMessage ? ariaDescribedBy : messageId;

  const item = (
    <RadioGroupPrimitive.Item
      ref={ref}
      id={controlId}
      disabled={disabled}
      aria-invalid={error || undefined}
      aria-describedby={describedBy}
      className={cn(
        radioButtonVariants({ size, error, warning: effectiveWarning }),
        '[[data-group-error]_&]:border-error',
        '[[data-group-error]_&]:data-[state=checked]:shadow-[0_0_0_2px_var(--color-error)]',
        '[[data-group-warning]_&]:border-warning',
        '[[data-group-warning]_&]:data-[state=checked]:shadow-[0_0_0_1px_var(--color-warning)]',
        className,
      )}
      {...rest}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <span className={radioDotVariants({ size })} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );

  if (hideMessage) return item;

  return (
    <div className="flex flex-col">
      {item}
      <SelectionMessage
        messageId={messageId}
        showError={showError}
        showWarning={showWarning}
        errorMessage={errorMessage}
        warningMessage={warningMessage}
      />
    </div>
  );
});

export { radioButtonVariants };
