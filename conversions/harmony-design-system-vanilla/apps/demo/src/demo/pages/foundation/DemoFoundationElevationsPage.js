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
  SHADOWS,
  attachValueRefresh,
} from './foundationShared.js';

export class DemoFoundationElevationsPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, foundationStyles];
  #obs;

  connectedCallback() {
    const { npm, staticZip } = importSnippets('elevations');
    const cards = SHADOWS.map((s) => {
      const shadow = s.cssVar === '--shadow-none' ? 'none' : `var(${s.cssVar})`;
      return `
      <div class="elev-card" style="box-shadow: ${shadow};">
        <div class="name">${s.name}</div>
        <div class="usage">${s.description}</div>
        <div class="usage">${s.usage}</div>
        <div class="mono" data-var="${s.cssVar}">${s.cssVar}</div>
      </div>`;
    }).join('');

    this.shadowRoot.innerHTML = `
      <demo-page-header title="Elevations" scope="Elevations">
        <p class="lede">A layered shadow system that creates depth and visual hierarchy. Shadows adapt in dark mode via the product stylesheet <code>.dark</code> block.</p>
      </demo-page-header>

      <h2>Shadow Scale</h2>
      <div class="grid-3">${cards}</div>

      <h2>Shadow Values</h2>
      <p>Each shadow has separate values for light and dark modes. Toggle mode in the header to see live computed values.</p>
      <demo-example>
        <table>
          <thead><tr><th>Token</th><th>Computed value</th></tr></thead>
          <tbody>
            ${SHADOWS.filter((s) => s.cssVar !== '--shadow-none')
              .map(
                (s) => `<tr><td><code>${s.cssVar}</code></td><td class="mono" data-var="${s.cssVar}">${s.cssVar}</td></tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </demo-example>

      <h2>Elevation Hierarchy</h2>
      <div class="a11y">
        <demo-example><div class="name">Level 0: Ground Level</div><div class="usage">Page background, no shadow</div><div class="mono">none</div></demo-example>
        <demo-example><div class="name">Level 1: Raised</div><div class="usage">Cards, containers, buttons</div><div class="mono">shadow-sm</div></demo-example>
        <demo-example><div class="name">Level 2: Floating</div><div class="usage">Dropdowns, menus, popovers</div><div class="mono">shadow-md</div></demo-example>
        <demo-example><div class="name">Level 3: Overlay</div><div class="usage">Modals, dialogs</div><div class="mono">shadow-lg</div></demo-example>
        <demo-example><div class="name">Level 4: Prominent</div><div class="usage">Focus elements, highlighted content</div><div class="mono">shadow-xl</div></demo-example>
      </div>

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

if (!customElements.get('demo-foundation-elevations-page')) {
  customElements.define('demo-foundation-elevations-page', DemoFoundationElevationsPage);
}
