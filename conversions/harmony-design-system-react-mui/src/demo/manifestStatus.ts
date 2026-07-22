import type { StatusBadgeVariant } from '@/components/StatusBadge';
import { manifestStatusBadgeVariant } from './demoStatusBadge';
import manifest from '../../conversion.manifest.json';

export type ElementStatus = 'not-started' | 'in-progress' | 'synced' | 'gap';

export interface ManifestElement {
  status: ElementStatus;
  harmonySource?: string;
  sourcePaths?: string[];
  notes?: string;
}

export function getElementStatus(scope: string): ElementStatus {
  if (scope === 'home' || scope === 'getting-started' || scope === 'changelog') return 'synced';
  const elements = manifest.elements as Record<string, ManifestElement>;
  const el = elements[scope];
  return el?.status ?? 'not-started';
}

/** Human-readable label for conversion.manifest element status. */
export function formatElementStatusLabel(status: ElementStatus): string {
  return status.replace(/-/g, ' ');
}

/** Conversion sync status for a manifest scope (not reference lifecycle). */
export function getConversionStatusForScope(scope: string): {
  status: ElementStatus;
  label: string;
  variant: StatusBadgeVariant;
} {
  const status = getElementStatus(scope);
  return {
    status,
    label: formatElementStatusLabel(status),
    variant: manifestStatusBadgeVariant(status),
  };
}

export function getCoveragePercent(): number {
  return manifest.coverage?.percent ?? 0;
}

export function getReferenceVersion(): string {
  return manifest.referenceVersion;
}

export function isScopeConverted(scope: string): boolean {
  return getElementStatus(scope) === 'synced';
}

export const manifestElements = manifest.elements as Record<string, ManifestElement>;
