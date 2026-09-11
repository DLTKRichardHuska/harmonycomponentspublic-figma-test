import {
  HarmonyElement,
  createSheet,
  typographySheet,
  buttonSheet,
  cardSheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../elements/shared.js';
import { demoPageSheet } from './demoPageStyles.js';
import '../elements/DemoExample.js';
import '../elements/DemoCallout.js';
import '../elements/DemoConsumeSnippets.js';

const styles = createSheet(`
  .stack { gap: var(--space-4); max-width: 28rem; }
  .grid-2 {
    display: grid;
    gap: var(--space-4);
    max-width: 42rem;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  }
`);

export class DemoCardsPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, demoPageSheet, buttonSheet, cardSheet, styles];

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <demo-page-header title="Cards" scope="Card">
        <p>Cards contain content and actions about a single subject. Ship as native HTML + BEM classes, or optional light-DOM <code>&lt;harmony-card&gt;</code> that maps attributes and slot markers onto the same recipe.</p>
      </demo-page-header>

      <h2 id="examples">Examples</h2>

      <h3>Basic Card</h3>
      <demo-example>
        <p class="path-label">Native</p>
        <div class="stack">
          <article class="card">
            <div class="card__body">
              <p class="text-sm" style="margin:0">This is a basic card with some content. Cards are great for grouping related information together.</p>
            </div>
          </article>
        </div>
        <p class="path-label" style="margin-top: var(--space-4)">Hybrid</p>
        <div class="stack">
          <harmony-card>
            <p class="text-sm" style="margin:0">This is a basic card with some content. Cards are great for grouping related information together.</p>
          </harmony-card>
        </div>
      </demo-example>

      <h3>Card with Header</h3>
      <demo-example>
        <p class="path-label">Native</p>
        <div class="stack">
          <article class="card">
            <div class="card__header">
              <div class="card__header-content">
                <h2 class="card__header-title">Card Title</h2>
                <p class="card__header-subtitle">Subtitle or description</p>
              </div>
            </div>
            <div class="card__body">
              <p class="text-sm" style="margin:0">Card body content goes here. You can add any content you need.</p>
            </div>
          </article>
        </div>
        <p class="path-label" style="margin-top: var(--space-4)">Hybrid</p>
        <div class="stack">
          <harmony-card title="Card Title" subtitle="Subtitle or description">
            <p class="text-sm" style="margin:0">Card body content goes here. You can add any content you need.</p>
          </harmony-card>
        </div>
      </demo-example>

      <h3>Card with Header Icons</h3>
      <demo-example>
        <p class="muted" style="margin-top:0">Header actions compose catalog ghost icon-only buttons (not Astro <code>.card__icon-btn</code>). Icon-only buttons need an <code>aria-label</code>.</p>
        <p class="path-label">Native</p>
        <div class="stack">
          <article class="card">
            <div class="card__header">
              <div class="card__header-content">
                <h2 class="card__header-title">All Three Icons</h2>
              </div>
              <div class="card__header-actions">
                <button class="btn--ghost btn--icon-xs" type="button" aria-label="Settings">
                  <harmony-icon name="cog-6-tooth" size="sm"></harmony-icon>
                </button>
                <button class="btn--ghost btn--icon-xs" type="button" aria-label="More options">
                  <harmony-icon name="ellipsis-vertical" size="sm"></harmony-icon>
                </button>
                <button class="btn--ghost btn--icon-xs" type="button" aria-label="Close">
                  <harmony-icon name="x-mark" size="sm"></harmony-icon>
                </button>
              </div>
            </div>
            <div class="card__body">
              <p class="text-sm" style="margin:0">Card with close, menu, and settings icons.</p>
            </div>
          </article>
          <article class="card">
            <div class="card__header">
              <div class="card__header-content">
                <h2 class="card__header-title">Close Only</h2>
              </div>
              <div class="card__header-actions">
                <button class="btn--ghost btn--icon-xs" type="button" aria-label="Close">
                  <harmony-icon name="x-mark" size="sm"></harmony-icon>
                </button>
              </div>
            </div>
            <div class="card__body">
              <p class="text-sm" style="margin:0">A single icon always appears at the far right.</p>
            </div>
          </article>
          <article class="card">
            <div class="card__header">
              <div class="card__header-content">
                <h2 class="card__header-title">With Subtitle</h2>
                <p class="card__header-subtitle">Optional description</p>
              </div>
              <div class="card__header-actions">
                <button class="btn--ghost btn--icon-xs" type="button" aria-label="Settings">
                  <harmony-icon name="cog-6-tooth" size="sm"></harmony-icon>
                </button>
                <button class="btn--ghost btn--icon-xs" type="button" aria-label="More options">
                  <harmony-icon name="ellipsis-vertical" size="sm"></harmony-icon>
                </button>
                <button class="btn--ghost btn--icon-xs" type="button" aria-label="Close">
                  <harmony-icon name="x-mark" size="sm"></harmony-icon>
                </button>
              </div>
            </div>
            <div class="card__body">
              <p class="text-sm" style="margin:0">Icons also work alongside a header subtitle.</p>
            </div>
          </article>
        </div>
        <p class="path-label" style="margin-top: var(--space-4)">Hybrid</p>
        <div class="stack">
          <harmony-card title="All Three Icons">
            <button slot="header-actions" class="btn--ghost btn--icon-xs" type="button" aria-label="Settings">
              <harmony-icon name="cog-6-tooth" size="sm"></harmony-icon>
            </button>
            <button slot="header-actions" class="btn--ghost btn--icon-xs" type="button" aria-label="More options">
              <harmony-icon name="ellipsis-vertical" size="sm"></harmony-icon>
            </button>
            <button slot="header-actions" class="btn--ghost btn--icon-xs" type="button" aria-label="Close">
              <harmony-icon name="x-mark" size="sm"></harmony-icon>
            </button>
            <p class="text-sm" style="margin:0">Card with close, menu, and settings icons.</p>
          </harmony-card>
          <harmony-card title="Close Only">
            <button slot="header-actions" class="btn--ghost btn--icon-xs" type="button" aria-label="Close">
              <harmony-icon name="x-mark" size="sm"></harmony-icon>
            </button>
            <p class="text-sm" style="margin:0">A single icon always appears at the far right.</p>
          </harmony-card>
        </div>
      </demo-example>

      <h3>Elevated Card</h3>
      <demo-example>
        <div class="grid-2">
          <article class="card card--elevated">
            <div class="card__header">
              <div class="card__header-content">
                <h2 class="card__header-title">Elevated Card</h2>
              </div>
            </div>
            <div class="card__body">
              <p class="text-sm" style="margin:0">This card has a shadow to make it stand out from the page background.</p>
            </div>
          </article>
          <harmony-card elevated title="Elevated Card">
            <p class="text-sm" style="margin:0">This card has a shadow to make it stand out from the page background.</p>
          </harmony-card>
        </div>
        <p class="muted">Left: native. Right: <code>harmony-card</code>.</p>
      </demo-example>

      <h3>Interactive Card</h3>
      <demo-example>
        <p class="muted" style="margin-top:0">Native <code>.card--interactive</code> is CSS only — set keyboard/ARIA on the host. Prefer a real <code>&lt;a&gt;</code> for navigation, or <code>role="button"</code> + <code>tabindex="0"</code> for actions. Hybrid <code>interactive</code> applies button semantics automatically.</p>
        <p class="path-label">Native — link</p>
        <div class="stack">
          <a class="card card--interactive" href="#examples">
            <div class="card__header">
              <div class="card__header-content">
                <h2 class="card__header-title">Click Me</h2>
              </div>
            </div>
            <div class="card__body">
              <p class="text-sm" style="margin:0">Whole card as a link — native <code>&lt;a&gt;</code> supplies role and keyboard.</p>
            </div>
          </a>
        </div>
        <p class="path-label" style="margin-top: var(--space-4)">Native — button role</p>
        <div class="stack">
          <div
            class="card card--interactive"
            role="button"
            tabindex="0"
            aria-label="Click Me Too"
          >
            <div class="card__header">
              <div class="card__header-content">
                <h2 class="card__header-title">Click Me Too</h2>
              </div>
            </div>
            <div class="card__body">
              <p class="text-sm" style="margin:0">Non-link host: set <code>role="button"</code>, <code>tabindex="0"</code>, and handle Enter/Space in your app.</p>
            </div>
          </div>
        </div>
        <p class="path-label" style="margin-top: var(--space-4)">Hybrid</p>
        <div class="stack">
          <harmony-card interactive title="Click Me" aria-label="Click Me">
            <p class="text-sm" style="margin:0">Hybrid interactive — helper sets <code>role="button"</code>, focus, and Enter/Space.</p>
          </harmony-card>
        </div>
      </demo-example>

      <h3>Primary Border Card</h3>
      <demo-example>
        <div class="grid-2">
          <article class="card card--primary">
            <div class="card__header">
              <div class="card__header-content">
                <h2 class="card__header-title">Featured Card</h2>
              </div>
            </div>
            <div class="card__body">
              <p class="text-sm" style="margin:0">This card has a prominent 6px top border in the theme primary color to draw attention.</p>
            </div>
          </article>
          <harmony-card primary title="Featured Card">
            <p class="text-sm" style="margin:0">This card has a prominent 6px top border in the theme primary color to draw attention.</p>
          </harmony-card>
        </div>
      </demo-example>

      <h3>Primary Border + Other Variants</h3>
      <demo-example>
        <div class="grid-2">
          <article class="card card--primary card--elevated">
            <div class="card__header">
              <div class="card__header-content">
                <h2 class="card__header-title">Primary + Elevated</h2>
              </div>
            </div>
            <div class="card__body">
              <p class="text-sm" style="margin:0">Combines the primary border with elevation shadow.</p>
            </div>
          </article>
          <div
            class="card card--primary card--interactive"
            role="button"
            tabindex="0"
            aria-label="Primary + Interactive"
          >
            <div class="card__header">
              <div class="card__header-content">
                <h2 class="card__header-title">Primary + Interactive</h2>
              </div>
            </div>
            <div class="card__body">
              <p class="text-sm" style="margin:0">Native interactive host with <code>role="button"</code> and <code>tabindex="0"</code>.</p>
            </div>
          </div>
        </div>
        <p class="path-label" style="margin-top: var(--space-4)">Hybrid (same variants)</p>
        <div class="grid-2">
          <harmony-card primary elevated title="Primary + Elevated">
            <p class="text-sm" style="margin:0">Combines the primary border with elevation shadow.</p>
          </harmony-card>
          <harmony-card primary interactive title="Primary + Interactive" aria-label="Primary + Interactive">
            <p class="text-sm" style="margin:0">Combines the primary border with hover effects (CE button a11y).</p>
          </harmony-card>
        </div>
      </demo-example>

      <h3>Card with Footer</h3>
      <demo-example>
        <div class="grid-2">
          <article class="card">
            <div class="card__header">
              <div class="card__header-content">
                <h2 class="card__header-title">With Footer</h2>
              </div>
            </div>
            <div class="card__body">
              <p class="text-sm" style="margin:0">Footer ships in the CSS recipe even though the Astro docs page omits an example.</p>
            </div>
            <div class="card__footer">
              <button type="button" class="btn--secondary btn--sm">Cancel</button>
              <button type="button" class="btn--sm">Continue</button>
            </div>
          </article>
          <harmony-card title="With Footer">
            <p class="text-sm" style="margin:0">Footer ships in the CSS recipe even though the Astro docs page omits an example.</p>
            <button slot="footer" type="button" class="btn--secondary btn--sm">Cancel</button>
            <button slot="footer" type="button" class="btn--sm">Continue</button>
          </harmony-card>
        </div>
      </demo-example>

      <h2 id="props">API</h2>
      <demo-example>
        <h3>Native classes</h3>
        <table>
          <thead><tr><th>Class</th><th>Role</th></tr></thead>
          <tbody>
            <tr><td><code>.card</code></td><td>Base surface</td></tr>
            <tr><td><code>.card--elevated</code></td><td>Larger shadow</td></tr>
            <tr><td><code>.card--interactive</code></td><td>Hover + pointer (CSS only — add <code>role</code> / <code>tabindex</code> or use <code>&lt;a&gt;</code>)</td></tr>
            <tr><td><code>.card--primary</code></td><td>Primary top border</td></tr>
            <tr><td><code>.card__header</code> / <code>__body</code> / <code>__footer</code></td><td>Regions</td></tr>
            <tr><td><code>.card__header-actions</code></td><td>Action row — compose ghost icon-only buttons with <code>aria-label</code></td></tr>
          </tbody>
        </table>
        <h3 style="margin-top: var(--space-6)"><code>harmony-card</code> attributes</h3>
        <table>
          <thead><tr><th>Attribute</th><th>Type</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td><code>elevated</code></td><td>boolean</td><td>Larger shadow</td></tr>
            <tr><td><code>interactive</code></td><td>boolean</td><td>CSS + <code>role="button"</code>, focus, Enter/Space</td></tr>
            <tr><td><code>primary</code></td><td>boolean</td><td>Primary top border</td></tr>
            <tr><td><code>title</code></td><td>string</td><td>Header title when no <code>slot="header"</code> (also HTML tooltip)</td></tr>
            <tr><td><code>subtitle</code></td><td>string</td><td>Header subtitle when no <code>slot="header"</code></td></tr>
          </tbody>
        </table>
      </demo-example>

      <h2 id="accessibility">Accessibility</h2>
      <demo-callout heading="Semantic structure">
        <p class="muted" style="margin:0">Use header / body / footer regions and a sensible heading level for the title.</p>
      </demo-callout>
      <demo-callout heading="Interactive cards">
        <p class="muted" style="margin:0">Native: use <code>&lt;a class="card card--interactive"&gt;</code> for navigation, or <code>role="button"</code> + <code>tabindex="0"</code> (and Enter/Space handlers) on a non-link host. Hybrid <code>interactive</code> applies button semantics. Do not nest header/footer controls inside an interactive card.</p>
      </demo-callout>
      <demo-callout heading="Header actions">
        <p class="muted" style="margin:0">Icon-only buttons need an <code>aria-label</code>.</p>
      </demo-callout>

      <demo-callout tone="warning" style="margin-top: var(--space-6)">
        <strong>Accepted gaps.</strong> No Astro <code>icon1</code>–<code>icon3</code> or <code>.card__icon-btn</code> (compose ghost icon-xs). Kanban cards are separate catalog elements.
      </demo-callout>

      <h2>Import</h2>
      <demo-consume-snippets></demo-consume-snippets>
    `;

    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm =
      `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';\n` +
      `import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/vp/elements';\n\n` +
      `registerHarmonyElements();\n\n` +
      `<article class="card">\n` +
      `  <div class="card__body">Card body</div>\n` +
      `</article>\n` +
      `<harmony-card title="Card Title">Card body</harmony-card>`;
    consume.staticZip =
      `<link rel="stylesheet" href="/vendor/harmony/styles.css" />\n` +
      `<script type="module" src="/vendor/harmony/elements.js"></script>\n\n` +
      `<article class="card">\n` +
      `  <div class="card__body">Card body</div>\n` +
      `</article>\n` +
      `<harmony-card title="Card Title">Card body</harmony-card>`;
  }
}

if (!customElements.get('demo-cards-page')) {
  customElements.define('demo-cards-page', DemoCardsPage);
}
