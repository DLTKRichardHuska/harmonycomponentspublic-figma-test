import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

export class DemoBadgesPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Badges" scope="Badge">
        <p>Status badges via <code>&lt;harmony-badge&gt;</code>. Optional <code>icon</code> injects <code>harmony-icon</code>.</p>
      </demo-page-header>

      <h2>Variants</h2>
      <demo-example class="row">
        <harmony-badge>Default</harmony-badge>
        <harmony-badge variant="primary">Primary</harmony-badge>
        <harmony-badge variant="success">Success</harmony-badge>
        <harmony-badge variant="warning">Warning</harmony-badge>
        <harmony-badge variant="error">Error</harmony-badge>
        <harmony-badge variant="info">Info</harmony-badge>
        <harmony-badge variant="orange">Orange</harmony-badge>
        <harmony-badge variant="pink">Pink</harmony-badge>
        <harmony-badge variant="disabled">Disabled</harmony-badge>
      </demo-example>

      <h2>Sizes</h2>
      <demo-example class="row">
        <harmony-badge size="small">Small</harmony-badge>
        <harmony-badge size="medium">Medium</harmony-badge>
        <harmony-badge size="large">Large</harmony-badge>
      </demo-example>

      <h2>With icons</h2>
      <demo-example>
        <div class="row">
          <harmony-badge variant="success" icon="check">Approved</harmony-badge>
          <harmony-badge variant="warning" icon="clock">Pending</harmony-badge>
          <harmony-badge variant="error" icon="x-mark">Rejected</harmony-badge>
          <harmony-badge variant="info" icon="information-circle">Info</harmony-badge>
        </div>
        <div class="row" style="margin-top: var(--space-4)">
          <harmony-badge variant="success" size="small" icon="check">Small</harmony-badge>
          <harmony-badge variant="success" size="medium" icon="check">Medium</harmony-badge>
          <harmony-badge variant="success" size="large" icon="check">Large</harmony-badge>
        </div>
        <p class="muted">Icon scales with badge size (xs / xs / sm).</p>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>variant</code></td><td>default | primary | success | warning | error | info | orange | pink | disabled</td><td>default</td></tr>
            <tr><td><code>size</code></td><td>small | medium | large</td><td>large</td></tr>
            <tr><td><code>icon</code></td><td>harmony-icon name</td><td>—</td></tr>
          </tbody>
        </table>
        <p class="muted">Default slot = label. Part <code>icon</code>. <code>disabled</code> is a visual variant only. NotificationBadge is a separate catalog element.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Badges are typically decorative status labels. When a badge carries essential meaning, associate it with related content (proximity or ARIA). Do not rely on color alone — pair with text and/or an icon. Icon-only badges need an accessible name on the badge or parent.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-badge variant="success">stable</harmony-badge>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-badge variant="success">stable</harmony-badge>`;
  }
}

if (!customElements.get('demo-badges-page')) {
  customElements.define('demo-badges-page', DemoBadgesPage);
}
