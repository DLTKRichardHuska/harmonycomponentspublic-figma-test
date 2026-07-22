import { forwardRef, useId, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import {
  SelectionMessage,
  type SelectionValidationProps,
} from '../checkbox/SelectionMessage';

const radioGroupVariants = cva('', {
  variants: {
    orientation: {
      vertical: '',
      horizontal: '',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

export type RadioGroupOrientation = NonNullable<
  VariantProps<typeof radioGroupVariants>['orientation']
>;

export interface RadioGroupProps
  extends Omit<
      ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
      'orientation' | 'children'
    >,
    SelectionValidationProps,
    VariantProps<typeof radioGroupVariants> {
  legend?: string;
  orientation?: RadioGroupOrientation;
  children?: ReactNode;
}

export const RadioGroup = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(function RadioGroup(
  {
    className,
    legend,
    orientation = 'vertical',
    error = false,
    warning = false,
    errorMessage,
    warningMessage,
    children,
    id,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const groupId = id ?? reactId;
  const showError = Boolean(error && errorMessage);
  const showWarning = Boolean(!error && warning && warningMessage);
  const messageId = showError
    ? `${groupId}-error`
    : showWarning
      ? `${groupId}-warning`
      : undefined;
  const effectiveWarning = warning && !error;

  return (
    <fieldset
      id={groupId}
      data-group-error={error || undefined}
      data-group-warning={effectiveWarning || undefined}
      className="m-0 min-w-0 border-0 p-0"
    >
      {legend ? (
        <legend
          className={cn(
            'mb-3 font-display text-sm font-semibold text-foreground',
            error && 'text-error',
            effectiveWarning && 'text-warning',
          )}
        >
          {legend}
        </legend>
      ) : null}
      <RadioGroupPrimitive.Root
        ref={ref}
        aria-describedby={messageId}
        orientation={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
        className={cn(
          radioGroupVariants({ orientation }),
          'flex gap-3',
          orientation === 'horizontal'
            ? 'flex-row flex-wrap gap-4 max-md:flex-col max-md:gap-3'
            : 'flex-col',
          className,
        )}
        {...rest}
      >
        {children}
      </RadioGroupPrimitive.Root>
      <SelectionMessage
        messageId={messageId}
        showError={showError}
        showWarning={showWarning}
        errorMessage={errorMessage}
        warningMessage={warningMessage}
      />
    </fieldset>
  );
});

export { radioGroupVariants };
