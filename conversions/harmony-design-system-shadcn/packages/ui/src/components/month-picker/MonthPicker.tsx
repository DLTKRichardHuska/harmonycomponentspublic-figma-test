import { forwardRef, useEffect, useMemo, useState, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { PickerNavButton } from '../date-picker';

export interface MonthPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Selected month as YYYY-MM. */
  value?: string;
  onSelect?: (month: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  locale?: string;
}

function parseMonth(value?: string): { year: number; month: number | null } {
  if (!value) return { year: new Date().getFullYear(), month: null };
  const [y, m] = value.split('-').map((p) => parseInt(p, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m)) {
    return { year: new Date().getFullYear(), month: null };
  }
  return { year: y, month: m - 1 };
}

function formatMonth(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

function monthDisabled(
  year: number,
  monthIndex: number,
  min?: string,
  max?: string,
): boolean {
  const key = year * 12 + monthIndex;
  if (min) {
    const { year: my, month: mm } = parseMonth(min);
    if (mm !== null && key < my * 12 + mm) return true;
  }
  if (max) {
    const { year: My, month: Mm } = parseMonth(max);
    if (Mm !== null && key > My * 12 + Mm) return true;
  }
  return false;
}

export const MonthPicker = forwardRef<HTMLDivElement, MonthPickerProps>(function MonthPicker(
  {
    className,
    value,
    onSelect,
    min,
    max,
    disabled = false,
    locale = 'en-US',
    id,
    ...rest
  },
  ref,
) {
  const parsed = parseMonth(value);
  const [year, setYear] = useState(parsed.year);

  useEffect(() => {
    setYear(parseMonth(value).year);
  }, [value]);

  const monthNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { month: 'short' });
    return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2020, i, 1)));
  }, [locale]);

  const selected = parseMonth(value).month;

  return (
    <div ref={ref} id={id} className={cn('month-picker w-[280px]', className)} {...rest}>
      <div className="relative mb-3 flex h-8 items-center justify-center">
        <div className="absolute inset-x-0 z-10 flex justify-between px-1">
          <PickerNavButton
            direction="prev"
            label="Previous year"
            disabled={disabled}
            onClick={() => setYear((y) => y - 1)}
          />
          <PickerNavButton
            direction="next"
            label="Next year"
            disabled={disabled}
            onClick={() => setYear((y) => y + 1)}
          />
        </div>
        <span className="pointer-events-none text-sm font-semibold text-foreground">
          {year}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2" role="listbox" aria-label="Select month">
        {monthNames.map((name, monthIndex) => {
          const isSelected = selected === monthIndex && parseMonth(value).year === year;
          const isDisabled = disabled || monthDisabled(year, monthIndex, min, max);
          return (
            <button
              key={name}
              type="button"
              role="option"
              aria-selected={isSelected}
              disabled={isDisabled}
              className={cn(
                'h-10 rounded-md text-sm font-medium',
                'hover:bg-hover focus-visible:outline-none focus-visible:shadow-[var(--focus-ring-primary)]',
                'disabled:pointer-events-none disabled:opacity-40',
                isSelected
                  ? 'bg-primary text-primary-foreground hover:bg-[var(--theme-primary-hover)]'
                  : 'text-foreground',
              )}
              onClick={() => onSelect?.(formatMonth(year, monthIndex))}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
});
