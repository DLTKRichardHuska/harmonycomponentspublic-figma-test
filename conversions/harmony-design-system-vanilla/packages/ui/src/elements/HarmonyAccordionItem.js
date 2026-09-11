import { HarmonyElement, createSheet } from './HarmonyElement.js';
import { accordionItemCss } from '../styles/generated/accordionItemCss.js';

const styles = createSheet(accordionItemCss);

let panelSeq = 0;

/**
 * Accordion item Custom Element (open Shadow DOM).
 * Default slot = panel body. Emits `toggle` with `{ open }`.
 */
export class HarmonyAccordionItem extends HarmonyElement {
  static styles = [styles];

  static get observedAttributes() {
    return ['title', 'open', 'disabled'];
  }

  /** @type {string} */
  #panelId = `accordion-panel-${++panelSeq}`;

  connectedCallback() {
    this.#render();
    this.#sync();
    this.shadowRoot.querySelector('[part="trigger"]')?.addEventListener('click', this.#onClick);
  }

  disconnectedCallback() {
    this.shadowRoot
      ?.querySelector('[part="trigger"]')
      ?.removeEventListener('click', this.#onClick);
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#sync();
  }

  get title() {
    return this.getAttribute('title') || '';
  }

  set title(v) {
    this.reflectString('title', v);
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(v) {
    this.reflectBoolean('open', Boolean(v));
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(v) {
    this.reflectBoolean('disabled', Boolean(v));
  }

  #render() {
    this.shadowRoot.innerHTML = `
      <button type="button" part="trigger" aria-controls="${this.#panelId}">
        <span class="title"></span>
        <harmony-icon part="icon" name="chevron-down" size="sm"></harmony-icon>
      </button>
      <div part="panel" id="${this.#panelId}" role="region">
        <slot></slot>
      </div>
    `;
  }

  #sync() {
    const trigger = this.shadowRoot?.querySelector('[part="trigger"]');
    const titleEl = this.shadowRoot?.querySelector('.title');
    if (!trigger || !titleEl) return;

    titleEl.textContent = this.title;
    const isOpen = this.open && !this.disabled;
    if (this.disabled && this.open) this.removeAttribute('open');
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    trigger.toggleAttribute('disabled', this.disabled);
  }

  #onClick = () => {
    if (this.disabled) return;
    const next = !this.open;
    this.open = next;
    this.emit('toggle', { open: next });
  };
}
