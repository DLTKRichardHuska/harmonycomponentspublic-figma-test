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
      {
        label: 'Dela AI',
        isCustom: true,
        customSrc: 'RS_DelaDefault',
        customSrcActive: 'RS_Dela_Active',
        useGradientHeader: true,
        active: true,
      },
      { icon: 'bell', label: 'Alerts' },
      { icon: 'question-mark-circle', label: 'Help' },
    ],
  },
];

export class DemoRightSidebarPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Right Sidebar" scope="RightSidebar">
        <p>Icon rail via <code>&lt;harmony-right-sidebar&gt;</code>. Defaults come from the product kit and lead with Dela AI. Hover to expand labels. Switch the demo product to see CP vs standard section sets.</p>
      </demo-page-header>

      <h2>Default rail</h2>
      <demo-example>
        <div class="sidebar-demo sidebar-demo--right">
          <div class="sidebar-demo__body">
            <p class="muted">Hover the rail to expand. Last selection:</p>
            <p id="demo-select-out" class="muted">—</p>
          </div>
          <div class="sidebar-demo__rail">
            <harmony-right-sidebar id="demo-right-default" inline></harmony-right-sidebar>
          </div>
        </div>
      </demo-example>

      <h2>Expanded (docs staging)</h2>
      <demo-example>
        <div class="sidebar-demo sidebar-demo--right">
          <div class="sidebar-demo__body">
            <p class="muted"><code>expanded</code> keeps labels visible without hover.</p>
          </div>
          <div class="sidebar-demo__rail">
            <harmony-right-sidebar inline expanded></harmony-right-sidebar>
          </div>
        </div>
      </demo-example>

      <h2>Panel-open (collapsed + tooltips)</h2>
      <demo-example>
        <div class="sidebar-demo sidebar-demo--right">
          <div class="sidebar-demo__body">
            <p class="muted"><code>panel-open</code> keeps the rail at 52px; hover items for tooltips. Active Dela uses the gradient tile.</p>
          </div>
          <div class="sidebar-demo__rail">
            <harmony-right-sidebar inline panel-open active-id="right-sidebar-item-0-0"></harmony-right-sidebar>
          </div>
        </div>
      </demo-example>

      <h2>Custom sections</h2>
      <demo-example>
        <div class="sidebar-demo sidebar-demo--right">
          <div class="sidebar-demo__body">
            <p class="muted">Set <code>sections</code> on the element to replace product defaults.</p>
          </div>
          <div class="sidebar-demo__rail">
            <harmony-right-sidebar id="demo-right-custom" inline expanded></harmony-right-sidebar>
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
        <p class="muted">Event <code>right-sidebar-item-select</code> — detail <code>{ id, label, panelTitle, useGradientHeader?, … }</code>. No <code>variant</code> attribute.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <style>
        .sidebar-demo {
          position: relative;
          min-height: 620px;
          background-color: var(--page-bg);
          border-radius: var(--radius-lg);
          display: flex;
        }
        .sidebar-demo__rail {
          flex-shrink: 0;
          width: 52px;
          display: flex;
          align-items: center;
          padding: var(--space-4) 0;
          overflow: visible;
          z-index: var(--z-10);
          margin-left: auto;
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

    const def = this.shadowRoot.querySelector('#demo-right-default');
    const out = this.shadowRoot.querySelector('#demo-select-out');
    def?.addEventListener('right-sidebar-item-select', (e) => {
      const d = e.detail || {};
      if (out) {
        out.textContent = `${d.label} (${d.id})${d.useGradientHeader ? ' · gradient' : ''}`;
      }
    });

    const custom = this.shadowRoot.querySelector('#demo-right-custom');
    if (custom) custom.sections = CUSTOM_SECTIONS;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    if (consume) {
      consume.npm =
        `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
        `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
        `registerHarmonyElements();\n\n` +
        `<harmony-right-sidebar></harmony-right-sidebar>`;
      consume.staticZip =
        `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
        `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
        `<harmony-right-sidebar></harmony-right-sidebar>`;
    }
  }
}

if (!customElements.get('demo-right-sidebar-page')) {
  customElements.define('demo-right-sidebar-page', DemoRightSidebarPage);
}
