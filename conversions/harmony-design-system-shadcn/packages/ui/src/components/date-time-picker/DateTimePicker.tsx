import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { DatePicker } from '../date-picker';
import { TimePicker, type TimeFormat } from '../time-picker';

export interface DateTimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Datetime as YYYY-MM-DDTHH:MM. */
  value?: string;
  onSelect?: (datetime: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  timeFormat?: TimeFormat;
  locale?: string;
}

function splitDateTime(value?: string): { date?: string; time?: string } {
  if (!value) return {};
  const [date, timePart] = value.split('T');
  const time = timePart?.split('.')[0]?.slice(0, 5);
  return { date, time };
}

function splitBound(bound?: string): { date?: string; time?: string } {
  if (!bound) return {};
  if (bound.includes('T')) return splitDateTime(bound);
  return { date: bound };
}

export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  function DateTimePicker(
    {
      className,
      value,
      onSelect,
      min,
      max,
      disabled = false,
      timeFormat = '24',
      locale = 'en-US',
      id,
      ...rest
    },
    ref,
  ) {
    const initial = splitDateTime(value);
    const [date, setDate] = useState(initial.date);
    const [time, setTime] = useState(initial.time);

    useEffect(() => {
      const next = splitDateTime(value);
      setDate(next.date);
      setTime(next.time);
    }, [value]);

    const minParts = splitBound(min);
    const maxParts = splitBound(max);

    const emitIfComplete = (nextDate?: string, nextTime?: string) => {
      if (nextDate && nextTime) {
        onSelect?.(`${nextDate}T${nextTime}`);
      }
    };

    return (
      <div
        ref={ref}
        id={id}
        className={cn(
          'datetime-picker flex flex-col gap-4',
          className,
        )}
        {...rest}
      >
        <div className="border-b border-solid border-border pb-3">
          <DatePicker
            value={date}
            min={minParts.date}
            max={maxParts.date}
            disabled={disabled}
            locale={locale}
            onSelect={(d) => {
              setDate(d);
              emitIfComplete(d, time);
            }}
          />
        </div>
        <TimePicker
          value={time}
          min={date && minParts.date === date ? minParts.time : undefined}
          max={date && maxParts.date === date ? maxParts.time : undefined}
          disabled={disabled}
          format={timeFormat}
          onSelect={(t) => {
            setTime(t);
            emitIfComplete(date, t);
          }}
        />
      </div>
    );
  },
);
