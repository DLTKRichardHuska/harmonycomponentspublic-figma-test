import {
  HarmonyElement,
  createSheet,
  typographySheet,
  labelSheet,
  inputSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

const pageSheet = createSheet(`
  .demo-field,
  .field-stack {
    max-width: 24rem;
  }
  .form-card { max-width: 40rem; }
`);

const COUNTRY_OPTIONS = `
  <option value="us">United States</option>
  <option value="ca">Canada</option>
  <option value="uk">United Kingdom</option>
  <option value="de">Germany</option>
  <option value="fr">France</option>
`;

const PRIORITY_OPTIONS = `
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
  <option value="urgent">Urgent</option>
`;

export class DemoDropdownsPage extends HarmonyElement {
  static styles = [
    typographySheet,
    demoChromeSheet,
    demoPageSheet,
    labelSheet,
    inputSheet,
    pageSheet,
  ];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Dropdowns" scope="Dropdown">
        <p>Catalog Dropdown ships as Select. Native <code>&lt;select&gt;</code> gets the Harmony closed-field look. Use <code>&lt;harmony-select&gt;</code> for labels, errors, and <code>&lt;harmony-form-layout&gt;</code>. The open list is the operating-system picker.</p>
      </demo-page-header>

      <h2 id="examples">Basic Dropdown</h2>
      <demo-example>
        <div class="field-stack">
          <label class="label" for="country-basic">Country</label>
          <harmony-select id="country-basic" name="country" placeholder="Select a country">
            ${COUNTRY_OPTIONS}
          </harmony-select>
        </div>
      </demo-example>

      <h2>With Label (Stacked)</h2>
      <demo-example>
        <harmony-select
          class="demo-field"
          id="country-stacked"
          label="Country"
          label-variant="stacked"
          placeholder="Select a country"
        >
          ${COUNTRY_OPTIONS}
        </harmony-select>
      </demo-example>

      <h2>With Label (Inline)</h2>
      <demo-example>
        <harmony-select
          class="demo-field"
          id="country-inline"
          label="Country"
          label-variant="inline"
          placeholder="Select a country"
        >
          ${COUNTRY_OPTIONS}
        </harmony-select>
      </demo-example>

      <h2>With Pre-selected Value</h2>
      <demo-example>
        <div class="field-stack">
          <label class="label" for="priority">Priority</label>
          <harmony-select id="priority" name="priority" value="medium">
            ${PRIORITY_OPTIONS}
          </harmony-select>
        </div>
      </demo-example>

      <h2>Disabled</h2>
      <demo-example>
        <div class="field-stack">
          <label class="label" for="country-disabled">Country (Disabled)</label>
          <harmony-select id="country-disabled" value="us" disabled>
            ${COUNTRY_OPTIONS}
          </harmony-select>
        </div>
      </demo-example>

      <h2>Error</h2>
      <demo-example>
        <harmony-select
          class="demo-field"
          id="country-error"
          label="Country"
          error
          error-message="Select a country"
          placeholder="Select a country"
          required
        >
          ${COUNTRY_OPTIONS}
        </harmony-select>
      </demo-example>

      <h2>Native select</h2>
      <demo-example>
        <div class="field-stack">
          <label class="label" for="native-country">Country</label>
          <select id="native-country" name="country">
            <option value="" disabled selected>Select a country</option>
            ${COUNTRY_OPTIONS}
          </select>
        </div>
        <p class="muted">Unclassed <code>&lt;select&gt;</code> picks up Harmony styles from product CSS. <code>.select</code> is the same look when a class is needed.</p>
      </demo-example>

      <h2>Form layout</h2>
      <demo-example>
        <p class="muted"><code>harmony-select</code> uses the same cells and label columns as <code>harmony-input</code>.</p>
        <div class="card form-card">
          <div class="card__body">
            <form>
              <harmony-form-layout label-layout="inline">
                <harmony-form-row>
                  <harmony-input id="dd-first" name="first" label="First Name" placeholder="Jane" required></harmony-input>
                  <harmony-select id="dd-country" name="country" label="Country" placeholder="Select a country" required>
                    ${COUNTRY_OPTIONS}
                  </harmony-select>
                </harmony-form-row>
              </harmony-form-layout>
            </form>
          </div>
        </div>
      </demo-example>

      <h2 id="props">API</h2>
      <demo-example>
        <h4>harmony-select</h4>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>name</code> / <code>value</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>placeholder</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>disabled</code> / <code>required</code> / <code>error</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>error-message</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>label</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>label-variant</code></td><td>inline | stacked</td><td>stacked (inline on CP when unset; ignored inside form layout)</td></tr>
          </tbody>
        </table>
        <p class="muted">Default slot: <code>&lt;option&gt;</code> and <code>&lt;optgroup&gt;</code>. Events: retargeted <code>input</code> / <code>change</code>. There is no <code>harmony-dropdown</code>.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>The control is a native <code>&lt;select&gt;</code> (keyboard, required, and disabled follow the platform). Associate a label with <code>for</code>/<code>id</code> or the <code>label</code> attribute. Disabled selects are not focusable. The custom Astro listbox, trigger slot, and option slots are not part of this conversion — the open menu is the OS picker.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-select id="country" name="country" label="Country" placeholder="Select a country">\n` +
      `  <option value="us">United States</option>\n` +
      `  <option value="ca">Canada</option>\n` +
      `</harmony-select>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<label class="label" for="country">Country</label>\n` +
      `<select id="country" name="country">\n` +
      `  <option value="us">United States</option>\n` +
      `</select>`;
  }
}

if (!customElements.get('demo-dropdowns-page')) {
  customElements.define('demo-dropdowns-page', DemoDropdownsPage);
}
