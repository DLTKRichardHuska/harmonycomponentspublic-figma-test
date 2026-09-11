import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { spinnerCss } from '../styles/generated/spinnerCss.js';

const SIZES = new Set(['sm', 'md', 'lg']);

const styles = createSheet(spinnerCss);

/**
 * Loading spinner Custom Element (open Shadow DOM).
 */
export class HarmonySpinner extends HarmonyElement {
  static styles = [styles];

  static get observedAttributes() {
    return ['size', 'label'];
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
    if (!this.hasAttribute('label')) this.setAttribute('label', 'Loading');
    this.#render();
    this.#syncA11y();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#syncA11y();
  }

  get size() {
    const s = this.getAttribute('size') || 'md';
    return SIZES.has(s) ? s : 'md';
  }

  set size(v) {
    this.reflectString('size', SIZES.has(v) ? v : 'md');
  }

  get label() {
    return this.getAttribute('label') || 'Loading';
  }

  set label(v) {
    this.reflectString('label', v == null || v === '' ? 'Loading' : String(v));
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <span part="spinner" aria-hidden="true"></span>
      <span class="sr-only"></span>
    `;
  }

  #syncA11y() {
    const text = this.label;
    const sr = this.shadowRoot?.querySelector('.sr-only');
    if (sr) sr.textContent = `${text}…`;

    if (this.#internals) {
      this.#internals.role = 'status';
      this.#internals.ariaLabel = text;
    } else {
      this.setAttribute('role', 'status');
      this.setAttribute('aria-label', text);
    }
  }
}
