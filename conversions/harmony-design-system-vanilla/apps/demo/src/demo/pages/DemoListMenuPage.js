import {
  HarmonyElement,
  createSheet,
  typographySheet,
  listMenuSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

const pageSheet = createSheet(`
  /* Match reference max-w-xs (20rem) around the menu, not the demo-example frame */
  .menu-demo {
    max-width: 20rem;
  }
`);

export class DemoListMenuPage extends HarmonyElement {
  static styles = [
    typographySheet,
    demoChromeSheet,
    demoPageSheet,
    listMenuSheet,
    pageSheet,
  ];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="List Menu" scope="ListMenu">
        <p>Vertical list for navigation or selection. Native <code>nav.list-menu</code> with <code>a</code>/<code>button.list-menu__item</code>, or optional light-DOM <code>&lt;harmony-list-menu&gt;</code> that adds item classes.</p>
      </demo-page-header>

      <h2 id="examples">Basic (native)</h2>
      <demo-example>
        <nav class="list-menu menu-demo" aria-label="Basic list menu">
          <a class="list-menu__item is-active" href="#examples">
            <harmony-icon name="home" size="md" class="list-menu__item-icon"></harmony-icon>
            Dashboard
          </a>
          <a class="list-menu__item" href="#examples">
            <harmony-icon name="user" size="md" class="list-menu__item-icon"></harmony-icon>
            Profile
          </a>
          <a class="list-menu__item" href="#examples">
            <harmony-icon name="cog-6-tooth" size="md" class="list-menu__item-icon"></harmony-icon>
            Settings
          </a>
          <button type="button" class="list-menu__item">
            <harmony-icon name="arrow-right-on-rectangle" size="md" class="list-menu__item-icon"></harmony-icon>
            Logout
          </button>
        </nav>
      </demo-example>

      <h2>Without icons</h2>
      <demo-example>
        <nav class="list-menu menu-demo" aria-label="Labels only">
          <a class="list-menu__item is-active" href="#examples">Overview</a>
          <a class="list-menu__item" href="#examples">Details</a>
          <a class="list-menu__item" href="#examples">History</a>
          <a class="list-menu__item" href="#examples">Export</a>
        </nav>
      </demo-example>

      <h2>With links (helper)</h2>
      <demo-example>
        <harmony-list-menu class="menu-demo" aria-label="Documents menu">
          <a href="#examples" class="is-active">
            <harmony-icon name="document" size="md"></harmony-icon>
            Documents
          </a>
          <a href="#examples">
            <harmony-icon name="photo" size="md"></harmony-icon>
            Images
          </a>
          <a href="#examples">
            <harmony-icon name="film" size="md"></harmony-icon>
            Videos
          </a>
          <a href="#examples">
            <harmony-icon name="musical-note" size="md"></harmony-icon>
            Audio
          </a>
        </harmony-list-menu>
        <p class="muted">Optional <code>&lt;harmony-list-menu&gt;</code> adds <code>list-menu</code> / <code>list-menu__item</code> / <code>list-menu__item-icon</code>. Same look as native compose.</p>
      </demo-example>

      <h2>No borders</h2>
      <demo-example>
        <harmony-list-menu variant="no-borders" class="menu-demo" aria-label="No borders menu">
          <button type="button" class="is-active">
            <harmony-icon name="home" size="md"></harmony-icon>
            Dashboard
          </button>
          <button type="button">
            <harmony-icon name="user" size="md"></harmony-icon>
            Profile
          </button>
          <button type="button">
            <harmony-icon name="cog-6-tooth" size="md"></harmony-icon>
            Settings
          </button>
          <button type="button">
            <harmony-icon name="arrow-right-on-rectangle" size="md"></harmony-icon>
            Logout
          </button>
        </harmony-list-menu>
        <p class="muted"><code>variant="no-borders"</code> removes item separators; the outer menu border remains.</p>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Surface</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td><code>.list-menu</code></td><td>Host container (nav, div, or helper)</td></tr>
            <tr><td><code>.list-menu--no-borders</code></td><td>Removes item separators</td></tr>
            <tr><td><code>.list-menu__item</code></td><td>On each <code>a</code> / <code>button</code></td></tr>
            <tr><td><code>.is-active</code></td><td>Selected / current item</td></tr>
            <tr><td><code>.list-menu__item-icon</code></td><td>On <code>harmony-icon</code> (helper adds if missing)</td></tr>
            <tr><td><code>variant</code> (helper)</td><td>default | no-borders</td></tr>
          </tbody>
        </table>
        <p class="muted">No <code>items[]</code> JSON API — compose children. Demo nav dogfoods this recipe in Shadow DOM via <code>listMenuSheet</code>.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Prefer <code>&lt;nav&gt;</code> with an accessible name for navigation menus. Mark the current page with <code>aria-current="page"</code> and/or <code>is-active</code>. Buttons are for actions; links for navigation.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-list-menu variant="no-borders">\n` +
      `  <a href="/home" class="is-active"><harmony-icon name="home" size="md"></harmony-icon> Home</a>\n` +
      `  <a href="/profile"><harmony-icon name="user" size="md"></harmony-icon> Profile</a>\n` +
      `</harmony-list-menu>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<nav class="list-menu" aria-label="Main">\n` +
      `  <a class="list-menu__item is-active" href="/">Home</a>\n` +
      `  <a class="list-menu__item" href="/settings">Settings</a>\n` +
      `</nav>`;
  }
}

if (!customElements.get('demo-list-menu-page')) {
  customElements.define('demo-list-menu-page', DemoListMenuPage);
}
