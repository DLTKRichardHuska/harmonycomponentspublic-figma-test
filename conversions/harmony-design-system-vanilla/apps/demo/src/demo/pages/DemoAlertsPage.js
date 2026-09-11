import {
  HarmonyElement,
  createSheet,
  typographySheet,
  buttonSheet,
  linkSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

const pageSheet = createSheet(`
  .stack.wide { max-width: 40rem; }
  harmony-alert { width: 100%; }
`);

export class DemoAlertsPage extends HarmonyElement {
  static styles = [
    typographySheet,
    demoChromeSheet,
    demoPageSheet,
    buttonSheet,
    linkSheet,
    pageSheet,
  ];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Alerts" scope="Alert">
        <p>Alerts via <code>&lt;harmony-alert&gt;</code>. Close emits <code>dismiss</code> (consumer removes). Enhanced actions use the <code>actions</code> slot with design-system buttons and links.</p>
      </demo-page-header>

      <h2>Variants</h2>
      <demo-example>
        <div class="stack wide">
          <harmony-alert variant="info" title="Information">This is an informational message for the user.</harmony-alert>
          <harmony-alert variant="success" title="Success">Your changes have been saved successfully.</harmony-alert>
          <harmony-alert variant="warning" title="Warning">Please review the changes before proceeding.</harmony-alert>
          <harmony-alert variant="error" title="Error">Something went wrong. Please try again.</harmony-alert>
        </div>
      </demo-example>

      <h2>Dismissible</h2>
      <demo-example>
        <div class="stack wide">
          <harmony-alert variant="info" title="Dismissible Alert" dismissible>
            Click the X button to dismiss this alert.
          </harmony-alert>
        </div>
      </demo-example>

      <h2>Without Title</h2>
      <demo-example>
        <div class="stack wide">
          <harmony-alert variant="info">A simple informational message.</harmony-alert>
          <harmony-alert variant="success">Operation completed successfully.</harmony-alert>
        </div>
      </demo-example>

      <h2>Enhanced Variant</h2>
      <demo-example>
        <div class="stack wide">
          <harmony-alert variant="success" enhanced title="Alert Title" dismissible>
            Alert Description
          </harmony-alert>
          <harmony-alert variant="warning" enhanced title="Warning Alert" dismissible>
            This is a warning message with enhanced styling.
          </harmony-alert>
        </div>
      </demo-example>

      <h2>Enhanced with Actions</h2>
      <demo-example>
        <div class="stack wide">
          <harmony-alert variant="success" enhanced title="Success Alert" dismissible>
            This alert includes primary and secondary buttons, plus a link.
            <div slot="actions">
              <harmony-button size="xs" variant="primary">Button Text</harmony-button>
              <harmony-button size="xs" variant="secondary">Button Text</harmony-button>
              <a class="text-xs" href="#examples">Link Text</a>
            </div>
          </harmony-alert>
          <harmony-alert variant="info" enhanced title="Information Alert" dismissible>
            This alert includes only a link action.
            <div slot="actions">
              <a class="text-xs" href="#examples">Learn more</a>
            </div>
          </harmony-alert>
        </div>
      </demo-example>

      <h2>Enhanced with Progress</h2>
      <demo-example>
        <div class="stack wide">
          <harmony-alert variant="success" enhanced title="Progress Alert" progress-value="75" dismissible>
            This alert shows a progress bar indicating 75% completion.
          </harmony-alert>
          <harmony-alert variant="warning" enhanced title="Countdown Alert" progress-value="45" dismissible>
            This alert shows a progress bar at 45%.
          </harmony-alert>
        </div>
      </demo-example>

      <h2 id="examples">API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>variant</code></td><td>info | success | warning | error</td><td>info</td></tr>
            <tr><td><code>enhanced</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>title</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>dismissible</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>icon</code></td><td>harmony-icon name</td><td>per variant</td></tr>
            <tr><td><code>progress-value</code></td><td>number (enhanced)</td><td>—</td></tr>
          </tbody>
        </table>
        <p class="muted">Slots: default = message; <code>actions</code> = enhanced actions (compose <code>harmony-button</code> / <code>.btn</code> / <code>&lt;a&gt;</code>). Event: <code>dismiss</code>. Parts: border, icon, title, message, close, actions, progress.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p><code>role="alert"</code> announces the message. The close control is a button with <code>aria-label="Dismiss"</code> and fires <code>dismiss</code> — the host is not removed automatically. Forced-colors uses shadow-local borders and Highlight for the enhanced accent.</p>
      </demo-example>
    `;

    this.shadowRoot.addEventListener('dismiss', this.#onDismiss);

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-alert variant="success" enhanced title="Saved" dismissible>\n` +
      `  Done.\n` +
      `  <div slot="actions">\n` +
      `    <harmony-button size="xs" variant="primary">OK</harmony-button>\n` +
      `    <a href="/docs">Learn more</a>\n` +
      `  </div>\n` +
      `</harmony-alert>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-alert variant="info" title="Heads up">Message</harmony-alert>`;
  }

  disconnectedCallback() {
    this.shadowRoot?.removeEventListener('dismiss', this.#onDismiss);
  }

  #onDismiss = (e) => {
    const alert = e.target;
    if (alert?.tagName === 'HARMONY-ALERT') alert.remove();
  };
}

if (!customElements.get('demo-alerts-page')) {
  customElements.define('demo-alerts-page', DemoAlertsPage);
}
