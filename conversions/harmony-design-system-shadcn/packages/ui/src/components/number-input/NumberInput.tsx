import {
  forwardRef,
  useCallback,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button } from '../button';

const numberInputVariants = cva([
  'inline-flex items-stretch overflow-hidden',
  'border border-solid border-border rounded-[var(--field-radius)]',
  'transition-all',
  'has-[:focus-visible]:border-primary has-[:focus-visible]:shadow-[var(--focus-ring-primary)]',
  'max-md:w-full',
]);

const numberStepperClasses =
  'h-[var(--field-height)] w-[var(--field-height)] shrink-0 rounded-none border-0 bg-[var(--elevated-bg)] text-secondary hover:bg-hover hover:text-foreground disabled:text-muted-foreground max-md:min-h-11 max-md:min-w-11';

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'size'> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    className,
    value: valueProp,
    defaultValue = 0,
    onChange,
    min,
    max,
    step = 1,
    disabled,
    id,
    name,
    ...rest
  },
  ref,
) {
  const isControlled = valueProp !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = isControlled ? valueProp : uncontrolled;

  const setValue = useCallback(
    (next: number) => {
      let clamped = next;
      if (min !== undefined) clamped = Math.max(min, clamped);
      if (max !== undefined) clamped = Math.min(max, clamped);
      if (!isControlled) setUncontrolled(clamped);
      onChange?.(clamped);
    },
    [isControlled, max, min, onChange],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (Number.isNaN(parsed)) return;
    setValue(parsed);
  };

  const canDecrement = !disabled && (min === undefined || value > min);
  const canIncrement = !disabled && (max === undefined || value < max);

  return (
    <div className={cn(numberInputVariants(), className)} data-slot="number-input">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        icon="minus"
        disabled={!canDecrement}
        aria-label="Decrease"
        className={numberStepperClasses}
        onClick={() => setValue(value - step)}
      />
      <input
        ref={ref}
        type="number"
        id={id}
        name={name}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={handleInputChange}
        className={cn(
          'w-[60px] h-[var(--field-height)] text-center font-sans text-[length:var(--field-font-size)] text-foreground',
          'bg-input border-0 border-x border-solid border-border',
          'focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:text-muted-foreground',
          'max-md:min-h-11 max-md:text-base',
        )}
        {...rest}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        icon="plus"
        disabled={!canIncrement}
        aria-label="Increase"
        className={numberStepperClasses}
        onClick={() => setValue(value + step)}
      />
    </div>
  );
});

export { numberInputVariants };
