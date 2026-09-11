const DOC_STATUS_VARIANTS = {
  stable: 'success',
  beta: 'warning',
  deprecated: 'error',
};

const MANIFEST_STATUS_VARIANTS = {
  'not-started': 'default',
  'in-progress': 'warning',
  synced: 'success',
  gap: 'error',
};

/** Infer Badge variant from a doc lifecycle label (stable/beta/deprecated) or free-form text. */
export function inferStatusBadgeVariant(label) {
  return DOC_STATUS_VARIANTS[String(label).toLowerCase()] ?? 'default';
}

/** Map conversion.manifest element status to a Badge variant. */
export function manifestStatusBadgeVariant(status) {
  return MANIFEST_STATUS_VARIANTS[status] ?? 'default';
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Thin HTML helper for demo shell status/info labels.
 * Defaults to size large (shadcn DemoStatusBadge defaults to lg).
 */
export function statusBadgeHtml({ label, variant, size = 'large' }) {
  const resolvedVariant = variant ?? inferStatusBadgeVariant(label);
  return `<harmony-badge variant="${escapeHtml(resolvedVariant)}" size="${escapeHtml(size)}">${escapeHtml(label)}</harmony-badge>`;
}
