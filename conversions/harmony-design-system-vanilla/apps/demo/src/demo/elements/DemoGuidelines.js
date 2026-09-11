import {
  HarmonyElement,
  createSheet,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from './shared.js';

const gridStyles = createSheet(`
  :host {
    display: grid;
    gap: var(--space-6);
    width: 100%;
  }
  @media (min-width: 768px) {
    :host {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`);

/**
 * Demo-only Do / Don't guideline pair layout (mirrors reference `.guidelines`).
 * Slot {@link DemoGuideline} cards (or any content).
 */
export class DemoGuidelines extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, gridStyles];

  connectedCallback() {
    this.shadowRoot.innerHTML = `<slot></slot>`;
  }
}

const cardStyles = createSheet(`
  :host {
    display: block;
    padding: var(--space-6);
    border-radius: var(--radius-lg);
    box-sizing: border-box;
  }
  :host([variant='do']) {
    border: 1px solid var(--color-success-border);
    background-color: var(--color-success-bg-subtle);
  }
  :host([variant='dont']) {
    border: 1px solid var(--color-error-border);
    background-color: var(--color-error-bg-subtle);
  }
  .header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: var(--font-semibold);
    margin: 0 0 var(--space-3);
    font-size: inherit;
  }
  :host([variant='do']) .header { color: var(--color-success); }
  :host([variant='dont']) .header { color: var(--color-error); }
  ul {
    margin: 0;
    padding-inline-start: var(--space-6);
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }
  ::slotted(li) {
    margin-bottom: var(--space-2);
  }
  ::slotted(li:last-child) {
    margin-bottom: 0;
  }
  @media (forced-colors: active) {
    :host([variant='do']),
    :host([variant='dont']) {
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }
    .header { color: CanvasText; }
    ul { color: CanvasText; }
  }
`);

const VARIANTS = new Set(['do', 'dont']);

/**
 * Demo-only guideline card. Default slot accepts `<li>` items (wrapped in `<ul>`).
 *
 * @example
 * <demo-guidelines>
 *   <demo-guideline variant="do">
 *     <li>Always use labels with inputs</li>
 *   </demo-guideline>
 *   <demo-guideline variant="dont" heading="Avoid">
 *     <li>Use placeholder as label</li>
 *   </demo-guideline>
 * </demo-guidelines>
 */
export class DemoGuideline extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, cardStyles];

  static get observedAttributes() {
    return ['variant', 'heading'];
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#render();
  }

  get variant() {
    const v = this.getAttribute('variant') || 'do';
    return VARIANTS.has(v) ? v : 'do';
  }

  set variant(v) {
    this.setAttribute('variant', VARIANTS.has(v) ? v : 'do');
  }

  get heading() {
    if (this.hasAttribute('heading')) return this.getAttribute('heading') || '';
    return this.variant === 'dont' ? "Don't" : 'Do';
  }

  set heading(v) {
    this.reflectString('heading', v);
  }

  #render() {
    const variant = this.variant;
    const icon = variant === 'dont' ? 'x-mark' : 'check';
    const heading = this.heading;
    this.shadowRoot.innerHTML = `
      <h3 class="header" part="header">
        <harmony-icon name="${icon}" size="sm"></harmony-icon>
        <span class="heading-text"></span>
      </h3>
      <ul part="list"><slot></slot></ul>
    `;
    this.shadowRoot.querySelector('.heading-text').textContent = heading;
  }
}

if (!customElements.get('demo-guidelines')) {
  customElements.define('demo-guidelines', DemoGuidelines);
}
if (!customElements.get('demo-guideline')) {
  customElements.define('demo-guideline', DemoGuideline);
}
