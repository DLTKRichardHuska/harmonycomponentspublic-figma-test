import { forwardRef, type ElementRef } from 'react';
import { Field, FieldDescription, FieldLabel } from '../label';
import { Label } from '../label';
import { cn } from '../../lib/utils';
import { RadioButton, type RadioButtonProps } from './RadioButton';
import {
  SelectionMessage,
  useSelectionMessageIds,
} from '../checkbox/SelectionMessage';

export type RadioLabelVariant = 'stacked' | 'inline';

export interface RadioFieldProps extends Omit<RadioButtonProps, 'hideMessage'> {
  label: string;
  labelVariant?: RadioLabelVariant;
  helper?: string;
  required?: boolean;
}

export const RadioField = forwardRef<ElementRef<typeof RadioButton>, RadioFieldProps>(
  function RadioField(
  {
    label,
    labelVariant = 'inline',
    helper,
    required,
    id,
    error = false,
    warning = false,
    errorMessage,
    warningMessage,
    className,
    ...radioProps
  },
  ref,
) {
  const { controlId, messageId, showError, showWarning } = useSelectionMessageIds(id, {
    error,
    warning,
    errorMessage,
    warningMessage,
  });

  if (labelVariant === 'stacked') {
    return (
      <Field orientation="stacked" data-invalid={error || undefined} className={className}>
        <FieldLabel htmlFor={controlId} required={required}>
          {label}
        </FieldLabel>
        {helper ? <FieldDescription>{helper}</FieldDescription> : null}
        <RadioButton
          ref={ref}
          id={controlId}
          error={error}
          warning={warning}
          errorMessage={errorMessage}
          warningMessage={warningMessage}
          {...radioProps}
        />
      </Field>
    );
  }

  return (
    <div className={cn('flex flex-col', className)} data-invalid={error || undefined}>
      <div className="inline-flex items-center gap-2">
        <RadioButton
          ref={ref}
          id={controlId}
          error={error}
          warning={warning}
          hideMessage
          {...radioProps}
          aria-describedby={messageId}
        />
        <Label htmlFor={controlId} required={required} className="cursor-pointer">
          {label}
        </Label>
      </div>
      {helper ? (
        <FieldDescription className="mt-1 pl-[calc(18px+var(--space-2))]">{helper}</FieldDescription>
      ) : null}
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
