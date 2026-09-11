import {
  HarmonyElement,
  typographySheet,
  buttonSheet,
  linkSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

export class DemoLinksPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet, buttonSheet, linkSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Links" scope="Link">
        <p>Unclassed <code>&lt;a&gt;</code> is the Harmony link (product reset). Use <code>.link--muted</code> for muted. Sizes via typography classes. External: <code>target</code>/<code>rel</code> + compose <code>harmony-icon</code>.</p>
      </demo-page-header>

      <h2>Basic Link</h2>
      <demo-example>
        <p>Visit our <a href="#examples">documentation</a> for more information.</p>
      </demo-example>

      <h2 id="examples">Size variants</h2>
      <demo-example>
        <p>
          <a href="#examples" class="text-xs">Small link</a>
          <span aria-hidden="true"> · </span>
          <a href="#examples" class="text-sm">Medium link</a>
          <span aria-hidden="true"> · </span>
          <a href="#examples" class="text-base">Large link</a>
        </p>
        <p class="muted">Sizes use typography classes (<code>.text-xs</code> / <code>.text-sm</code> / <code>.text-base</code>), not link size modifiers.</p>
      </demo-example>

      <h2>External Link</h2>
      <demo-example>
        <p>
          Check out
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub
            <harmony-icon name="arrow-top-right-on-square" class="link__external-icon" size="xs"></harmony-icon>
          </a>
          for the source code.
        </p>
      </demo-example>

      <h2>Muted Link</h2>
      <demo-example>
        <p>
          <a href="#examples" class="link--muted">Privacy Policy</a>
          ·
          <a href="#examples" class="link--muted">Terms of Service</a>
        </p>
      </demo-example>

      <h2>Button link</h2>
      <demo-example class="row">
        <a class="btn btn--secondary" href="#examples">Link with .btn</a>
        <p class="muted"><code>a.btn</code> keeps button chrome (not text-link underline).</p>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Surface</th><th>Details</th></tr></thead>
          <tbody>
            <tr><td>Unclassed <code>&lt;a&gt;</code></td><td>Harmony text link (product reset)</td></tr>
            <tr><td><code>.link--muted</code></td><td>Muted color; hover → primary text</td></tr>
            <tr><td>Sizes</td><td>Typography classes (<code>.text-xs</code> / <code>.text-sm</code> / <code>.text-base</code>) — no link size modifiers</td></tr>
            <tr><td>External</td><td><code>target</code>/<code>rel</code> + compose <code>harmony-icon.link__external-icon</code></td></tr>
          </tbody>
        </table>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Use semantic <code>&lt;a href&gt;</code>. External links should include a visible cue (icon) and clear destination. Focus-visible rings come from the product reset. Forced-colors uses <code>LinkText</code>.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n\n` +
      `<a href="/docs">Documentation</a>\n` +
      `<a href="/privacy" class="link--muted">Privacy</a>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n\n` +
      `<a href="/docs">Documentation</a>\n` +
      `<a href="/privacy" class="link--muted">Privacy</a>`;
  }
}

if (!customElements.get('demo-links-page')) {
  customElements.define('demo-links-page', DemoLinksPage);
}
