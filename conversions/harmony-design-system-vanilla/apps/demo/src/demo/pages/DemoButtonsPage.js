import {
  HarmonyElement,
  typographySheet,
  buttonSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoCallout.js';
import '../elements/DemoConsumeSnippets.js';

export class DemoButtonsPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet, buttonSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Buttons" scope="Button">
        <p>Interactive buttons. Native <code>&lt;button&gt;</code> and button-type <code>&lt;input&gt;</code> get the Harmony look by default. Use <code>.btn</code> on other tags (chiefly anchors). Optional <code>&lt;harmony-button&gt;</code> maps attributes to the same classes.</p>
      </demo-page-header>

      <h2>Native defaults</h2>
      <demo-example>
        <div class="row">
          <button type="button">Primary (unclassed)</button>
          <input type="button" value="Input button" />
          <input type="submit" value="Submit" />
          <button type="button" class="btn--secondary">Secondary modifier</button>
          <a class="btn btn--secondary" href="#examples">Link with .btn</a>
        </div>
        <p class="muted">Unclassed controls are primary + md. Anchors need <code>class="btn"</code>.</p>
      </demo-example>

      <h2 id="examples">Button types</h2>
      <demo-example>
        <h4>Theme buttons (default)</h4>
        <div class="row">
          <button type="button" class="btn--primary">Primary</button>
          <button type="button" class="btn--secondary">Secondary</button>
          <button type="button" class="btn--tertiary">Tertiary</button>
        </div>
        <h4>Page header buttons</h4>
        <div class="row">
          <button type="button" class="btn--page-header btn--primary">Primary</button>
          <button type="button" class="btn--page-header btn--secondary">Secondary</button>
          <button type="button" class="btn--page-header btn--tertiary">Tertiary</button>
        </div>
      </demo-example>

      <h2>Variants</h2>
      <demo-example class="row">
        <button type="button" class="btn--primary">Primary</button>
        <button type="button" class="btn--secondary">Secondary</button>
        <button type="button" class="btn--tertiary">Tertiary</button>
        <button type="button" class="btn--outline">Outline</button>
        <button type="button" class="btn--ghost">Ghost</button>
        <button type="button" class="btn--destructive">Destructive</button>
      </demo-example>

      <h2>Dela buttons</h2>
      <demo-callout tone="warning">
        <strong>Deferred.</strong> <code>dela</code> / <code>dela-pill</code> variants and the Stars graphic wait until foundation Dela is synced. Accepted gap for this release.
      </demo-callout>

      <h2>Sizes</h2>
      <demo-example class="row">
        <button type="button" class="btn--xs">XSmall</button>
        <button type="button" class="btn--sm">Small</button>
        <button type="button" class="btn--md">Medium</button>
        <button type="button" class="btn--lg">Large</button>
      </demo-example>

      <h2>With icons</h2>
      <demo-example class="row">
        <button type="button"><harmony-icon name="plus" size="sm"></harmony-icon> Add Item</button>
        <button type="button">Continue <harmony-icon name="arrow-right" size="sm"></harmony-icon></button>
        <button type="button"><harmony-icon name="arrow-down-tray" size="sm"></harmony-icon> Download</button>
        <button type="button" class="btn--secondary"><harmony-icon name="pencil" size="sm"></harmony-icon> Edit</button>
        <button type="button" class="btn--outline"><harmony-icon name="share" size="sm"></harmony-icon> Share</button>
      </demo-example>

      <h2>Icon only</h2>
      <demo-example>
        <div class="row">
          <button type="button" class="btn--icon-xs" aria-label="Add item"><harmony-icon name="plus" size="xs"></harmony-icon></button>
          <button type="button" class="btn--icon-sm" aria-label="Add item"><harmony-icon name="plus" size="sm"></harmony-icon></button>
          <button type="button" class="btn--icon-md" aria-label="Add item"><harmony-icon name="plus" size="sm"></harmony-icon></button>
          <button type="button" class="btn--icon-lg" aria-label="Add item"><harmony-icon name="plus" size="md"></harmony-icon></button>
        </div>
        <div class="row" style="margin-top: var(--space-4)">
          <button type="button" class="btn--secondary btn--icon-md" aria-label="Edit"><harmony-icon name="pencil" size="sm"></harmony-icon></button>
          <button type="button" class="btn--tertiary btn--icon-md" aria-label="Settings"><harmony-icon name="cog-6-tooth" size="sm"></harmony-icon></button>
          <button type="button" class="btn--outline btn--icon-md" aria-label="Share"><harmony-icon name="share" size="sm"></harmony-icon></button>
          <button type="button" class="btn--ghost btn--icon-md" aria-label="More options"><harmony-icon name="ellipsis-vertical" size="sm"></harmony-icon></button>
          <button type="button" class="btn--destructive btn--icon-md" aria-label="Delete"><harmony-icon name="trash" size="sm"></harmony-icon></button>
        </div>
      </demo-example>

      <h2>States</h2>
      <demo-example>
        <h4>Theme — default and disabled</h4>
        <div class="row">
          <button type="button">Default</button>
          <button type="button" disabled>Disabled</button>
          <button type="button" class="btn--secondary">Default</button>
          <button type="button" class="btn--secondary" disabled>Disabled</button>
          <button type="button" class="btn--tertiary">Default</button>
          <button type="button" class="btn--tertiary" disabled>Disabled</button>
        </div>
        <p class="muted">Hover, pressed, and focused states show on interaction.</p>
        <h4>Page header — default and disabled</h4>
        <div class="row">
          <button type="button" class="btn--page-header btn--primary">Default</button>
          <button type="button" class="btn--page-header btn--primary" disabled>Disabled</button>
          <button type="button" class="btn--page-header btn--secondary">Default</button>
          <button type="button" class="btn--page-header btn--secondary" disabled>Disabled</button>
          <button type="button" class="btn--page-header btn--tertiary">Default</button>
          <button type="button" class="btn--page-header btn--tertiary" disabled>Disabled</button>
        </div>
      </demo-example>

      <h2>Loading state</h2>
      <demo-example class="row">
        <button type="button" class="btn--loading" disabled aria-busy="true">
          <svg class="btn__spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="var(--btn-spinner-stroke-width)"></circle><path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>Loading...</span>
        </button>
        <button type="button" class="btn--secondary btn--loading" disabled aria-busy="true">
          <svg class="btn__spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="var(--btn-spinner-stroke-width)"></circle><path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>Processing</span>
        </button>
        <harmony-button loading loading-text="Saving...">Save</harmony-button>
      </demo-example>

      <h2>Full width</h2>
      <demo-example class="stack">
        <button type="button" class="btn--full">Full Width Primary</button>
        <button type="button" class="btn--outline btn--full">Full Width Outline</button>
      </demo-example>

      <h2>Vertical orientation</h2>
      <demo-example>
        <div class="row">
          <button type="button" class="btn--vertical"><harmony-icon name="arrow-up" size="sm"></harmony-icon> Up</button>
          <button type="button" class="btn--secondary btn--vertical"><harmony-icon name="arrow-down" size="sm"></harmony-icon> Down</button>
          <button type="button" class="btn--tertiary btn--vertical"><harmony-icon name="arrow-left" size="sm"></harmony-icon> Left</button>
          <button type="button" class="btn--outline btn--vertical"><harmony-icon name="arrow-right" size="sm"></harmony-icon> Right</button>
        </div>
        <div class="row" style="margin-top: var(--space-4)">
          <button type="button" class="btn--page-header btn--primary btn--vertical"><harmony-icon name="arrow-up" size="sm"></harmony-icon> Up</button>
          <button type="button" class="btn--page-header btn--secondary btn--vertical"><harmony-icon name="arrow-down" size="sm"></harmony-icon> Down</button>
          <button type="button" class="btn--page-header btn--tertiary btn--vertical"><harmony-icon name="arrow-left" size="sm"></harmony-icon> Left</button>
          <button type="button" class="btn--page-header btn--outline btn--vertical"><harmony-icon name="arrow-right" size="sm"></harmony-icon> Right</button>
        </div>
      </demo-example>

      <h2>Hybrid helper (&lt;harmony-button&gt;)</h2>
      <demo-example class="row">
        <harmony-button variant="primary">Save</harmony-button>
        <harmony-button variant="ghost" icon="pencil" aria-label="Edit"></harmony-button>
        <harmony-button variant="secondary" icon="plus">Add Item</harmony-button>
        <harmony-button variant="outline" icon="arrow-right" icon-position="right">Continue</harmony-button>
        <harmony-button variant="destructive" icon="trash">Delete</harmony-button>
      </demo-example>

      <h2>Combinations</h2>
      <demo-example>
        <div class="row">
          <button type="button">Save Changes</button>
          <button type="button" class="btn--ghost">Cancel</button>
        </div>
        <div class="row" style="margin-top: var(--space-3)">
          <button type="button" class="btn--destructive"><harmony-icon name="trash" size="sm"></harmony-icon> Delete</button>
          <button type="button" class="btn--outline">Cancel</button>
        </div>
        <div class="row" style="margin-top: var(--space-3)">
          <button type="button"><harmony-icon name="check" size="sm"></harmony-icon> Confirm</button>
          <button type="button" class="btn--secondary"><harmony-icon name="x-mark" size="sm"></harmony-icon> Reject</button>
        </div>
      </demo-example>

      <h2>Usage guidelines</h2>
      <demo-example>
        <h4>When to use each button type</h4>
        <ul>
          <li><strong>Theme buttons:</strong> General UI actions. Use darker shades of the theme primary for hierarchy.</li>
          <li><strong>Page header buttons:</strong> Page headers and navigation areas (dark blue header scheme).</li>
        </ul>
        <h4>When to use each variant</h4>
        <ul>
          <li><strong>Primary:</strong> Main call-to-action, one per section</li>
          <li><strong>Secondary:</strong> Alternative actions, less prominent</li>
          <li><strong>Tertiary:</strong> Subtle actions with theme-primary text</li>
          <li><strong>Outline:</strong> Secondary actions that need visibility</li>
          <li><strong>Ghost:</strong> Minimal actions, toolbar buttons</li>
          <li><strong>Destructive:</strong> Delete, remove, or irreversible actions</li>
        </ul>
        <h4>Do</h4>
        <ul>
          <li>Use one primary button per section</li>
          <li>Prefer native <code>&lt;button&gt;</code> / button-type <code>&lt;input&gt;</code>; use <code>.btn</code> on links</li>
          <li>Give icon-only buttons an accessible name</li>
        </ul>
        <h4>Don't</h4>
        <ul>
          <li>Stack multiple primary buttons in the same group</li>
          <li>Use destructive for non-destructive actions</li>
          <li>Rely on color alone for meaning</li>
        </ul>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Surface</th><th>Details</th></tr></thead>
          <tbody>
            <tr><td>Native defaults</td><td><code>button</code>, <code>input[type=button|submit|reset]</code> → primary + md</td></tr>
            <tr><td><code>.btn</code></td><td>Opt-in for <code>&lt;a&gt;</code> and other non-button tags</td></tr>
            <tr><td>Modifiers</td><td><code>.btn--primary|secondary|tertiary|outline|ghost|destructive</code>, <code>.btn--page-header</code>, sizes, icon-only, loading, full, vertical</td></tr>
            <tr><td><code>harmony-button</code></td><td>Attrs: variant, button-type, size, orientation, disabled, loading, loading-text, icon, icon-position, type, full-width. formAssociated. No href.</td></tr>
          </tbody>
        </table>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-callout>
        <p>Prefer native <code>&lt;button&gt;</code> / <code>&lt;input type="button"&gt;</code> semantics. Icon-only controls need an accessible name (<code>aria-label</code>). <code>harmony-button</code> uses <code>ElementInternals</code> (role=button); it is not a real <code>HTMLButtonElement</code> — use native submit/reset when form drop-ins matter.</p>
      </demo-callout>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<button type="button">Save</button>\n` +
      `<a class="btn btn--secondary" href="/docs">Docs</a>\n` +
      `<harmony-button variant="primary" icon="plus">Add</harmony-button>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<button type="button">Save</button>\n` +
      `<a class="btn btn--secondary" href="/docs">Docs</a>\n` +
      `<harmony-button variant="primary">Save</harmony-button>`;
  }
}

if (!customElements.get('demo-buttons-page')) {
  customElements.define('demo-buttons-page', DemoButtonsPage);
}
