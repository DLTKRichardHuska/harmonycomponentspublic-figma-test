import {
  HarmonyElement,
  createSheet,
  registerIcons,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';
import { heroIconNames, customIconNames } from '../generated/iconNames.js';

registerIcons({
  'demo-diamond': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3 21 12 12 21 3 12Z"/></svg>',
});

const styles = createSheet(`
  h3 { margin: 0 0 var(--space-3); }
  .size-row {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: var(--space-8);
  }
  .size {
    display: grid;
    justify-items: center;
    gap: var(--space-1-5);
    color: var(--text-secondary);
  }
  .size span, .icon-name { font-size: var(--caption); }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
    gap: var(--space-1-5);
  }
  .icon-cell {
    min-width: 0;
    display: grid;
    justify-items: center;
    gap: var(--space-1-5);
    padding: var(--space-2-5) var(--space-1-5);
    border-radius: var(--radius-06);
    color: var(--text-secondary);
  }
  .icon-cell:hover {
    color: var(--theme-primary);
    background: var(--hover-bg);
  }
  .examples { display: flex; flex-wrap: wrap; gap: var(--space-6); align-items: center; }
  .accent { color: var(--theme-primary); }
  .a11y-example {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1-5);
    min-height: var(--space-11);
    padding: var(--space-2) var(--space-3);
    border: var(--border-width-thin) solid var(--border-color);
    border-radius: var(--radius-06);
    color: inherit;
    background: transparent;
  }
  @media (forced-colors: active) {
    .icon-cell:hover {
      color: HighlightText;
      background: Highlight;
    }
  }
`);

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

function iconGrid(names) {
  return names.map((name) => {
    const safe = escapeHtml(name);
    return `<div class="icon-cell" title="${safe}">
      <harmony-icon name="${safe}" size="lg"></harmony-icon>
      <span class="icon-name">${safe}</span>
    </div>`;
  }).join('');
}

export class DemoIconsPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet, styles];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Icons" scope="Icon">
        <p>Outline icons use the complete Heroicons 24/outline set. Harmony custom SVGs and application registrations extend the same name-based API.</p>
      </demo-page-header>

      <h2>Icon API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute / API</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>name</code></td><td>string</td><td>—</td><td>Bundled or registered icon name.</td></tr>
            <tr><td><code>size</code></td><td>xs | sm | md | lg | xl</td><td>md</td><td>Token-backed icon size.</td></tr>
            <tr><td><code>label</code></td><td>string</td><td>—</td><td>Optional accessible name for a standalone icon.</td></tr>
            <tr><td><code>class</code></td><td>native host class</td><td>—</td><td>Styles host color and layout; it is not copied into Shadow DOM.</td></tr>
            <tr><td>default slot</td><td>raw SVG</td><td>—</td><td>Overrides registry lookup.</td></tr>
            <tr><td><code>registerIcons(map)</code></td><td>helper</td><td>—</td><td>Document-global name → trusted SVG string. Merges; same name replaces. See section below.</td></tr>
          </tbody>
        </table>
        <p>CSS parts: <code>svg</code> and <code>fallback</code>. Outline only; <code>variant</code> and Tabler are intentionally omitted.</p>
      </demo-example>

      <h2>Sizes</h2>
      <demo-example class="size-row">
        ${Object.entries({ xs: 12, sm: 16, md: 20, lg: 24, xl: 32 }).map(([size, pixels]) => `
          <div class="size">
            <harmony-icon name="home" size="${size}"></harmony-icon>
            <span>${size} (${pixels}px)</span>
          </div>`).join('')}
      </demo-example>

      <h2>Usage and behavior</h2>
      <demo-example class="examples">
        <span><harmony-icon name="check-circle" class="accent" size="lg"></harmony-icon> currentColor</span>
        <span><harmony-icon name="demo-diamond" size="lg" label="Registered diamond"></harmony-icon> registerIcons()</span>
        <span><harmony-icon name="not-a-real-icon" size="lg"></harmony-icon> missing fallback</span>
        <span><harmony-icon size="lg"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg></harmony-icon> raw SVG slot</span>
      </demo-example>

      <h2>registerIcons()</h2>
      <demo-example>
        <p>Register app-owned glyphs by name after importing the product <code>/elements</code> module (or the static kit <code>elements.js</code>). This page registers <code>demo-diamond</code> at module load.</p>
        <p>Lookup order: default slot → <code>registerIcons</code> → Harmony custom SVGs → Heroicons 24/outline → <code>?</code>. Later calls merge; the same name replaces. Values must be SVG strings with an <code>&lt;svg&gt;</code> root (prefer <code>currentColor</code> and a 24×24 viewBox). Invalid entries throw <code>TypeError</code>. Register only trusted markup.</p>
        <div class="examples">
          <span><harmony-icon name="demo-diamond" size="lg" label="Registered diamond"></harmony-icon> demo-diamond</span>
        </div>
      </demo-example>
      <demo-consume-snippets
        id="register"
        npm-label="registerIcons — npm"
        static-label="registerIcons — static zip"
      ></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Icons are decorative (<code>aria-hidden="true"</code>) unless <code>label</code> is set. For icon buttons, keep the icon decorative and put the accessible name on the button.</p>
        <div class="examples">
          <button class="a11y-example" type="button" aria-label="Edit document">
            <harmony-icon name="pencil"></harmony-icon>
          </button>
          <button class="a11y-example" type="button" aria-label="Delete item">
            <harmony-icon name="trash"></harmony-icon>
          </button>
          <span><harmony-icon name="information-circle" label="Information"></harmony-icon> standalone labeled icon</span>
        </div>
      </demo-example>

      <demo-consume-snippets id="consume"></demo-consume-snippets>

      <h2>Heroicons 24/outline (${heroIconNames.length})</h2>
      <demo-example class="grid">${iconGrid(heroIconNames)}</demo-example>

      <h2>Harmony custom icons (${customIconNames.length})</h2>
      <demo-example class="grid">${iconGrid(customIconNames)}</demo-example>
    `;

    const consume = this.shadowRoot.querySelector('#consume');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n` +
      `<harmony-icon name="home" size="lg"></harmony-icon>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n` +
      `<harmony-icon name="home" size="lg"></harmony-icon>`;

    const register = this.shadowRoot.querySelector('#register');
    register.npm =
      `import {\n` +
      `  registerHarmonyElements,\n` +
      `  registerIcons,\n` +
      `} from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n` +
      `registerIcons({\n` +
      `  'my-glyph':\n` +
      `    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3 21 12 12 21 3 12Z"/></svg>',\n` +
      `});`;
    register.staticZip =
      `import { registerIcons } from '/vendor/harmony/elements.js';\n\n` +
      `registerIcons({\n` +
      `  'my-glyph':\n` +
      `    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3 21 12 12 21 3 12Z"/></svg>',\n` +
      `});`;
  }
}

if (!customElements.get('demo-icons-page')) {
  customElements.define('demo-icons-page', DemoIconsPage);
}
