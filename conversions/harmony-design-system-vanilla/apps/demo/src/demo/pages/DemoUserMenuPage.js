import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

const DEMO_PHOTO =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&w=128&h=128&fit=crop&q=80';

export class DemoUserMenuPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="User Menu" scope="UserMenu">
        <p>Interactive user avatar menu via <code>&lt;harmony-user-menu&gt;</code>. Tooltip shows the full name. Image when <code>src</code> is set; otherwise initials.</p>
      </demo-page-header>

      <h2>Initials</h2>
      <demo-example>
        <div style="display:flex;justify-content:flex-end;">
          <harmony-user-menu name="Jane Doe">
            <button type="button" data-icon="user">Profile</button>
            <a href="#settings" data-icon="cog-6-tooth">Settings</a>
            <button type="button" data-icon="arrow-right-on-rectangle">Sign out</button>
          </harmony-user-menu>
        </div>
      </demo-example>

      <h2>Image</h2>
      <demo-example>
        <div style="display:flex;justify-content:flex-end;">
          <harmony-user-menu name="Jane Doe" src="${DEMO_PHOTO}">
            <button type="button" data-icon="user-circle">Account</button>
            <button type="button" data-icon="arrow-right-on-rectangle">Sign out</button>
          </harmony-user-menu>
        </div>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>name</code></td><td>string</td><td>required</td></tr>
            <tr><td><code>src</code></td><td>image URL</td><td>—</td></tr>
          </tbody>
        </table>
        <p class="muted">Default slot: <code>a</code> / <code>button</code> menu items. Optional <code>data-icon</code> injects a leading <code>harmony-icon</code>.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-user-menu name="Jane Doe">\n` +
      `  <button type="button" data-icon="arrow-right-on-rectangle">Sign out</button>\n` +
      `</harmony-user-menu>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-user-menu name="Jane Doe"></harmony-user-menu>`;
  }
}

if (!customElements.get('demo-user-menu-page')) {
  customElements.define('demo-user-menu-page', DemoUserMenuPage);
}
