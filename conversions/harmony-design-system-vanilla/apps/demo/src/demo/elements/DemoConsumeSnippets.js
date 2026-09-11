import {
  HarmonyElement,
  createSheet,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from './shared.js';
import './DemoImportSnippet.js';

const styles = createSheet(`
  :host {
    display: grid;
    gap: var(--space-3);
    margin: var(--space-4) 0 var(--space-6);
  }
  .heading {
    margin: 0;
    font-size: var(--heading-s);
    font-weight: var(--font-semibold);
    line-height: var(--leading-snug);
  }
  :host([heading="h2"]) .heading {
    font-size: var(--heading-s);
  }
`);

/**
 * Demo-only npm + static zip consume pair. Sets code via `npm` / `staticZip` properties.
 */
export class DemoConsumeSnippets extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, styles];

  static get observedAttributes() {
    return ['npm', 'static-zip', 'npm-label', 'static-label', 'heading'];
  }

  #npm = '';
  #staticZip = '';

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback(name, _old, value) {
    if (name === 'npm') this.#npm = value ?? '';
    if (name === 'static-zip') this.#staticZip = value ?? '';
    if (this.isConnected) this.#render();
  }

  get npm() {
    return this.#npm;
  }

  set npm(value) {
    this.#npm = value ?? '';
    this.#syncSnippets();
  }

  get staticZip() {
    return this.#staticZip;
  }

  set staticZip(value) {
    this.#staticZip = value ?? '';
    this.#syncSnippets();
  }

  get npmLabel() {
    return this.getAttribute('npm-label') ?? 'Consume — npm';
  }

  set npmLabel(value) {
    this.reflectString('npm-label', value);
  }

  get staticLabel() {
    return this.getAttribute('static-label') ?? 'Consume — static zip';
  }

  set staticLabel(value) {
    this.reflectString('static-label', value);
  }

  get heading() {
    const value = this.getAttribute('heading');
    return value === 'h2' ? 'h2' : 'h3';
  }

  set heading(value) {
    this.reflectString('heading', value === 'h2' ? 'h2' : 'h3');
  }

  #render() {
    const tag = this.heading;
    this.shadowRoot.innerHTML = `
      <${tag} class="heading" part="npm-heading"></${tag}>
      <demo-import-snippet part="npm"></demo-import-snippet>
      <${tag} class="heading" part="static-heading"></${tag}>
      <demo-import-snippet part="static"></demo-import-snippet>
    `;
    const headings = this.shadowRoot.querySelectorAll('.heading');
    headings[0].textContent = this.npmLabel;
    headings[1].textContent = this.staticLabel;
    this.#syncSnippets();
  }

  #syncSnippets() {
    const snippets = this.shadowRoot?.querySelectorAll('demo-import-snippet');
    if (!snippets?.length) return;
    snippets[0].code = this.#npm;
    snippets[1].code = this.#staticZip;
  }
}

if (!customElements.get('demo-consume-snippets')) {
  customElements.define('demo-consume-snippets', DemoConsumeSnippets);
}
