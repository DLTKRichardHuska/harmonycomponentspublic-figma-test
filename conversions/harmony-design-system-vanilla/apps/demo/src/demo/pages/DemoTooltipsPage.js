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
  .row { display: flex; flex-wrap: wrap; gap: var(--space-4); align-items: center; }
  .positions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
  }
  .icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--space-8);
    height: var(--space-8);
    padding: 0;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
  }
  .icon-btn:hover { color: var(--theme-primary); background: var(--hover-bg); }
  .help-text {
    color: var(--theme-primary);
    cursor: help;
    text-decoration: underline;
    text-decoration-style: dotted;
  }
`);

export class DemoTooltipsPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet, buttonSheet, pageSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Tooltips" scope="Tooltip">
        <p>Tooltips via <code>&lt;harmony-tooltip&gt;</code>. Show on hover and focus; Escape dismisses. Use <code>text</code> or a <code>content</code> slot for rich HTML.</p>
      </demo-page-header>

      <h2 id="examples">Examples</h2>

      <h3>Basic Tooltip</h3>
      <demo-example>
        <div class="row">
          <harmony-tooltip text="This is a tooltip">
            <harmony-button variant="outline">Hover me</harmony-button>
          </harmony-tooltip>
        </div>
      </demo-example>

      <h3>Positions</h3>
      <demo-example>
        <div class="positions">
          <harmony-tooltip text="Appears on top" position="top">
            <harmony-button variant="outline">Top</harmony-button>
          </harmony-tooltip>
          <harmony-tooltip text="Appears on bottom" position="bottom">
            <harmony-button variant="outline">Bottom</harmony-button>
          </harmony-tooltip>
          <harmony-tooltip text="Appears on left" position="left">
            <harmony-button variant="outline">Left</harmony-button>
          </harmony-tooltip>
          <harmony-tooltip text="Appears on right" position="right">
            <harmony-button variant="outline">Right</harmony-button>
          </harmony-tooltip>
        </div>
      </demo-example>

      <h3>On Different Elements</h3>
      <demo-example>
        <div class="row">
          <harmony-tooltip text="Icon button info">
            <button type="button" class="icon-btn" aria-label="Information">
              <harmony-icon name="information-circle" size="md"></harmony-icon>
            </button>
          </harmony-tooltip>
          <harmony-tooltip text="More information about this text">
            <span class="help-text" tabindex="0">Hover for info</span>
          </harmony-tooltip>
        </div>
      </demo-example>

      <h3>Corner Variants</h3>
      <demo-example>
        <div class="positions">
          <harmony-tooltip text="Top corners sharp" corner-variant="top" position="top">
            <harmony-button variant="outline">Top Corner</harmony-button>
          </harmony-tooltip>
          <harmony-tooltip text="Bottom corners sharp" corner-variant="bottom" position="bottom">
            <harmony-button variant="outline">Bottom Corner</harmony-button>
          </harmony-tooltip>
          <harmony-tooltip text="Left corners sharp" corner-variant="left" position="left">
            <harmony-button variant="outline">Left Corner</harmony-button>
          </harmony-tooltip>
          <harmony-tooltip text="Right corners sharp" corner-variant="right" position="right">
            <harmony-button variant="outline">Right Corner</harmony-button>
          </harmony-tooltip>
        </div>
      </demo-example>

      <h3>Rich content slot</h3>
      <demo-example>
        <div class="row">
          <harmony-tooltip position="bottom">
            <harmony-button variant="outline">Rich tip</harmony-button>
            <span slot="content">More <strong>detail</strong> in the tip</span>
          </harmony-tooltip>
        </div>
      </demo-example>

      <h2 id="props">API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>text</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>position</code></td><td>top | bottom | left | right</td><td>top</td></tr>
            <tr><td><code>corner-variant</code></td><td>top | bottom | left | right</td><td>—</td></tr>
          </tbody>
        </table>
        <p class="muted">Slots: default = trigger; <code>content</code> = rich HTML (wins over <code>text</code>). Part: <code>content</code>.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2 id="accessibility">Accessibility</h2>
      <demo-example>
        <p>Bubble uses <code>role="tooltip"</code> (visual, <code>aria-hidden</code>). The trigger is associated via <code>aria-describedby</code> / <code>ariaDescribedByElements</code> to a light-DOM description node. Tips show on hover and focus-within; Escape dismisses (WCAG 1.4.13). Do not rely on tooltips for critical information.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-tooltip text="Helpful tip" position="top">\n` +
      `  <harmony-button variant="outline">Hover me</harmony-button>\n` +
      `</harmony-tooltip>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-tooltip text="Tip"><button type="button">Hover</button></harmony-tooltip>`;
  }
}

if (!customElements.get('demo-tooltips-page')) {
  customElements.define('demo-tooltips-page', DemoTooltipsPage);
}
