import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/button';

export interface ShellPageHeaderButton {
  text: string;
  /** Harmony Icon name. */
  icon?: string;
  href?: string;
  onClick?: () => void;
}

export interface ShellPageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Primary (filled) action, rendered right-most. */
  primaryButton?: ShellPageHeaderButton;
  /** Up to three secondary (outline) actions, rendered left of the primary. */
  outlineButtons?: ShellPageHeaderButton[];
  /** Full override of the actions area. When provided, buttons props are ignored. */
  actions?: ReactNode;
}

function renderButton(config: ShellPageHeaderButton, variant: 'primary' | 'secondary', key?: number) {
  return (
    <Button
      key={key}
      variant={variant}
      buttonType="pageHeader"
      size="md"
      icon={config.icon}
      href={config.href}
      onClick={config.onClick}
    >
      {config.text}
    </Button>
  );
}

export const ShellPageHeader = forwardRef<HTMLElement, ShellPageHeaderProps>(function ShellPageHeader(
  { className, title, subtitle, primaryButton, outlineButtons, actions, ...props },
  ref,
) {
  const outline = outlineButtons ?? [];
  const hasActions = actions != null || primaryButton != null || outline.length > 0;

  return (
    <header ref={ref} data-slot="shell-page-header" className={cn('shell-page-header', className)} {...props}>
      <div className="shell-page-header__left">
        <h1 className="shell-page-header__title">{title}</h1>
        {subtitle ? <p className="shell-page-header__subtitle">{subtitle}</p> : null}
      </div>
      {hasActions ? (
        <div className="shell-page-header__actions">
          {actions != null ? (
            actions
          ) : (
            <>
              {outline.map((btn, i) => renderButton(btn, 'secondary', i))}
              {primaryButton ? renderButton(primaryButton, 'primary') : null}
            </>
          )}
        </div>
      ) : null}
    </header>
  );
});
