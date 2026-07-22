import { forwardRef, useId } from 'react';
import { Field, FieldDescription, FieldLabel, type FieldOrientation } from '../label';
import type { LabelVariant } from '../input';
import { NumberInput, type NumberInputProps } from './NumberInput';

export interface NumberFieldProps extends NumberInputProps {
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

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  { label, labelVariant, helper, required, id, ...numberProps },
  ref,
) {
  const reactId = useId();
  const controlId = id ?? reactId;
  const orientation = resolveOrientation(labelVariant);

  return (
    <Field orientation={orientation}>
      <FieldLabel htmlFor={controlId} required={required}>
        {label}
      </FieldLabel>
      {helper && orientation === 'stacked' ? (
        <FieldDescription>{helper}</FieldDescription>
      ) : null}
      <div className="min-w-0 flex-1">
        <NumberInput ref={ref} id={controlId} required={required} {...numberProps} />
        {helper && orientation !== 'stacked' ? (
          <FieldDescription className="mt-1">{helper}</FieldDescription>
        ) : null}
      </div>
    </Field>
  );
});
