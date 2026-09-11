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
  .field-stack { max-width: 24rem; }
`);

export class DemoLabelsPage extends HarmonyElement {
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
      <demo-page-header title="Labels" scope="Label">
        <p>Native <code>&lt;label class="label"&gt;</code> for form fields. Required indicator via <code>.label--required</code>; helper text via <code>.label__helper</code>.</p>
      </demo-page-header>

      <h2 id="examples">Basic Label</h2>
      <demo-example>
        <div class="field-stack">
          <label class="label" for="name">Full Name</label>
          <harmony-input id="name" placeholder="Enter your name"></harmony-input>
        </div>
      </demo-example>

      <h2>Required Label</h2>
      <demo-example>
        <div class="field-stack">
          <label class="label label--required" for="email">Email Address</label>
          <harmony-input id="email" type="email" placeholder="you@example.com" required></harmony-input>
        </div>
      </demo-example>

      <h2>With Helper Text</h2>
      <demo-example>
        <div class="field-stack">
          <label class="label" for="phone">Phone Number <span class="label__helper">(optional)</span></label>
          <harmony-input id="phone" type="tel" placeholder="(555) 555-5555"></harmony-input>
        </div>
      </demo-example>

      <h2 id="props">Classes</h2>
      <demo-example>
        <table>
          <thead><tr><th>Class</th><th>Role</th></tr></thead>
          <tbody>
            <tr><td><code>.label</code></td><td>Base form label</td></tr>
            <tr><td><code>.label--required</code></td><td>Appends red <code>*</code></td></tr>
            <tr><td><code>.label__helper</code></td><td>Muted helper text (usually in parentheses)</td></tr>
          </tbody>
        </table>
        <p class="muted">Native <code>for</code> associates with the control <code>id</code>. No <code>harmony-label</code> Custom Element.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Always set <code>for</code> to the associated control id. Pair <code>.label--required</code> with the control’s <code>required</code> attribute. Helper text is part of the label content and is announced with the name.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n\n` +
      `<label class="label label--required" for="email">Email</label>\n` +
      `<input id="email" type="email" required />`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n\n` +
      `<label class="label" for="phone">Phone <span class="label__helper">(optional)</span></label>\n` +
      `<input id="phone" type="tel" />`;
  }
}

if (!customElements.get('demo-labels-page')) {
  customElements.define('demo-labels-page', DemoLabelsPage);
}
