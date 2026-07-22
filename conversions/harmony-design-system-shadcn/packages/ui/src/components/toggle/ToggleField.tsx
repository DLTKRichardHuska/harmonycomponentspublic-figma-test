import { forwardRef, useId, type ElementRef } from 'react';
import { Field, FieldDescription, FieldLabel } from '../label';
import { Label } from '../label';
import { cn } from '../../lib/utils';
import { Toggle, type ToggleProps } from './Toggle';

export type ToggleLabelVariant = 'stacked' | 'inline';

export interface ToggleFieldProps extends ToggleProps {
  label: string;
  /** stacked → label above; inline → label beside (default). */
  labelVariant?: ToggleLabelVariant;
  helper?: string;
  required?: boolean;
}

export const ToggleField = forwardRef<ElementRef<typeof Toggle>, ToggleFieldProps>(
  function ToggleField(
    {
      label,
      labelVariant = 'inline',
      helper,
      required,
      id,
      className,
      ...toggleProps
    },
    ref,
  ) {
    const reactId = useId();
    const controlId = id ?? reactId;

    if (labelVariant === 'stacked') {
      return (
        <Field orientation="stacked" className={className}>
          <FieldLabel htmlFor={controlId} required={required}>
            {label}
          </FieldLabel>
          {helper ? <FieldDescription>{helper}</FieldDescription> : null}
          <Toggle ref={ref} id={controlId} {...toggleProps} />
        </Field>
      );
    }

    return (
      <div className={cn('inline-flex flex-col', className)}>
        <div className="inline-flex items-center gap-2">
          <Toggle ref={ref} id={controlId} {...toggleProps} />
          <Label htmlFor={controlId} required={required} className="cursor-pointer">
            {label}
          </Label>
        </div>
        {helper ? (
          <FieldDescription className="mt-1 pl-[calc(var(--space-11)+var(--space-2))]">
            {helper}
          </FieldDescription>
        ) : null}
      </div>
    );
  },
);
