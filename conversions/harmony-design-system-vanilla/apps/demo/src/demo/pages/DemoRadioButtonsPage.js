import {
  HarmonyElement,
  createSheet,
  typographySheet,
  radioSheet,
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

export class DemoRadioButtonsPage extends HarmonyElement {
  static styles = [
    typographySheet,
    demoChromeSheet,
    demoPageSheet,
    radioSheet,
    inputSheet,
    labelSheet,
    pageSheet,
  ];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Radio Buttons" scope="RadioButton">
        <p>Native <code>input[type=radio]</code> gets a Harmony look by default. Use <code>&lt;harmony-radio&gt;</code> for labels, sizes, warning/error, and form layout. Group mutually exclusive options with the same <code>name</code>.</p>
      </demo-page-header>

      <demo-callout tone="warning">
        <strong>RadioGroup</strong> is later / out of scope — group with a shared <code>name</code> (and optional <code>fieldset</code>) for now.
      </demo-callout>

      <h2 id="examples">Native radios</h2>
      <demo-example>
        <div class="field-stack">
          <label class="native-row"><input type="radio" name="native-basic" value="1" /> Option 1</label>
          <label class="native-row"><input type="radio" name="native-basic" value="2" checked /> Option 2</label>
          <label class="native-row"><input type="radio" name="native-basic" value="3" /> Option 3</label>
        </div>
      </demo-example>

      <h2>Basic — <code>harmony-radio</code></h2>
      <demo-example>
        <div class="field-stack">
          <harmony-radio name="basic" value="1" label="Option 1"></harmony-radio>
          <harmony-radio name="basic" value="2" label="Option 2" checked></harmony-radio>
          <harmony-radio name="basic" value="3" label="Option 3"></harmony-radio>
        </div>
      </demo-example>

      <h2>Sizes</h2>
      <demo-example>
        <div class="field-stack">
          <harmony-radio name="sizes" value="sm" label="Small" size="small"></harmony-radio>
          <harmony-radio name="sizes" value="md" label="Medium (default)" size="medium" checked></harmony-radio>
          <harmony-radio name="sizes" value="lg" label="Large" size="large"></harmony-radio>
        </div>
      </demo-example>

      <h2>States</h2>
      <demo-example>
        <div class="field-stack">
          <harmony-radio name="states" value="1" label="Unchecked"></harmony-radio>
          <harmony-radio name="states" value="2" label="Checked" checked></harmony-radio>
          <harmony-radio name="states2" value="3" label="Disabled" disabled></harmony-radio>
          <harmony-radio name="states2" value="4" label="Checked &amp; disabled" checked disabled></harmony-radio>
        </div>
      </demo-example>

      <h2>Inline layout</h2>
      <demo-example>
        <div class="inline-row">
          <harmony-radio name="color" value="red" label="Red"></harmony-radio>
          <harmony-radio name="color" value="green" label="Green" checked></harmony-radio>
          <harmony-radio name="color" value="blue" label="Blue"></harmony-radio>
        </div>
      </demo-example>

      <h2>Warning &amp; error</h2>
      <demo-example>
        <div class="field-stack">
          <h4>Warning</h4>
          <harmony-radio name="warning-unchecked" value="1" label="Unchecked with warning" warning warning-message="This action may have unintended consequences"></harmony-radio>
          <harmony-radio name="warning-checked" value="2" label="Checked with warning" checked warning warning-message="Review this selection carefully"></harmony-radio>
          <h4>Error</h4>
          <harmony-radio name="error-unchecked" value="1" label="Unchecked with error" error error-message="This field is required"></harmony-radio>
          <harmony-radio name="error-checked" value="2" label="Checked with error" checked error error-message="This selection is invalid"></harmony-radio>
        </div>
      </demo-example>

      <h2>Form layout (Stacked)</h2>
      <demo-example>
        <harmony-form-layout class="form-strip" label-layout="stacked">
          <harmony-radio name="fl-plan" value="starter" label="Starter" checked></harmony-radio>
          <harmony-radio name="fl-plan" value="pro" label="Pro"></harmony-radio>
          <harmony-radio name="fl-plan" value="enterprise" label="Enterprise"></harmony-radio>
        </harmony-form-layout>
        <p class="muted">Shared <code>name</code> keeps selection exclusive. Field <code>id</code> is optional — labels still activate the control.</p>
      </demo-example>

      <h2>Form layout (Inline)</h2>
      <demo-example>
        <harmony-form-layout class="form-strip" label-layout="inline">
          <harmony-radio name="fli-plan" value="starter" label="Starter" checked></harmony-radio>
          <harmony-radio name="fli-plan" value="pro" label="Pro"></harmony-radio>
          <harmony-radio name="fli-plan" value="enterprise" label="Enterprise"></harmony-radio>
        </harmony-form-layout>
        <p class="muted">Inline puts the radio before the label. Separate <code>name</code> from the stacked example so groups don’t collide.</p>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>name</code> / <code>value</code></td><td>string (required for grouping)</td><td>—</td></tr>
            <tr><td><code>label</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>size</code></td><td>small | medium | large</td><td>medium</td></tr>
            <tr><td><code>checked</code> / <code>disabled</code> / <code>required</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>warning</code> / <code>error</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>warning-message</code> / <code>error-message</code></td><td>string</td><td>—</td></tr>
          </tbody>
        </table>
        <p class="muted">Form-associated; dual path with native radios. Same <code>name</code> = one group.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>All options in a group share <code>name</code>. Tab into the group; arrow keys move selection. Error state sets <code>aria-invalid</code> and associates the message.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-radio name="plan" value="a" label="Starter" checked></harmony-radio>\n` +
      `<harmony-radio name="plan" value="b" label="Pro"></harmony-radio>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<label><input type="radio" name="plan" value="a" checked /> Starter</label>\n` +
      `<label><input type="radio" name="plan" value="b" /> Pro</label>`;
  }
}

if (!customElements.get('demo-radio-buttons-page')) {
  customElements.define('demo-radio-buttons-page', DemoRadioButtonsPage);
}
