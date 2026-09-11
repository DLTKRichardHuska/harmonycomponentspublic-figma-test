import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { progressCss } from '../styles/generated/progressCss.js';

const SIZES = new Set(['sm', 'md', 'lg']);
const VARIANTS = new Set(['default', 'success', 'warning', 'error']);

const styles = createSheet(progressCss);

/**
 * Determinate progress bar Custom Element (open Shadow DOM).
 */
export class HarmonyProgress extends HarmonyElement {
  static styles = [styles];

  static get observedAttributes() {
    return ['value', 'max', 'size', 'variant', 'show-label'];
  }

  /** @type {ElementInternals | null} */
  #internals = null;

  constructor() {
    super();
    if (typeof this.attachInternals === 'function') {
      this.#internals = this.attachInternals();
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('size')) this.setAttribute('size', 'md');
    if (!this.hasAttribute('variant')) this.setAttribute('variant', 'default');
    this.#render();
    this.#sync();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#sync();
  }

  get value() {
    const n = Number(this.getAttribute('value'));
    return Number.isFinite(n) ? n : 0;
  }

  set value(v) {
    this.setAttribute('value', String(v));
  }

  get max() {
    const n = Number(this.getAttribute('max'));
    return Number.isFinite(n) && n > 0 ? n : 100;
  }

  set max(v) {
    this.setAttribute('max', String(v));
  }

  get size() {
    const s = this.getAttribute('size') || 'md';
    return SIZES.has(s) ? s : 'md';
  }

  set size(v) {
    this.reflectString('size', SIZES.has(v) ? v : 'md');
  }

  get variant() {
    const v = this.getAttribute('variant') || 'default';
    return VARIANTS.has(v) ? v : 'default';
  }

  set variant(v) {
    this.reflectString('variant', VARIANTS.has(v) ? v : 'default');
  }

  get showLabel() {
    return this.hasAttribute('show-label');
  }

  set showLabel(v) {
    this.reflectBoolean('show-label', Boolean(v));
  }

  #percentage() {
    return Math.min(Math.max((this.value / this.max) * 100, 0), 100);
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <div part="track">
        <div part="bar"></div>
      </div>
      <span part="label" hidden></span>
    `;
  }

  #sync() {
    const pct = this.#percentage();
    this.style.setProperty('--harmony-progress', `${pct}%`);

    const label = this.shadowRoot.querySelector('[part="label"]');
    if (label) {
      if (this.showLabel) {
        label.hidden = false;
        label.textContent = `${Math.round(pct)}%`;
      } else {
        label.hidden = true;
        label.textContent = '';
      }
    }

    if (this.#internals) {
      this.#internals.role = 'progressbar';
      this.#internals.ariaValueNow = String(this.value);
      this.#internals.ariaValueMin = '0';
      this.#internals.ariaValueMax = String(this.max);
    } else {
      this.setAttribute('role', 'progressbar');
      this.setAttribute('aria-valuenow', String(this.value));
      this.setAttribute('aria-valuemin', '0');
      this.setAttribute('aria-valuemax', String(this.max));
    }
  }
}
