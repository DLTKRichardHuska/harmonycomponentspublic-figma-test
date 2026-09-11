import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { getColorScheme } from '@dltkrichardhuska/harmony-design-system-vanilla/theme';
import { demoChromeSheet } from '../../elements/shared.js';
import '../../elements/DemoExample.js';
import '../../elements/DemoCallout.js';
import '../../elements/DemoConsumeSnippets.js';
import {
  ICON_SUN,
  ICON_MOON,
  ICON_HAND,
  ICON_EYE,
  ICON_MONITOR,
  foundationStyles,
  importSnippets,
  SEMANTIC_COLORS,
  LIGHT_PALETTE,
  renderSwatchGrid,
  attachValueRefresh,
} from './foundationShared.js';

export class DemoFoundationColorsPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, foundationStyles];
  #obs;

  connectedCallback() {
    const mode = getColorScheme();
    const { npm, staticZip } = importSnippets('colors');
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Color System" scope="Colors">
        <p class="lede">A comprehensive color palette designed for both dark and light themes, with semantic colors for consistent communication. Values come from the active product stylesheet.</p>
      </demo-page-header>
      <div class="badge">${mode === 'dark' ? ICON_MOON : ICON_SUN} Showing ${mode === 'dark' ? 'Dark' : 'Light'} Mode Colors</div>

      <h2>Semantic surface palette</h2>
      <p>Live CSS variables from the loaded product kit (switch product in the header to compare).</p>
      <div class="grid">${renderSwatchGrid(LIGHT_PALETTE)}</div>

      <h2>Semantic Colors</h2>
      <p>These colors adapt to light and dark modes for optimal contrast and meaning.</p>
      <div class="grid">${renderSwatchGrid(SEMANTIC_COLORS)}</div>

      <h2>Accent Colors</h2>
      <div class="grid-2">
        <div>
          <div class="swatch" style="background: var(--theme-primary);"></div>
          <div class="swatch-meta">
            <div class="name">Theme Primary</div>
            <div class="mono" data-var="--theme-primary">--theme-primary</div>
            <div class="usage">Primary brand color, buttons, CTA</div>
          </div>
        </div>
        <div>
          <div class="swatch" style="background: var(--color-accent, var(--theme-primary));"></div>
          <div class="swatch-meta">
            <div class="name">Accent</div>
            <div class="mono" data-var="--color-accent">--color-accent</div>
            <div class="usage">Secondary accent</div>
          </div>
        </div>
      </div>

      <h2>Accessibility</h2>
      <div class="a11y">
        <demo-callout heading="Contrast Ratios">
          <span slot="icon">${ICON_HAND}</span>
          <p>All color combinations meet WCAG AA standards. Primary text on backgrounds maintains a minimum 4.5:1 contrast ratio, while large text maintains 3:1. Interactive elements have clear focus states.</p>
        </demo-callout>
        <demo-callout heading="Color Blindness">
          <span slot="icon">${ICON_EYE}</span>
          <p>Semantic colors are designed to be distinguishable for users with color vision deficiencies. Always pair color with icons or text labels for critical information.</p>
        </demo-callout>
        <demo-callout heading="Windows High Contrast">
          <span slot="icon">${ICON_MONITOR}</span>
          <p>When the OS enables forced colors (Windows Contrast Themes), the product stylesheet remaps semantic tokens to system colors such as Canvas and Highlight. No Theme JS call is required. Boundaries and focus use borders and outlines; do not rely on shadows or hue alone.</p>
        </demo-callout>
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

if (!customElements.get('demo-foundation-colors-page')) {
  customElements.define('demo-foundation-colors-page', DemoFoundationColorsPage);
}
