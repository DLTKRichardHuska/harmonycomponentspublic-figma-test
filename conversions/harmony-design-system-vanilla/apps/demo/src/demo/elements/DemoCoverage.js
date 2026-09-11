import {
  HarmonyElement,
  createSheet,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { getCoverage } from '../manifestStatus.js';
import { demoChromeSheet } from './shared.js';

const styles = createSheet(`
  :host {
    display: block;
    flex-shrink: 0;
    padding: var(--space-3) var(--space-4);
    border-top: var(--border-width-thin) solid var(--border-color);
    font-size: var(--caption);
    line-height: var(--leading-normal);
    opacity: 0.85;
  }
  .row {
    display: flex;
    justify-content: space-between;
    margin-top: var(--space-1-5);
  }
  .bar {
    margin-top: var(--space-1-5);
    height: var(--space-1);
    border-radius: var(--radius-full);
    background: var(--border-color);
    overflow: hidden;
  }
  .bar > span {
    display: block;
    height: 100%;
    background: var(--theme-primary);
  }
  @media (forced-colors: active) {
    :host {
      border-top-color: CanvasText;
      opacity: 1;
      color: CanvasText;
    }
    .bar {
      background: Canvas;
      border: var(--border-width-thin) solid CanvasText;
    }
    .bar > span {
      background: Highlight;
      forced-color-adjust: none;
    }
  }
`);

/** Coverage footer for the demo chrome. */
export class DemoCoverage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, styles];

  connectedCallback() {
    this.#render();
  }

  refresh() {
    this.#render();
  }

  #render() {
    const coverage = getCoverage();
    const pct = Math.min(100, Math.max(0, coverage.percent));
    this.shadowRoot.innerHTML = `
      <div aria-label="Conversion coverage for version ${coverage.referenceVersion}">
        <div>v${coverage.referenceVersion}</div>
        <div class="row"><span>Coverage</span><strong>${coverage.percent}%</strong></div>
        <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <span style="width:${pct}%"></span>
        </div>
        <div style="margin-top:var(--space-1-5)">${coverage.completed}/${coverage.total} elements</div>
      </div>
    `;
  }
}

if (!customElements.get('demo-coverage')) {
  customElements.define('demo-coverage', DemoCoverage);
}
