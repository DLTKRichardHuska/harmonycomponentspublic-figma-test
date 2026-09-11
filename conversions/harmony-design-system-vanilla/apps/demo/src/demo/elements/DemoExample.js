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
    margin-bottom: var(--space-4);
  }
  @media (forced-colors: active) {
    :host {
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }
  }
`);

/**
 * Demo-only framed surface for examples, API tables, and specimen groups.
 * Layout of slotted content stays with the page (row, stack, grid, etc.).
 */
export class DemoExample extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, styles];

  connectedCallback() {
    this.shadowRoot.innerHTML = `<slot></slot>`;
  }
}

if (!customElements.get('demo-example')) {
  customElements.define('demo-example', DemoExample);
}
