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
 * True when a field is under `harmony-form-layout` (layout owns labels).
 * Prefer this over `:host-context(harmony-form-layout)` — Firefox does not
 * support `:host-context()`.
 * @param {Element} el
 */
export function isInFormLayout(el) {
  return Boolean(el.closest('harmony-form-layout'));
}

/**
 * Layout used by the field's own shadow label.
 * Inside `harmony-form-layout`, the layout owns positioning — always stacked
 * (shadow label is hidden). Unset follows `--harmony-label-variant-default`
 * (inline on the CP kit, stacked otherwise).
 * @param {HTMLElement} el
 */
export function effectiveLabelVariant(el) {
  if (isInFormLayout(el)) return 'stacked';
  const explicit = readLabelVariant(el);
  if (explicit) return explicit;
  const def = getComputedStyle(el).getPropertyValue('--harmony-label-variant-default').trim();
  return def === 'inline' ? 'inline' : 'stacked';
}

/**
 * Sync host attrs used by shadow CSS: `data-label-variant` and
 * `data-in-form-layout` (Firefox-safe substitute for `:host-context`).
 * @param {HTMLElement} el
 */
export function syncLabelVariant(el) {
  if (isInFormLayout(el)) el.setAttribute('data-in-form-layout', '');
  else el.removeAttribute('data-in-form-layout');
  el.setAttribute('data-label-variant', effectiveLabelVariant(el));
}
