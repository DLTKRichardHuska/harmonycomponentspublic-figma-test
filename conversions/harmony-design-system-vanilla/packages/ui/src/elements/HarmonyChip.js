import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { chipCss } from '../styles/generated/chipCss.js';

const SIZES = new Set(['sm', 'md', 'lg']);
const VARIANTS = new Set(['fill', 'outline']);
const TYPES = new Set(['chip', 'horiz-dots', 'vert-dots', 'overflow']);
const ICON_SIZE = { sm: 'xs', md: 'sm', lg: 'md' };

const HORIZ_DOTS = `<svg viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg" class="chip__dots-svg horiz" aria-hidden="true"><circle cx="2" cy="2" r="1.5" fill="currentColor"/><circle cx="9" cy="2" r="1.5" fill="currentColor"/><circle cx="16" cy="2" r="1.5" fill="currentColor"/></svg>`;
const VERT_DOTS = `<svg viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="chip__dots-svg vert" aria-hidden="true"><circle cx="2" cy="2" r="1.5" fill="currentColor"/><circle cx="2" cy="9" r="1.5" fill="currentColor"/><circle cx="2" cy="16" r="1.5" fill="currentColor"/></svg>`;

const styles = createSheet(chipCss);

/**
 * Chip Custom Element (open Shadow DOM).
 * Body click for select/filter; `remove` CustomEvent on remove control.
 */
export class HarmonyChip extends HarmonyElement {
  static styles = [styles];
  static shadowRootInit = { mode: 'open', delegatesFocus: true };

  static get observedAttributes() {
    return [
      'size',
      'variant',
      'type',
      'overflow-count',
      'selected',
      'removable',
      'icon',
      'disabled',
    ];
  }

  connectedCallback() {
    if (!this.hasAttribute('size')) this.setAttribute('size', 'md');
    if (!this.hasAttribute('variant')) this.setAttribute('variant', 'fill');
    if (!this.hasAttribute('type')) this.setAttribute('type', 'chip');
    this.#render();
    this.#syncA11y();
    this.shadowRoot.addEventListener('click', this.#onShadowClick);
  }

  disconnectedCallback() {
    this.shadowRoot?.removeEventListener('click', this.#onShadowClick);
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#render();
    this.#syncA11y();
  }

  get size() {
    const s = this.getAttribute('size') || 'md';
    return SIZES.has(s) ? s : 'md';
  }

  set size(v) {
    this.reflectString('size', SIZES.has(v) ? v : 'md');
  }

  get variant() {
    const v = this.getAttribute('variant') || 'fill';
    return VARIANTS.has(v) ? v : 'fill';
  }

  set variant(v) {
    this.reflectString('variant', VARIANTS.has(v) ? v : 'fill');
  }

  get type() {
    const t = this.getAttribute('type') || 'chip';
    return TYPES.has(t) ? t : 'chip';
  }

  set type(v) {
    this.reflectString('type', TYPES.has(v) ? v : 'chip');
  }

  get overflowCount() {
    const n = Number(this.getAttribute('overflow-count'));
    return Number.isFinite(n) ? n : 10;
  }

  set overflowCount(v) {
    this.setAttribute('overflow-count', String(v));
  }

  get selected() {
    return this.hasAttribute('selected');
  }

  set selected(v) {
    this.reflectBoolean('selected', Boolean(v));
  }

  get removable() {
    return this.hasAttribute('removable');
  }

  set removable(v) {
    this.reflectBoolean('removable', Boolean(v));
  }

  get icon() {
    return this.getAttribute('icon') || '';
  }

  set icon(v) {
    this.reflectString('icon', v);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(v) {
    this.reflectBoolean('disabled', Boolean(v));
  }

  #onShadowClick = (e) => {
    if (this.disabled) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    const removeBtn = e.target.closest?.('[part="remove"]');
    if (removeBtn) {
      e.stopPropagation();
      this.emit('remove');
      return;
    }
    // Body click bubbles as native click retargeted to host — no extra emit needed.
  };

  #syncA11y() {
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true');
      this.tabIndex = -1;
    } else {
      this.removeAttribute('aria-disabled');
      if (this.type === 'chip' || this.type === 'overflow') {
        this.tabIndex = 0;
      }
    }
    if (this.selected) this.setAttribute('aria-pressed', 'true');
    else this.removeAttribute('aria-pressed');
  }

  #render() {
    const type = this.type;
    const iconSize = ICON_SIZE[this.size] || 'sm';

    if (type === 'horiz-dots') {
      this.shadowRoot.innerHTML = `<span part="dots" aria-label="More options">${HORIZ_DOTS}</span>`;
      return;
    }
    if (type === 'vert-dots') {
      this.shadowRoot.innerHTML = `<span part="dots" aria-label="More options">${VERT_DOTS}</span>`;
      return;
    }

    const iconHtml = this.icon
      ? `<harmony-icon part="icon" name="${escapeAttr(this.icon)}" size="${iconSize}"></harmony-icon>`
      : '';
    const labelHtml =
      type === 'overflow'
        ? `<span class="chip__overflow-text">+${this.overflowCount}</span>`
        : `<slot>Chip</slot>`;
    const removeHtml = this.removable
      ? `<button type="button" part="remove" aria-label="Remove"><harmony-icon name="x-mark" size="${iconSize}"></harmony-icon></button>`
      : '';

    this.shadowRoot.innerHTML = `${iconHtml}${labelHtml}${removeHtml}`;
  }
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
