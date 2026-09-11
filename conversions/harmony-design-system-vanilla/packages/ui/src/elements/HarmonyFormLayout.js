import { HarmonyElement } from './HarmonyElement.js';

const LAYOUTS = new Set(['inline', 'stacked']);

const FIELD_TAGS = new Set([
  'HARMONY-INPUT',
  'HARMONY-TEXTAREA',
  'HARMONY-SELECT',
  'HARMONY-DATE-INPUT',
  'HARMONY-CHECKBOX',
  'HARMONY-RADIO',
  'HARMONY-TOGGLE',
]);

/** Boolean controls — inline form-layout puts the control before the label. */
const BOOLEAN_FIELD_TAGS = new Set([
  'HARMONY-CHECKBOX',
  'HARMONY-RADIO',
  'HARMONY-TOGGLE',
]);

const FIELD_SELECTOR =
  ':scope > harmony-input, :scope > harmony-textarea, :scope > harmony-select, :scope > harmony-date-input, :scope > harmony-checkbox, :scope > harmony-radio, :scope > harmony-toggle';

/**
 * Light-DOM form layout helper. Place inside a native `<form>`.
 * Reads `label` on child field CEs (`harmony-input`, `harmony-textarea`,
 * `harmony-select`, `harmony-date-input`, `harmony-checkbox`, `harmony-radio`,
 * `harmony-toggle`) and inserts aligned light-DOM `<label class="label">`
 * nodes. Layout wins over per-field shadow labels (hidden via :host-context).
 *
 * Field `id` is optional (for JS/CSS hooks). When present, labels use `for`.
 * When absent, the layout wires click activation and `aria-labelledby` so
 * labels still toggle/focus the control.
 *
 * Text-like fields: label then control. Boolean fields in **inline** layout:
 * control then label (native checkbox/radio reading order).
 *
 * Multi-field rows: wrap fields in `<harmony-form-row>` (optional `columns`).
 *
 * Density: sets `data-compact` when the host is too narrow for side-by-side
 * pairs (`--harmony-form-field-pair-min` × columns + gaps). Stacked rows
 * collapse to one column; inline switches from a 4-track grid to label|field.
 */
export class HarmonyFormLayout extends HarmonyElement {
  static shadowRootInit = null;

  static get observedAttributes() {
    return ['label-layout'];
  }

  /** @type {MutationObserver | null} */
  #observer = null;
  /** @type {ResizeObserver | null} */
  #resizeObserver = null;
  /** @type {boolean} */
  #syncing = false;
  /** @type {number} */
  #labelSeq = 0;
  /** @type {WeakMap<Element, HTMLElement>} */
  #labelFields = new WeakMap();

