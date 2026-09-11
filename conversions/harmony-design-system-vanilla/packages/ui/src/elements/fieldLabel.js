const VARIANTS = new Set(['inline', 'stacked']);

/**
 * Explicit `label-variant` (`inline` | `stacked`), or `''` when unset.
 * @param {Element} el
 */
export function readLabelVariant(el) {
  const v = el.getAttribute('label-variant') || '';
  return VARIANTS.has(v) ? v : '';
}

/**
 * Layout used by the field's own shadow label.
 * Inside `harmony-form-layout`, the layout owns positioning — always stacked
 * (shadow label is hidden). Unset follows `--harmony-label-variant-default`
 * (inline on the CP kit, stacked otherwise).
 * @param {HTMLElement} el
 */
export function effectiveLabelVariant(el) {
  if (el.closest('harmony-form-layout')) return 'stacked';
  const explicit = readLabelVariant(el);
  if (explicit) return explicit;
  const def = getComputedStyle(el).getPropertyValue('--harmony-label-variant-default').trim();
  return def === 'inline' ? 'inline' : 'stacked';
}

/** @param {HTMLElement} el */
export function syncLabelVariant(el) {
  el.setAttribute('data-label-variant', effectiveLabelVariant(el));
}
