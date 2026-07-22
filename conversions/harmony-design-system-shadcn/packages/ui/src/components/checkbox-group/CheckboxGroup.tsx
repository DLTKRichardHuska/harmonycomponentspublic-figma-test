import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import {
  SelectionMessage,
  type SelectionValidationProps,
} from '../checkbox/SelectionMessage';

const checkboxGroupVariants = cva('border-0 p-0 m-0 min-w-0', {
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

export type CheckboxGroupOrientation = NonNullable<
  VariantProps<typeof checkboxGroupVariants>['orientation']
>;

export interface CheckboxGroupProps
  extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'children'>,
    SelectionValidationProps,
    VariantProps<typeof checkboxGroupVariants> {
  legend?: string;
  orientation?: CheckboxGroupOrientation;
  children?: ReactNode;
}

export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  function CheckboxGroup(
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
        ref={ref}
        id={groupId}
        data-group-error={error || undefined}
        data-group-warning={effectiveWarning || undefined}
        aria-describedby={messageId}
        className={cn(checkboxGroupVariants({ orientation }), className)}
        {...rest}
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
        <div
          className={cn(
            'flex gap-3',
            orientation === 'horizontal'
              ? 'flex-row flex-wrap gap-4 max-md:flex-col max-md:gap-3'
              : 'flex-col',
          )}
        >
          {children}
        </div>
        <SelectionMessage
          messageId={messageId}
          showError={showError}
          showWarning={showWarning}
          errorMessage={errorMessage}
          warningMessage={warningMessage}
        />
      </fieldset>
    );
  },
);

export { checkboxGroupVariants };
