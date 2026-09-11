import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

export class DemoProgressBarPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Progress Bar" scope="ProgressBar">
        <p>Determinate progress via <code>&lt;harmony-progress&gt;</code>. Fill width is computed in Shadow DOM; optional percentage label.</p>
      </demo-page-header>

      <h2>Basic Progress</h2>
      <demo-example>
        <div class="stack">
          <harmony-progress value="25"></harmony-progress>
          <harmony-progress value="50"></harmony-progress>
          <harmony-progress value="75"></harmony-progress>
          <harmony-progress value="100"></harmony-progress>
        </div>
      </demo-example>

      <h2>Sizes</h2>
      <demo-example>
        <div class="stack">
          <harmony-progress value="60" size="sm"></harmony-progress>
          <harmony-progress value="60" size="md"></harmony-progress>
          <harmony-progress value="60" size="lg"></harmony-progress>
        </div>
      </demo-example>

      <h2>Variants</h2>
      <demo-example>
        <div class="stack">
          <harmony-progress value="75"></harmony-progress>
          <harmony-progress value="75" variant="success"></harmony-progress>
          <harmony-progress value="75" variant="warning"></harmony-progress>
          <harmony-progress value="75" variant="error"></harmony-progress>
        </div>
      </demo-example>

      <h2>With Label</h2>
      <demo-example>
        <div class="stack">
          <harmony-progress value="42" show-label></harmony-progress>
        </div>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>value</code></td><td>number</td><td>0</td></tr>
            <tr><td><code>max</code></td><td>number (&gt; 0)</td><td>100</td></tr>
            <tr><td><code>size</code></td><td>sm | md | lg</td><td>md</td></tr>
            <tr><td><code>variant</code></td><td>default | success | warning | error</td><td>default</td></tr>
            <tr><td><code>show-label</code></td><td>boolean</td><td>false</td></tr>
          </tbody>
        </table>
        <p class="muted">Parts: <code>track</code>, <code>bar</code>, <code>label</code>. Fill width is computed in Shadow DOM (<code>--harmony-progress</code>). No events.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p><code>harmony-progress</code> uses <code>ElementInternals</code> with <code>role="progressbar"</code> and <code>aria-valuenow</code> / <code>min</code> / <code>max</code>. Under forced-colors, the track keeps a CanvasText border and the bar uses Highlight.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-progress value="42" show-label></harmony-progress>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-progress value="42" show-label></harmony-progress>`;
  }
}

if (!customElements.get('demo-progress-bar-page')) {
  customElements.define('demo-progress-bar-page', DemoProgressBarPage);
}
