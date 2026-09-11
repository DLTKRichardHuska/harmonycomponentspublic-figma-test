import {
  HarmonyElement,
  createSheet,
  typographySheet,
  checkboxSheet,
  inputSheet,
  labelSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoCallout.js';
import '../elements/DemoConsumeSnippets.js';

const pageSheet = createSheet(`
  .field-stack { display: grid; gap: var(--space-3); max-width: 28rem; }
  .inline-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
    align-items: center;
  }
  .native-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }
  .form-strip { max-width: 28rem; }
`);

export class DemoCheckboxesPage extends HarmonyElement {
  static styles = [
    typographySheet,
    demoChromeSheet,
    demoPageSheet,
    checkboxSheet,
    inputSheet,
    labelSheet,
    pageSheet,
  ];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Checkboxes" scope="Checkbox">
        <p>Native <code>input[type=checkbox]</code> gets a Harmony look by default. Use <code>&lt;harmony-checkbox&gt;</code> for labels, warning/error, and <code>harmony-form-layout</code>.</p>
      </demo-page-header>

      <demo-callout tone="warning">
        <strong>CheckboxGroup</strong> is out of scope for this conversion — group related options with a <code>fieldset</code> or form layout for now.
      </demo-callout>

      <h2 id="examples">Native checkboxes</h2>
      <demo-example>
        <div class="field-stack">
          <label class="native-row"><input type="checkbox" name="native-1" /> Option 1</label>
          <label class="native-row"><input type="checkbox" name="native-2" checked /> Option 2 (checked)</label>
          <label class="native-row"><input type="checkbox" name="native-3" disabled /> Option 3 (disabled)</label>
        </div>
      </demo-example>

      <h2>Basic — <code>harmony-checkbox</code></h2>
      <demo-example>
        <div class="field-stack">
          <harmony-checkbox label="Option 1" name="basic-1"></harmony-checkbox>
          <harmony-checkbox label="Option 2 (checked)" name="basic-2" checked></harmony-checkbox>
          <harmony-checkbox label="Option 3" name="basic-3"></harmony-checkbox>
        </div>
      </demo-example>

      <h2>States</h2>
      <demo-example>
        <div class="field-stack">
          <harmony-checkbox label="Unchecked" name="state-unchecked"></harmony-checkbox>
          <harmony-checkbox label="Checked" name="state-checked" checked></harmony-checkbox>
          <harmony-checkbox label="Disabled" name="state-disabled" disabled></harmony-checkbox>
          <harmony-checkbox label="Checked &amp; disabled" name="state-checked-disabled" checked disabled></harmony-checkbox>
        </div>
      </demo-example>

      <h2>Without labels</h2>
      <demo-example>
        <div class="inline-row">
          <harmony-checkbox name="no-label-1" aria-label="Option 1"></harmony-checkbox>
          <harmony-checkbox name="no-label-2" checked aria-label="Option 2"></harmony-checkbox>
          <harmony-checkbox name="no-label-3" disabled aria-label="Option 3"></harmony-checkbox>
        </div>
      </demo-example>

      <h2>Warning &amp; error</h2>
      <demo-example>
        <div class="field-stack">
          <h4>Warning</h4>
          <harmony-checkbox label="Unchecked with warning" name="warning-unchecked" warning warning-message="This action may have unintended consequences"></harmony-checkbox>
          <harmony-checkbox label="Checked with warning" name="warning-checked" checked warning warning-message="Review this selection carefully"></harmony-checkbox>
          <h4>Error</h4>
          <harmony-checkbox label="Unchecked with error" name="error-unchecked" error error-message="This field is required"></harmony-checkbox>
          <harmony-checkbox label="Checked with error" name="error-checked" checked error error-message="This selection is invalid"></harmony-checkbox>
        </div>
      </demo-example>

      <h2>Inline layout</h2>
      <demo-example>
        <div class="inline-row">
          <harmony-checkbox label="Option A" name="inline-a"></harmony-checkbox>
          <harmony-checkbox label="Option B" name="inline-b" checked></harmony-checkbox>
          <harmony-checkbox label="Option C" name="inline-c"></harmony-checkbox>
          <harmony-checkbox label="Option D" name="inline-d"></harmony-checkbox>
        </div>
      </demo-example>

      <h2>Form layout (Stacked)</h2>
      <demo-example>
        <harmony-form-layout class="form-strip" label-layout="stacked">
          <harmony-checkbox label="Email notifications" name="fl-email" checked></harmony-checkbox>
          <harmony-checkbox label="SMS notifications" name="fl-sms"></harmony-checkbox>
          <harmony-checkbox label="Push notifications" name="fl-push" checked></harmony-checkbox>
        </harmony-form-layout>
        <p class="muted">Inside <code>harmony-form-layout</code>, the layout owns the label. Field <code>id</code> is optional (add it only when you need a JS/CSS hook).</p>
      </demo-example>

      <h2>Form layout (Inline)</h2>
      <demo-example>
        <harmony-form-layout class="form-strip" label-layout="inline">
          <harmony-checkbox label="Email notifications" name="fli-email" checked></harmony-checkbox>
          <harmony-checkbox label="SMS notifications" name="fli-sms"></harmony-checkbox>
          <harmony-checkbox label="Push notifications" name="fli-push" checked></harmony-checkbox>
        </harmony-form-layout>
        <p class="muted">Inline boolean fields put the control before the label (checkbox | label). Text fields still use label | field.</p>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>label</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>checked</code> / <code>disabled</code> / <code>required</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>warning</code> / <code>error</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>warning-message</code> / <code>error-message</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>name</code> / <code>value</code> / <code>id</code></td><td>string (<code>id</code> optional)</td><td>—</td></tr>
            <tr><td><code>indeterminate</code></td><td>property (boolean)</td><td>false</td></tr>
          </tbody>
        </table>
        <p class="muted">Form-associated; retargets <code>input</code> / <code>change</code>. Dual path with native checkboxes.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2 id="usage">Usage Guidelines</h2>
      <demo-example>
        <div class="guidelines">
          <div>
            <h4>Do</h4>
            <ul>
              <li>Use for multiple selections</li>
              <li>Provide clear, concise labels</li>
              <li>Group related options together</li>
              <li>Use for binary on/off choices</li>
              <li>Use error state for validation failures</li>
              <li>Use warning state for cautionary information</li>
              <li>Provide helpful message text with warning/error states</li>
            </ul>
          </div>
          <div>
            <h4>Don't</h4>
            <ul>
              <li>Use for mutually exclusive options (use radio buttons)</li>
              <li>Have checkboxes without labels</li>
              <li>Use negative phrasing</li>
              <li>Pre-check options unexpectedly</li>
              <li>Use error state for warnings (use warning state instead)</li>
              <li>Show error/warning states without helpful messages</li>
            </ul>
          </div>
        </div>
      </demo-example>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Visible labels (or <code>aria-label</code>) are required. <code>error</code> sets <code>aria-invalid</code> and associates the message. Toggle with Space; Tab moves focus.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-checkbox label="Email notifications" name="email" checked></harmony-checkbox>\n` +
      `<harmony-checkbox label="Required" name="req" error error-message="Required"></harmony-checkbox>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<label><input type="checkbox" name="opt" /> Option</label>\n` +
      `<harmony-checkbox label="Option" name="opt2"></harmony-checkbox>`;
  }
}

if (!customElements.get('demo-checkboxes-page')) {
  customElements.define('demo-checkboxes-page', DemoCheckboxesPage);
}
