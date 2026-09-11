import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { pageStyles } from './pageStyles.js';

export class DemoChangelogPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, pageStyles];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <h1>Changelog</h1>
      <p>Conversion harness scaffolded. Catalog elements convert via <code>/conversion-agent</code> after converter readiness.</p>
    `;
  }
}

if (!customElements.get('demo-changelog-page')) {
  customElements.define('demo-changelog-page', DemoChangelogPage);
}
