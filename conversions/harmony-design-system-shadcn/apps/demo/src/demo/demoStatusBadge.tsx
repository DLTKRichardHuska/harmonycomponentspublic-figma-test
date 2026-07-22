import type { ReactNode } from 'react';
import { Badge, type BadgeVariant } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

const DOC_STATUS_VARIANTS: Record<string, BadgeVariant> = {
  stable: 'success',
  beta: 'warning',
  deprecated: 'error',
};

const MANIFEST_STATUS_VARIANTS: Record<string, BadgeVariant> = {
  'not-started': 'default',
  'in-progress': 'warning',
  synced: 'success',
  gap: 'error',
};

/** Infer Badge variant from a doc lifecycle label (stable/beta/deprecated) or free-form text. */
export function inferStatusBadgeVariant(label: string): BadgeVariant {
  return DOC_STATUS_VARIANTS[label.toLowerCase()] ?? 'default';
}

/** Map conversion.manifest element status to a Badge variant. */
export function manifestStatusBadgeVariant(status: string): BadgeVariant {
  return MANIFEST_STATUS_VARIANTS[status] ?? 'default';
}

interface DemoStatusBadgeProps {
  children: ReactNode;
  /** Override inferred variant (e.g. primary for version badges). */
  badgeVariant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
}

/** Thin Badge wrapper for demo shell status/info labels. Defaults to size lg. */
export function DemoStatusBadge({
  children,
  badgeVariant,
  size = 'lg',
}: DemoStatusBadgeProps) {
  const label = typeof children === 'string' ? children : '';
  const variant = badgeVariant ?? inferStatusBadgeVariant(label);

  return (
    <Badge variant={variant} size={size}>
      {children}
    </Badge>
  );
}
