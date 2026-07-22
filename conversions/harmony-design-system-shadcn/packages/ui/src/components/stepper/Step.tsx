import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';
import { useStepperContext } from './Stepper';

type StepState = 'default' | 'active' | 'completed' | 'success' | 'warning' | 'error' | 'disabled';

const indicatorVariants = cva(
  [
    'relative z-[3] flex items-center justify-center',
    'h-[40px] w-[40px] min-w-[40px] shrink-0 rounded-full',
    'border border-solid font-display text-base font-semibold leading-none',
    'transition-all',
  ],
  {
    variants: {
      state: {
        default: 'bg-[var(--elevated-bg)] border-border text-secondary',
        active: 'bg-primary border-primary text-card',
        completed: 'bg-primary border-primary text-card',
        success: 'bg-success border-success text-card',
        warning: 'bg-warning border-warning text-card',
        error: 'bg-error border-error text-card',
        disabled: 'bg-[var(--elevated-bg)] border-border text-muted-foreground opacity-60',
      },
      interactive: { true: '', false: '' },
    },
    compoundVariants: [
      {
        state: 'default',
        interactive: true,
        class: 'group-hover:bg-hover group-hover:border-primary',
      },
      {
        state: 'active',
        interactive: true,
        class: 'group-hover:bg-primary-hover group-hover:border-primary-hover',
      },
      {
        state: 'completed',
        interactive: true,
        class: 'group-hover:bg-[var(--color-success-hover)] group-hover:border-[var(--color-success-hover)]',
      },
    ],
    defaultVariants: { state: 'default', interactive: false },
  },
);

const labelTextVariants = cva(
  ['font-display text-sm leading-normal break-words'],
  {
    variants: {
      state: {
        default: 'font-medium text-foreground',
        active: 'font-semibold text-primary',
        completed: 'font-medium text-secondary',
        success: 'font-medium text-foreground',
        warning: 'font-medium text-foreground',
        error: 'font-medium text-foreground',
        disabled: 'font-medium text-muted-foreground opacity-60',
      },
      interactive: { true: '', false: '' },
    },
    compoundVariants: [
      { state: 'default', interactive: true, class: 'group-hover:text-primary' },
      { state: 'completed', interactive: true, class: 'group-hover:text-primary' },
    ],
    defaultVariants: { state: 'default', interactive: false },
  },
);

export interface StepProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> {
  completed?: boolean;
  disabled?: boolean;
  error?: boolean;
  warning?: boolean;
  success?: boolean;
  /** Custom Harmony Icon name; replaces the step number. */
  icon?: string;
  /** Optional description shown below the label. */
  description?: ReactNode;
  /** @internal injected by Stepper */
  __index?: number;
  /** @internal injected by Stepper */
  __isLast?: boolean;
  /** @internal injected by Stepper */
  __active?: boolean;
  /** @internal injected by Stepper */
  __disabled?: boolean;
  /** @internal injected by Stepper */
  __connectorActive?: boolean;
}

function resolveState(opts: {
  disabled: boolean;
  error?: boolean;
  warning?: boolean;
  success?: boolean;
  completed?: boolean;
  active: boolean;
}): StepState {
  if (opts.disabled) return 'disabled';
  if (opts.error) return 'error';
  if (opts.warning) return 'warning';
  if (opts.success) return 'success';
  if (opts.completed) return 'completed';
  if (opts.active) return 'active';
  return 'default';
}

export const Step = forwardRef<HTMLDivElement, StepProps>(function Step(
  {
    completed = false,
    disabled = false,
    error = false,
    warning = false,
    success = false,
    icon,
    description,
    className,
    children,
    __index = 0,
    __isLast = false,
    __active = false,
    __disabled,
    __connectorActive = false,
    ...rest
  },
  ref,
) {
  const ctx = useStepperContext();
  const orientation = ctx?.orientation ?? 'horizontal';
  const nonLinear = ctx?.nonLinear ?? false;

  const effectiveDisabled = __disabled ?? disabled;
  const interactive = nonLinear && !effectiveDisabled;
  const state = resolveState({
    disabled: effectiveDisabled,
    error,
    warning,
    success,
    completed,
    active: __active,
  });

  const indicatorContent = icon ? (
    <Icon name={icon} size="sm" />
  ) : error ? (
    <Icon name="exclamation-circle" size="sm" />
  ) : warning ? (
    <Icon name="exclamation-triangle" size="sm" />
  ) : success ? (
    <Icon name="check" size="sm" />
  ) : completed ? (
    <Icon name="check" size="sm" />
  ) : (
    <span>{__index + 1}</span>
  );

  const connectorColor = success
    ? 'bg-success'
    : __connectorActive || completed
      ? 'bg-primary'
      : 'bg-[var(--border-color)]';

  const handleClick = () => {
    if (interactive) ctx?.onStepClick?.(__index);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      ctx?.onStepClick?.(__index);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'group relative flex outline-none',
        orientation === 'horizontal'
          ? 'min-w-0 flex-1 flex-col items-center'
          : 'grid w-full grid-cols-[40px_1fr] items-start gap-x-3 pb-4 last:pb-0',
        interactive && 'cursor-pointer',
        effectiveDisabled && 'pointer-events-none',
        interactive &&
          'focus-visible:rounded-md focus-visible:shadow-[var(--focus-ring-primary)]',
        className,
      )}
      role={interactive ? 'button' : 'group'}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `Go to step ${__index + 1}` : undefined}
      aria-current={__active ? 'step' : undefined}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      {...rest}
    >
      <div className={cn(indicatorVariants({ state, interactive }))} aria-hidden="true">
        {indicatorContent}
      </div>

      {!__isLast ? (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute z-0 transition-colors',
            orientation === 'horizontal'
              ? 'top-[20px] left-[calc(50%+20px)] right-[calc(-50%+20px)] h-[var(--border-width-standard)]'
              : 'top-[40px] left-[20px] h-[calc(100%-40px+var(--space-4))] w-[var(--border-width-standard)] -translate-x-1/2',
            connectorColor,
          )}
        />
      ) : null}

      <div
        className={cn(
          'relative z-[2] flex min-w-0 flex-col',
          orientation === 'horizontal' ? 'mt-2 w-full text-center' : 'pt-0.5',
        )}
      >
        <span className={cn(labelTextVariants({ state, interactive }))}>{children}</span>
        {description ? (
          <span
            className={cn(
              'mt-1 font-sans text-sm font-normal leading-normal break-words',
              effectiveDisabled ? 'text-muted-foreground opacity-60' : 'text-secondary',
            )}
          >
            {description}
          </span>
        ) : null}
      </div>
    </div>
  );
});
