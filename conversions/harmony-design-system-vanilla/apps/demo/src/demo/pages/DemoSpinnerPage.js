import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

export class DemoSpinnerPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Spinner" scope="Spinner">
        <p>Loading indicator via <code>&lt;harmony-spinner&gt;</code>. CSS ring animation in Shadow DOM; optional accessible label.</p>
      </demo-page-header>

      <h2>Sizes</h2>
      <demo-example>
        <div class="row" style="align-items:center;gap:var(--space-6)">
          <harmony-spinner size="sm"></harmony-spinner>
          <harmony-spinner size="md"></harmony-spinner>
          <harmony-spinner size="lg"></harmony-spinner>
        </div>
      </demo-example>

      <h2>In Context</h2>
      <demo-example>
        <div class="stack">
          <div class="row" style="align-items:center;gap:var(--space-3)">
            <harmony-spinner size="sm"></harmony-spinner>
            <span class="muted">Loading…</span>
          </div>
          <div style="text-align:center;padding:var(--space-8) var(--space-4);border:var(--border-width-thin) solid var(--border-color);border-radius:var(--radius-lg);background:var(--card-bg)">
            <harmony-spinner size="lg" label="Loading content"></harmony-spinner>
            <p class="muted" style="margin-top:var(--space-4)">Loading content…</p>
          </div>
        </div>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>size</code></td><td>sm | md | lg</td><td>md</td></tr>
            <tr><td><code>label</code></td><td>string</td><td>Loading</td></tr>
          </tbody>
        </table>
        <p class="muted">Part: <code>spinner</code>. No events. No public document <code>.spinner</code> recipe.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p><code>harmony-spinner</code> uses <code>ElementInternals</code> with <code>role="status"</code> and <code>aria-label</code> from <code>label</code>. Under forced-colors, the ring uses CanvasText with a Highlight top segment.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-spinner size="md"></harmony-spinner>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-spinner size="md"></harmony-spinner>`;
  }
}

if (!customElements.get('demo-spinner-page')) {
  customElements.define('demo-spinner-page', DemoSpinnerPage);
}
