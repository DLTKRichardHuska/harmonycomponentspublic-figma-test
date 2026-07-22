import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface ShellLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** ShellHeader (fixed, row 1). */
  header?: ReactNode;
  /** LeftSidebar (fixed, left edge). */
  leftSidebar?: ReactNode;
  /** RightSidebar (fixed, right edge). */
  rightSidebar?: ReactNode;
  /** ShellFooter (row 3). Presence of this slot creates the footer row. */
  footer?: ReactNode;
  /** FloatingNav (CP). Presence of this slot shows the centered nav under/over the header. */
  floatingNav?: ReactNode;
  /** ShellPanel slid from the left. */
  leftPanel?: ReactNode;
  /** ShellPanel slid from the right. */
  rightPanel?: ReactNode;
  /**
   * Only tunes spacing (cp anchors the floating nav to the top; standard leaves header room).
   * It does NOT switch content — compose the pieces you want.
   */
  productVariant?: 'cp' | 'standard';
  /** Footer row height variant, when a footer is present. */
  footerVariant?: 'default' | 'compact';
  /** Main content. */
  children?: ReactNode;
}

export const ShellLayout = forwardRef<HTMLDivElement, ShellLayoutProps>(function ShellLayout(
  {
    className,
    header,
    leftSidebar,
    rightSidebar,
    footer,
    floatingNav,
    leftPanel,
    rightPanel,
    productVariant = 'standard',
    footerVariant = 'default',
    children,
    ...props
  },
  ref,
) {
  const hasFooter = footer != null;
  const hasFloatingNav = floatingNav != null;
  const hasRightSidebar = rightSidebar != null;
  const isCp = productVariant === 'cp';

  return (
    <div
      ref={ref}
      data-slot="shell-layout"
      data-shell-panel-scope=""
      data-cp-variant={isCp ? 'true' : 'false'}
      className={cn('shell-layout', className)}
      {...props}
    >
      <div
        className="shell-layout__container"
        data-has-footer={String(hasFooter)}
        data-has-floating-nav={String(hasFloatingNav)}
        data-has-right-sidebar={String(hasRightSidebar)}
        data-footer-variant={footerVariant}
      >
        {header != null ? <div className="shell-layout__header">{header}</div> : null}

        {hasFloatingNav ? <div className="shell-layout__floating-nav-wrap">{floatingNav}</div> : null}

        {leftSidebar != null ? <div className="shell-layout__left-sidebar">{leftSidebar}</div> : null}
        {hasRightSidebar ? <div className="shell-layout__right-sidebar">{rightSidebar}</div> : null}

        {rightPanel}
        {leftPanel}

        <main className="shell-layout__main">{children}</main>

        {hasFooter ? <div className="shell-layout__footer">{footer}</div> : null}
      </div>
    </div>
  );
});
