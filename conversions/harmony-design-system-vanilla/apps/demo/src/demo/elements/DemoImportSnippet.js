import {
  HarmonyElement,
  createSheet,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from './shared.js';

const styles = createSheet(`
  :host {
    display: block;
    margin: var(--space-3) 0;
  }
  pre {
    margin: 0;
    background: var(--shell-footer-bg);
    color: var(--shell-footer-tab-label-color);
    padding: var(--space-3-5) var(--space-4);
    border: none;
    border-radius: var(--radius-lg);
    overflow: auto;
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
    white-space: pre;
  }
`);

/**
 * Demo-only code snippet. Replace with a Harmony equivalent when one exists.
 * Prefer documenting package/static imports for consumers.
 */
export class DemoImportSnippet extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, styles];

  static get observedAttributes() {
    return ['code'];
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  get code() {
    return this.getAttribute('code') ?? this.textContent ?? '';
  }

  set code(value) {
    this.reflectString('code', value);
  }

  #render() {
    const text = this.getAttribute('code') ?? '';
    this.shadowRoot.innerHTML = `<pre part="code"><code></code></pre>`;
    this.shadowRoot.querySelector('code').textContent = text;
  }
}

if (!customElements.get('demo-import-snippet')) {
  customElements.define('demo-import-snippet', DemoImportSnippet);
}
