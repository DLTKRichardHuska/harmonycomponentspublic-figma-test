import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

const COMPANIES = [
  { id: 'acme-corp', name: 'Acme Corporation', color: '#FF507B' },
  { id: 'ocean-industries', name: 'Ocean Industries', color: '#285F8C' },
  { id: 'violet-systems', name: 'Violet Systems', color: '#DC50FF' },
];

export class DemoCompanyPickerPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet];

  connectedCallback() {
    const options = COMPANIES.map(
      (c) =>
        `<button type="button" data-company-option data-company-id="${c.id}" data-company-color="${c.color}">${c.name}</button>`,
    ).join('');

    this.shadowRoot.innerHTML = `
      <demo-page-header title="Company Picker" scope="CompanyPicker">
        <p>Standalone company dropdown via <code>&lt;harmony-company-picker&gt;</code>. Fires <code>company-change</code> with id, name, and color.</p>
      </demo-page-header>

      <h2>Basic</h2>
      <demo-example>
        <div style="display:flex;justify-content:flex-end;">
          <harmony-company-picker
            company-name="Acme Corporation"
            company-id="acme-corp"
            company-color="#FF507B"
          >${options}</harmony-company-picker>
        </div>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>company-name</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>company-id</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>company-color</code></td><td>CSS color</td><td>—</td></tr>
          </tbody>
        </table>
        <p class="muted">Event: <code>company-change</code> → <code>{ id, name, color }</code>. Options: slotted buttons with <code>data-company-id</code> / <code>data-company-color</code>.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-company-picker company-name="Acme" company-id="acme" company-color="#FF507B">\n` +
      `  <button type="button" data-company-option data-company-id="acme" data-company-color="#FF507B">Acme</button>\n` +
      `</harmony-company-picker>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-company-picker company-name="Acme"></harmony-company-picker>`;
  }
}

if (!customElements.get('demo-company-picker-page')) {
  customElements.define('demo-company-picker-page', DemoCompanyPickerPage);
}
