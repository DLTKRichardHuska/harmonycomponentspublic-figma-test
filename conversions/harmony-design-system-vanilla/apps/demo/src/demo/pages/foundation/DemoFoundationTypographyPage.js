import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { demoChromeSheet } from '../../elements/shared.js';
import '../../elements/DemoExample.js';
import '../../elements/DemoCallout.js';
import '../../elements/DemoConsumeSnippets.js';
import '../../elements/DemoImportSnippet.js';
import {
  ICON_HAND,
  ICON_EYE,
  foundationStyles,
  importSnippets,
  attachValueRefresh,
  renderTypeSpecimens,
  renderVarRows,
  TYPE_STYLES,
  FONT_FAMILIES,
  FONT_WEIGHTS,
  LINE_HEIGHTS,
  TEXT_SIZE_SCALE,
} from './foundationShared.js';

export class DemoFoundationTypographyPage extends HarmonyElement {
  static styles = [typographySheet, demoChromeSheet, foundationStyles];
  #obs;

  connectedCallback() {
    const { npm, staticZip } = importSnippets('typography');
    const usage = `<!-- Tags apply a type style by default -->
<h1>Page title</h1>
<p>Body copy.</p>

<!-- Classes apply a type style to any other element -->
<div class="text-overline">Featured</div>
<span class="text-caption">Updated 2 hours ago</span>

<!-- Or compose the variables directly -->
.custom-title {
  font-family: var(--font-display);
  font-size: var(--heading-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}`;

    const shadow = `import {
  HarmonyElement,
  typographySheet,
} from '@dltkrichardhuska/harmony-design-system-vanilla/elements';

// Document CSS does not pierce Shadow DOM — adopt the sheet to get the
// same tag defaults and .text-* classes inside your element.
class MyPanel extends HarmonyElement {
  static styles = [typographySheet, ownSheet];
}`;

    const scaleRows = TYPE_STYLES.map(
      (typeStyle) => `
        <tr>
          <td>${typeStyle.name}</td>
          <td>${typeStyle.tag ? typeStyle.tag.split(',').map((tag) => `<code>&lt;${tag.trim()}&gt;</code>`).join(' ') : '<span class="muted-cell">—</span>'}</td>
          <td><code>.${typeStyle.cssClass}</code></td>
          <td><span class="mono" data-var="${typeStyle.sizeVar}" data-value-only>—</span><br /><code>${typeStyle.sizeVar}</code></td>
          <td><span class="mono" data-var="${typeStyle.weightVar}" data-value-only>—</span><br /><code>${typeStyle.weightVar}</code></td>
          <td><span class="mono" data-var="${typeStyle.leadingVar}" data-value-only>—</span><br /><code>${typeStyle.leadingVar}</code></td>
          <td><span class="mono" data-var="${typeStyle.familyVar}" data-value-only>—</span><br /><code>${typeStyle.familyVar}</code></td>
        </tr>`,
    ).join('');

    const weightRows = FONT_WEIGHTS.map(
      (weight) => `
        <tr>
          <td>${weight.cssClass ? `<code>.${weight.cssClass}</code>` : '<span class="muted-cell">—</span>'}</td>
          <td><code>${weight.cssVar}</code></td>
          <td class="mono" data-var="${weight.cssVar}" data-value-only>—</td>
          <td class="${weight.cssClass ?? ''}">The quick brown fox</td>
          <td>${weight.usage}</td>
        </tr>`,
    ).join('');

    const sizeRows = TEXT_SIZE_SCALE.map(
      (size) => `
        <tr>
          <td>${size.cssClass ? `<code>.${size.cssClass}</code>` : '<span class="muted-cell">—</span>'}</td>
          <td><code>${size.cssVar}</code></td>
          <td class="mono" data-var="${size.cssVar}" data-value-only>—</td>
          <td style="font-size: var(${size.cssVar});">Aa</td>
        </tr>`,
    ).join('');

    this.shadowRoot.innerHTML = `
      <demo-page-header title="Typography" scope="Typography">
        <p class="lede">A typography system based on type styles and scale, not HTML tags. Display styles are for hero content, Headings for hierarchy, Body for content, and supporting styles for labels and captions.</p>
      </demo-page-header>
      <p>Loading the product stylesheet styles plain HTML for you — <code>&lt;h1&gt;</code> is Heading XL, <code>&lt;p&gt;</code> is Body Default. The <code>.text-*</code> classes apply any type style to any element, and the CSS variables are there when you need to compose your own rule. Every specimen below is live markup, shown with the exact source.</p>
      <nav class="nav-links">
        <a href="#apply">Apply a type style</a>
        <a href="#display">Display</a>
        <a href="#headings">Headings</a>
        <a href="#body">Body</a>
        <a href="#supporting">Supporting</a>
        <a href="#fonts">Fonts</a>
        <a href="#scale">Scale reference</a>
      </nav>

      <h2 id="apply">Apply a type style</h2>
      <demo-import-snippet></demo-import-snippet>
      <p>Inside a Custom Element, adopt the typography sheet:</p>
      <demo-import-snippet></demo-import-snippet>

      <h2 id="display">Display</h2>
      <p>Large, bold text for hero sections, marketing headlines, and high-impact moments. Display is class-only — no tag maps to it, so hero type never lands on a page by accident.</p>
      <div class="a11y">${renderTypeSpecimens('display')}</div>

      <h2 id="headings">Headings</h2>
      <p>Semantic hierarchy for page structure. Heading styles are what bare <code>&lt;h1&gt;</code>–<code>&lt;h6&gt;</code> tags produce.</p>
      <div class="a11y">${renderTypeSpecimens('heading')}</div>

      <h2 id="body">Body</h2>
      <p>Primary content text for readability and comprehension.</p>
      <div class="a11y">${renderTypeSpecimens('body')}</div>

      <h2 id="supporting">Supporting Styles</h2>
      <p>Smaller text for labels, captions, and supplementary information. Caption and Overline usually land on a <code>&lt;div&gt;</code> or <code>&lt;span&gt;</code>, so reach for the class.</p>
      <div class="a11y">${renderTypeSpecimens('supporting')}</div>

      <h2 id="fonts">Font Families</h2>
      <demo-example>
        <h3>Lexend — <code>.font-display</code> · <code>var(--font-display)</code></h3>
        <p class="usage">Used for Display, Heading, and Label styles</p>
        <p class="font-display text-2xl font-bold sample">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
        <p class="font-display text-2xl font-bold sample">abcdefghijklmnopqrstuvwxyz</p>
        <p class="font-display text-2xl font-bold sample">0123456789</p>
      </demo-example>
      <demo-example style="margin-top:var(--space-3);">
        <h3>Figtree — <code>.font-sans</code> · <code>var(--font-sans)</code></h3>
        <p class="usage">Used for Body text and UI elements</p>
        <p class="font-sans text-lg sample">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
        <p class="font-sans text-lg sample">abcdefghijklmnopqrstuvwxyz</p>
        <p class="font-sans text-lg sample">0123456789</p>
      </demo-example>
      <demo-example style="margin-top:var(--space-3);">
        <h3>JetBrains Mono — <code>.font-mono</code> · <code>var(--font-mono)</code></h3>
        <p class="usage">Used for code and technical content — <code>&lt;code&gt;</code>, <code>&lt;pre&gt;</code>, <code>&lt;kbd&gt;</code>, and <code>&lt;samp&gt;</code> get it by default</p>
        <code>const greeting = "Hello, World!";</code>
        <pre class="code-sample">function example() {
  return true;
}</pre>
      </demo-example>
      <p style="margin-top:var(--space-4);">Apps must load Figtree, Lexend, and JetBrains Mono (demo uses Google Fonts).</p>

      <h2 id="scale">Type Scale Reference</h2>
      <demo-example>
        <table class="scale-table">
          <thead><tr><th>Type style</th><th>Tag</th><th>Class</th><th>Size</th><th>Weight</th><th>Line height</th><th>Font</th></tr></thead>
          <tbody>${scaleRows}</tbody>
        </table>
      </demo-example>

      <h2>Font Family Variables</h2>
      <demo-example>
        <table>
          <thead><tr><th>Class</th><th>Variable</th><th>Computed value</th><th>Used for</th></tr></thead>
          <tbody>${renderVarRows(FONT_FAMILIES)}</tbody>
        </table>
      </demo-example>

      <h2>Font Weight Variables</h2>
      <demo-example>
        <table>
          <thead><tr><th>Class</th><th>Variable</th><th>Computed</th><th>Sample</th><th>Used for</th></tr></thead>
          <tbody>${weightRows}</tbody>
        </table>
      </demo-example>

      <h2>Line Height Variables</h2>
      <demo-example>
        <table>
          <thead><tr><th>Class</th><th>Variable</th><th>Computed value</th><th>Used for</th></tr></thead>
          <tbody>${renderVarRows(LINE_HEIGHTS)}</tbody>
        </table>
      </demo-example>

      <h2>Raw Size Ramp</h2>
      <p>Prefer the type styles above. This ramp covers one-off sizing that no type style describes.</p>
      <demo-example>
        <table>
          <thead><tr><th>Class</th><th>Variable</th><th>Computed</th><th>Sample</th></tr></thead>
          <tbody>${sizeRows}</tbody>
        </table>
      </demo-example>

      <h2>Usage Guidelines</h2>
      <div class="a11y">
        <demo-callout heading="Separate Visuals from Semantics">
          <span slot="icon">${ICON_HAND}</span>
          <p>Pick the tag for meaning and the class for looks. A dashboard title can be an <code>&lt;h1&gt;</code> wearing <code>.text-heading-m</code>; a hero headline can be an <code>&lt;h2&gt;</code> wearing <code>.text-display-xl</code>.</p>
        </demo-callout>
        <demo-callout heading="Accessibility">
          <span slot="icon">${ICON_EYE}</span>
          <p>Ensure proper heading hierarchy in HTML (H1 → H2 → H3) regardless of visual styling. Screen readers navigate by heading structure, not visual appearance.</p>
        </demo-callout>
      </div>

      <demo-consume-snippets heading="h2"></demo-consume-snippets>
    `;
    const snippets = this.shadowRoot.querySelectorAll('demo-import-snippet');
    snippets[0].code = usage;
    snippets[1].code = shadow;
    const consume = this.shadowRoot.querySelector('demo-consume-snippets');
    consume.npm = npm;
    consume.staticZip = staticZip;
    this.#obs = attachValueRefresh(this.shadowRoot);
  }

  disconnectedCallback() {
    this.#obs?.disconnect();
  }
}

if (!customElements.get('demo-foundation-typography-page')) {
  customElements.define('demo-foundation-typography-page', DemoFoundationTypographyPage);
}
