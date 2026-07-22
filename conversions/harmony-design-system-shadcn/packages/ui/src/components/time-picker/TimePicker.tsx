import { forwardRef, useCallback, useEffect, useState, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../button';

export type TimeFormat = '12' | '24';

export interface TimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Time as HH:MM (24h). */
  value?: string;
  onSelect?: (time: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  format?: TimeFormat;
  /** Minute step (default 1). */
  step?: number;
}

function parseTime(value?: string): { hour: number; minute: number } {
  if (!value) return { hour: 0, minute: 0 };
  const [h, m] = value.split(':').map((p) => parseInt(p, 10));
  return {
    hour: Number.isFinite(h) ? Math.min(23, Math.max(0, h)) : 0,
    minute: Number.isFinite(m) ? Math.min(59, Math.max(0, m)) : 0,
  };
}

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function toDisplayHour(hour24: number, format: TimeFormat): number {
  if (format === '24') return hour24;
  const h = hour24 % 12;
  return h === 0 ? 12 : h;
}

function fromDisplayHour(display: number, period: 'AM' | 'PM', format: TimeFormat): number {
  if (format === '24') return display;
  if (period === 'AM') return display === 12 ? 0 : display;
  return display === 12 ? 12 : display + 12;
}

function clampTime(hour: number, minute: number, min?: string, max?: string): { hour: number; minute: number } {
  let h = hour;
  let m = minute;
  const current = h * 60 + m;
  if (min) {
    const { hour: minh, minute: minm } = parseTime(min);
    const minTotal = minh * 60 + minm;
    if (current < minTotal) {
      h = minh;
      m = minm;
    }
  }
  if (max) {
    const { hour: maxh, minute: maxm } = parseTime(max);
    const maxTotal = maxh * 60 + maxm;
    if (h * 60 + m > maxTotal) {
      h = maxh;
      m = maxm;
    }
  }
  return { hour: h, minute: m };
}

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker(
  {
    className,
    value,
    onSelect,
    min,
    max,
    disabled = false,
    format = '24',
    step = 1,
    id,
    ...rest
  },
  ref,
) {
  const parsed = parseTime(value);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(parsed.hour >= 12 ? 'PM' : 'AM');

  useEffect(() => {
    const next = parseTime(value);
    setHour(next.hour);
    setMinute(next.minute);
    setPeriod(next.hour >= 12 ? 'PM' : 'AM');
  }, [value]);

  const emit = useCallback(
    (h: number, m: number) => {
      const clamped = clampTime(h, m, min, max);
      setHour(clamped.hour);
      setMinute(clamped.minute);
      setPeriod(clamped.hour >= 12 ? 'PM' : 'AM');
      onSelect?.(formatTime(clamped.hour, clamped.minute));
    },
    [min, max, onSelect],
  );

  const bumpHour = (delta: number) => {
    if (disabled) return;
    if (format === '12') {
      let display = toDisplayHour(hour, '12') + delta;
      let nextPeriod = period;
      if (display > 12) {
        display = 1;
      } else if (display < 1) {
        display = 12;
      }
      // Crossing 11↔12 or 12↔1 flips period when wrapping past noon/midnight in spinner UX —
      // keep simple: toggle period when going from 11→12 or 12→11 via buttons is awkward;
      // instead convert via display + period.
      const h24 = fromDisplayHour(display, nextPeriod, '12');
      emit(h24, minute);
    } else {
      emit((hour + delta + 24) % 24, minute);
    }
  };

  const bumpMinute = (delta: number) => {
    if (disabled) return;
    const stepN = Math.max(1, step);
    let next = minute + delta * stepN;
    let h = hour;
    if (next >= 60) {
      next = 0;
      h = (h + 1) % 24;
    } else if (next < 0) {
      next = 60 - stepN;
      h = (h + 23) % 24;
    }
    emit(h, next);
  };

  const displayHour = toDisplayHour(hour, format);

  return (
    <div
      ref={ref}
      id={id}
      className={cn('time-picker flex items-center justify-center gap-2', className)}
      data-disabled={disabled || undefined}
      {...rest}
    >
      <div className="flex flex-col items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          icon="chevron-up"
          aria-label="Increment hour"
          disabled={disabled}
          onClick={() => bumpHour(1)}
          className="text-muted-foreground"
        />
        <span
          className={cn(
            'inline-flex h-10 w-12 items-center justify-center',
            'rounded-md border border-solid border-border',
            'bg-input font-mono text-lg tabular-nums',
          )}
          aria-label="Hour"
        >
          {String(displayHour).padStart(2, '0')}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          icon="chevron-down"
          aria-label="Decrement hour"
          disabled={disabled}
          onClick={() => bumpHour(-1)}
          className="text-muted-foreground"
        />
      </div>

      <span className="text-lg font-semibold text-foreground">:</span>

      <div className="flex flex-col items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          icon="chevron-up"
          aria-label="Increment minute"
          disabled={disabled}
          onClick={() => bumpMinute(1)}
          className="text-muted-foreground"
        />
        <span
          className={cn(
            'inline-flex h-10 w-12 items-center justify-center',
            'rounded-md border border-solid border-border',
            'bg-input font-mono text-lg tabular-nums',
          )}
          aria-label="Minute"
        >
          {String(minute).padStart(2, '0')}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          icon="chevron-down"
          aria-label="Decrement minute"
          disabled={disabled}
          onClick={() => bumpMinute(-1)}
          className="text-muted-foreground"
        />
      </div>

      {format === '12' ? (
        <div className="ml-2 flex flex-col gap-1" role="group" aria-label="AM/PM">
          {(['AM', 'PM'] as const).map((p) => {
            const active = period === p;
            return (
              <button
                key={p}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                className={cn(
                  'h-8 w-12 rounded-md border border-solid text-sm font-medium',
                  'disabled:pointer-events-none disabled:opacity-40',
                  active
                    ? 'border-primary bg-primary font-semibold text-primary-foreground'
                    : 'border-border bg-input text-secondary hover:bg-hover hover:text-foreground',
                )}
                onClick={() => {
                  if (disabled || active) return;
                  const display = toDisplayHour(hour, '12');
                  emit(fromDisplayHour(display, p, '12'), minute);
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
});
