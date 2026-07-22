import { forwardRef, useMemo, useState, type HTMLAttributes } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const rangeInputVariants = cva('flex w-full items-center gap-3 max-md:gap-2');

export interface RangeInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Show value as percent of min–max range. */
  showPercent?: boolean;
  prefix?: string;
  suffix?: string;
  name?: string;
  id?: string;
}

function formatDisplay(
  value: number,
  min: number,
  max: number,
  showPercent: boolean,
  prefix: string,
  suffix: string,
) {
  if (showPercent) {
    const pct = max === min ? 0 : Math.round(((value - min) / (max - min)) * 100);
    return `${prefix}${pct}%${suffix}`;
  }
  return `${prefix}${value}${suffix}`;
}

export const RangeInput = forwardRef<HTMLDivElement, RangeInputProps>(function RangeInput(
  {
    className,
    value,
    defaultValue = 50,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    showPercent = false,
    prefix = '',
    suffix = '',
    id,
    name,
    ...rest
  },
  ref,
) {
  const controlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = controlled ? value : uncontrolled;

  const display = useMemo(
    () => formatDisplay(current, min, max, showPercent, prefix, suffix),
    [current, max, min, prefix, showPercent, suffix],
  );

  const handleChange = (vals: number[]) => {
    const next = vals[0] ?? min;
    if (!controlled) setUncontrolled(next);
    onChange?.(next);
  };

  return (
    <div ref={ref} className={cn(rangeInputVariants(), className)} {...rest}>
      <SliderPrimitive.Root
        id={id}
        name={name}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        value={[current]}
        onValueChange={handleChange}
        className={cn(
          'relative flex h-5 w-full touch-none select-none items-center',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[var(--border-color)] max-md:h-2">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            'block size-5 rounded-full bg-primary shadow-sm',
            'transition-transform',
            'hover:scale-110',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'disabled:pointer-events-none',
            'max-md:size-6',
          )}
        />
      </SliderPrimitive.Root>
      <span className="min-w-[50px] shrink-0 text-right text-sm text-secondary max-md:min-w-10">
        {display}
      </span>
    </div>
  );
});

export { rangeInputVariants };
