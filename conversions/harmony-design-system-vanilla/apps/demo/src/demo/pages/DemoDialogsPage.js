import {
  HarmonyElement,
  createSheet,
  typographySheet,
  buttonSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

const pageSheet = createSheet(`
  .stack { display: flex; flex-direction: column; gap: var(--space-3); }
  .long p { margin: 0 0 var(--space-4); color: var(--text-secondary); }
  .form-fields { display: flex; flex-direction: column; gap: var(--space-3); max-width: 24rem; }
  .form-fields label { display: flex; flex-direction: column; gap: var(--space-1); font-weight: var(--font-medium); color: var(--text-primary); }
  .form-fields input {
    height: var(--space-10);
    padding: 0 var(--space-3);
    border: var(--border-width-thin) solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--card-bg);
    color: var(--text-primary);
  }
  .muted { color: var(--text-muted); font-size: var(--text-sm); }
`);

export class DemoDialogsPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet, buttonSheet, pageSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Dialogs" scope="Dialog">
        <p>Dialogs via <code>&lt;harmony-dialog&gt;</code> (native <code>&lt;dialog&gt;</code>). Use <code>show()</code> / <code>close()</code>. Production: <code>close-on-backdrop</code>, <code>dirty</code> + <code>confirm-unsaved</code>.</p>
      </demo-page-header>

      <h2 id="examples">Examples</h2>

      <h3>Basic Dialog</h3>
      <demo-example>
        <harmony-button type="button" data-open="basic">Open Dialog</harmony-button>
        <harmony-dialog id="basic" title="Dialog Title">
          <p>This is a basic dialog with some content. You can add any content here including forms, images, or other components.</p>
          <div slot="footer">
            <harmony-button type="button" button-type="theme" data-close="basic">Confirm</harmony-button>
            <harmony-button type="button" button-type="theme" variant="secondary" data-close="basic">Cancel</harmony-button>
          </div>
        </harmony-dialog>
      </demo-example>

      <h3>Confirmation Dialog</h3>
      <demo-example>
        <harmony-button type="button" variant="destructive" data-open="confirm">Delete Item</harmony-button>
        <harmony-dialog id="confirm" title="Delete Item?">
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <div slot="footer">
            <harmony-button type="button" button-type="theme" variant="destructive" data-close="confirm">Delete</harmony-button>
            <harmony-button type="button" button-type="theme" variant="secondary" data-close="confirm">Cancel</harmony-button>
          </div>
        </harmony-dialog>
      </demo-example>

      <h3>Three buttons (Yes, No, Cancel)</h3>
      <demo-example>
        <harmony-button type="button" data-open="three">Open Save Changes Dialog</harmony-button>
        <harmony-dialog
          id="three"
          title="Save changes?"
          confirm-label="Yes"
          cancel-label="No"
          tertiary-label="Cancel"
        >
          <p>Do you want to save your changes before closing? Yes saves and closes, No closes without saving, Cancel keeps the dialog open.</p>
        </harmony-dialog>
      </demo-example>

      <h3>Right-Aligned Buttons</h3>
      <demo-example>
        <harmony-button type="button" data-open="right">Open Right-Aligned Dialog</harmony-button>
        <harmony-dialog id="right" title="Right-Aligned Buttons" button-alignment="right">
          <p>This dialog has buttons aligned to the right. Use button-alignment="right" to override the default left alignment.</p>
          <div slot="footer">
            <harmony-button type="button" button-type="theme" variant="secondary" data-close="right">Cancel</harmony-button>
            <harmony-button type="button" button-type="theme" data-close="right">Confirm</harmony-button>
          </div>
        </harmony-dialog>
      </demo-example>

      <h3>Primary Header Variant</h3>
      <demo-example>
        <harmony-button type="button" data-open="primary">Open Primary Header Dialog</harmony-button>
        <harmony-dialog id="primary" title="Primary Header" header-variant="primary">
          <p>This dialog has a primary blue header background with inverse text color for better contrast.</p>
          <div slot="footer">
            <harmony-button type="button" button-type="theme" data-close="primary">Confirm</harmony-button>
            <harmony-button type="button" button-type="theme" variant="secondary" data-close="primary">Cancel</harmony-button>
          </div>
        </harmony-dialog>
      </demo-example>

      <h3>Combined Variants</h3>
      <demo-example>
        <harmony-button type="button" data-open="combined">Open Combined Variants Dialog</harmony-button>
        <harmony-dialog id="combined" title="Combined Variants" button-alignment="left" header-variant="primary">
          <p>This dialog combines both variants: left-aligned buttons and a primary blue header.</p>
          <div slot="footer">
            <harmony-button type="button" button-type="theme" data-close="combined">Confirm</harmony-button>
            <harmony-button type="button" button-type="theme" variant="secondary" data-close="combined">Cancel</harmony-button>
          </div>
        </harmony-dialog>
      </demo-example>

      <h3>Resizable Dialog</h3>
      <demo-example>
        <harmony-button type="button" data-open="resizable">Open Resizable Dialog</harmony-button>
        <harmony-dialog id="resizable" title="Header" resizable>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <div slot="footer">
            <harmony-button type="button" button-type="theme" data-close="resizable">Submit</harmony-button>
            <harmony-button type="button" button-type="theme" variant="secondary" data-close="resizable">Cancel</harmony-button>
          </div>
        </harmony-dialog>
      </demo-example>

      <h3>Long Content (Scrollable Body)</h3>
      <demo-example>
        <harmony-button type="button" data-open="long">Open Scrollable Body Dialog</harmony-button>
        <harmony-dialog id="long" title="Scrollable Body">
          <div class="long">
            <p>When content is long, only the body scrolls. The header (title and close) and footer (buttons) stay fixed at the top and bottom.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla facilisi.</p>
            <p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget risus varius blandit sit amet non magna. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</p>
            <p>Cras mattis consectetur purus sit amet fermentum. Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
            <p>Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Etiam porta sem malesuada magna mollis euismod.</p>
            <p>Sed posuere consectetur est at lobortis. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec sed odio dui. Scroll to see that the header and footer remain fixed.</p>
          </div>
          <div slot="footer">
            <harmony-button type="button" button-type="theme" data-close="long">Confirm</harmony-button>
            <harmony-button type="button" button-type="theme" variant="secondary" data-close="long">Cancel</harmony-button>
          </div>
        </harmony-dialog>
      </demo-example>

      <h2 id="production">Vanilla production</h2>
      <p class="muted">Not in the Astro reference — form-safe dismiss and unsaved confirmation.</p>

      <h3>Disable backdrop close</h3>
      <demo-example>
        <harmony-button type="button" data-open="no-backdrop">Open (backdrop locked)</harmony-button>
        <harmony-dialog id="no-backdrop" title="Form dialog" close-on-backdrop="false" confirm-label="Save" cancel-label="Cancel">
          <p>Backdrop clicks do not close this dialog. Use Escape, X, or Cancel.</p>
        </harmony-dialog>
      </demo-example>

      <h3>Unsaved changes confirm</h3>
      <demo-example>
        <harmony-button type="button" data-open="form">Open form dialog</harmony-button>
        <harmony-dialog
          id="form"
          title="Edit item"
          close-on-backdrop="false"
          confirm-unsaved
          confirm-label="Save"
          cancel-label="Cancel"
          unsaved-message="Discard unsaved edits?"
        >
          <form class="form-fields" id="edit-form">
            <label>Name <input name="name" type="text" value="Sample" /></label>
            <label>Notes <input name="notes" type="text" value="" /></label>
          </form>
        </harmony-dialog>
      </demo-example>

      <h2 id="props">API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute / API</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td><code>title</code></td><td>Heading (also native HTML tooltip attribute)</td></tr>
            <tr><td><code>header-variant</code></td><td>default | primary</td></tr>
            <tr><td><code>button-alignment</code></td><td>left | right</td></tr>
            <tr><td><code>resizable</code></td><td>default true; grip drag</td></tr>
            <tr><td><code>close-on-backdrop</code></td><td>default true; set false for forms</td></tr>
            <tr><td><code>dirty</code> / <code>confirm-unsaved</code></td><td>unsaved gate + nested confirm</td></tr>
            <tr><td><code>show()</code> / <code>close({ force })</code></td><td>open / gated close</td></tr>
            <tr><td>Events</td><td><code>close</code>, <code>confirm</code>, <code>cancel</code>, <code>tertiary</code>, cancelable <code>close-request</code></td></tr>
          </tbody>
        </table>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2 id="accessibility">Accessibility</h2>
      <demo-example>
        <p>Native modal <code>&lt;dialog&gt;</code> provides focus trap, Escape, and restore. Title is labelled via <code>aria-labelledby</code>. Nested unsaved confirm is also modal. Forced-colors uses shadow-local borders.</p>
      </demo-example>
    `;

    this.shadowRoot.addEventListener('click', this.#onClick);
    this.shadowRoot.addEventListener('confirm', this.#onConfirm);
    this.shadowRoot.addEventListener('input', this.#onFormInput);

    const formDlg = this.shadowRoot.querySelector('#form');
    formDlg?.addEventListener('confirm', () => {
      formDlg.dirty = false;
      formDlg.close({ force: true });
    });

    const three = this.shadowRoot.querySelector('#three');
    three?.addEventListener('confirm', () => three.close({ force: true }));

    const noBackdrop = this.shadowRoot.querySelector('#no-backdrop');
    noBackdrop?.addEventListener('confirm', () => noBackdrop.close({ force: true }));

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-button type="button" id="open">Open</harmony-button>\n` +
      `<harmony-dialog id="dlg" title="Confirm" confirm-label="OK" cancel-label="Cancel">\n` +
      `  <p>Are you sure?</p>\n` +
      `</harmony-dialog>\n` +
      `<script type="module">\n` +
      `  open.onclick = () => dlg.show();\n` +
      `  dlg.addEventListener('confirm', () => dlg.close({ force: true }));\n` +
      `</script>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-dialog title="Hello"><p>Body</p></harmony-dialog>`;
  }

  disconnectedCallback() {
    this.shadowRoot?.removeEventListener('click', this.#onClick);
    this.shadowRoot?.removeEventListener('confirm', this.#onConfirm);
    this.shadowRoot?.removeEventListener('input', this.#onFormInput);
  }

  #onClick = (e) => {
    const openBtn = e.target.closest?.('[data-open]');
    if (openBtn) {
      const id = openBtn.getAttribute('data-open');
      this.shadowRoot.querySelector(`#${id}`)?.show();
      return;
    }
    const closeBtn = e.target.closest?.('[data-close]');
    if (closeBtn) {
      const id = closeBtn.getAttribute('data-close');
      this.shadowRoot.querySelector(`#${id}`)?.close({ force: true });
    }
  };

  #onConfirm = () => {
    /* per-dialog listeners above handle convenience confirm */
  };

  #onFormInput = (e) => {
    const form = e.target.closest?.('#edit-form');
    if (!form) return;
    const dlg = this.shadowRoot.querySelector('#form');
    if (dlg) dlg.dirty = true;
  };
}

if (!customElements.get('demo-dialogs-page')) {
  customElements.define('demo-dialogs-page', DemoDialogsPage);
}
