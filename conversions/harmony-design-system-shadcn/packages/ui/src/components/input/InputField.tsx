import { forwardRef, useId } from 'react';
import { Field, FieldDescription, FieldLabel, type FieldOrientation } from '../label';
import { Input, type InputProps } from './Input';

export type LabelVariant = 'stacked' | 'inline';

export interface InputFieldProps extends InputProps {
  /** Label text for the field. */
  label: string;
  /** stacked → label above; inline → label beside. Omit to follow the product default (auto). */
  labelVariant?: LabelVariant;
  /** Helper text under/near the label (FieldDescription). */
  helper?: string;
  /** Shows required indicator on the label. */
  required?: boolean;
}

function resolveOrientation(labelVariant: LabelVariant | undefined): FieldOrientation {
  if (labelVariant === 'inline') return 'horizontal';
  if (labelVariant === 'stacked') return 'stacked';
  return 'auto';
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { label, labelVariant, helper, required, id, error, ...inputProps },
  ref,
) {
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
        <Input ref={ref} id={inputId} error={error} required={required} {...inputProps} />
        {helper && orientation !== 'stacked' ? (
          <FieldDescription className="mt-1">{helper}</FieldDescription>
        ) : null}
      </div>
    </Field>
  );
});
