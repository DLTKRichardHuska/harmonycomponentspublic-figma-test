import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

export class DemoChipsPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Chips" scope="Chip">
        <p>Chips via <code>&lt;harmony-chip&gt;</code>. Body <code>click</code> for select/filter; <code>remove</code> CustomEvent on the remove control. <code>selected</code> is controlled.</p>
      </demo-page-header>

      <h2>Sizes</h2>
      <demo-example class="row">
        <harmony-chip size="sm">Chip Text</harmony-chip>
        <harmony-chip size="md">Chip Text</harmony-chip>
        <harmony-chip size="lg">Chip Text</harmony-chip>
      </demo-example>

      <h2>Variants — Fill</h2>
      <demo-example class="row">
        <harmony-chip variant="fill" size="sm">Small</harmony-chip>
        <harmony-chip variant="fill" size="md">Medium</harmony-chip>
        <harmony-chip variant="fill" size="lg">Large</harmony-chip>
      </demo-example>

      <h2>Variants — Outline</h2>
      <demo-example class="row">
        <harmony-chip variant="outline" size="sm">Small</harmony-chip>
        <harmony-chip variant="outline" size="md">Medium</harmony-chip>
        <harmony-chip variant="outline" size="lg">Large</harmony-chip>
      </demo-example>

      <h2>Selected &amp; disabled</h2>
      <demo-example class="row">
        <harmony-chip selected>Selected</harmony-chip>
        <harmony-chip disabled>Disabled</harmony-chip>
        <harmony-chip variant="outline" disabled>Outline disabled</harmony-chip>
      </demo-example>

      <h2>With icon &amp; removable</h2>
      <demo-example class="row">
        <harmony-chip icon="tag">Tagged</harmony-chip>
        <harmony-chip removable>Removable</harmony-chip>
        <harmony-chip icon="user" removable>Person</harmony-chip>
      </demo-example>

      <h2>Types</h2>
      <demo-example class="row">
        <harmony-chip type="horiz-dots" aria-label="More options"></harmony-chip>
        <harmony-chip type="vert-dots" aria-label="More options"></harmony-chip>
        <harmony-chip type="overflow" overflow-count="12"></harmony-chip>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>size</code></td><td>sm | md | lg</td><td>md</td></tr>
            <tr><td><code>variant</code></td><td>fill | outline</td><td>fill</td></tr>
            <tr><td><code>type</code></td><td>chip | horiz-dots | vert-dots | overflow</td><td>chip</td></tr>
            <tr><td><code>overflow-count</code></td><td>number</td><td>10</td></tr>
            <tr><td><code>selected</code> / <code>removable</code> / <code>disabled</code></td><td>boolean</td><td>false</td></tr>
            <tr><td><code>icon</code></td><td>harmony-icon name</td><td>—</td></tr>
          </tbody>
        </table>
        <p class="muted">Events: body <code>click</code>; <code>remove</code> CustomEvent on the remove control (does not bubble chip click). <code>selected</code> is controlled. Parts: <code>icon</code>, <code>remove</code>, <code>dots</code>.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Chips used as filters should expose pressed state (<code>aria-pressed</code> when <code>selected</code>). The remove control is a real button with <code>aria-label="Remove"</code>. Disabled chips set <code>aria-disabled</code> and are not focusable. Prefer text or icons plus color — not color alone.</p>
      </demo-example>
    `;

    this.shadowRoot.addEventListener('click', this.#onChipClick);
    this.shadowRoot.addEventListener('remove', this.#onRemove);

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-chip selected>Filter</harmony-chip>\n` +
      `<harmony-chip removable>Removable</harmony-chip>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-chip removable>Removable</harmony-chip>`;
  }

  disconnectedCallback() {
    this.shadowRoot?.removeEventListener('click', this.#onChipClick);
    this.shadowRoot?.removeEventListener('remove', this.#onRemove);
  }

  #onChipClick = (e) => {
    const chip = e.target.closest?.('harmony-chip');
    if (!chip || chip.disabled || chip.type !== 'chip') return;
    if (chip.hasAttribute('removable') && e.composedPath().some((n) => n?.part?.contains?.('remove'))) {
      return;
    }
    chip.selected = !chip.selected;
  };

  #onRemove = (e) => {
    const chip = e.target;
    if (chip?.tagName === 'HARMONY-CHIP') chip.remove();
  };
}

if (!customElements.get('demo-chips-page')) {
  customElements.define('demo-chips-page', DemoChipsPage);
}
