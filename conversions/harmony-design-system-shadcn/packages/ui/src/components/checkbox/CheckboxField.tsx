import { forwardRef, type ElementRef } from 'react';
import { Field, FieldDescription, FieldLabel } from '../label';
import { Label } from '../label';
import { cn } from '../../lib/utils';
import { Checkbox, type CheckboxProps } from './Checkbox';
import {
  SelectionMessage,
  useSelectionMessageIds,
} from './SelectionMessage';

export type CheckboxLabelVariant = 'stacked' | 'inline';

export interface CheckboxFieldProps extends Omit<CheckboxProps, 'hideMessage'> {
  label: string;
  /** stacked → label above; inline → label beside (default). */
  labelVariant?: CheckboxLabelVariant;
  helper?: string;
  required?: boolean;
}

export const CheckboxField = forwardRef<ElementRef<typeof Checkbox>, CheckboxFieldProps>(
  function CheckboxField(
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
    ...checkboxProps
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
        <Checkbox
          ref={ref}
          id={controlId}
          error={error}
          warning={warning}
          errorMessage={errorMessage}
          warningMessage={warningMessage}
          {...checkboxProps}
        />
      </Field>
    );
  }

  return (
    <div className={cn('flex flex-col', className)} data-invalid={error || undefined}>
      <div className="inline-flex items-center gap-2">
        <Checkbox
          ref={ref}
          id={controlId}
          error={error}
          warning={warning}
          hideMessage
          {...checkboxProps}
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
