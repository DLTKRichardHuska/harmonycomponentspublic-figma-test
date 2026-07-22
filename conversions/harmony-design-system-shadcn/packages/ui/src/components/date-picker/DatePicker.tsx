import { forwardRef, type HTMLAttributes } from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { format, parse, isValid } from 'date-fns';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';
import { Button } from '../button';

function parseIsoDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = parse(value, 'yyyy-MM-dd', new Date());
  return isValid(d) ? d : undefined;
}

function toIsoDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Selected date as YYYY-MM-DD. */
  value?: string;
  /** Called with YYYY-MM-DD when a day is selected. */
  onSelect?: (date: string) => void;
  /** Minimum selectable date (YYYY-MM-DD). */
  min?: string;
  /** Maximum selectable date (YYYY-MM-DD). */
  max?: string;
  disabled?: boolean;
  /** BCP 47 locale string (display only; day-picker uses date-fns default unless extended). */
  locale?: string;
  /** Extra DayPicker props (mode is always single). */
  dayPickerProps?: Omit<DayPickerProps, 'mode' | 'selected' | 'onSelect' | 'disabled'>;
}

/**
 * Harmony DatePicker — shadcn Calendar pattern on `react-day-picker`.
 * Also exported as `Calendar` for AI familiarity.
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  {
    className,
    value,
    onSelect,
    min,
    max,
    disabled = false,
    locale: _locale = 'en-US',
    dayPickerProps,
    id,
    ...rest
  },
  ref,
) {
  const selected = parseIsoDate(value);
  const minDate = parseIsoDate(min);
  const maxDate = parseIsoDate(max);

  const disabledMatchers = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
    ...(disabled ? [() => true] : []),
  ];

  return (
    <div ref={ref} id={id} className={cn('date-picker w-full', className)} {...rest}>
      <DayPicker
        mode="single"
        navLayout="around"
        selected={selected}
        onSelect={(day) => {
          if (day && onSelect) onSelect(toIsoDate(day));
        }}
        disabled={disabledMatchers.length ? disabledMatchers : undefined}
        showOutsideDays
        className="w-full"
        formatters={{
          formatWeekdayName: (date) => format(date, 'EEE'),
        }}
        classNames={{
          months: 'relative flex flex-col',
          // Match reference header: [prev] [month year] [next] then grid below
          month: cn(
            'grid w-full grid-cols-[auto_1fr_auto] items-center',
            'gap-x-0 gap-y-[var(--space-4)]',
          ),
          month_caption: 'col-start-2 row-start-1 justify-self-center',
          caption_label: cn(
            'pointer-events-none inline-flex items-center gap-2',
            'font-display text-base font-semibold text-foreground',
          ),
          button_previous: cn(
            'col-start-1 row-start-1',
            'inline-flex h-8 w-8 shrink-0 items-center justify-center',
            'rounded-md border border-solid border-border',
            'bg-transparent p-0 text-secondary',
            'hover:bg-hover hover:text-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ),
          button_next: cn(
            'col-start-3 row-start-1',
            'inline-flex h-8 w-8 shrink-0 items-center justify-center',
            'rounded-md border border-solid border-border',
            'bg-transparent p-0 text-secondary',
            'hover:bg-hover hover:text-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ),
          month_grid: 'col-span-3 row-start-2 w-full border-collapse',
          weekdays: 'flex w-full',
          weekday: cn(
            'flex h-8 w-[36px] flex-1 items-center justify-center',
            'text-center text-xs font-medium text-muted-foreground',
          ),
          week: 'mt-1 flex w-full',
          day: 'relative flex flex-1 items-center justify-center p-0 text-center text-sm',
          day_button: cn(
            'inline-flex h-[36px] w-[36px] items-center justify-center',
            'rounded-md border border-solid border-transparent',
            'font-sans text-sm text-foreground',
            'hover:bg-hover hover:border-border',
            'focus-visible:outline-none focus-visible:shadow-[var(--focus-ring-date-picker)]',
          ),
          selected:
            '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:border-primary [&>button]:font-semibold [&>button]:hover:bg-[var(--theme-primary-hover)]',
          today: '[&>button]:font-semibold [&>button]:border-primary',
          outside: '[&>button]:text-muted-foreground [&>button]:opacity-50',
          disabled:
            '[&>button]:pointer-events-none [&>button]:text-muted-foreground [&>button]:opacity-40',
          hidden: 'invisible',
        }}
        components={{
          Chevron: ({ orientation }) => {
            const name =
              orientation === 'left'
                ? 'chevron-left'
                : orientation === 'right'
                  ? 'chevron-right'
                  : orientation === 'up'
                    ? 'chevron-up'
                    : 'chevron-down';
            return <Icon name={name} size="sm" className="pointer-events-none" />;
          },
        }}
        {...dayPickerProps}
      />
    </div>
  );
});

/** Alias for AI / shadcn familiarity. */
export const Calendar = DatePicker;

/** Nav button helper used by Month/Week pickers (shared chrome). */
export function PickerNavButton({
  direction,
  onClick,
  disabled,
  label,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      icon={direction === 'prev' ? 'chevron-left' : 'chevron-right'}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'h-8 w-8 border border-solid border-border',
        'text-secondary hover:text-foreground',
      )}
    />
  );
}
