import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

const CUSTOM_SECTIONS = [
  {
    items: [
      { icon: 'home', label: 'Home', active: true },
      { icon: 'star', label: 'Favorites' },
      { icon: 'cog-6-tooth', label: 'Settings' },
    ],
  },
];

export class DemoLeftSidebarPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Left Sidebar" scope="LeftSidebar">
        <p>Icon rail via <code>&lt;harmony-left-sidebar&gt;</code>. Defaults come from the product kit; hover to expand labels. Switch the demo product to see CP vs standard section sets.</p>
      </demo-page-header>

      <h2>Default rail</h2>
      <demo-example>
        <div class="sidebar-demo">
          <div class="sidebar-demo__rail">
            <harmony-left-sidebar id="demo-left-default" inline></harmony-left-sidebar>
          </div>
          <div class="sidebar-demo__body">
            <p class="muted">Hover the rail to expand. Last selection:</p>
            <p id="demo-select-out" class="muted">—</p>
          </div>
        </div>
      </demo-example>

      <h2>Expanded (docs staging)</h2>
      <demo-example>
        <div class="sidebar-demo">
          <div class="sidebar-demo__rail">
            <harmony-left-sidebar inline expanded></harmony-left-sidebar>
          </div>
          <div class="sidebar-demo__body">
            <p class="muted"><code>expanded</code> keeps labels visible without hover.</p>
          </div>
        </div>
      </demo-example>

      <h2>Panel-open (collapsed + tooltips)</h2>
      <demo-example>
        <div class="sidebar-demo">
          <div class="sidebar-demo__rail">
            <harmony-left-sidebar inline panel-open active-id="left-sidebar-item-0-0"></harmony-left-sidebar>
          </div>
          <div class="sidebar-demo__body">
            <p class="muted"><code>panel-open</code> keeps the rail at 52px; hover items for tooltips.</p>
          </div>
        </div>
      </demo-example>

      <h2>Custom sections</h2>
      <demo-example>
        <div class="sidebar-demo">
          <div class="sidebar-demo__rail">
            <harmony-left-sidebar id="demo-left-custom" inline expanded></harmony-left-sidebar>
          </div>
          <div class="sidebar-demo__body">
            <p class="muted">Set <code>sections</code> on the element to replace product defaults.</p>
          </div>
        </div>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute / prop</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>active-id</code></td><td>string</td><td>uncontrolled</td></tr>
            <tr><td><code>expanded</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>panel-open</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>inline</code></td><td>boolean</td><td>false (docs embed)</td></tr>
            <tr><td><code>sections</code> (property)</td><td>SidebarSection[]</td><td>product kit</td></tr>
          </tbody>
        </table>
        <p class="muted">Event <code>left-sidebar-item-select</code> — detail <code>{ id, label, panelTitle, … }</code>. No <code>variant</code> attribute.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <style>
        .sidebar-demo {
          position: relative;
          min-height: 420px;
          background-color: var(--page-bg);
          border-radius: var(--radius-lg);
          display: flex;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }
        .sidebar-demo__rail {
          flex-shrink: 0;
          width: 52px;
          display: flex;
          align-items: flex-start;
          padding: var(--space-4) 0;
          overflow: visible;
          z-index: var(--z-10);
        }
        .sidebar-demo__body {
          flex: 1;
          padding: var(--space-6);
          background-color: var(--elevated-bg);
          margin: var(--space-4);
          border-radius: var(--radius-lg);
        }
      </style>
    `;

    const def = this.shadowRoot.querySelector('#demo-left-default');
    const out = this.shadowRoot.querySelector('#demo-select-out');
    def?.addEventListener('left-sidebar-item-select', (e) => {
      const d = e.detail || {};
      if (out) out.textContent = `${d.label} (${d.id})`;
    });

    const custom = this.shadowRoot.querySelector('#demo-left-custom');
    if (custom) custom.sections = CUSTOM_SECTIONS;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    if (consume) {
      consume.npm =
        `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
        `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
        `registerHarmonyElements();\n\n` +
        `<harmony-left-sidebar></harmony-left-sidebar>`;
      consume.staticZip =
        `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
        `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
        `<harmony-left-sidebar></harmony-left-sidebar>`;
    }
  }
}

if (!customElements.get('demo-left-sidebar-page')) {
  customElements.define('demo-left-sidebar-page', DemoLeftSidebarPage);
}
