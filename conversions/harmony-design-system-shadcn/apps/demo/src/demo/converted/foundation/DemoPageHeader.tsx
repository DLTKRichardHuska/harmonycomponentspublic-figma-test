import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { DemoStatusBadge } from '../../demoStatusBadge';
import { getConversionStatusForScope } from '../../manifestStatus';
import { scopeFromPath, shouldShowConversionStatus } from '../../demoScope';

export function DemoPageHeader({
  title,
  description,
  scope: scopeProp,
  children,
}: {
  title: string;
  description: string;
  /** Manifest element key; when omitted, resolved from the current route. */
  scope?: string;
  children?: ReactNode;
}) {
  const { pathname } = useLocation();
  const scope = scopeProp ?? scopeFromPath(pathname);
  const showStatus = shouldShowConversionStatus(pathname);
  const conversionStatus = showStatus ? getConversionStatusForScope(scope) : null;

  return (
    <header className="mb-8 border-b border-border pb-6">
      <div className="mb-2 flex items-center gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {conversionStatus && (
          <DemoStatusBadge badgeVariant={conversionStatus.variant}>{conversionStatus.label}</DemoStatusBadge>
        )}
      </div>
      <p className="max-w-3xl text-secondary">{description}</p>
      {children}
    </header>
  );
}
