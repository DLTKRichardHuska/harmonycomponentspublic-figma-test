import {
  HarmonyElement,
  typographySheet,
  cardSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { getCoverage } from '../manifestStatus.js';
import { statusBadgeHtml } from '../demoStatusBadge.js';
import { demoChromeSheet } from '../elements/shared.js';
import { pageStyles } from './pageStyles.js';

export class DemoHomePage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, cardSheet, pageStyles];

  connectedCallback() {
    const coverage = getCoverage();
    const badge = statusBadgeHtml({
      label: `v${coverage.referenceVersion} · ${coverage.percent}% converted`,
      variant: 'primary',
      size: 'large',
    });
    this.shadowRoot.innerHTML = `
      <div class="home-badge">${badge}</div>
      <h1>Harmony Design System — Vanilla Web</h1>
      <p>Frameworkless Harmony: native HTML + CSS, optional hybrid helpers, Custom Elements. Dual consume: <strong>npm</strong> and <strong>static zip</strong>. WCAG 2.3 AA.</p>
      <div class="cards">
        <article class="card">
          <div class="card__header">
            <div class="card__header-content">
              <h2 class="card__header-title">Installation</h2>
            </div>
          </div>
          <div class="card__body">
            <p>Start with Getting Started for npm <em>and</em> no-npm static drop-in.</p>
            <p><a href="/getting-started" data-nav>Open Getting Started →</a></p>
          </div>
        </article>
        <article class="card">
          <div class="card__header">
            <div class="card__header-content">
              <h2 class="card__header-title">Foundation</h2>
            </div>
          </div>
          <div class="card__body">
            <p>Tokens for color, type, spacing and elevation.</p>
            <p><a href="/foundation/colors" data-nav>Open Foundation →</a></p>
          </div>
        </article>
      </div>
    `;
    this.shadowRoot.addEventListener('click', this.#onClick);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('click', this.#onClick);
  }

  #onClick = (e) => {
    const a = e.target.closest('a[data-nav]');
    if (!a) return;
    e.preventDefault();
    this.emit('demo-navigate', { href: a.getAttribute('href') });
  };
}

if (!customElements.get('demo-home-page')) {
  customElements.define('demo-home-page', DemoHomePage);
}
