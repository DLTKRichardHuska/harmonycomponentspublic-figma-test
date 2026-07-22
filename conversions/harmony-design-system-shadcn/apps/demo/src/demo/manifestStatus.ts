import type { BadgeVariant } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { manifestStatusBadgeVariant } from './demoStatusBadge';
import manifest from '../../../../conversion.manifest.json';

export type ElementStatus = 'not-started' | 'in-progress' | 'synced' | 'gap';

type ManifestShape = {
  referenceVersion?: string;
  coverage?: {
    percent?: number;
    completed?: number;
    total?: number;
  };
  elements?: Record<string, { status?: ElementStatus; userDecision?: string | null }>;
};

const data = manifest as ManifestShape;

export function getReferenceVersion(): string {
  return data.referenceVersion ?? '—';
}

export function getElementStatus(key: string): ElementStatus {
  if (key === 'home' || key === 'getting-started' || key === 'changelog') return 'synced';
  return data.elements?.[key]?.status ?? 'not-started';
}

/** Human-readable label for conversion.manifest element status. */
export function formatElementStatusLabel(status: ElementStatus): string {
  return status.replace(/-/g, ' ');
}

/** Conversion sync status for a manifest scope (not reference lifecycle). */
export function getConversionStatusForScope(scope: string): {
  status: ElementStatus;
  label: string;
  variant: BadgeVariant;
} {
  const status = getElementStatus(scope);
  return {
    status,
    label: formatElementStatusLabel(status),
    variant: manifestStatusBadgeVariant(status),
  };
}

/** Percent of reference elements complete for the current `referenceVersion`. */
export function getCoveragePercent(): number {
  return data.coverage?.percent ?? 0;
}

/**
 * Coverage for the current conversion version (from `conversion.manifest.json`).
 * Increases when an element is marked `synced` (or accepted `gap` with userDecision)
 * and `compute_coverage.mjs --write` is run after human sign-off.
 * On a new referenceVersion, element statuses reset and coverage returns to 0%.
 */
export function getCoverageSummary(): {
  percent: number;
  completed: number;
  total: number;
  version: string;
} {
  return {
    percent: data.coverage?.percent ?? 0,
    completed: data.coverage?.completed ?? 0,
    total: data.coverage?.total ?? 0,
    version: getReferenceVersion(),
  };
}
