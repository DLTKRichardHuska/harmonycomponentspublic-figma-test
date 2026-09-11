import {
  HarmonyElement,
  createSheet,
  typographySheet,
  buttonSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { getColorScheme } from '@dltkrichardhuska/harmony-design-system-vanilla/theme';
import { PRODUCTS, demoChromeSheet } from './shared.js';

const styles = createSheet(`
  :host {
    display: block;
    flex-shrink: 0;
    border-bottom: var(--border-width-thin) solid var(--border-color);
    background: var(--card-bg);
    z-index: var(--z-20);
  }
  :host-context(html.dark) {
    background: var(--card-bg);
    border-color: var(--border-color);
  }
  header {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-5);
  }
  .left { display: flex; align-items: center; gap: var(--space-3); }
  .left strong {
    font-family: var(--font-display, Lexend, sans-serif);
    font-size: var(--heading-s);
    font-weight: var(--font-semibold);
    line-height: var(--leading-snug);
  }
  .controls { display: flex; gap: var(--space-2); align-items: center; flex-wrap: wrap; }
  label {
    font-size: var(--label);
    font-weight: var(--font-normal);
  }
  select {
    padding: var(--space-1-5) var(--space-2-5);
    border-radius: var(--radius-md);
    border: var(--border-width-thin) solid var(--border-color);
    background: var(--card-bg);
    color: inherit;
    font: inherit;
  }
  :host-context(html.dark) select {
    background: var(--card-bg);
    border-color: var(--border-color);
  }
  .nav-toggle {
    display: none;
  }
  @media (max-width: 1023px) {
    .nav-toggle { display: inline-flex; }
  }
  @media (forced-colors: active) {
    :host,
    :host-context(html.dark) {
      background: Canvas;
      border-color: CanvasText;
    }
    select,
    :host-context(html.dark) select {
      background: ButtonFace;
      border: var(--border-width-thin) solid ButtonText;
      color: ButtonText;
    }
    select:focus-visible {
      outline: var(--border-width-standard) solid Highlight;
      outline-offset: var(--space-0-5);
    }
  }
`);

/**
 * Demo review header — uses Harmony button defaults + modifiers.
 */
export class DemoHeader extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, buttonSheet, styles];

  static get observedAttributes() {
    return ['product', 'nav-open'];
  }

  connectedCallback() {
    this.#render();
    this.shadowRoot.addEventListener('click', this.#onClick);
    this.shadowRoot.addEventListener('change', this.#onChange);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#onClick);
    this.shadowRoot.removeEventListener('change', this.#onChange);
  }

  attributeChangedCallback() {
    this.#render();
  }

  get product() {
    return this.getAttribute('product') || 'vp';
  }

  set product(value) {
    this.reflectString('product', value);
  }

  get navOpen() {
    return this.hasAttribute('nav-open');
  }

  set navOpen(value) {
    this.reflectBoolean('nav-open', Boolean(value));
  }

  #onClick = (e) => {
    const button = e.target instanceof Element ? e.target.closest('button') : null;
    if (button?.id === 'nav-toggle') {
      this.emit('demo-nav-toggle');
    } else if (button?.id === 'mode-toggle') {
      this.emit('demo-mode-toggle');
    }
  };

  #onChange = (e) => {
    if (e.target.id === 'product-select') {
      this.emit('demo-product-change', { product: e.target.value });
    }
  };

  #render() {
    const product = this.product;
    const mode = getColorScheme();
    const options = PRODUCTS.map(
      (p) => `<option value="${p.id}" ${p.id === product ? 'selected' : ''}>${p.label}</option>`,
    ).join('');
    this.shadowRoot.innerHTML = `
      <header part="header">
        <div class="left">
          <button type="button" class="nav-toggle btn--ghost btn--icon-md" id="nav-toggle" aria-label="Open navigation" aria-controls="docs-sidebar" aria-expanded="${this.navOpen}">
            <harmony-icon name="bars-3" size="sm"></harmony-icon>
          </button>
          <strong>Harmony Vanilla</strong>
        </div>
        <div class="controls">
          <label>Product
            <select id="product-select" aria-label="Product theme for demo">${options}</select>
          </label>
          <button type="button" class="btn--secondary btn--sm" id="mode-toggle" aria-label="Toggle color scheme">
            <harmony-icon name="${mode === 'dark' ? 'moon' : 'sun'}" size="sm"></harmony-icon>
            Mode: ${mode}
          </button>
        </div>
      </header>
    `;
  }
}

if (!customElements.get('demo-header')) {
  customElements.define('demo-header', DemoHeader);
}
