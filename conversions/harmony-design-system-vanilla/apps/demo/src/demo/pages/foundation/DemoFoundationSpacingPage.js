import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../../elements/shared.js';
import '../../elements/DemoExample.js';
import '../../elements/DemoConsumeSnippets.js';
import {
  foundationStyles,
  importSnippets,
  SPACING_SCALE,
  RADIUS_SCALE,
  attachValueRefresh,
} from './foundationShared.js';

export class DemoFoundationSpacingPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, foundationStyles];
  #obs;

  connectedCallback() {
    const { npm, staticZip } = importSnippets('spacing');
    const rows = SPACING_SCALE.map((name) => {
      const cssVarName = `--space-${name}`;
      return `
        <div class="space-row">
          <span class="label-w">${name}</span>
          <div class="space-bar" style="width: var(${cssVarName});"></div>
          <span class="mono" data-var="${cssVarName}">${cssVarName}</span>
        </div>`;
    }).join('');

    const radii = RADIUS_SCALE.map(
      (r) => `
      <div style="text-align:center;">
        <div class="radius-box" style="border-radius: var(${r.cssVar});"></div>
        <div class="name" style="margin-top:var(--space-2);">${r.name}</div>
        <div class="mono" data-var="${r.cssVar}">${r.cssVar}</div>
      </div>`,
    ).join('');

    this.shadowRoot.innerHTML = `
      <demo-page-header title="Spacing" scope="Spacing">
        <p class="lede">A consistent spacing scale based on a 4px grid system for margins, padding, and gaps.</p>
      </demo-page-header>

      <h2>Spacing Scale</h2>
      ${rows}

      <h2>Usage Patterns</h2>
      <div class="grid-2">
        <demo-example><h3>Tight (4–8px)</h3><p>Icon + text, compact lists, inline elements</p></demo-example>
        <demo-example><h3>Default (12–16px)</h3><p>Form elements, card content, button groups</p></demo-example>
        <demo-example><h3>Relaxed (24–32px)</h3><p>Section spacing, page sections</p></demo-example>
        <demo-example><h3>Loose (48–64px)</h3><p>Major sections, hero areas</p></demo-example>
      </div>

      <h2>Border Radius</h2>
      <p>Numbered naming convention (e.g. radius-04, radius-12, radius-100).</p>
      <div class="grid-3">${radii}</div>

      <h2>CSS Variables</h2>
      <demo-example>
        <table>
          <thead><tr><th>Variable</th><th>Computed value</th></tr></thead>
          <tbody>
            ${RADIUS_SCALE.map((r) => `<tr><td><code>${r.cssVar}</code></td><td class="mono" data-var="${r.cssVar}">${r.cssVar}</td></tr>`).join('')}
          </tbody>
        </table>
      </demo-example>

      <demo-consume-snippets heading="h2"></demo-consume-snippets>
    `;
    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm = npm;
    consume.staticZip = staticZip;
    this.#obs = attachValueRefresh(this.shadowRoot);
  }

  disconnectedCallback() {
    this.#obs?.disconnect();
  }
}

if (!customElements.get('demo-foundation-spacing-page')) {
  customElements.define('demo-foundation-spacing-page', DemoFoundationSpacingPage);
}
