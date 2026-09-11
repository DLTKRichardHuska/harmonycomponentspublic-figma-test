import { createSheet } from '@dltkrichardhuska/harmony-design-system-vanilla/elements';

export const ICON_SUN = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
export const ICON_MOON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
export const ICON_HAND = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-4 0v5"/><path d="M14 10V4a2 2 0 0 0-4 0v8"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.6-2.4L3 14.5"/></svg>`;
export const ICON_EYE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
export const ICON_MONITOR = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`;

export const foundationStyles = createSheet(`
  :host { display: block; }
  /* Page chrome only — scoped to top-level nodes so live specimens keep the
     package's own tag defaults. */
  demo-page-header { display: block; }
  :host > h1 { margin: 0 0 var(--space-2); }
  :host > h2 {
    margin: var(--space-8) 0 var(--space-3);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: var(--overline);
    font-weight: var(--font-semibold);
    letter-spacing: 0.1em;
    line-height: var(--leading-normal);
    text-transform: uppercase;
  }
  :host > p { max-width: 42rem; margin: 0 0 var(--space-4); }
  p { margin: 0 0 var(--space-4); }
  .lede { margin-bottom: var(--space-5); }
  .badge {
    display: inline-flex; align-items: center; gap: var(--space-1-5);
    font-size: var(--caption); padding: var(--space-1) var(--space-2-5); border-radius: var(--radius-full);
    background: var(--surface-bg); border: var(--border-width-thin) solid var(--border-color);
    color: var(--text-primary); margin: var(--space-2) 0 var(--space-4);
  }
  .grid { display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  .grid-2 { display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  .grid-3 { display: grid; gap: var(--space-4); grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
  .swatch {
    height: var(--space-20); border-radius: var(--radius-08);
    border: var(--border-width-thin) solid var(--border-color);
  }
  .swatch-meta { margin-top: var(--space-2); }
  .name { font-size: var(--label); font-weight: var(--font-semibold); color: var(--text-primary); }
  .mono { font-family: var(--font-mono, monospace); font-size: var(--caption); color: var(--text-muted); word-break: break-all; }
  .usage { font-size: var(--caption); color: var(--text-secondary); margin-top: var(--space-1); }
  demo-example h3 { margin: 0 0 var(--space-1-5); }
  .grid-2 > demo-example,
  .a11y > demo-example {
    margin-bottom: 0;
  }
  .a11y { display: grid; gap: var(--space-3); }
  .sample { color: var(--text-primary); margin: 0; }
  .type-card { display: grid; gap: var(--space-3); }
  .type-meta { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: var(--space-2); }
  .specimen > * { margin: 0; }
  .specimen p { max-width: none; }
  code { font-size: var(--caption); }
  .muted-cell { color: var(--text-muted); }
  .scale-table td { vertical-align: top; }
  .scale-table .mono { display: inline-block; margin-bottom: var(--space-0-5); }
  .code-sample {
    margin: var(--space-2) 0 0;
    padding: var(--space-4);
    border-radius: var(--radius-08);
    background: var(--surface-bg);
    color: var(--text-primary);
    overflow-x: auto;
  }
  .css-vars {
    margin: 0;
    padding: var(--space-3) var(--space-3-5);
    border: var(--border-width-thin) solid var(--border-color);
    border-radius: var(--radius-08);
    background: var(--surface-bg);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: var(--caption);
    line-height: var(--leading-relaxed);
    overflow-x: auto;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .space-row { display: flex; align-items: center; gap: var(--space-4); margin: var(--space-2) 0; }
  .space-bar { height: var(--space-6); background: var(--theme-primary); border-radius: var(--space-0-5); flex-shrink: 0; }
  .label-w { width: var(--space-12); font-size: var(--text-13); color: var(--text-muted); }
  .radius-box {
    height: var(--space-16); width: var(--space-16); margin: 0 auto;
    background: var(--theme-primary); border: var(--border-width-thin) solid var(--border-color);
  }
  .elev-card {
    padding: var(--space-6); text-align: center; border-radius: var(--radius-08);
    background: var(--card-bg); color: var(--text-primary);
  }
  .nav-links { display: flex; flex-wrap: wrap; gap: var(--space-3); margin: 0 0 var(--space-6); }
  .nav-links a { font-size: var(--label); }
  table { width: 100%; border-collapse: collapse; font-size: var(--label); }
  th, td { text-align: left; padding: var(--space-2); border-bottom: var(--border-width-thin) solid var(--border-color); color: var(--text-primary); }
  th { color: var(--text-secondary); font-weight: var(--font-semibold); }
  @media (forced-colors: active) {
    h1, h2, h3, .name, .sample, th, td { color: CanvasText; }
    p, .usage, .mono, .label-w, th { color: CanvasText; }
    .mono, .label-w { color: GrayText; }
    .badge, .css-vars {
      background: Canvas;
      border: var(--border-width-thin) solid CanvasText;
      color: CanvasText;
    }
    .swatch {
      border: var(--border-width-standard) solid CanvasText;
    }
    .space-bar, .radius-box {
      background: Highlight;
      border: var(--border-width-thin) solid CanvasText;
      forced-color-adjust: none;
    }
    .elev-card {
      background: Canvas;
      color: CanvasText;
      border: var(--border-width-standard) solid CanvasText;
      box-shadow: none !important;
    }
    .nav-links a { color: LinkText; }
    .nav-links a:focus-visible {
      outline: var(--border-width-standard) solid Highlight;
      outline-offset: var(--space-0-5);
    }
  }
`);

