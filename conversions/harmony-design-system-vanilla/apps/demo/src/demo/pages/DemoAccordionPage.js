import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoConsumeSnippets.js';

export class DemoAccordionPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Accordion" scope="Accordion">
        <p>Collapsible sections via <code>&lt;harmony-accordion&gt;</code> and <code>&lt;harmony-accordion-item&gt;</code>.</p>
      </demo-page-header>

      <h2>Basic Accordion</h2>
      <demo-example>
        <harmony-accordion>
          <harmony-accordion-item title="What is this design system?">
            A comprehensive design system built with accessibility, performance, and flexibility in mind.
          </harmony-accordion-item>
          <harmony-accordion-item title="How do I get started?">
            Start with Foundation tokens, then Shell Layout, then Components.
          </harmony-accordion-item>
          <harmony-accordion-item title="Is it accessible?">
            Yes — ARIA, keyboard navigation, and WCAG 2.3 AA.
          </harmony-accordion-item>
        </harmony-accordion>
      </demo-example>

      <h2>With Label</h2>
      <demo-example>
        <harmony-accordion label="Account preferences">
          <harmony-accordion-item title="Notifications">Choose how you receive updates and alerts.</harmony-accordion-item>
          <harmony-accordion-item title="Privacy">Control what data is stored and shared.</harmony-accordion-item>
        </harmony-accordion>
      </demo-example>

      <h2>With Default Open</h2>
      <demo-example>
        <harmony-accordion>
          <harmony-accordion-item title="Can I customize the colors?" open>
            Override CSS custom properties to match your brand.
          </harmony-accordion-item>
          <harmony-accordion-item title="What browsers are supported?">
            Modern browsers including Chrome, Firefox, Safari, and Edge.
          </harmony-accordion-item>
          <harmony-accordion-item title="Can I use this commercially?">
            Yes — check the license for specific terms.
          </harmony-accordion-item>
        </harmony-accordion>
      </demo-example>

      <h2>Allow Multiple</h2>
      <demo-example>
        <harmony-accordion allow-multiple>
          <harmony-accordion-item title="Section A" open>Content A</harmony-accordion-item>
          <harmony-accordion-item title="Section B" open>Content B</harmony-accordion-item>
          <harmony-accordion-item title="Section C">Content C</harmony-accordion-item>
        </harmony-accordion>
      </demo-example>

      <h2>Disabled Sections</h2>
      <demo-example>
        <harmony-accordion allow-multiple>
          <harmony-accordion-item title="Editable section">This section can be expanded or collapsed.</harmony-accordion-item>
          <harmony-accordion-item title="Locked section" disabled>This content is not available yet.</harmony-accordion-item>
          <harmony-accordion-item title="Another editable section">Disabled sections cannot be opened.</harmony-accordion-item>
        </harmony-accordion>
      </demo-example>

      <h2>Focus</h2>
      <demo-example>
        <p class="muted">Tab through the headers or click to move focus and see the focus state.</p>
        <harmony-accordion allow-multiple>
          <harmony-accordion-item title="What is this design system?">Foundation, shell, and components.</harmony-accordion-item>
          <harmony-accordion-item title="How do I get started?">Explore Foundation first.</harmony-accordion-item>
          <harmony-accordion-item title="Is it accessible?">ARIA and keyboard support.</harmony-accordion-item>
        </harmony-accordion>
      </demo-example>

      <h2>API</h2>
      <demo-example>
        <table>
          <thead><tr><th>Element</th><th>Attribute</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td><code>harmony-accordion</code></td><td><code>allow-multiple</code>, <code>label</code></td><td>Single-open by default</td></tr>
            <tr><td><code>harmony-accordion-item</code></td><td><code>title</code>, <code>open</code>, <code>disabled</code></td><td>Default slot = body; <code>toggle</code> event</td></tr>
          </tbody>
        </table>
      </demo-example>

      <demo-consume-snippets></demo-consume-snippets>

      <h2>Accessibility</h2>
      <demo-example>
        <p>Item triggers are buttons with <code>aria-expanded</code> and <code>aria-controls</code>. Use <kbd>Tab</kbd> to move between headers and <kbd>Enter</kbd> / <kbd>Space</kbd> to toggle. Optional accordion <code>label</code> sets <code>role="group"</code> and <code>aria-label</code>. Forced-colors use shadow-local fallbacks.</p>
      </demo-example>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<harmony-accordion>\n` +
      `  <harmony-accordion-item title="Item" open>Body</harmony-accordion-item>\n` +
      `</harmony-accordion>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<harmony-accordion>\n` +
      `  <harmony-accordion-item title="Item" open>Body</harmony-accordion-item>\n` +
      `</harmony-accordion>`;
  }
}

if (!customElements.get('demo-accordion-page')) {
  customElements.define('demo-accordion-page', DemoAccordionPage);
}
