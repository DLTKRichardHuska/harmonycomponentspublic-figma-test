import {
  HarmonyElement,
  createSheet,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from './shared.js';

const styles = createSheet(`
  :host {
    display: block;
    padding: var(--space-4);
    border: var(--border-width-thin) solid var(--border-color);
    border-radius: var(--radius-08);
    background: var(--card-bg);
    margin-bottom: var(--space-3);
    color: var(--text-primary);
  }
  :host([tone="warning"]) {
    border-style: dashed;
    background: var(--alert-chip-warning-bg);
    color: var(--alert-chip-warning-fg);
  }
  .title {
    display: flex;
    align-items: center;
    gap: var(--space-1-5);
    font-size: var(--label);
    font-weight: var(--font-semibold);
    color: inherit;
    margin: 0 0 var(--space-1-5);
  }
  .title[hidden] {
    display: none;
  }
  @media (forced-colors: active) {
    :host,
    :host([tone="warning"]) {
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }
  }
`);

/**
 * Demo-only callout for accessibility notes, deferred gaps, and similar chrome.
 * Optional `heading` + `icon` slot; default slot is body content.
 */
export class DemoCallout extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, styles];

  static get observedAttributes() {
    return ['heading', 'tone'];
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  get heading() {
    return this.getAttribute('heading') ?? '';
  }

  set heading(value) {
    this.reflectString('heading', value);
  }

  get tone() {
    return this.getAttribute('tone') ?? '';
  }

  set tone(value) {
    this.reflectString('tone', value);
  }

  #render() {
    const heading = this.getAttribute('heading') ?? '';
    this.shadowRoot.innerHTML = `
      <div class="title" part="title">
        <slot name="icon"></slot>
        <span class="heading-text"></span>
      </div>
      <div class="body" part="body"><slot></slot></div>
    `;
    const title = this.shadowRoot.querySelector('.title');
    const text = this.shadowRoot.querySelector('.heading-text');
    const iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
    text.textContent = heading;

    const syncTitle = () => {
      const hasIcon = iconSlot.assignedNodes({ flatten: true }).some(
        (node) => node.nodeType !== Node.TEXT_NODE || node.textContent.trim(),
      );
      title.hidden = !heading && !hasIcon;
    };
    iconSlot.addEventListener('slotchange', syncTitle);
    syncTitle();
  }
}

if (!customElements.get('demo-callout')) {
  customElements.define('demo-callout', DemoCallout);
}
