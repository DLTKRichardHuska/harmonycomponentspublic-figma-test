import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Field, FieldDescription, FieldLabel, type FieldOrientation } from '../label';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from './Select';

export type SelectLabelVariant = 'stacked' | 'inline';

export interface SelectFieldProps extends ComponentPropsWithoutRef<typeof Select> {
  label: string;
  /** stacked → label above; inline → label beside. Omit to follow the product default (auto). */
  labelVariant?: SelectLabelVariant;
  helper?: string;
  required?: boolean;
  placeholder?: string;
  /** SelectItem (and Group/Label/Separator) children — placed inside SelectContent. */
  children: ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  id?: string;
}

function resolveOrientation(labelVariant: SelectLabelVariant | undefined): FieldOrientation {
  if (labelVariant === 'inline') return 'horizontal';
  if (labelVariant === 'stacked') return 'stacked';
  return 'auto';
}

export function SelectField({
  label,
  labelVariant,
  helper,
  required,
  placeholder = 'Select an option',
  children,
  triggerClassName,
  contentClassName,
  id,
  disabled,
  ...selectProps
}: SelectFieldProps) {
  const reactId = useId();
  const triggerId = id ?? reactId;
  const orientation = resolveOrientation(labelVariant);

  return (
    <Field orientation={orientation}>
      <FieldLabel htmlFor={triggerId} required={required}>
        {label}
      </FieldLabel>
      {helper && orientation === 'stacked' ? (
        <FieldDescription>{helper}</FieldDescription>
      ) : null}
      <div className="min-w-0 flex-1">
        <Select disabled={disabled} {...selectProps}>
          <SelectTrigger id={triggerId} className={triggerClassName}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className={contentClassName}>{children}</SelectContent>
        </Select>
        {helper && orientation !== 'stacked' ? (
          <FieldDescription className="mt-1">{helper}</FieldDescription>
        ) : null}
      </div>
    </Field>
  );
}
