import {
  HarmonyElement,
  createSheet,
  typographySheet,
  buttonSheet,
  cardSheet,
  labelSheet,
  inputSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';
import '../elements/DemoGuidelines.js';

const pageSheet = createSheet(`
  .demo-field,
  .field-stack-list > harmony-input,
  .field-stack-list > harmony-textarea,
  .field-stack-list > harmony-select {
    max-width: 24rem;
  }
  .field-stack-list { max-width: 28rem; }
  .field-stack { max-width: 24rem; }
  .form-card { max-width: 40rem; }
  .form-card .card__body { display: grid; gap: var(--space-4); }
  .grid-2 {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: 1fr;
  }
  @media (min-width: 640px) {
    .grid-2 { grid-template-columns: 1fr 1fr; }
  }
  .input-form-wrapper,
  .textarea-form-wrapper { max-width: 24rem; }
`);

export class DemoInputsPage extends HarmonyElement {
  static styles = [
    typographySheet,
    demoChromeSheet,
    demoPageSheet,
    buttonSheet,
    cardSheet,
    labelSheet,
    inputSheet,
    pageSheet,
  ];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Inputs" scope="Input">
        <p>Text inputs, textareas, and selects. Native text-like <code>&lt;input&gt;</code> / <code>&lt;textarea&gt;</code> / <code>&lt;select&gt;</code> get the Harmony look by default. Use <code>&lt;harmony-input&gt;</code> / <code>&lt;harmony-textarea&gt;</code> / <code>&lt;harmony-select&gt;</code> for adornments, errors, and form association. Align labeled fields with <code>&lt;harmony-form-layout&gt;</code>.</p>
      </demo-page-header>

      <h2 id="examples">Basic Input</h2>
      <demo-example>
        <harmony-input
          class="demo-field"
          type="email"
          id="email-basic"
          label="Email"
          placeholder="you@example.com"
        ></harmony-input>
      </demo-example>

      <h2>Input Types</h2>
      <demo-example>
        <div class="field-stack-list">
          <harmony-input type="text" id="text-input" label="Text" placeholder="Enter text..."></harmony-input>
          <harmony-input type="email" id="email-input" label="Email" placeholder="you@example.com"></harmony-input>
          <harmony-input type="password" id="password-input" label="Password" placeholder="Enter password"></harmony-input>
          <harmony-input type="number" id="number-input" label="Number" placeholder="0"></harmony-input>
        </div>
      </demo-example>

      <h2>With Icon</h2>
      <demo-example>
        <div class="field-stack-list">
          <harmony-input icon="magnifying-glass" id="search-input" label="Search" placeholder="Search..."></harmony-input>
          <harmony-input icon="envelope" type="email" id="email-icon" label="Email" placeholder="you@example.com"></harmony-input>
        </div>
      </demo-example>

      <h2>Trailing icon and slot</h2>
      <demo-example>
        <div class="field-stack-list">
          <harmony-input id="input-trailing-icon" label="Trailing icon" trailing-icon="currency-dollar" placeholder="0.00"></harmony-input>
          <harmony-input icon="magnifying-glass" id="input-lead-trail" label="Leading and trailing icons" trailing-icon="x-mark" placeholder="Search"></harmony-input>
          <harmony-input type="password" id="input-trailing-slot" label="Trailing slot (action)" placeholder="Password">
            <harmony-button
              slot="trailing"
              type="button"
              variant="ghost"
              size="sm"
              icon="eye"
              aria-label="Show password"
            ></harmony-button>
          </harmony-input>
        </div>
        <p class="muted">Prefer an icon-only ghost button in the trailing slot. The slot takes precedence over <code>trailing-icon</code>.</p>
      </demo-example>

      <h2>States</h2>
      <demo-example>
        <div class="field-stack-list">
          <harmony-input id="default-state" label="Default" placeholder="Default state"></harmony-input>
          <harmony-input id="disabled-state" label="Disabled" disabled value="Disabled input"></harmony-input>
          <harmony-input id="error-state" label="Error" error error-message="Please enter a valid value" value="Invalid value"></harmony-input>
        </div>
      </demo-example>

      <h2>Textarea</h2>
      <demo-example>
        <harmony-textarea
          class="demo-field"
          id="textarea-basic"
          label="Description"
          placeholder="Enter your message..."
        ></harmony-textarea>
      </demo-example>

      <h2>With Label (Stacked)</h2>
      <demo-example>
        <harmony-input
          id="stacked-email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
        ></harmony-input>
        <p class="muted">Standalone <code>label</code> is stacked unless <code>label-variant="inline"</code> (CP kits default unset to inline).</p>
      </demo-example>

      <h2>With Label (Inline)</h2>
      <demo-example>
        <harmony-input
          class="demo-field"
          id="inline-email"
          label="Email Address"
          label-variant="inline"
          type="email"
          placeholder="you@example.com"
        ></harmony-input>
        <p class="muted"><code>label-variant="inline"</code> places the field’s own label beside the control. Inside <code>harmony-form-layout</code> this attribute is ignored.</p>
      </demo-example>

      <h2>Textarea With Label</h2>
      <demo-example>
        <harmony-textarea
          class="demo-field"
          id="inline-message"
          label="Message"
          label-variant="inline"
          placeholder="Enter your message..."
        ></harmony-textarea>
      </demo-example>

      <h2>Form Example</h2>
      <demo-example>
        <div class="card form-card">
          <div class="card__body">
            <h3>Contact Form</h3>
            <form>
              <harmony-form-layout label-layout="stacked">
                <harmony-form-row>
                  <harmony-input id="first-name" label="First Name" placeholder="John" required></harmony-input>
                  <harmony-input id="last-name" label="Last Name" placeholder="Doe" required></harmony-input>
                </harmony-form-row>
                <harmony-input icon="envelope" type="email" id="contact-email" label="Email" placeholder="john@example.com" required></harmony-input>
                <harmony-select id="contact-country" name="country" label="Country" placeholder="Select a country">
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="uk">United Kingdom</option>
                </harmony-select>
                <harmony-textarea id="message" rows="4" label="Message" placeholder="How can we help you?" required></harmony-textarea>
              </harmony-form-layout>
              <div style="margin-top: var(--space-4)">
                <button type="submit" class="btn--full">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </demo-example>

      <h2>Form Example with Inline Labels</h2>
      <demo-example>
        <p class="muted">Same contact form with <code>label-layout="inline"</code>. First/Last and Country/Priority share <code>harmony-form-row</code>s; Email and Message sit on their own full-width rows. When compact, every field uses the same label|field columns and row gap.</p>
        <div class="card form-card">
          <div class="card__body">
            <h3>Contact Form</h3>
            <form>
              <harmony-form-layout label-layout="inline">
                <harmony-form-row>
                  <harmony-input id="inline-first" label="First Name" placeholder="John" required></harmony-input>
                  <harmony-input id="inline-last" label="Last Name" placeholder="Doe" required></harmony-input>
                </harmony-form-row>
                <harmony-form-row>
                  <harmony-select id="inline-country" name="country" label="Country" placeholder="Select a country">
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                  </harmony-select>
                  <harmony-select id="inline-priority" name="priority" label="Priority" value="medium">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </harmony-select>
                </harmony-form-row>
                <harmony-input icon="envelope" type="email" id="inline-contact-email" label="Email" placeholder="john@example.com" required></harmony-input>
                <harmony-textarea id="inline-contact-message" rows="4" label="Message" placeholder="How can we help you?" required></harmony-textarea>
              </harmony-form-layout>
              <div style="margin-top: var(--space-4)">
                <button type="submit" class="btn--full">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </demo-example>

      <h2>Form layout (stacked)</h2>
      <demo-example>
        <p class="muted">Single-column <code>harmony-form-layout</code> without a row group.</p>
        <div class="card form-card">
          <div class="card__body">
            <h3>Stacked layout</h3>
            <form>
              <harmony-form-layout label-layout="stacked">
                <harmony-input id="fl-stack-name" name="name" label="Full Name" placeholder="Jane Doe" required></harmony-input>
                <harmony-input id="fl-stack-email" name="email" type="email" label="Email" icon="envelope" placeholder="jane@example.com" required></harmony-input>
                <harmony-select id="fl-stack-country" name="country" label="Country" placeholder="Select a country">
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                </harmony-select>
                <harmony-textarea id="fl-stack-notes" name="notes" label="Notes" rows="3" placeholder="Optional notes"></harmony-textarea>
              </harmony-form-layout>
              <div style="margin-top: var(--space-4)">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </demo-example>

      <h2>Form layout (inline)</h2>
      <demo-example>
        <p class="muted">Inline layout aligns labels in one column. Use <code>harmony-form-row</code> when two fields should share a row (see Form Example with Inline Labels). On CP kits, omitting <code>label-layout</code> defaults to inline.</p>
        <div class="card form-card">
          <div class="card__body">
            <h3>Inline layout</h3>
            <form>
              <harmony-form-layout label-layout="inline">
                <harmony-form-row>
                  <harmony-input id="fl-inline-first" name="first" label="First Name" placeholder="John" required></harmony-input>
                  <harmony-input id="fl-inline-last" name="last" label="Last Name" placeholder="Doe" required></harmony-input>
                </harmony-form-row>
                <harmony-input id="fl-inline-email" name="email" type="email" label="Email" icon="envelope" placeholder="john@example.com" required></harmony-input>
                <harmony-textarea id="fl-inline-message" name="message" label="Message" rows="4" placeholder="How can we help you?" required></harmony-textarea>
              </harmony-form-layout>
              <div style="margin-top: var(--space-4)">
                <button type="submit" class="btn--full">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </demo-example>

      <h2>Native dual path</h2>
      <demo-example>
        <div class="field-stack-list">
          <div class="field-stack">
            <label class="label" for="native-email">Native input</label>
            <input id="native-email" type="email" placeholder="you@example.com" />
          </div>
          <div class="field-stack">
            <label class="label" for="native-ta">Native textarea</label>
            <textarea id="native-ta" rows="3" placeholder="Message"></textarea>
          </div>
        </div>
        <p class="muted">Unclassed text-like inputs and textareas pick up Harmony styles from product CSS.</p>
      </demo-example>

      <h2 id="usage">Usage Guidelines</h2>
      <demo-example>
        <demo-guidelines>
          <demo-guideline variant="do">
            <li>Always use labels with inputs</li>
            <li>Provide helpful placeholder text</li>
            <li>Show validation feedback inline</li>
            <li>Use appropriate input types</li>
          </demo-guideline>
          <demo-guideline variant="dont">
            <li>Use placeholder as label</li>
            <li>Hide error messages</li>
            <li>Disable without explanation</li>
            <li>Use generic error messages</li>
          </demo-guideline>
        </demo-guidelines>
      </demo-example>

      <h2 id="props">API</h2>
      <demo-example>
        <h4>harmony-input</h4>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>type</code></td><td>text | email | password | number | url | search | tel</td><td>text</td></tr>
            <tr><td><code>name</code> / <code>value</code> / <code>placeholder</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>disabled</code> / <code>required</code> / <code>readonly</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>error</code> / <code>error-message</code></td><td>boolean / string</td><td>—</td></tr>
            <tr><td><code>icon</code> / <code>trailing-icon</code></td><td>harmony-icon name</td><td>—</td></tr>
            <tr><td><code>label</code></td><td>string (stacked when standalone)</td><td>—</td></tr>
            <tr><td><code>label-variant</code></td><td>inline | stacked</td><td>stacked (inline on CP when unset; ignored inside <code>harmony-form-layout</code>)</td></tr>
          </tbody>
        </table>
        <h4>harmony-textarea</h4>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>rows</code></td><td>number</td><td>4</td></tr>
            <tr><td>core + <code>error</code> / <code>label</code></td><td>same as input (no icons)</td><td>—</td></tr>
          </tbody>
        </table>
        <p class="muted">Events: retargeted <code>input</code> / <code>change</code>. Slot: <code>trailing</code> (input only). Form: <code>formAssociated</code> + ElementInternals.</p>
        <h4>harmony-form-layout</h4>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>label-layout</code></td><td>inline | stacked</td><td>stacked (inline on CP when unset)</td></tr>
          </tbody>
        </table>
        <h4>harmony-form-row</h4>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>columns</code></td><td>number</td><td>2</td></tr>
          </tbody>
        </table>
        <p class="muted">Wrap fields in <code>harmony-form-row</code> to place them on one row (e.g. First/Last Name, or Country next to another field). <code>harmony-select</code> uses the same cells as <code>harmony-input</code>. Inline dissolves the row into the parent grid; full-width fields span remaining tracks. The layout sets <code>data-compact</code> when pairs cannot be 160px (stacked) or 200px (inline) wide.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Associate labels with <code>for</code>/<code>id</code> (or use the field <code>label</code> attribute). Errors set <code>aria-invalid</code> and <code>aria-describedby</code>. Focus rings and forced-colors use document CSS for native fields and shadow-local rules on the CEs.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-input id="email" type="email" name="email" label="Email" icon="envelope"></harmony-input>\n\n` +
      `<form>\n` +
      `  <harmony-form-layout label-layout="inline">\n` +
      `    <harmony-form-row>\n` +
      `      <harmony-input id="first" name="first" label="First Name" required></harmony-input>\n` +
      `      <harmony-input id="last" name="last" label="Last Name" required></harmony-input>\n` +
      `    </harmony-form-row>\n` +
      `    <harmony-input id="email2" name="email" type="email" label="Email" required></harmony-input>\n` +
      `    <harmony-textarea id="msg" name="msg" label="Message" rows="4"></harmony-textarea>\n` +
      `  </harmony-form-layout>\n` +
      `  <button type="submit">Send</button>\n` +
      `</form>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<input type="email" placeholder="you@example.com" />\n` +
      `<harmony-input id="search" icon="magnifying-glass" placeholder="Search"></harmony-input>`;
  }
}

if (!customElements.get('demo-inputs-page')) {
  customElements.define('demo-inputs-page', DemoInputsPage);
}