  connectedCallback() {
    this.#sync();
    this.#updateDensity();
    this.#resizeObserver = new ResizeObserver(() => this.#updateDensity());
    this.#resizeObserver.observe(this);
    this.#observer = new MutationObserver((records) => {
      if (this.#syncing) return;
      for (const r of records) {
        if (r.type === 'childList') {
          this.#sync();
          this.#updateDensity();
          return;
        }
        if (
          r.type === 'attributes' &&
          (FIELD_TAGS.has(r.target.tagName) || r.target.tagName === 'HARMONY-FORM-ROW')
        ) {
          this.#sync();
          this.#updateDensity();
          return;
        }
      }
    });
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['label', 'required', 'id', 'columns'],
    });
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = null;
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#sync();
    this.#updateDensity();
  }

  get labelLayout() {
    const v = this.getAttribute('label-layout') || '';
    return LAYOUTS.has(v) ? v : '';
  }

  set labelLayout(v) {
    if (!v || !LAYOUTS.has(v)) this.removeAttribute('label-layout');
    else this.setAttribute('label-layout', v);
  }

  /**
   * Effective inline layout — includes CP unset default (CSS grid without attr).
   * @returns {boolean}
   */
  #isInlineLayout() {
    const v = this.labelLayout;
    if (v === 'inline') return true;
    if (v === 'stacked') return false;
    return getComputedStyle(this).display === 'grid';
  }

  /**
   * @param {HTMLElement} field
   * @returns {boolean}
   */
  #labelFollowsControl(field) {
    return this.#isInlineLayout() && BOOLEAN_FIELD_TAGS.has(field.tagName);
  }

  /** @returns {number} */
  #rowColumns() {
    let max = 1;
    for (const row of this.querySelectorAll(':scope > harmony-form-row')) {
      const n = Number(row.getAttribute('columns') || '2');
      if (Number.isFinite(n) && n >= 1) max = Math.max(max, Math.floor(n));
    }
    return max;
  }

  #updateDensity() {
    const cols = this.#rowColumns();
    if (cols <= 1) {
      this.removeAttribute('data-compact');
      return;
    }
    const cs = getComputedStyle(this);
    const min =
      parseFloat(cs.getPropertyValue('--harmony-form-field-pair-min')) || 160;
    const gap = parseFloat(cs.getPropertyValue('--space-4')) || 16;
    const need = cols * min + (cols - 1) * gap;
    this.toggleAttribute('data-compact', this.clientWidth < need);
  }

  /** @returns {HTMLElement[]} */
  #collectFields() {
    /** @type {HTMLElement[]} */
    const fields = [];
    for (const child of this.children) {
      if (FIELD_TAGS.has(child.tagName)) {
        fields.push(/** @type {HTMLElement} */ (child));
      } else if (child.classList?.contains('harmony-form-layout__cell')) {
        const field = child.querySelector(FIELD_SELECTOR);
        if (field) fields.push(/** @type {HTMLElement} */ (field));
      } else if (child.tagName === 'HARMONY-FORM-ROW') {
        for (const node of child.querySelectorAll(
          ':scope > .harmony-form-layout__cell > harmony-input, :scope > .harmony-form-layout__cell > harmony-textarea, :scope > .harmony-form-layout__cell > harmony-select, :scope > .harmony-form-layout__cell > harmony-date-input, :scope > .harmony-form-layout__cell > harmony-checkbox, :scope > .harmony-form-layout__cell > harmony-radio, :scope > .harmony-form-layout__cell > harmony-toggle, :scope > harmony-input, :scope > harmony-textarea, :scope > harmony-select, :scope > harmony-date-input, :scope > harmony-checkbox, :scope > harmony-radio, :scope > harmony-toggle',
        )) {
          fields.push(/** @type {HTMLElement} */ (node));
        }
      }
    }
    return fields;
  }

  /**
   * Ensure a field sits in a `.harmony-form-layout__cell` (layout or form-row host).
   * @param {HTMLElement} field
   * @returns {HTMLElement | null}
   */
  #ensureCell(field) {
    const parent = field.parentElement;
    if (parent?.classList?.contains('harmony-form-layout__cell')) return parent;

    const row = field.closest('harmony-form-row');
    const host =
      row && this.contains(row) ? row : field.parentElement === this ? this : null;
    if (!host) return null;

    const prev = field.previousElementSibling;
    const next = field.nextElementSibling;
    const cell = document.createElement('div');
    cell.className = 'harmony-form-layout__cell';
    host.insertBefore(cell, field);
    if (prev?.classList?.contains('harmony-form-layout__label')) {
      cell.append(prev);
    }
    cell.append(field);
    if (next?.classList?.contains('harmony-form-layout__label')) {
      cell.append(next);
    }
    return cell;
  }

  /**
   * @param {HTMLElement} field
   * @returns {Element | null}
   */
  #managedLabelFor(field) {
    const prev = field.previousElementSibling;
    if (prev?.classList?.contains('harmony-form-layout__label')) return prev;
    const next = field.nextElementSibling;
    if (next?.classList?.contains('harmony-form-layout__label')) return next;
    return null;
  }

  /**
   * Activate the field when the layout label has no `for` (field `id` omitted).
   * @param {MouseEvent} e
   */
  #onLabelClick = (e) => {
    const label = /** @type {HTMLElement} */ (e.currentTarget);
    if (label.hasAttribute('for')) return;
    const field = this.#labelFields.get(label);
    if (!field || field.hasAttribute('disabled')) return;
    e.preventDefault();
    field.click();
  };

  /**
   * @param {HTMLLabelElement} labelEl
   * @param {HTMLElement} field
   */
  #bindLabel(labelEl, field) {
    this.#labelFields.set(labelEl, field);
    if (labelEl.dataset.harmonyFormLabelBound === '1') return;
    labelEl.dataset.harmonyFormLabelBound = '1';
    labelEl.addEventListener('click', this.#onLabelClick);
  }

  /**
   * @param {HTMLElement} field
   * @param {HTMLLabelElement} labelEl
   * @param {string} fieldId
   */
  #associateLabel(field, labelEl, fieldId) {
    if (fieldId) {
      labelEl.setAttribute('for', fieldId);
      if (field.getAttribute('aria-labelledby') === labelEl.id) {
        field.removeAttribute('aria-labelledby');
      }
      return;
    }

    labelEl.removeAttribute('for');
    if (!labelEl.id) {
      this.#labelSeq += 1;
      labelEl.id = `harmony-fl-label-${this.#labelSeq}`;
    }
    field.setAttribute('aria-labelledby', labelEl.id);
  }

  /**
   * @param {HTMLElement} field
   * @param {Element | null} cell
   */
  #syncFieldLabel(field, cell) {
    const labelText = field.getAttribute('label') || '';
    const host = cell || field.parentElement || this;
    const managed = this.#managedLabelFor(field);
    const labelAfter = this.#labelFollowsControl(field);

    if (!labelText) {
      if (managed?.id && field.getAttribute('aria-labelledby') === managed.id) {
        field.removeAttribute('aria-labelledby');
      }
      managed?.remove();
      return;
    }

    const id = field.id || field.getAttribute('id') || '';
    const required = field.hasAttribute('required');
    let labelEl = /** @type {HTMLLabelElement | null} */ (managed);
    if (!labelEl) {
      labelEl = document.createElement('label');
      labelEl.className = 'label harmony-form-layout__label';
    }

    labelEl.textContent = labelText;
    labelEl.classList.toggle('label--required', required);
    this.#associateLabel(field, labelEl, id);
    this.#bindLabel(labelEl, field);

    if (labelAfter) {
      if (labelEl.previousElementSibling !== field || labelEl.parentElement !== host) {
        field.after(labelEl);
      }
    } else if (labelEl.nextElementSibling !== field || labelEl.parentElement !== host) {
      host.insertBefore(labelEl, field);
    }
  }

  #cleanupOrphans() {
    for (const label of this.querySelectorAll('.harmony-form-layout__label')) {
      const prev = label.previousElementSibling;
      const next = label.nextElementSibling;
      const tiedToField =
        (next && FIELD_TAGS.has(next.tagName)) ||
        (prev && FIELD_TAGS.has(prev.tagName));
      if (!tiedToField) label.remove();
    }
    for (const cell of this.querySelectorAll('.harmony-form-layout__cell')) {
      const field = cell.querySelector(FIELD_SELECTOR);
      if (!field) cell.remove();
    }
  }

  #sync() {
    this.#syncing = true;
    try {
      this.#cleanupOrphans();
      const fields = this.#collectFields();
      for (const field of fields) {
        const cell = this.#ensureCell(field);
        this.#syncFieldLabel(field, cell);
      }
    } finally {
      this.#syncing = false;
    }
  }
}
