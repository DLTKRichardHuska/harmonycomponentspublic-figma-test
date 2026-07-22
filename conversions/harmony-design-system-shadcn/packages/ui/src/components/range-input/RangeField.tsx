import { forwardRef, useId } from 'react';
import { Field, FieldDescription, FieldLabel, type FieldOrientation } from '../label';
import type { LabelVariant } from '../input';
import { RangeInput, type RangeInputProps } from './RangeInput';

export interface RangeFieldProps extends RangeInputProps {
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

export const RangeField = forwardRef<HTMLDivElement, RangeFieldProps>(function RangeField(
  { label, labelVariant, helper, required, id, ...rangeProps },
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
        <RangeInput ref={ref} id={controlId} {...rangeProps} />
        {helper && orientation !== 'stacked' ? (
          <FieldDescription className="mt-1">{helper}</FieldDescription>
        ) : null}
      </div>
    </Field>
  );
});
