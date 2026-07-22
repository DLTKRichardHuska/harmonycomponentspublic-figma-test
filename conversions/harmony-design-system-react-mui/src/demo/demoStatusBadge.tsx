import type { ReactNode } from 'react';
import { StatusBadge, type StatusBadgeVariant } from '@/components/StatusBadge';

const DOC_STATUS_VARIANTS: Record<string, StatusBadgeVariant> = {
  stable: 'success',
  beta: 'warning',
  deprecated: 'error',
};

const MANIFEST_STATUS_VARIANTS: Record<string, StatusBadgeVariant> = {
  'not-started': 'default',
  'in-progress': 'warning',
  synced: 'success',
  gap: 'error',
};

/** Infer StatusBadge variant from a doc lifecycle label (stable/beta/deprecated) or free-form text. */
export function inferStatusBadgeVariant(label: string): StatusBadgeVariant {
  return DOC_STATUS_VARIANTS[label.toLowerCase()] ?? 'default';
}

/** Map conversion.manifest element status to a StatusBadge variant. */
export function manifestStatusBadgeVariant(status: string): StatusBadgeVariant {
  return MANIFEST_STATUS_VARIANTS[status] ?? 'default';
}

interface DemoStatusBadgeProps {
  children: ReactNode;
  /** Override inferred variant (e.g. primary for version badges). */
  badgeVariant?: StatusBadgeVariant;
}

/** Thin StatusBadge wrapper for demo shell status/info labels. Defaults to size large. */
export function DemoStatusBadge({ children, badgeVariant }: DemoStatusBadgeProps) {
  const label = typeof children === 'string' ? children : '';
  const variant = badgeVariant ?? inferStatusBadgeVariant(label);

  return (
    <StatusBadge variant={variant} size="large">
      {children}
    </StatusBadge>
  );
}
