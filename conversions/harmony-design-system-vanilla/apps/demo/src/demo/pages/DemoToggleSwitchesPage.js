import {
  HarmonyElement,
  createSheet,
  typographySheet,
  toggleSheet,
  inputSheet,
  labelSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

const pageSheet = createSheet(`
  .field-stack { display: grid; gap: var(--space-4); max-width: 28rem; }
  .inline-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
    align-items: center;
  }
  .form-strip { max-width: 28rem; }
`);

export class DemoToggleSwitchesPage extends HarmonyElement {
  static styles = [
    typographySheet,
    demoChromeSheet,
    demoPageSheet,
    toggleSheet,
    inputSheet,
    labelSheet,
    pageSheet,
  ];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Toggle Switches" scope="Toggle">
        <p>Binary on/off (or two labeled options) via <code>&lt;harmony-toggle&gt;</code>. CE-only surface — no native checkbox restyled as a switch. Participates in <code>harmony-form-layout</code>.</p>
      </demo-page-header>

      <h2 id="examples">Basic</h2>
      <demo-example>
        <div class="field-stack">
          <harmony-toggle label="Enable notifications"></harmony-toggle>
          <harmony-toggle label="Dark mode" checked></harmony-toggle>
        </div>
      </demo-example>

      <h2>States</h2>
      <demo-example>
        <div class="field-stack">
          <harmony-toggle label="Unchecked"></harmony-toggle>
          <harmony-toggle label="Checked" checked></harmony-toggle>
          <harmony-toggle label="Disabled" disabled></harmony-toggle>
          <harmony-toggle label="Checked &amp; disabled" checked disabled></harmony-toggle>
        </div>
      </demo-example>

      <h2>Sizes</h2>
      <demo-example>
        <div class="inline-row">
          <harmony-toggle size="sm" label="Small"></harmony-toggle>
          <harmony-toggle size="md" label="Medium"></harmony-toggle>
        </div>
      </demo-example>

      <h2>Without label</h2>
      <demo-example>
        <div class="inline-row">
          <harmony-toggle aria-label="Toggle A"></harmony-toggle>
          <harmony-toggle checked aria-label="Toggle B"></harmony-toggle>
          <harmony-toggle disabled aria-label="Toggle C"></harmony-toggle>
        </div>
      </demo-example>

      <h2>Segmented</h2>
      <demo-example>
        <div class="field-stack">
          <div class="inline-row">
            <harmony-toggle variant="segmented"></harmony-toggle>
            <harmony-toggle variant="segmented" checked></harmony-toggle>
          </div>
          <harmony-toggle variant="segmented" disabled></harmony-toggle>
          <harmony-toggle
            variant="segmented"
            option-label-left="List"
            option-label-right="Board"
          ></harmony-toggle>
        </div>
        <p class="muted">Unchecked = left option; checked = right. External <code>label</code> is ignored for segmented.</p>
      </demo-example>

      <h2>Form layout (Stacked)</h2>
      <demo-example>
        <harmony-form-layout class="form-strip" label-layout="stacked">
          <harmony-toggle label="Email digests" name="fl-notif" checked></harmony-toggle>
          <harmony-toggle label="Auto-save" name="fl-auto"></harmony-toggle>
          <harmony-toggle label="Beta features" name="fl-beta"></harmony-toggle>
        </harmony-form-layout>
        <p class="muted">Field <code>id</code> is optional — labels still activate the control.</p>
      </demo-example>

      <h2>Form layout (Inline)</h2>
      <demo-example>
        <harmony-form-layout class="form-strip" label-layout="inline">
          <harmony-toggle label="Email digests" name="fli-notif" checked></harmony-toggle>
          <harmony-toggle label="Auto-save" name="fli-auto"></harmony-toggle>
          <harmony-toggle label="Beta features" name="fli-beta"></harmony-toggle>
        </harmony-form-layout>
        <p class="muted">Field <code>id</code> is optional — labels still activate the control.</p>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>label</code></td><td>string (default variant)</td><td>—</td></tr>
            <tr><td><code>variant</code></td><td>default | segmented</td><td>default</td></tr>
            <tr><td><code>size</code></td><td>sm | md</td><td>md</td></tr>
            <tr><td><code>option-label-left</code> / <code>option-label-right</code></td><td>string</td><td>Item 1 / Item 2</td></tr>
            <tr><td><code>checked</code> / <code>disabled</code> / <code>required</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>name</code> / <code>id</code></td><td>string</td><td>—</td></tr>
          </tbody>
        </table>
        <p class="muted">Uses <code>role="switch"</code> and <code>aria-checked</code>. Form-associated.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Default variant associates visible label text. Segmented exposes both option names (default <code>aria-label</code> or your own). Tab to focus; Space to toggle. Disabled switches are not focusable.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-toggle label="Enable notifications" checked></harmony-toggle>\n` +
      `<harmony-toggle variant="segmented" option-label-left="List" option-label-right="Board"></harmony-toggle>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-toggle label="Dark mode"></harmony-toggle>`;
  }
}

if (!customElements.get('demo-toggle-switches-page')) {
  customElements.define('demo-toggle-switches-page', DemoToggleSwitchesPage);
}
