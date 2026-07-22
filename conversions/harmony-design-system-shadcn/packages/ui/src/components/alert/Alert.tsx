import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Icon } from '../icon';
import { Button } from '../button';
import { ProgressBar } from '../progress-bar';

const alertVariants = cva(
  'relative w-full rounded-[var(--radius-08)] border border-solid p-4',
  {
    variants: {
      variant: {
        info: 'border-[var(--color-info-border,var(--color-info))] bg-[var(--color-info-light)] text-foreground',
        success:
          'border-[var(--color-success-border,var(--color-success))] bg-[var(--color-success-light)] text-foreground',
        warning:
          'border-[var(--color-warning-border,var(--color-warning))] bg-[var(--color-warning-light)] text-foreground',
        error:
          'border-[var(--color-error-border,var(--color-error))] bg-[var(--color-error-light)] text-foreground',
      },
      appearance: {
        default: '',
        enhanced: 'overflow-hidden border-0 p-0 shadow-[var(--shadow-sm,none)]',
      },
    },
    defaultVariants: {
      variant: 'info',
      appearance: 'default',
    },
  },
);

const defaultIcons = {
  info: 'information-circle',
  success: 'check-circle',
  warning: 'exclamation-triangle',
  error: 'exclamation-circle',
} as const;

const iconColor = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
} as const;

const borderColor = {
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
} as const;

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;
export type AlertAppearance = NonNullable<VariantProps<typeof alertVariants>['appearance']>;

export interface AlertActionConfig {
  /** Button label. */
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface AlertTitleProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>(function AlertTitle(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('font-sans text-base font-semibold text-foreground', className)}
      {...rest}
    >
      {children}
    </div>
  );
});

export interface AlertDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>(
  function AlertDescription({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('text-sm text-secondary [&_p]:leading-relaxed', className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export interface AlertActionSlotProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Action slot (shadcn AlertAction shape) — place buttons/links. */
export const AlertAction = forwardRef<HTMLDivElement, AlertActionSlotProps>(function AlertAction(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn('mt-3 flex flex-wrap items-center gap-2', className)} {...rest}>
      {children}
    </div>
  );
});

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'style'>,
    VariantProps<typeof alertVariants> {
  /** Severity. */
  variant?: AlertVariant;
  /**
   * Layout style — Harmony `appearance` (Astro used `style`).
   * `enhanced` unlocks border accent, actions, link, progress.
   */
  appearance?: AlertAppearance;
  /** Title text (convenience API). */
  title?: string;
  /** Show dismiss control. */
  dismissible?: boolean;
  /** Called when dismiss is activated (controlled — does not remove from DOM). */
  onDismiss?: () => void;
  /** Override default severity icon (Harmony Icon name). */
  icon?: string;
  /** Primary action (enhanced). */
  primaryAction?: AlertActionConfig;
  /** Secondary action (enhanced). */
  secondaryAction?: AlertActionConfig;
  /** Inline link text (enhanced). */
  linkText?: string;
  /** Inline link href (enhanced). */
  linkHref?: string;
  /** Progress 0–100 (enhanced) — composes ProgressBar. */
  progressValue?: number;
  /** Message body (or use compound AlertDescription). */
  children?: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant = 'info',
    appearance = 'default',
    title,
    dismissible = false,
    onDismiss,
    icon,
    primaryAction,
    secondaryAction,
    linkText,
    linkHref,
    progressValue,
    className,
    children,
    ...rest
  },
  ref,
) {
  const alertIcon = icon || defaultIcons[variant];
  const enhanced = appearance === 'enhanced';
  const hasActions =
    Boolean(primaryAction || secondaryAction || (linkText && linkHref));

  const dismissBtn = dismissible ? (
    <button
      type="button"
      aria-label="Dismiss"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[var(--radius-04)] border-0 bg-transparent p-1',
        'text-secondary hover:bg-hover cursor-pointer',
      )}
      onClick={() => onDismiss?.()}
    >
      <Icon name="x-mark" size="sm" />
    </button>
  ) : null;

  if (enhanced) {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant, appearance }), 'bg-[var(--elevated-bg)]', className)}
        {...rest}
      >
        <div className={cn('absolute inset-y-0 left-0 w-1', borderColor[variant])} />
        <div className="flex flex-col gap-3 p-4 pl-5">
          <div className="flex items-start gap-3">
            <Icon name={alertIcon} size="md" className={cn('mt-0.5 shrink-0', iconColor[variant])} />
            <div className="min-w-0 flex-1 space-y-1">
              {title ? <AlertTitle>{title}</AlertTitle> : null}
              <AlertDescription>{children}</AlertDescription>
            </div>
            {dismissBtn}
          </div>
          {hasActions ? (
            <AlertAction>
              <div className="flex flex-wrap gap-2">
                {primaryAction ? (
                  <Button
                    variant="primary"
                    size="xs"
                    href={primaryAction.href}
                    onClick={primaryAction.onClick}
                  >
                    {primaryAction.label}
                  </Button>
                ) : null}
                {secondaryAction ? (
                  <Button
                    variant="secondary"
                    size="xs"
                    href={secondaryAction.href}
                    onClick={secondaryAction.onClick}
                  >
                    {secondaryAction.label}
                  </Button>
                ) : null}
              </div>
              {linkText && linkHref ? (
                <a
                  href={linkHref}
                  className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                >
                  {linkText}
                </a>
              ) : null}
            </AlertAction>
          ) : null}
          {typeof progressValue === 'number' ? (
            <ProgressBar value={progressValue} size="sm" variant={variant === 'info' ? 'default' : variant} />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, appearance }), className)}
      {...rest}
    >
      <div className="flex items-start gap-3">
        <Icon name={alertIcon} size="md" className={cn('mt-0.5 shrink-0', iconColor[variant])} />
        <div className="min-w-0 flex-1 space-y-1">
          {title ? <AlertTitle>{title}</AlertTitle> : null}
          <AlertDescription>{children}</AlertDescription>
        </div>
        {dismissBtn}
      </div>
    </div>
  );
});

export { alertVariants };
