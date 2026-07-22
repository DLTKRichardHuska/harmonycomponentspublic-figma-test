import { forwardRef, useId } from 'react';
import { Field, FieldDescription, FieldLabel, type FieldOrientation } from '../label';
import { type LabelVariant } from '../input';
import { DateInput, type DateInputProps } from './DateInput';

export type { LabelVariant };

export interface DateInputFieldProps extends DateInputProps {
  label: string;
  labelVariant?: LabelVariant;
  helper?: string;
  required?: boolean;
}

function resolveOrientation(labelVariant: LabelVariant | undefined): FieldOrientation {
  if (labelVariant === 'inline') return 'horizontal';
  if (labelVariant === 'stacked') return 'stacked';
  return 'auto';
}

export const DateInputField = forwardRef<HTMLInputElement, DateInputFieldProps>(
  function DateInputField({ label, labelVariant, helper, required, id, error, ...dateProps }, ref) {
    const reactId = useId();
    const inputId = id ?? reactId;
    const orientation = resolveOrientation(labelVariant);

    return (
      <Field orientation={orientation} data-invalid={error || undefined}>
        <FieldLabel htmlFor={inputId} required={required}>
          {label}
        </FieldLabel>
        {helper && orientation === 'stacked' ? (
          <FieldDescription>{helper}</FieldDescription>
        ) : null}
        <div className="min-w-0 flex-1">
          <DateInput ref={ref} id={inputId} error={error} required={required} {...dateProps} />
          {helper && orientation !== 'stacked' ? (
            <FieldDescription className="mt-1">{helper}</FieldDescription>
          ) : null}
        </div>
      </Field>
    );
  },
);
