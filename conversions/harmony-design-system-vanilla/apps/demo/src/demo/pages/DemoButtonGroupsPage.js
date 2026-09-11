import {
  HarmonyElement,
  createSheet,
  typographySheet,
  buttonSheet,
  buttonGroupSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

const pageSheet = createSheet(`
  .size-block {
    display: grid;
    gap: var(--space-2);
    justify-items: start; /* keep btn-group inline-flex width; grid default stretch was full-bleed */
  }
  .size-block + .size-block { margin-top: var(--space-4); }
`);

export class DemoButtonGroupsPage extends HarmonyElement {
  static styles = [
    typographySheet,
    demoChromeSheet,
    demoPageSheet,
    buttonSheet,
    buttonGroupSheet,
    pageSheet,
  ];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Button Groups" scope="ButtonGroup">
        <p>Related actions in one unit. Native <code>div.btn-group</code> or optional light-DOM <code>&lt;harmony-button-group&gt;</code>. Selected = primary (or <code>.btn--selected</code>); others outline.</p>
      </demo-page-header>

      <h2 id="examples">Default variant</h2>
      <demo-example>
        <div class="btn-group btn-group--default btn-group--md btn-group--horizontal" role="group">
          <button type="button" class="btn--primary">Selected</button>
          <button type="button" class="btn--outline">Option 1</button>
          <button type="button" class="btn--outline">Option 2</button>
        </div>
        <p class="muted">Native recipe. Bordered container with spaced buttons.</p>
      </demo-example>

      <h2>Default — toggle example</h2>
      <demo-example>
        <harmony-button-group>
          <button type="button" class="btn--primary">Day</button>
          <button type="button" class="btn--outline">Week</button>
          <button type="button" class="btn--outline">Month</button>
        </harmony-button-group>
      </demo-example>

      <h2>Sizes</h2>
      <demo-example>
        <div class="size-block">
          <p class="path-label">Small</p>
          <harmony-button-group size="sm">
            <button type="button" class="btn--primary">Option 1</button>
            <button type="button" class="btn--outline">Option 2</button>
            <button type="button" class="btn--outline">Option 3</button>
          </harmony-button-group>
        </div>
        <div class="size-block">
          <p class="path-label">Medium (default)</p>
          <harmony-button-group size="md">
            <button type="button" class="btn--primary">Option 1</button>
            <button type="button" class="btn--outline">Option 2</button>
            <button type="button" class="btn--outline">Option 3</button>
          </harmony-button-group>
        </div>
        <div class="size-block">
          <p class="path-label">Large</p>
          <harmony-button-group size="lg">
            <button type="button" class="btn--primary">Option 1</button>
            <button type="button" class="btn--outline">Option 2</button>
            <button type="button" class="btn--outline">Option 3</button>
          </harmony-button-group>
        </div>
      </demo-example>

      <h2>Orientation</h2>
      <demo-example>
        <div class="size-block">
          <p class="path-label">Horizontal</p>
          <harmony-button-group orientation="horizontal">
            <button type="button" class="btn--primary">Option 1</button>
            <button type="button" class="btn--outline">Option 2</button>
            <button type="button" class="btn--outline">Option 3</button>
          </harmony-button-group>
        </div>
        <div class="size-block">
          <p class="path-label">Vertical</p>
          <harmony-button-group orientation="vertical">
            <button type="button" class="btn--primary">Option 1</button>
            <button type="button" class="btn--outline">Option 2</button>
            <button type="button" class="btn--outline">Option 3</button>
          </harmony-button-group>
        </div>
      </demo-example>

      <h2>Disabled</h2>
      <demo-example>
        <harmony-button-group>
          <button type="button" class="btn--primary" disabled>Selected</button>
          <button type="button" class="btn--outline" disabled>Option 1</button>
          <button type="button" class="btn--outline" disabled>Option 2</button>
        </harmony-button-group>
      </demo-example>

      <h2>Multiple counts</h2>
      <demo-example>
        <div class="size-block">
          <p class="path-label">2 buttons</p>
          <harmony-button-group>
            <button type="button" class="btn--primary">Option 1</button>
            <button type="button" class="btn--outline">Option 2</button>
          </harmony-button-group>
        </div>
        <div class="size-block">
          <p class="path-label">5 buttons</p>
          <harmony-button-group>
            <button type="button" class="btn--primary">Option 1</button>
            <button type="button" class="btn--outline">Option 2</button>
            <button type="button" class="btn--outline">Option 3</button>
            <button type="button" class="btn--outline">Option 4</button>
            <button type="button" class="btn--outline">Option 5</button>
          </harmony-button-group>
        </div>
        <div class="size-block">
          <p class="path-label">10 buttons</p>
          <harmony-button-group>
            <button type="button" class="btn--primary">1</button>
            <button type="button" class="btn--outline">2</button>
            <button type="button" class="btn--outline">3</button>
            <button type="button" class="btn--outline">4</button>
            <button type="button" class="btn--outline">5</button>
            <button type="button" class="btn--outline">6</button>
            <button type="button" class="btn--outline">7</button>
            <button type="button" class="btn--outline">8</button>
            <button type="button" class="btn--outline">9</button>
            <button type="button" class="btn--outline">10</button>
          </harmony-button-group>
        </div>
      </demo-example>

      <h2>With icons and text</h2>
      <demo-example>
        <harmony-button-group>
          <button type="button" class="btn--primary"><harmony-icon name="plus" size="sm"></harmony-icon> Button 1</button>
          <button type="button" class="btn--outline"><harmony-icon name="squares-2x2" size="sm"></harmony-icon> Button 2</button>
          <button type="button" class="btn--outline"><harmony-icon name="chart-bar" size="sm"></harmony-icon> Button 3</button>
        </harmony-button-group>
        <div class="size-block" style="margin-top: var(--space-6)">
          <p class="path-label">Small</p>
          <harmony-button-group size="sm">
            <button type="button" class="btn--primary"><harmony-icon name="plus" size="sm"></harmony-icon> Button 1</button>
            <button type="button" class="btn--outline"><harmony-icon name="squares-2x2" size="sm"></harmony-icon> Button 2</button>
            <button type="button" class="btn--outline"><harmony-icon name="chart-bar" size="sm"></harmony-icon> Button 3</button>
          </harmony-button-group>
        </div>
        <div class="size-block">
          <p class="path-label">Medium</p>
          <harmony-button-group size="md">
            <button type="button" class="btn--primary"><harmony-icon name="plus" size="sm"></harmony-icon> Button 1</button>
            <button type="button" class="btn--outline"><harmony-icon name="squares-2x2" size="sm"></harmony-icon> Button 2</button>
            <button type="button" class="btn--outline"><harmony-icon name="chart-bar" size="sm"></harmony-icon> Button 3</button>
          </harmony-button-group>
        </div>
        <div class="size-block">
          <p class="path-label">Large</p>
          <harmony-button-group size="lg">
            <button type="button" class="btn--primary"><harmony-icon name="plus" size="sm"></harmony-icon> Button 1</button>
            <button type="button" class="btn--outline"><harmony-icon name="squares-2x2" size="sm"></harmony-icon> Button 2</button>
            <button type="button" class="btn--outline"><harmony-icon name="chart-bar" size="sm"></harmony-icon> Button 3</button>
          </harmony-button-group>
        </div>
      </demo-example>

      <h2>Icon only</h2>
      <demo-example class="row">
        <harmony-button-group>
          <button type="button" class="btn--primary btn--icon-md" aria-label="Bold"><harmony-icon name="bold" size="sm"></harmony-icon></button>
          <button type="button" class="btn--outline btn--icon-md" aria-label="Italic"><harmony-icon name="italic" size="sm"></harmony-icon></button>
          <button type="button" class="btn--outline btn--icon-md" aria-label="Underline"><harmony-icon name="underline" size="sm"></harmony-icon></button>
        </harmony-button-group>
      </demo-example>

      <h2>Outline variant</h2>
      <demo-example>
        <div class="btn-group btn-group--outline btn-group--md btn-group--horizontal" role="group">
          <button type="button" class="btn--outline">Left</button>
          <button type="button" class="btn--outline">Middle</button>
          <button type="button" class="btn--outline">Right</button>
        </div>
        <p class="muted" style="margin-top: var(--space-4)">Helper equivalent:</p>
        <harmony-button-group variant="outline" style="margin-top: var(--space-2)">
          <button type="button" class="btn--outline">Left</button>
          <button type="button" class="btn--outline">Middle</button>
          <button type="button" class="btn--outline">Right</button>
        </harmony-button-group>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Attribute / class</th><th>Values</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>variant</code> / <code>.btn-group--*</code></td><td>default | outline</td><td>default</td></tr>
            <tr><td><code>size</code></td><td>sm | md | lg</td><td>md</td></tr>
            <tr><td><code>orientation</code></td><td>horizontal | vertical</td><td>horizontal</td></tr>
          </tbody>
        </table>
        <p class="muted">Light-DOM helper maps attrs to classes and sets <code>role="group"</code>. Children are normal buttons / <code>harmony-button</code>.</p>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Wrap related controls in a group with <code>role="group"</code> (helper sets this). Icon-only buttons need <code>aria-label</code>. Communicate selected state via primary styling plus text — not color alone.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-button-group>\n` +
      `  <button type="button" class="btn--primary">Day</button>\n` +
      `  <button type="button" class="btn--outline">Week</button>\n` +
      `  <button type="button" class="btn--outline">Month</button>\n` +
      `</harmony-button-group>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<div class="btn-group btn-group--default btn-group--md btn-group--horizontal" role="group">\n` +
      `  <button type="button" class="btn--primary">Day</button>\n` +
      `  <button type="button" class="btn--outline">Week</button>\n` +
      `</div>`;
  }
}

if (!customElements.get('demo-button-groups-page')) {
  customElements.define('demo-button-groups-page', DemoButtonGroupsPage);
}
