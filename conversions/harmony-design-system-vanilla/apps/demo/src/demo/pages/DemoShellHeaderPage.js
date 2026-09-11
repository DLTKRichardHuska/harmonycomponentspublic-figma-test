import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

const DEMO_PHOTO =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&w=128&h=128&fit=crop&q=80';

const COMPANIES = [
  { id: 'acme-corp', name: 'Acme Corporation', color: '#FF507B' },
  { id: 'ocean-industries', name: 'Ocean Industries', color: '#285F8C' },
  { id: 'violet-systems', name: 'Violet Systems', color: '#DC50FF' },
  { id: 'azure-dynamics', name: 'Azure Dynamics', color: '#5077FF' },
  { id: 'sunset-corporation', name: 'Sunset Corporation', color: '#FFAF50' },
];

function companyOptionsHtml() {
  return COMPANIES.map(
    (c) =>
      `<button type="button" data-company-option data-company-id="${c.id}" data-company-color="${c.color}">${c.name}</button>`,
  ).join('');
}

export class DemoShellHeaderPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Shell Header" scope="ShellHeader">
        <p>Top application bar via <code>&lt;harmony-shell-header&gt;</code>. Compose Company Picker, User Menu, and extra controls in <code>slot="actions"</code>. Product logo comes from the product kit (no logo attribute).</p>
      </demo-page-header>

      <h2>Default composition</h2>
      <demo-example>
        <div style="min-height:120px;border:1px solid var(--border-color);border-radius:var(--radius-lg);overflow:hidden">
          <harmony-shell-header id="demo-shell-header" product-name="Costpoint" gradient-color="#FF507B">
            <div slot="actions" style="display:flex;align-items:center;gap:var(--space-3)">
              <harmony-company-picker
                id="demo-company-picker"
                company-name="Acme Corporation"
                company-id="acme-corp"
                company-color="#FF507B"
              >${companyOptionsHtml()}</harmony-company-picker>
              <span style="width:1px;height:20px;background:var(--border-color)" aria-hidden="true"></span>
              <harmony-user-menu name="Jane Doe">
                <button type="button" data-icon="user">Profile</button>
                <button type="button" data-icon="cog-6-tooth">Settings</button>
                <button type="button" data-icon="arrow-right-on-rectangle">Sign out</button>
              </harmony-user-menu>
            </div>
          </harmony-shell-header>
        </div>
        <p class="muted">Selecting a company updates the header gradient via <code>company-change</code>.</p>
      </demo-example>

      <h2>Custom actions / swap picker</h2>
      <demo-example>
        <div style="min-height:120px;border:1px solid var(--border-color);border-radius:var(--radius-lg);overflow:hidden">
          <harmony-shell-header product-name="Costpoint">
            <div slot="actions" style="display:flex;align-items:center;gap:var(--space-3)">
              <button type="button" class="btn btn--ghost btn--sm">Help</button>
              <harmony-user-menu name="Alex Rivera" src="${DEMO_PHOTO}">
                <button type="button" data-icon="user-circle">Account</button>
                <button type="button" data-icon="arrow-right-on-rectangle">Sign out</button>
              </harmony-user-menu>
            </div>
          </harmony-shell-header>
        </div>
        <p class="muted">Company picker omitted; ghost Help control plus image User Menu.</p>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>product-name</code></td><td>string</td><td>Harmony</td></tr>
            <tr><td><code>gradient-color</code></td><td>CSS color</td><td>product primary</td></tr>
            <tr><td><code>href</code></td><td>brand URL</td><td>/</td></tr>
          </tbody>
        </table>
        <p class="muted">Slot <code>actions</code>. No logo attribute — mark is product-scoped.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>
    `;

    const header = this.shadowRoot.querySelector('#demo-shell-header');
    this.shadowRoot.querySelector('#demo-company-picker')?.addEventListener('company-change', (e) => {
      if (header && e.detail?.color) header.setAttribute('gradient-color', e.detail.color);
    });

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-shell-header product-name="Costpoint">\n` +
      `  <div slot="actions">…</div>\n` +
      `</harmony-shell-header>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-shell-header product-name="Costpoint"></harmony-shell-header>`;
  }
}

if (!customElements.get('demo-shell-header-page')) {
  customElements.define('demo-shell-header-page', DemoShellHeaderPage);
}
