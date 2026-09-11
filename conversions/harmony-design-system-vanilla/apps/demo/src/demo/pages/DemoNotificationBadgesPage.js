import {
  HarmonyElement,
  createSheet,
  typographySheet,
  buttonSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

const pageSheet = createSheet(`
  .badge-group {
    display: grid;
    gap: var(--space-2);
  }
  .badge-group + .badge-group { margin-top: var(--space-4); }
  .wrap-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
    align-items: center;
  }
`);

export class DemoNotificationBadgesPage extends HarmonyElement {
  static styles = [
    typographySheet,
    demoChromeSheet,
    demoPageSheet,
    buttonSheet,
    pageSheet,
  ];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Notification Badges" scope="NotificationBadge">
        <p>Small indicators via <code>&lt;harmony-notification-badge&gt;</code>. Standalone (empty host) or wrap a target in the default slot; the badge sits at <code>position</code> (default <code>top-end</code>).</p>
      </demo-page-header>

      <h2 id="examples">Dot badges</h2>
      <demo-example>
        <div class="badge-group">
          <span class="path-label">Primary</span>
          <div class="row">
            <harmony-notification-badge type="dot" variant="primary" size="sm"></harmony-notification-badge>
            <harmony-notification-badge type="dot" variant="primary" size="md"></harmony-notification-badge>
            <harmony-notification-badge type="dot" variant="primary" size="lg"></harmony-notification-badge>
            <harmony-notification-badge type="dot" variant="primary" size="sm" border></harmony-notification-badge>
            <harmony-notification-badge type="dot" variant="primary" size="md" border></harmony-notification-badge>
            <harmony-notification-badge type="dot" variant="primary" size="lg" border></harmony-notification-badge>
          </div>
        </div>
        <div class="badge-group">
          <span class="path-label">Error</span>
          <div class="row">
            <harmony-notification-badge type="dot" variant="error" size="sm"></harmony-notification-badge>
            <harmony-notification-badge type="dot" variant="error" size="md"></harmony-notification-badge>
            <harmony-notification-badge type="dot" variant="error" size="lg"></harmony-notification-badge>
            <harmony-notification-badge type="dot" variant="error" size="sm" border></harmony-notification-badge>
            <harmony-notification-badge type="dot" variant="error" size="md" border></harmony-notification-badge>
            <harmony-notification-badge type="dot" variant="error" size="lg" border></harmony-notification-badge>
          </div>
        </div>
      </demo-example>

      <h2>Number badges</h2>
      <demo-example>
        <div class="badge-group">
          <span class="path-label">Primary</span>
          <div class="row">
            <harmony-notification-badge type="number" value="1" variant="primary" size="sm"></harmony-notification-badge>
            <harmony-notification-badge type="number" value="1" variant="primary" size="md"></harmony-notification-badge>
            <harmony-notification-badge type="number" value="1" variant="primary" size="lg"></harmony-notification-badge>
            <harmony-notification-badge type="number" value="1" variant="primary" size="sm" border></harmony-notification-badge>
            <harmony-notification-badge type="number" value="1" variant="primary" size="md" border></harmony-notification-badge>
            <harmony-notification-badge type="number" value="1" variant="primary" size="lg" border></harmony-notification-badge>
          </div>
        </div>
        <div class="badge-group">
          <span class="path-label">Error</span>
          <div class="row">
            <harmony-notification-badge type="number" value="5" variant="error" size="sm"></harmony-notification-badge>
            <harmony-notification-badge type="number" value="5" variant="error" size="md"></harmony-notification-badge>
            <harmony-notification-badge type="number" value="5" variant="error" size="lg"></harmony-notification-badge>
            <harmony-notification-badge type="number" value="5" variant="error" size="sm" border></harmony-notification-badge>
            <harmony-notification-badge type="number" value="5" variant="error" size="md" border></harmony-notification-badge>
            <harmony-notification-badge type="number" value="5" variant="error" size="lg" border></harmony-notification-badge>
          </div>
        </div>
      </demo-example>

      <h2>Overflow badges</h2>
      <demo-example>
        <div class="badge-group">
          <span class="path-label">Primary</span>
          <div class="row">
            <harmony-notification-badge type="overflow" value="99+" variant="primary" size="sm"></harmony-notification-badge>
            <harmony-notification-badge type="overflow" value="99+" variant="primary" size="md"></harmony-notification-badge>
            <harmony-notification-badge type="overflow" value="99+" variant="primary" size="lg"></harmony-notification-badge>
            <harmony-notification-badge type="overflow" value="99+" variant="primary" size="sm" border></harmony-notification-badge>
            <harmony-notification-badge type="overflow" value="99+" variant="primary" size="md" border></harmony-notification-badge>
            <harmony-notification-badge type="overflow" value="99+" variant="primary" size="lg" border></harmony-notification-badge>
          </div>
        </div>
        <div class="badge-group">
          <span class="path-label">Error</span>
          <div class="row">
            <harmony-notification-badge type="overflow" value="99+" variant="error" size="sm"></harmony-notification-badge>
            <harmony-notification-badge type="overflow" value="99+" variant="error" size="md"></harmony-notification-badge>
            <harmony-notification-badge type="overflow" value="99+" variant="error" size="lg"></harmony-notification-badge>
            <harmony-notification-badge type="overflow" value="99+" variant="error" size="sm" border></harmony-notification-badge>
            <harmony-notification-badge type="overflow" value="99+" variant="error" size="md" border></harmony-notification-badge>
            <harmony-notification-badge type="overflow" value="99+" variant="error" size="lg" border></harmony-notification-badge>
          </div>
        </div>
      </demo-example>

      <h2>Wrapped on a button</h2>
      <demo-example>
        <div class="wrap-row">
          <harmony-notification-badge type="dot" variant="error" size="sm" border aria-label="New notifications">
            <harmony-button type="button" variant="ghost" size="md" icon="bell" aria-label="Notifications"></harmony-button>
          </harmony-notification-badge>
          <harmony-notification-badge type="number" value="3" variant="error" size="sm" border>
            <harmony-button type="button" variant="ghost" size="md" icon="bell" aria-label="Notifications"></harmony-button>
          </harmony-notification-badge>
          <harmony-notification-badge type="overflow" value="99+" variant="primary" size="md" border>
            <harmony-button type="button" variant="secondary" size="md" icon="bell" aria-label="Notifications"></harmony-button>
          </harmony-notification-badge>
        </div>
        <p class="muted">Default slot = wrap target. Badge is absolutely positioned at <code>top-end</code>.</p>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>type</code></td><td>dot | number | overflow</td><td>number</td></tr>
            <tr><td><code>size</code></td><td>sm | md | lg</td><td>md</td></tr>
            <tr><td><code>variant</code></td><td>primary | error</td><td>primary</td></tr>
            <tr><td><code>value</code></td><td>string | number</td><td>1</td></tr>
            <tr><td><code>border</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>position</code></td><td>top-end</td><td>top-end</td></tr>
          </tbody>
        </table>
        <p class="muted">CE-only surface (no public document recipe). Distinct from catalog Badge.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Provide context with <code>aria-label</code> on the badge or the wrapped control (e.g. “3 unread notifications”). Prefer announcing dynamic count changes with a live region when urgency warrants it. Do not rely on color alone.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-notification-badge type="number" value="3" variant="error" border>\n` +
      `  <harmony-button type="button" variant="ghost" icon="bell" aria-label="Notifications"></harmony-button>\n` +
      `</harmony-notification-badge>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-notification-badge type="dot" variant="error"></harmony-notification-badge>`;
  }
}

if (!customElements.get('demo-notification-badges-page')) {
  customElements.define('demo-notification-badges-page', DemoNotificationBadgesPage);
}
