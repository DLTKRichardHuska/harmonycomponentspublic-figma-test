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

export class DemoAvatarPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Avatar" scope="Avatar">
        <p>User avatar via <code>&lt;harmony-avatar&gt;</code>: icon, initials, or image. Interactive avatars fire host <code>click</code> (Enter/Space synthesize click).</p>
      </demo-page-header>

      <h2>Sizes (icon)</h2>
      <demo-example class="row">
        <harmony-avatar size="sm"></harmony-avatar>
        <harmony-avatar size="md"></harmony-avatar>
        <harmony-avatar size="lg"></harmony-avatar>
      </demo-example>

      <h2>Variants</h2>
      <demo-example class="row">
        <harmony-avatar size="md" variant="icon"></harmony-avatar>
        <harmony-avatar size="md" variant="initials" initials="Jane Doe"></harmony-avatar>
        <harmony-avatar size="md" variant="image" src="${DEMO_PHOTO}" alt="Portrait of a person used as sample photo"></harmony-avatar>
      </demo-example>

      <h2>Interactive</h2>
      <demo-example>
        <div class="row">
          <div style="display:flex;flex-direction:column;align-items:center;gap:var(--space-2)">
            <harmony-avatar size="md" interactive></harmony-avatar>
            <span class="muted">Default</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:var(--space-2)">
            <harmony-avatar size="md" interactive disabled></harmony-avatar>
            <span class="muted">Disabled</span>
          </div>
        </div>
        <p class="muted">Hover and focus use real pointer/keyboard interaction (no docs staging classes). Enter/Space synthesize <code>click</code>.</p>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>size</code></td><td>sm | md | lg</td><td>md</td></tr>
            <tr><td><code>variant</code></td><td>icon | initials | image</td><td>icon</td></tr>
            <tr><td><code>initials</code></td><td>string</td><td>—</td></tr>
            <tr><td><code>src</code> / <code>alt</code></td><td>image URL / accessible name</td><td>—</td></tr>
            <tr><td><code>interactive</code> / <code>disabled</code></td><td>boolean</td><td>false</td></tr>
          </tbody>
        </table>
        <p class="muted">Parts: <code>icon</code>, <code>initials</code>, <code>image</code>. Event: <code>click</code> when interactive. Missing initials/src falls back to the <code>user</code> icon.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Non-interactive avatars use <code>role="img"</code> with an accessible name. Interactive avatars use <code>role="button"</code>, are focusable, and fire host <code>click</code> (Enter/Space included). Decorative inner content is <code>aria-hidden</code>. Image <code>alt=""</code>; name lives on the host.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-avatar variant="initials" initials="Jane Doe"></harmony-avatar>\n` +
      `<harmony-avatar interactive></harmony-avatar>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-avatar interactive></harmony-avatar>`;
  }
}

if (!customElements.get('demo-avatar-page')) {
  customElements.define('demo-avatar-page', DemoAvatarPage);
}
