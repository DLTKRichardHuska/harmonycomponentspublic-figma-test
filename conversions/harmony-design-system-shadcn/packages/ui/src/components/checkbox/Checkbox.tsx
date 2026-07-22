import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';
import {
  SelectionMessage,
  useSelectionMessageIds,
  type SelectionValidationProps,
} from './SelectionMessage';

const checkboxVariants = cva(
  [
    'peer h-[18px] w-[18px] shrink-0 rounded-sm border-2 border-solid border-border',
    'bg-input transition-all',
    'focus-visible:outline-none focus-visible:shadow-[var(--focus-ring-primary)]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:border-primary data-[state=checked]:bg-primary',
  ],
  {
    variants: {
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
      error: false,
      warning: false,
    },
  },
);

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'asChild'>,
    SelectionValidationProps,
    Omit<VariantProps<typeof checkboxVariants>, 'error' | 'warning'> {
  asChild?: boolean;
  /** When true, skip built-in message row (e.g. CheckboxField lays out messages). */
  hideMessage?: boolean;
}

export const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(function Checkbox(
  {
    className,
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

  const root = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={controlId}
      disabled={disabled}
      aria-invalid={error || undefined}
      aria-describedby={describedBy}
      className={cn(
        checkboxVariants({ error, warning: effectiveWarning }),
        '[[data-group-error]_&]:border-error',
        '[[data-group-error]_&]:data-[state=checked]:shadow-[0_0_0_2px_var(--color-error)]',
        '[[data-group-warning]_&]:border-warning',
        '[[data-group-warning]_&]:data-[state=checked]:shadow-[0_0_0_1px_var(--color-warning)]',
        className,
      )}
      {...rest}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
        <Icon name="check" size="xs" className="text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (hideMessage) return root;

  return (
    <div className="flex flex-col">
      {root}
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

export { checkboxVariants };
