import {
  HarmonyElement,
  createSheet,
  typographySheet,
  tabStripSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

const pageSheet = createSheet(`
  .overflow-box {
    width: 400px;
    max-width: 100%;
    border: var(--border-width-thin) solid var(--border-color);
    padding: var(--space-4);
    border-radius: var(--radius-md);
  }
`);

export class DemoTabStripPage extends HarmonyElement {
  static styles = [
    typographySheet,
    demoChromeSheet,
    demoPageSheet,
    tabStripSheet,
    pageSheet,
  ];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Tab Strip" scope="TabStrip">
        <p>Organize views with <code>&lt;harmony-tab-strip&gt;</code>. Panels are consumer-owned (e.g. <code>.tab-panel</code>). Set the <code>tabs</code> property in JS; listen for <code>tab-select</code> to update panels.</p>
      </demo-page-header>

      <h2 id="examples">Basic tabs</h2>
      <demo-example>
        <div data-tab-demo>
          <harmony-tab-strip id="tabs-basic"></harmony-tab-strip>
          <div class="tab-panel is-active" data-panel="1"><p class="muted">This is the overview content. Click other tabs to switch views.</p></div>
          <div class="tab-panel" data-panel="2"><p class="muted">Features tab content.</p></div>
          <div class="tab-panel" data-panel="3"><p class="muted">Pricing tab content.</p></div>
          <div class="tab-panel" data-panel="4"><p class="muted">Reviews tab content.</p></div>
        </div>
      </demo-example>

      <h2>Icons left</h2>
      <demo-example>
        <div data-tab-demo>
          <harmony-tab-strip id="tabs-icons-left"></harmony-tab-strip>
          <div class="tab-panel is-active" data-panel="1"><p class="muted">Home tab content.</p></div>
          <div class="tab-panel" data-panel="2"><p class="muted">Profile tab content.</p></div>
          <div class="tab-panel" data-panel="3"><p class="muted">Settings tab content.</p></div>
        </div>
      </demo-example>

      <h2>Icons right</h2>
      <demo-example>
        <div data-tab-demo>
          <harmony-tab-strip id="tabs-icons-right"></harmony-tab-strip>
          <div class="tab-panel is-active" data-panel="1"><p class="muted">Home tab content.</p></div>
          <div class="tab-panel" data-panel="2"><p class="muted">Profile tab content.</p></div>
          <div class="tab-panel" data-panel="3"><p class="muted">Settings tab content.</p></div>
        </div>
      </demo-example>

      <h2>Icons top</h2>
      <demo-example>
        <div data-tab-demo>
          <harmony-tab-strip id="tabs-icons-top"></harmony-tab-strip>
          <div class="tab-panel is-active" data-panel="1"><p class="muted">Home tab content.</p></div>
          <div class="tab-panel" data-panel="2"><p class="muted">Profile tab content.</p></div>
          <div class="tab-panel" data-panel="3"><p class="muted">Settings tab content.</p></div>
        </div>
      </demo-example>

      <h2>Disabled</h2>
      <demo-example>
        <harmony-tab-strip id="tabs-disabled"></harmony-tab-strip>
      </demo-example>

      <h2>Add Tab</h2>
      <demo-example>
        <harmony-tab-strip id="tabs-add" show-add-tab add-tab-label="Add Tab"></harmony-tab-strip>
        <p class="muted">Listen for <code>tab-add</code> to append a tab in your app.</p>
      </demo-example>

      <h2>Per-tab actions</h2>
      <demo-example>
        <harmony-tab-strip
          id="tabs-actions"
          show-tab-open-in-new
          show-tab-close
          show-tab-overflow-menu
        ></harmony-tab-strip>
        <p class="muted">Events: <code>tab-open-new</code>, <code>tab-close</code>, <code>tab-set-default</code>. Tab 3 disables the ⋮ menu via <code>showMenu: false</code>.</p>
      </demo-example>

      <h2>Overflow (narrow container)</h2>
      <demo-example>
        <div class="overflow-box">
          <harmony-tab-strip id="tabs-overflow" show-add-tab overflow-mode="auto"></harmony-tab-strip>
        </div>
        <p class="muted">Resize the viewport or container; overflowing tabs move into More(N).</p>
      </demo-example>

      <h2>Manual overflow</h2>
      <demo-example>
        <harmony-tab-strip id="tabs-overflow-manual" show-add-tab overflow-mode="manual"></harmony-tab-strip>
      </demo-example>

      <h2>Compact</h2>
      <demo-example>
        <harmony-tab-strip id="tabs-compact" variant="compact"></harmony-tab-strip>
      </demo-example>

      <h2>Pill (VP)</h2>
      <demo-example>
        <div data-tab-demo>
          <harmony-tab-strip id="tabs-pill" variant="pill"></harmony-tab-strip>
          <div class="tab-panel is-active" data-panel="1"><p class="muted">Content for the selected tab.</p></div>
          <div class="tab-panel" data-panel="2"><p class="muted">Transformation content.</p></div>
          <div class="tab-panel" data-panel="3"><p class="muted">Validation content.</p></div>
        </div>
        <p class="muted">Pill styling applies when the VP theme is active; other themes keep the underline.</p>
      </demo-example>

      <h2>Enforced icon position</h2>
      <demo-example>
        <harmony-tab-strip id="tabs-icon-pos" icon-position="top"></harmony-tab-strip>
        <p class="muted">Component-level <code>icon-position</code> overrides per-tab values.</p>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attr / property</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>tabs</code> (property)</td><td>Tab[]</td><td>[]</td></tr>
            <tr><td><code>overflowTabs</code> (property)</td><td>Tab[]</td><td>[]</td></tr>
            <tr><td><code>variant</code></td><td>default | compact | pill</td><td>default</td></tr>
            <tr><td><code>overflow-mode</code></td><td>auto | manual | none</td><td>auto</td></tr>
            <tr><td><code>show-add-tab</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>icon-position</code></td><td>left | right | top</td><td>—</td></tr>
            <tr><td><code>show-tab-open-in-new</code> / <code>show-tab-close</code> / <code>show-tab-overflow-menu</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>selected</code></td><td>tab id</td><td>—</td></tr>
          </tbody>
        </table>
        <p class="muted">Events: <code>tab-select</code>, <code>tab-add</code>, <code>tab-close</code>, <code>tab-open-new</code>, <code>tab-set-default</code>.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Tab strip uses a tablist pattern. Associate consumer panels with <code>role="tabpanel"</code> and matching ids when building production UIs. Disabled tabs are not selectable.</p>
      </demo-example>
    `;

    this.#wireTabs();
    this.shadowRoot.addEventListener('tab-select', this.#onTabSelect);
    this.shadowRoot.addEventListener('tab-add', this.#onTabAdd);
    this.shadowRoot.addEventListener('tab-close', this.#onTabClose);

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-tab-strip id="strip"></harmony-tab-strip>\n` +
      `<div class="tab-panel is-active" data-panel="1">Overview</div>\n\n` +
      `<script type="module">\n` +
      `  const strip = document.getElementById('strip');\n` +
      `  strip.tabs = [\n` +
      `    { id: '1', label: 'Overview', active: true },\n` +
      `    { id: '2', label: 'Features' },\n` +
      `  ];\n` +
      `  strip.addEventListener('tab-select', (e) => {\n` +
      `    document.querySelectorAll('.tab-panel').forEach((p) => {\n` +
      `      p.classList.toggle('is-active', p.dataset.panel === e.detail.id);\n` +
      `    });\n` +
      `  });\n` +
      `</script>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-tab-strip id="strip"></harmony-tab-strip>`;
  }

  disconnectedCallback() {
    this.shadowRoot?.removeEventListener('tab-select', this.#onTabSelect);
    this.shadowRoot?.removeEventListener('tab-add', this.#onTabAdd);
    this.shadowRoot?.removeEventListener('tab-close', this.#onTabClose);
  }

  #wireTabs() {
    const root = this.shadowRoot;
    /** @type {Record<string, object>} */
    const configs = {
      'tabs-basic': {
        tabs: [
          { id: '1', label: 'Overview', active: true },
          { id: '2', label: 'Features' },
          { id: '3', label: 'Pricing' },
          { id: '4', label: 'Reviews' },
        ],
      },
      'tabs-icons-left': {
        tabs: [
          { id: '1', label: 'Home', icon: 'home', iconPosition: 'left', active: true },
          { id: '2', label: 'Profile', icon: 'user', iconPosition: 'left' },
          { id: '3', label: 'Settings', icon: 'cog-6-tooth', iconPosition: 'left' },
        ],
      },
      'tabs-icons-right': {
        tabs: [
          { id: '1', label: 'Home', icon: 'home', iconPosition: 'right', active: true },
          { id: '2', label: 'Profile', icon: 'user', iconPosition: 'right' },
          { id: '3', label: 'Settings', icon: 'cog-6-tooth', iconPosition: 'right' },
        ],
      },
      'tabs-icons-top': {
        tabs: [
          { id: '1', label: 'Home', icon: 'home', iconPosition: 'top', active: true },
          { id: '2', label: 'Profile', icon: 'user', iconPosition: 'top' },
          { id: '3', label: 'Settings', icon: 'cog-6-tooth', iconPosition: 'top' },
        ],
      },
      'tabs-disabled': {
        tabs: [
          { id: '1', label: 'Active', active: true },
          { id: '2', label: 'Normal' },
          { id: '3', label: 'Disabled', disabled: true },
        ],
      },
      'tabs-add': {
        tabs: [
          { id: '1', label: 'Tab 1', active: true },
          { id: '2', label: 'Tab 2' },
          { id: '3', label: 'Tab 3' },
        ],
      },
      'tabs-actions': {
        tabs: [
          { id: '1', label: 'Documents', active: true },
          { id: '2', label: 'Reports' },
          { id: '3', label: 'Settings', showMenu: false },
        ],
      },
      'tabs-overflow': {
        tabs: Array.from({ length: 10 }, (_, i) => ({
          id: String(i + 1),
          label: `Tab ${i + 1}`,
          active: i === 0,
        })),
      },
      'tabs-overflow-manual': {
        tabs: [
          { id: '1', label: 'Tab 1', active: true },
          { id: '2', label: 'Tab 2' },
          { id: '3', label: 'Tab 3' },
          { id: '4', label: 'Tab 4' },
        ],
        overflowTabs: [
          { id: '5', label: 'Tab 5', icon: 'document' },
          { id: '6', label: 'Tab 6', icon: 'folder' },
          { id: '7', label: 'Tab 7', icon: 'chart-bar' },
        ],
      },
      'tabs-compact': {
        tabs: [
          { id: '1', label: 'Overview', active: true },
          { id: '2', label: 'Features' },
          { id: '3', label: 'Pricing' },
          { id: '4', label: 'Reviews' },
        ],
      },
      'tabs-pill': {
        tabs: [
          { id: '1', label: 'Overview', active: true },
          { id: '2', label: 'Transformation' },
          { id: '3', label: 'Validation' },
        ],
      },
      'tabs-icon-pos': {
        tabs: [
          { id: '1', label: 'Home', icon: 'home', active: true },
          { id: '2', label: 'Profile', icon: 'user' },
          { id: '3', label: 'Settings', icon: 'cog-6-tooth' },
        ],
      },
    };

    for (const el of root.querySelectorAll('harmony-tab-strip')) {
      const cfg = configs[el.id];
      if (!cfg) continue;
      el.tabs = cfg.tabs;
      if (cfg.overflowTabs) el.overflowTabs = cfg.overflowTabs;
    }
  }

  #onTabSelect = (e) => {
    const id = e.detail?.id;
    if (!id) return;
    const demo = e.target.closest?.('[data-tab-demo]');
    if (!demo) return;
    demo.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.panel === id);
    });
  };

  #onTabAdd = (e) => {
    const strip = e.target;
    if (strip?.tagName !== 'HARMONY-TAB-STRIP') return;
    const nextId = String(strip.tabs.length + 1);
    strip.tabs = [
      ...strip.tabs.map((t) => ({ ...t, active: false })),
      { id: nextId, label: `Tab ${nextId}`, active: true },
    ];
    strip.selected = nextId;
  };

  #onTabClose = (e) => {
    const strip = e.target;
    const id = e.detail?.id;
    if (strip?.tagName !== 'HARMONY-TAB-STRIP' || !id) return;
    const remaining = strip.tabs.filter((t) => t.id !== id);
    if (!remaining.length) return;
    if (strip.selected === id) {
      remaining[0] = { ...remaining[0], active: true };
      strip.selected = remaining[0].id;
    }
    strip.tabs = remaining;
  };
}

if (!customElements.get('demo-tab-strip-page')) {
  customElements.define('demo-tab-strip-page', DemoTabStripPage);
}
