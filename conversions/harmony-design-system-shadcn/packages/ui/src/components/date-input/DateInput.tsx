import { forwardRef, useId, useState, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';
import { DatePicker } from '../date-picker';
import { DateTimePicker } from '../date-time-picker';
import { Input, type InputProps } from '../input';
import { MonthPicker } from '../month-picker';
import { Popover, PopoverAnchor, PopoverContent } from '../picker-popup';
import { TimePicker, type TimeFormat } from '../time-picker';
import { WeekPicker } from '../week-picker';

export type DateInputType = 'date' | 'time' | 'datetime-local' | 'month' | 'week';

export interface DateInputProps
  extends Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange' | 'readOnly' | 'trailing' | 'trailingIcon' | 'icon'> {
  type?: DateInputType;
  /** ISO value matching `type`. */
  value?: string;
  /** Form-style change handler (preferred for DateInput). */
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  timeFormat?: TimeFormat;
  locale?: string;
  /** Hidden input name for forms. */
  name?: string;
}

const PLACEHOLDERS: Record<DateInputType, string> = {
  date: 'Select date',
  time: 'Select time',
  'datetime-local': 'Select date & time',
  month: 'Select month',
  week: 'Select week',
};

function formatDisplayValue(
  val: string | undefined,
  inputType: DateInputType,
  locale: string,
  timeFormat: TimeFormat,
): string {
  if (!val) return '';
  try {
    if (inputType === 'date') {
      const date = new Date(`${val}T00:00:00`);
      return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
    }
    if (inputType === 'time') {
      const [hStr, mStr] = val.split(':');
      let hour = parseInt(hStr, 10);
      const minute = mStr ?? '00';
      if (timeFormat === '12') {
        const period = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${String(hour).padStart(2, '0')}:${minute} ${period}`;
      }
      return `${String(hour).padStart(2, '0')}:${minute}`;
    }
    if (inputType === 'datetime-local') {
      const [datePart, timePart] = val.split('T');
      const date = new Date(`${datePart}T00:00:00`);
      const dateStr = date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const timeStr = timePart ? timePart.split('.')[0] : '';
      return `${dateStr} ${timeStr}`;
    }
    if (inputType === 'month') {
      const [year, month] = val.split('-');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      return date.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
    }
    if (inputType === 'week') {
      const match = val.match(/(\d{4})-W(\d{2})/);
      if (match) return `${match[1]}, Week ${parseInt(match[2], 10)}`;
    }
  } catch {
    return val;
  }
  return val;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  {
    type = 'date',
    value,
    onChange,
    min,
    max,
    disabled = false,
    required,
    timeFormat = '24',
    locale = 'en-US',
    name,
    id,
    error,
    errorMessage,
    className,
    placeholder,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const [open, setOpen] = useState(false);
  const display = formatDisplayValue(value, type, locale, timeFormat);
  const iconName = type === 'time' ? 'clock' : 'calendar';
  const placeholderText = placeholder ?? PLACEHOLDERS[type];

  const handleSelect = (next: string) => {
    onChange?.(next);
    if (type !== 'datetime-local' && type !== 'time') {
      setOpen(false);
    }
  };

  let panel: ReactNode = null;
  if (type === 'date') {
    panel = (
      <DatePicker value={value} min={min} max={max} disabled={disabled} locale={locale} onSelect={handleSelect} />
    );
  } else if (type === 'time') {
    panel = (
      <TimePicker
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        format={timeFormat}
        onSelect={handleSelect}
      />
    );
  } else if (type === 'datetime-local') {
    panel = (
      <DateTimePicker
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        timeFormat={timeFormat}
        locale={locale}
        onSelect={handleSelect}
      />
    );
  } else if (type === 'month') {
    panel = (
      <MonthPicker value={value} min={min} max={max} disabled={disabled} locale={locale} onSelect={handleSelect} />
    );
  } else if (type === 'week') {
    panel = (
      <WeekPicker value={value} min={min} max={max} disabled={disabled} locale={locale} onSelect={handleSelect} />
    );
  }

  const openPicker = () => {
    if (!disabled) setOpen(true);
  };

  return (
    <div className={cn('w-full', className)}>
      {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}
      <Popover open={open} onOpenChange={(next) => !disabled && setOpen(next)}>
        <PopoverAnchor asChild>
          <div className="w-full">
            <Input
              ref={ref}
              id={inputId}
              readOnly
              disabled={disabled}
              required={required}
              error={error}
              errorMessage={errorMessage}
              value={display}
              placeholder={placeholderText}
              aria-label={placeholderText}
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={openPicker}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openPicker();
                }
              }}
              trailing={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={iconName}
                  aria-label={`Open ${placeholderText}`}
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    openPicker();
                  }}
                  className="h-full w-full text-muted-foreground hover:text-foreground"
                />
              }
              {...rest}
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className={cn(type === 'datetime-local' ? 'p-3' : undefined)}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {panel}
        </PopoverContent>
      </Popover>
    </div>
  );
});
