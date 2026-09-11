import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { accordionCss } from '../styles/generated/accordionCss.js';

const styles = createSheet(accordionCss);

/**
 * Accordion container Custom Element (open Shadow DOM).
 * Children: `<harmony-accordion-item>`.
 */
export class HarmonyAccordion extends HarmonyElement {
  static styles = [styles];

  static get observedAttributes() {
    return ['allow-multiple', 'label'];
  }

  connectedCallback() {
    this.#render();
    this.addEventListener('toggle', this.#onItemToggle);
    this.#syncLabel();
  }

  disconnectedCallback() {
    this.removeEventListener('toggle', this.#onItemToggle);
  }

  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === 'label') this.#syncLabel();
  }

  get allowMultiple() {
    return this.hasAttribute('allow-multiple');
  }

  set allowMultiple(v) {
    this.reflectBoolean('allow-multiple', Boolean(v));
  }

  get label() {
    return this.getAttribute('label') || '';
  }

  set label(v) {
    this.reflectString('label', v);
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <p part="label" id="accordion-label" hidden></p>
      <div part="surface" role="presentation">
        <slot></slot>
      </div>
    `;
  }

  #syncLabel() {
    const el = this.shadowRoot?.querySelector('[part="label"]');
    if (!el) return;
    const text = this.label;
    if (text) {
      el.hidden = false;
      el.textContent = text;
      this.setAttribute('role', 'group');
      this.setAttribute('aria-label', text);
    } else {
      el.hidden = true;
      el.textContent = '';
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
    }
  }

  /** @param {Event} event */
  #onItemToggle = (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (event.target.localName !== 'harmony-accordion-item') return;
    if (!event.detail?.open || this.allowMultiple) return;

    for (const item of this.querySelectorAll('harmony-accordion-item')) {
      if (item !== event.target && item.hasAttribute('open')) {
        item.removeAttribute('open');
      }
    }
  };
}
