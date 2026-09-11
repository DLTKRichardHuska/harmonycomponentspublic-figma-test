/** Read coverage from conversion.manifest.json (imported as raw JSON via Vite). */
import manifest from '@conversion-manifest';
import { manifestStatusBadgeVariant } from './demoStatusBadge.js';

export function getCoverage() {
  const c = manifest.coverage ?? { percent: 0, completed: 0, total: 0 };
  return {
    percent: c.percent ?? 0,
    completed: c.completed ?? 0,
    total: c.total ?? 0,
    referenceVersion: manifest.referenceVersion ?? 'unknown',
  };
}

export function getElementStatus(key) {
  if (key === 'home' || key === 'getting-started' || key === 'changelog') return 'synced';
  return manifest.elements?.[key]?.status ?? 'not-started';
}

/** Human-readable label for conversion.manifest element status. */
export function formatElementStatusLabel(status) {
  return status.replace(/-/g, ' ');
}

/** Conversion sync status for a manifest scope (not reference lifecycle). */
export function getConversionStatusForScope(scope) {
  const status = getElementStatus(scope);
  const strategy = manifest.elements?.[scope]?.strategy ?? null;
  return {
    status,
    strategy,
    label: formatElementStatusLabel(status),
    variant: manifestStatusBadgeVariant(status),
  };
}
