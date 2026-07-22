import { forwardRef, useId } from 'react';
import { Field, FieldDescription, FieldLabel, type FieldOrientation } from '../label';
import type { LabelVariant } from '../input';
import { Textarea, type TextareaProps } from './Textarea';

export interface TextareaFieldProps extends TextareaProps {
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

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField(
    { label, labelVariant, helper, required, id, ...textareaProps },
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
          <Textarea ref={ref} id={controlId} required={required} {...textareaProps} />
          {helper && orientation !== 'stacked' ? (
            <FieldDescription className="mt-1">{helper}</FieldDescription>
          ) : null}
        </div>
      </Field>
    );
  },
);
