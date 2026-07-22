import { forwardRef, useEffect, useMemo, useState, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { PickerNavButton } from '../date-picker';

export interface WeekPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Selected ISO week as YYYY-Www. */
  value?: string;
  onSelect?: (week: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  locale?: string;
}

function getISOWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: d.getUTCFullYear(), week };
}

function getDateFromISOWeek(year: number, week: number): Date {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const start = new Date(simple);
  if (dow <= 4) {
    start.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    start.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return start;
}

function weeksInISOYear(year: number): number {
  const d = new Date(year, 11, 28);
  return getISOWeek(d).week;
}

function parseWeek(value?: string): { year: number; week: number | null } {
  if (!value) return { year: new Date().getFullYear(), week: null };
  const match = value.match(/(\d{4})-W(\d{2})/);
  if (!match) return { year: new Date().getFullYear(), week: null };
  return { year: parseInt(match[1], 10), week: parseInt(match[2], 10) };
}

function formatWeek(year: number, week: number): string {
  return `${year}-W${String(week).padStart(2, '0')}`;
}

function weekKey(year: number, week: number): number {
  return year * 100 + week;
}

function weekDisabled(year: number, week: number, min?: string, max?: string): boolean {
  const key = weekKey(year, week);
  if (min) {
    const { year: my, week: mw } = parseWeek(min);
    if (mw !== null && key < weekKey(my, mw)) return true;
  }
  if (max) {
    const { year: My, week: Mw } = parseWeek(max);
    if (Mw !== null && key > weekKey(My, Mw)) return true;
  }
  return false;
}

export const WeekPicker = forwardRef<HTMLDivElement, WeekPickerProps>(function WeekPicker(
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
  const parsed = parseWeek(value);
  const [year, setYear] = useState(parsed.year);

  useEffect(() => {
    setYear(parseWeek(value).year);
  }, [value]);

  const weeks = useMemo(() => {
    const count = weeksInISOYear(year);
    const dateFmt = new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' });
    return Array.from({ length: count }, (_, i) => {
      const week = i + 1;
      const start = getDateFromISOWeek(year, week);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return {
        week,
        label: `Week ${week}`,
        range: `${dateFmt.format(start)} – ${dateFmt.format(end)}`,
      };
    });
  }, [year, locale]);

  const selected = parseWeek(value);

  return (
    <div ref={ref} id={id} className={cn('week-picker w-[300px]', className)} {...rest}>
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
      <div
        className="max-h-[280px] space-y-1 overflow-y-auto"
        role="listbox"
        aria-label="Select week"
      >
        {weeks.map(({ week, label, range }) => {
          const isSelected = selected.week === week && selected.year === year;
          const isDisabled = disabled || weekDisabled(year, week, min, max);
          return (
            <button
              key={week}
              type="button"
              role="option"
              aria-selected={isSelected}
              disabled={isDisabled}
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-md',
                'px-3 py-2 text-left text-sm',
                'hover:bg-hover focus-visible:outline-none focus-visible:shadow-[var(--focus-ring-primary)]',
                'disabled:pointer-events-none disabled:opacity-40',
                isSelected
                  ? 'bg-primary text-primary-foreground hover:bg-[var(--theme-primary-hover)]'
                  : 'text-foreground',
              )}
              onClick={() => onSelect?.(formatWeek(year, week))}
            >
              <span className="font-medium">{label}</span>
              <span className={cn('text-xs', isSelected ? 'opacity-90' : 'text-muted-foreground')}>
                {range}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
