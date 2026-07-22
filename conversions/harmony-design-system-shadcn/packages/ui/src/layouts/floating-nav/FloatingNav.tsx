import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { Icon } from '../../components/icon';

export interface FloatingNavProps extends HTMLAttributes<HTMLDivElement> {
  /** 'full' shows the Execute button; 'compact' hides it. */
  variant?: 'full' | 'compact';
  showExecute?: boolean;
  saveDisabled?: boolean;
  onExecute?: () => void;
  onActions?: () => void;
  onRefresh?: () => void;
  onSave?: () => void;
  onPin?: () => void;
  /** Full override of the toolbar contents. */
  actions?: ReactNode;
}

export const FloatingNav = forwardRef<HTMLDivElement, FloatingNavProps>(function FloatingNav(
  {
    className,
    variant = 'full',
    showExecute = true,
    saveDisabled = false,
    onExecute,
    onActions,
    onRefresh,
    onSave,
    onPin,
    actions,
    ...props
  },
  ref,
) {
  return (
    <div ref={ref} data-slot="floating-nav" className={cn('floating-nav', className)} {...props}>
      <div className="floating-nav__toolbar">
        {actions != null ? (
          actions
        ) : (
          <>
            <div className="floating-nav__buttons">
              {showExecute && variant === 'full' ? (
                <button type="button" className="floating-nav__btn floating-nav__btn--secondary" onClick={onExecute}>
                  Execute
                </button>
              ) : null}

              <button
                type="button"
                className="floating-nav__btn floating-nav__btn--secondary"
                onClick={onActions}
              >
                <span className="floating-nav__btn-text">Actions</span>
                <Icon name="chevron-down" size="sm" className="floating-nav__btn-chevron" />
              </button>

              <button
                type="button"
                className="floating-nav__btn floating-nav__btn--secondary"
                onClick={onRefresh}
                aria-label="Refresh"
              >
                <Icon name="arrow-path" size="md" className="floating-nav__btn-icon" />
                <Icon name="chevron-down" size="sm" className="floating-nav__btn-chevron" />
              </button>

              <button
                type="button"
                className={cn(
                  'floating-nav__btn',
                  saveDisabled ? 'floating-nav__btn--disabled' : 'floating-nav__btn--primary',
                )}
                disabled={saveDisabled}
                onClick={onSave}
              >
                <span className="floating-nav__btn-text">Save</span>
                <Icon name="chevron-down" size="sm" className="floating-nav__btn-chevron" />
              </button>
            </div>

            <div className="floating-nav__divider" />

            <button type="button" className="floating-nav__pin" aria-label="Pin navigation" onClick={onPin}>
              <Icon name="pin" size="md" className="floating-nav__pin-icon" />
            </button>
          </>
        )}
      </div>
    </div>
  );
});