export function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function rgbToHex(rgb) {
  const values = rgb.match(/[\d.]+/g);
  if (!values || values.length < 3) return rgb;
  const r = parseInt(values[0], 10).toString(16).padStart(2, '0');
  const g = parseInt(values[1], 10).toString(16).padStart(2, '0');
  const b = parseInt(values[2], 10).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

export function displayColor(varName) {
  const value = cssVar(varName);
  if (!value) return '—';
  if (value.startsWith('#')) return value.toUpperCase();
  if (value.startsWith('rgba')) {
    const parts = value.match(/[\d.]+/g);
    if (parts && parts.length >= 4 && parseFloat(parts[3]) < 1) {
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${parseFloat(parts[3])})`;
    }
    return rgbToHex(value);
  }
  if (value.startsWith('rgb')) return rgbToHex(value);
  return value;
}

const SNIPPET_VARS = {
  colors: ['--page-bg', '--text-primary'],
  typography: ['--font-display', '--heading-l', '--font-semibold'],
  spacing: ['--space-4', '--radius-08'],
  elevations: ['--shadow-md', '--shadow-lg'],
};

export function importSnippets(kind) {
  const vars = SNIPPET_VARS[kind] ?? SNIPPET_VARS.colors;
  const npm = `import '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css';
// Use CSS variables: ${vars.map((name) => `var(${name})`).join(', ')}, …`;
  const staticZip = `<link rel="stylesheet" href="/vendor/harmony/styles.css" />
<!-- Tokens on :root / .dark — use var(${vars[0]}) -->`;
  return { npm, staticZip };
}

export const SEMANTIC_COLORS = [
  { name: 'Success', cssVar: '--color-success', usage: 'Positive feedback, success states' },
  { name: 'Warning', cssVar: '--color-warning', usage: 'Caution, warnings' },
  { name: 'Error', cssVar: '--color-error', usage: 'Errors, destructive actions' },
  { name: 'Info', cssVar: '--color-info', usage: 'Informational messages' },
];

export const LIGHT_PALETTE = [
  { name: 'Link', cssVar: '--link-color', usage: 'Text links' },
  { name: 'Page Background', cssVar: '--page-bg', usage: 'Main page background' },
  { name: 'Cell Background', cssVar: '--surface-bg', usage: 'Table cells, content areas' },
  { name: 'Card Background', cssVar: '--card-bg', usage: 'Cards, containers' },
  { name: 'Nav Background', cssVar: '--nav-bg', usage: 'Sidebar, header, navigation' },
  { name: 'Input Background', cssVar: '--input-bg', usage: 'Input fields' },
  { name: 'Input Disabled', cssVar: '--input-disabled-bg', usage: 'Disabled inputs' },
  { name: 'Table Total', cssVar: '--table-total-bg', usage: 'Table totals, summary rows' },
  { name: 'Border', cssVar: '--border-color', usage: 'Borders, dividers' },
  { name: 'Hover', cssVar: '--hover-bg', usage: 'Hover states' },
  { name: 'Title Text', cssVar: '--text-primary', usage: 'Primary text, titles' },
  { name: 'Secondary Text', cssVar: '--text-secondary', usage: 'Secondary text, labels' },
  { name: 'Muted Text', cssVar: '--text-muted', usage: 'Muted text, placeholders' },
];

/**
 * Typography styles and how to apply each one.
 *
 * `tag` is the element that gets the type style with no class (empty when the
 * style is class-only); `cssClass` applies it to any other element. Both ship in the
 * product stylesheet.
 */
export const TYPE_STYLES = [
  {
    group: 'display',
    name: 'Display XL',
    cssClass: 'text-display-xl',
    tag: '',
    sizeVar: '--display-xl',
    familyVar: '--font-display',
    weightVar: '--font-bold',
    leadingVar: '--leading-tight',
    markup: '<h1 class="text-display-xl">The quick brown fox</h1>',
    usage: 'Hero sections, marketing headlines',
  },
  {
    group: 'display',
    name: 'Display L',
    cssClass: 'text-display-l',
    tag: '',
    sizeVar: '--display-l',
    familyVar: '--font-display',
    weightVar: '--font-bold',
    leadingVar: '--leading-tight',
    markup: '<h2 class="text-display-l">The quick brown fox jumps</h2>',
    usage: 'Secondary hero content',
  },
  {
    group: 'display',
    name: 'Display M',
    cssClass: 'text-display-m',
    tag: '',
    sizeVar: '--display-m',
    familyVar: '--font-display',
    weightVar: '--font-bold',
    leadingVar: '--leading-tight',
    markup: '<h3 class="text-display-m">The quick brown fox jumps over</h3>',
    usage: 'High-impact section openers',
  },
  {
    group: 'heading',
    name: 'Heading XL',
    cssClass: 'text-heading-xl',
    tag: 'h1',
    sizeVar: '--heading-xl',
    familyVar: '--font-display',
    weightVar: '--font-semibold',
    leadingVar: '--leading-snug',
    markup: '<h1>Heading Extra Large</h1>',
    usage: 'Page titles',
  },
  {
    group: 'heading',
    name: 'Heading L',
    cssClass: 'text-heading-l',
    tag: 'h2',
    sizeVar: '--heading-l',
    familyVar: '--font-display',
    weightVar: '--font-semibold',
    leadingVar: '--leading-snug',
    markup: '<h2>Heading Large</h2>',
    usage: 'Major sections',
  },
  {
    group: 'heading',
    name: 'Heading M',
    cssClass: 'text-heading-m',
    tag: 'h3',
    sizeVar: '--heading-m',
    familyVar: '--font-display',
    weightVar: '--font-semibold',
    leadingVar: '--leading-snug',
    markup: '<h3>Heading Medium</h3>',
    usage: 'Subsections, card titles',
  },
  {
    group: 'heading',
    name: 'Heading S',
    cssClass: 'text-heading-s',
    tag: 'h4, h5, h6',
    sizeVar: '--heading-s',
    familyVar: '--font-display',
    weightVar: '--font-medium',
    leadingVar: '--leading-snug',
    markup: '<h4>Heading Small</h4>',
    usage: 'Dense groupings, panel titles',
  },
  {
    group: 'body',
    name: 'Body Default',
    cssClass: 'text-body-default',
    tag: 'p',
    sizeVar: '--body-default',
    familyVar: '--font-sans',
    weightVar: '--font-normal',
    leadingVar: '--leading-normal',
    markup:
      "<p>The quick brown fox jumps over the lazy dog. This is standard body text used for paragraphs, descriptions, and general content throughout the interface. It's optimized for readability at various screen sizes.</p>",
    usage: 'Paragraphs, descriptions, general content',
  },
  {
    group: 'body',
    name: 'Body Emphasized',
    cssClass: 'text-body-emphasized',
    tag: '',
    sizeVar: '--body-emphasized',
    familyVar: '--font-sans',
    weightVar: '--font-semibold',
    leadingVar: '--leading-normal',
    markup:
      '<p class="text-body-emphasized">The quick brown fox jumps over the lazy dog. This emphasized body text draws attention to key information while maintaining readability for longer passages.</p>',
    usage: 'Key information inside body copy',
  },
  {
    group: 'supporting',
    name: 'Label',
    cssClass: 'text-label',
    tag: 'label',
    sizeVar: '--label',
    familyVar: '--font-display',
    weightVar: '--font-normal',
    leadingVar: '--leading-normal',
    markup: '<label for="project">Form Field Label</label>',
    usage: 'Form fields, table headers, controls',
  },
  {
    group: 'supporting',
    name: 'Caption',
    cssClass: 'text-caption',
    tag: 'small',
    sizeVar: '--caption',
    familyVar: '--font-sans',
    weightVar: '--font-normal',
    leadingVar: '--leading-normal',
    markup: '<div class="text-caption">Last updated 2 hours ago • 5 min read</div>',
    usage: 'Metadata, helper text, timestamps',
  },
  {
    group: 'supporting',
    name: 'Overline',
    cssClass: 'text-overline',
    tag: '',
    sizeVar: '--overline',
    familyVar: '--font-sans',
    weightVar: '--font-semibold',
    leadingVar: '--leading-normal',
    markup: '<div class="text-overline">Featured article</div>',
    usage: 'Eyebrow labels above headings',
  },
];

export const FONT_FAMILIES = [
  {
    cssVar: '--font-display',
    cssClass: 'font-display',
    usage: 'Display, Heading, and Label styles (Lexend)',
  },
  { cssVar: '--font-sans', cssClass: 'font-sans', usage: 'Body text and UI chrome (Figtree)' },
  {
    cssVar: '--font-mono',
    cssClass: 'font-mono',
    usage: 'Code and technical content (JetBrains Mono)',
  },
];

export const FONT_WEIGHTS = [
  { cssVar: '--font-light', cssClass: 'font-light', usage: 'Rarely used — long-form display only' },
  { cssVar: '--font-normal', cssClass: 'font-normal', usage: 'Body, Caption, Label' },
  { cssVar: '--font-medium', cssClass: 'font-medium', usage: 'Heading S' },
  {
    cssVar: '--font-semibold',
    cssClass: 'font-semibold',
    usage: 'Heading XL–M, Body Emphasized, Overline',
  },
  { cssVar: '--font-bold', cssClass: 'font-bold', usage: 'Display styles' },
  { cssVar: '--font-extrabold', usage: 'Reserved for marketing surfaces' },
];

export const LINE_HEIGHTS = [
  { cssVar: '--leading-none', cssClass: 'leading-none', usage: 'Icon glyphs, single-line chips' },
  { cssVar: '--leading-tight', cssClass: 'leading-tight', usage: 'Display styles' },
  { cssVar: '--leading-snug', usage: 'Heading styles' },
  {
    cssVar: '--leading-normal',
    cssClass: 'leading-normal',
    usage: 'Body and supporting styles',
  },
  { cssVar: '--leading-relaxed', cssClass: 'leading-relaxed', usage: 'Code blocks, dense reading' },
];

/** Raw size ramp — prefer the type styles above; these cover one-off sizing. */
export const TEXT_SIZE_SCALE = [
  { cssVar: '--text-xs', cssClass: 'text-xs' },
  { cssVar: '--text-sm', cssClass: 'text-sm' },
  { cssVar: '--text-13' },
  { cssVar: '--text-base', cssClass: 'text-base' },
  { cssVar: '--text-lg', cssClass: 'text-lg' },
  { cssVar: '--text-xl', cssClass: 'text-xl' },
  { cssVar: '--text-2xl', cssClass: 'text-2xl' },
  { cssVar: '--text-3xl', cssClass: 'text-3xl' },
  { cssVar: '--text-4xl', cssClass: 'text-4xl' },
  { cssVar: '--text-5xl', cssClass: 'text-5xl' },
  { cssVar: '--text-6xl' },
];

export function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Live specimen rendered from real markup, shown next to the markup itself. */
export function renderTypeSpecimen(typeStyle) {
  const reach = typeStyle.tag
    ? `<code>&lt;${typeStyle.tag.split(',')[0].trim()}&gt;</code> by default · <code>.${typeStyle.cssClass}</code> anywhere`
    : `<code>.${typeStyle.cssClass}</code> on any element`;
  return `
    <demo-example class="type-card">
      <div class="specimen">${typeStyle.markup}</div>
      <div class="type-meta">
        <div>
          <div class="name">${typeStyle.name}</div>
          <div class="usage">${typeStyle.usage}</div>
          <div class="usage">${reach}</div>
        </div>
        <span class="mono" data-var="${typeStyle.sizeVar}">${typeStyle.sizeVar}</span>
      </div>
      <pre class="css-vars"><code>${escapeHtml(typeStyle.markup)}</code></pre>
    </demo-example>`;
}

export function renderTypeSpecimens(group) {
  return TYPE_STYLES.filter((typeStyle) => typeStyle.group === group)
    .map(renderTypeSpecimen)
    .join('');
}

/** Class / variable / computed value / usage table rows. */
export function renderVarRows(items) {
  return items
    .map(
      (item) => `
      <tr>
        <td>${item.cssClass ? `<code>.${item.cssClass}</code>` : '<span class="muted-cell">—</span>'}</td>
        <td><code>${item.cssVar}</code></td>
        <td class="mono" data-var="${item.cssVar}" data-value-only>—</td>
        <td>${item.usage ?? ''}</td>
      </tr>`,
    )
    .join('');
}

export const SPACING_SCALE = [
  '0', '0-5', '1', '1-5', '2', '2-5', '3', '3-5', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '16', '20', '24',
];

export const RADIUS_SCALE = [
  { name: 'radius-04', cssVar: '--radius-04' },
  { name: 'radius-08', cssVar: '--radius-08' },
  { name: 'radius-12', cssVar: '--radius-12' },
  { name: 'radius-16', cssVar: '--radius-16' },
  { name: 'radius-24', cssVar: '--radius-24' },
  { name: 'radius-100', cssVar: '--radius-100' },
];

export const SHADOWS = [
  { name: 'None', cssVar: '--shadow-none', fallback: 'none', description: 'No shadow, ground level', usage: '' },
  { name: 'SM', cssVar: '--shadow-sm', description: 'Subtle elevation for buttons and small elements', usage: 'Buttons, Inputs, Small cards' },
  { name: 'MD', cssVar: '--shadow-md', description: 'Medium elevation for floating elements and cards', usage: 'Floating menus, Popovers, Cards' },
  { name: 'LG', cssVar: '--shadow-lg', description: 'High elevation for prominent elements', usage: 'Modals, Dialogs, Notifications' },
  { name: 'XL', cssVar: '--shadow-xl', description: 'Extra high elevation for overlays', usage: 'Full-screen modals, Image lightboxes' },
  { name: '2XL', cssVar: '--shadow-2xl', description: 'Maximum elevation for dramatic effect', usage: 'Hero images, Featured content' },
];

export function renderSwatchGrid(items) {
  return items
    .map(
      (c) => `
    <div>
      <div class="swatch" style="background: var(${c.cssVar});"></div>
      <div class="swatch-meta">
        <div class="name">${c.name}</div>
        <div class="mono" data-var="${c.cssVar}">${c.cssVar}</div>
        <div class="usage">${c.usage || ''}</div>
      </div>
    </div>`,
    )
    .join('');
}

/**
 * Keep `[data-var]` nodes showing live token values.
 *
 * The product stylesheet link starts empty and is pointed at a product at
 * runtime, so values must be re-read when it loads or the product changes.
 */
export function attachValueRefresh(root) {
  const refresh = () => {
    root.querySelectorAll('[data-var]').forEach((el) => {
      const name = el.getAttribute('data-var');
      const val = displayColor(name);
      el.textContent = el.hasAttribute('data-value-only') ? val : `${name} · ${val}`;
    });
  };
  refresh();

  const observers = [new MutationObserver(refresh), new MutationObserver(refresh)];
  observers[0].observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-product'],
  });

  const link = document.getElementById('harmony-product-styles');
  if (link) {
    link.addEventListener('load', refresh);
    observers[1].observe(link, { attributes: true, attributeFilter: ['href'] });
  }

  return {
    disconnect() {
      for (const obs of observers) obs.disconnect();
      link?.removeEventListener('load', refresh);
    },
  };
}
