import {
  forwardRef,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/utils';
import { Icon } from '../../components/icon';

export type ShellPanelSide = 'left' | 'right';
export type ShellPanelWidth = 'narrow' | 'full';
export type ShellPanelHeaderVariant = 'theme' | 'default';

export interface ShellPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  side: ShellPanelSide;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  /** Harmony Icon name shown before the title. */
  titleIcon?: string;
  headerVariant?: ShellPanelHeaderVariant;
  /** Initial width; can be toggled by the user via the width button. */
  width?: ShellPanelWidth;
  showClose?: boolean;
  showPopout?: boolean;
  onPopout?: () => void;
  /** Render the Dela brand gradient header. */
  gradientHeader?: boolean;
  /** Full override of the header. */
  header?: ReactNode;
  children?: ReactNode;
}

export const ShellPanel = forwardRef<HTMLDivElement, ShellPanelProps>(function ShellPanel(
  {
    className,
    side,
    open,
    onOpenChange,
    title,
    titleIcon,
    headerVariant = 'theme',
    width = 'narrow',
    showClose = true,
    showPopout = true,
    onPopout,
    gradientHeader = false,
    header,
    children,
    ...props
  },
  ref,
) {
  const [currentWidth, setCurrentWidth] = useState<ShellPanelWidth>(width);
  useEffect(() => setCurrentWidth(width), [width]);

  return (
    <div
      ref={ref}
      data-slot="shell-panel"
      data-side={side}
      data-open={open}
      data-width={currentWidth}
      className={cn(
        'shell-panel',
        `shell-panel--${side}`,
        `shell-panel--${currentWidth}`,
        open && 'shell-panel--open',
        className,
      )}
      {...props}
    >
      {header != null ? (
        header
      ) : (
        <div
          className={cn('shell-panel__header', `shell-panel__header--${headerVariant}`)}
          data-header-variant={headerVariant}
          data-gradient-header={gradientHeader ? 'true' : undefined}
        >
          <div className="shell-panel__header-content">
            <span className="shell-panel__header-icon">
              {titleIcon ? <Icon name={titleIcon} size="md" /> : null}
            </span>
            <h2 className="shell-panel__title">{title}</h2>
            <div className="shell-panel__actions">
              <button
                type="button"
                className="shell-panel__action"
                aria-label="Toggle panel width"
                onClick={() => setCurrentWidth((w) => (w === 'full' ? 'narrow' : 'full'))}
              >
                <Icon name={currentWidth === 'full' ? 'arrows-pointing-in' : 'arrows-pointing-out'} size="md" />
              </button>
              {showPopout ? (
                <button type="button" className="shell-panel__action" aria-label="Pop out panel" onClick={onPopout}>
                  <Icon name="arrow-top-right-on-square" size="md" />
                </button>
              ) : null}
              {showClose ? (
                <button
                  type="button"
                  className="shell-panel__action"
                  aria-label="Close panel"
                  onClick={() => onOpenChange?.(false)}
                >
                  <Icon name="x-mark" size="lg" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
      <div className="shell-panel__content">{children}</div>
    </div>
  );
});
