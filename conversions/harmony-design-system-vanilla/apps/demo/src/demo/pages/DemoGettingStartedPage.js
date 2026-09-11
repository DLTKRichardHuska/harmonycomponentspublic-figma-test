import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { pageStyles } from './pageStyles.js';
import '../elements/DemoImportSnippet.js';
import '../elements/DemoPageHeader.js';

export class DemoGettingStartedPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, pageStyles];

  connectedCallback() {
    const npm = `npm install @dltkrichardhuska/harmony-design-system-vanilla

import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';
import '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';
import {
  initColorScheme,
  persistColorScheme,
  setColorScheme,
} from '@dltkrichardhuska/harmony-design-system-vanilla/theme';

// Prefer OS until the user chooses; then persist the override.
initColorScheme();
// After a user toggle:
// persistColorScheme(setColorScheme('dark'));`;

    const staticZip = `<link rel="stylesheet" href="/vendor/harmony/styles.css" />
<script type="module" src="/vendor/harmony/elements.js"></script>
<script type="module">
  import { initColorScheme } from '/vendor/harmony/theme.js';
  initColorScheme();
</script>`;

    const agents = `Use Harmony Vanilla from AGENTS.md (product subpath or static kit).
Prefer native HTML + CSS recipes; use Custom Elements when the catalog map says so; no React/Lit; WCAG 2.3 AA.
Load Figtree, Lexend, and JetBrains Mono in the host app.`;

    const mode = `import { initColorScheme, persistColorScheme, toggleColorScheme } from '.../theme';
initColorScheme(); // prefers-color-scheme when nothing saved
const next = toggleColorScheme();
persistColorScheme(next); // explicit override wins over OS
// or: document.documentElement.classList.toggle('dark');`;

    const fonts = `<!-- Host app must load Harmony fonts -->
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..800&family=Lexend:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet" />`;

    this.shadowRoot.innerHTML = `
      <demo-page-header title="Getting Started">
        <p>Choose a product <strong>once</strong> (npm subpath or which zip you copy). Toggle light/dark anytime. Foundation tokens ship as CSS variables on <code>:root</code> / <code>.dark</code>. Catalog pieces ship as <strong>native HTML + CSS</strong>, optional <strong>hybrid</strong> helpers, or <strong>Custom Elements</strong> — see package <code>AGENTS.md</code>.</p>
      </demo-page-header>
      <h2>A — npm</h2>
      <demo-import-snippet></demo-import-snippet>
      <h2>B — static zip (no npm)</h2>
      <p>Copy <code>dist-static/vp/</code> (or unzip <code>harmony-design-system-vanilla-vp.zip</code>) to <code>/vendor/harmony/</code>:</p>
      <demo-import-snippet></demo-import-snippet>
      <h2>Fonts</h2>
      <p>Token families reference Figtree, Lexend, and JetBrains Mono — load them in your app (demo uses Google Fonts).</p>
      <demo-import-snippet></demo-import-snippet>
      <h2>Cursor / AI</h2>
      <p>Point agent rules at package (or kit) <code>AGENTS.md</code> — do not duplicate a second source of truth.</p>
      <demo-import-snippet></demo-import-snippet>
      <h2>Dark mode</h2>
      <p>Token CSS stays class-based (<code>html.dark</code>). Theme JS bootstraps from <code>prefers-color-scheme</code> when no preference is saved.</p>
      <demo-import-snippet></demo-import-snippet>
      <p>Full consumer guide: <code>docs/CONSUMER.md</code> in the conversion root. Foundation usage: package <code>docs/foundation/</code>.</p>
    `;
    const snippets = this.shadowRoot.querySelectorAll('demo-import-snippet');
    snippets[0].code = npm;
    snippets[1].code = staticZip;
    snippets[2].code = fonts;
    snippets[3].code = agents;
    snippets[4].code = mode;
  }
}

if (!customElements.get('demo-getting-started-page')) {
  customElements.define('demo-getting-started-page', DemoGettingStartedPage);
}
