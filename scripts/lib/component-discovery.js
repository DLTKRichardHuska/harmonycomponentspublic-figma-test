/**
 * Component discovery: extract props (sizes, variants) from .astro files
 * and CSS variables from components.css. Build full spec key matrix.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');

const THEMES = ['cp', 'vp', 'ppm', 'maconomy'];
const MODES = ['light', 'dark'];

/** Component name -> CSS root class (when different from slug). */
const COMPONENT_CSS_PREFIX = {
  Button: 'btn',
  ButtonGroup: 'btn-group',
  DateTimePicker: 'datetime-picker',
  ProgressBar: 'progress',
  RadioButton: 'radio',
  Stepper: 'step',
  TabStrip: 'tab-panel',
  ShellHeader: 'header',
};

/** Components with structure in .astro or layout.css only, or no __ in CSS: return multi-element fallback. */
const HARDCODED_STRUCTURE = {
  Badge: {
    elements: [
      { selector: '.badge', tag: 'span', styles: {}, children: ['.badge__content'] },
      { selector: '.badge__content', tag: 'span', styles: {}, parent: '.badge' },
    ],
    modifiers: [],
  },
  ButtonGroup: {
    elements: [
      { selector: '.btn-group', tag: 'div', styles: {}, children: ['.btn-group__inner'] },
      { selector: '.btn-group__inner', tag: 'div', styles: {}, parent: '.btn-group' },
    ],
    modifiers: [],
  },
  Icon: {
    elements: [
      { selector: '.icon', tag: 'span', styles: {}, children: ['.icon__svg'] },
      { selector: '.icon__svg', tag: 'svg', styles: {}, parent: '.icon' },
    ],
    modifiers: [],
  },
  Link: {
    elements: [
      { selector: '.link', tag: 'a', styles: {}, children: ['.link__text'] },
      { selector: '.link__text', tag: 'span', styles: {}, parent: '.link' },
    ],
    modifiers: [],
  },
  NotificationBadge: {
    elements: [
      { selector: '.notification-badge', tag: 'span', styles: {}, children: ['.notification-badge__content'] },
      { selector: '.notification-badge__content', tag: 'span', styles: {}, parent: '.notification-badge' },
    ],
    modifiers: [],
  },
  ShellFooter: {
    elements: [
      { selector: '.shell-footer', tag: 'div', styles: {}, children: ['.shell-footer__tabstrip'] },
      { selector: '.shell-footer__tabstrip', tag: 'div', styles: {}, parent: '.shell-footer' },
    ],
    modifiers: [],
  },
  ShellPageHeader: {
    elements: [
      { selector: '.shell-page-header', tag: 'header', styles: {}, children: ['.shell-page-header__left', '.shell-page-header__actions'] },
      { selector: '.shell-page-header__left', tag: 'div', styles: {}, parent: '.shell-page-header' },
      { selector: '.shell-page-header__title', tag: 'h1', styles: {}, parent: '.shell-page-header' },
      { selector: '.shell-page-header__subtitle', tag: 'p', styles: {}, parent: '.shell-page-header' },
      { selector: '.shell-page-header__actions', tag: 'div', styles: {}, parent: '.shell-page-header' },
    ],
    modifiers: [],
  },
  Spinner: {
    elements: [
      { selector: '.spinner', tag: 'div', styles: {}, children: ['.spinner__content'] },
      { selector: '.spinner__content', tag: 'span', styles: {}, parent: '.spinner' },
    ],
    modifiers: [],
  },
  TabStrip: {
    elements: [
      { selector: '.tab-panel', tag: 'div', styles: {}, children: ['.tab-panel__content'] },
      { selector: '.tab-panel__content', tag: 'div', styles: {}, parent: '.tab-panel' },
    ],
    modifiers: [],
  },
};

/**
 * Component name (PascalCase) to CSS class prefix (e.g. Avatar -> avatar).
 * @param {string} componentName
 * @returns {string}
 */
function componentNameToSlug(componentName) {
  if (!componentName) return '';
  const s = componentName.replace(/([A-Z])/g, '-$1').toLowerCase();
  return s.replace(/^-/, '');
}

/**
 * Resolve path to component .astro file.
 * @param {string} componentName - e.g. 'Avatar'
 * @returns {string} Absolute path to src/components/ui/Avatar.astro
 */
export function getComponentPath(componentName) {
  return path.join(ROOT, 'src', 'components', 'ui', `${componentName}.astro`);
}

/**
 * Extract size and variant prop values from an .astro (or .ts) component file.
 * Uses regex to find patterns like: size?: 'sm' | 'md' | 'lg' or variant?: 'primary' | 'secondary'
 * @param {string} componentPath - Absolute or relative path to .astro file
 * @returns {{ sizes: string[], variants: string[] }}
 */
export function discoverComponentProps(componentPath) {
  const filePath = path.isAbsolute(componentPath) ? componentPath : path.join(ROOT, componentPath);
  const content = fs.readFileSync(filePath, 'utf-8');

  const sizes = [];
  const variants = [];

  // size?: 'sm' | 'md' | 'lg' or size?: "xs" | "sm" | "md" | "lg"
  const sizeMatch = content.match(/size\??\s*:\s*([^;}\n]+)/);
  if (sizeMatch) {
    const quoted = sizeMatch[1].match(/['"](\w+)['"]/g);
    if (quoted) sizes.push(...quoted.map((q) => q.slice(1, -1)));
  }

  // variant?: 'primary' | 'secondary' | ...
  const variantMatch = content.match(/variant\??\s*:\s*([^;}\n]+)/);
  if (variantMatch) {
    const quoted = variantMatch[1].match(/['"](\w+)['"]/g);
    if (quoted) variants.push(...quoted.map((q) => q.slice(1, -1)));
  }

  return {
    sizes: [...new Set(sizes)],
    variants: [...new Set(variants)],
  };
}

/**
 * Find CSS rules for this component (e.g. .avatar, .avatar--sm, .avatar__icon)
 * and extract all var(--*) variable names (without the -- prefix).
 * @param {string} componentName - e.g. 'Avatar'
 * @param {string} cssPath - Path to components.css (relative to project root or absolute)
 * @returns {{ variables: string[] }}
 */
export function discoverComponentVariables(componentName, cssPath = 'src/styles/components.css') {
  const slug = componentNameToSlug(componentName);
  if (!slug) return { variables: [] };

  const filePath = path.isAbsolute(cssPath) ? cssPath : path.join(ROOT, cssPath);
  const content = fs.readFileSync(filePath, 'utf-8');

  const variables = new Set();

  // Find rule blocks: .avatar, .avatar--sm, .avatar__icon
  const escapedSlug = slug.replace(/-/g, '[-]');
  const selectorPattern = new RegExp(
    `\\.${escapedSlug}(?:--[\\w-]*|__[\\w-]*)?\\s*\\{`,
    'g'
  );

  let match;
  while ((match = selectorPattern.exec(content)) !== null) {
    const blockStart = match.index + match[0].length;
    let depth = 1;
    let pos = blockStart;
    while (pos < content.length && depth > 0) {
      const ch = content[pos];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      pos++;
    }
    const block = content.slice(blockStart, pos - 1);
    const varMatches = block.matchAll(/var\s*\(\s*--([\w-]+)\s*\)/g);
    for (const vm of varMatches) variables.add(vm[1]);
  }

  return { variables: [...variables].sort() };
}

/**
 * Parse CSS content into list of { selector, block } (only top-level rules; skips @media body).
 * @param {string} content - Full CSS file content
 * @returns {{ selector: string, block: string }[]}
 */
function parseCssRules(content) {
  const rules = [];
  let pos = 0;
  while (pos < content.length) {
    const open = content.indexOf('{', pos);
    if (open === -1) break;
    const selectorStr = content.slice(pos, open).trim();
    let depth = 1;
    let close = open + 1;
    while (close < content.length && depth > 0) {
      const ch = content[close];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      close++;
    }
    const block = content.slice(open + 1, close - 1);
    if (!selectorStr.startsWith('@')) rules.push({ selector: selectorStr, block });
    pos = close;
  }
  return rules;
}

/**
 * Extract style declarations from a CSS block (property: value;).
 * @param {string} block - Content inside { }
 * @returns {Record<string, string>}
 */
function parseDeclarations(block) {
  const styles = {};
  const regex = /([a-zA-Z-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = regex.exec(block)) !== null) {
    const prop = m[1].trim();
    const value = m[2].trim();
    if (prop && value) styles[prop] = value;
  }
  return styles;
}

/**
 * Normalize a full selector to the component-relevant class (first class that matches prefix).
 * E.g. ".btn--primary:hover" -> ".btn--primary", ".dialog-overlay.is-open" -> ".dialog-overlay"
 * @param {string} fullSelector - e.g. ".btn, .btn--primary"
 * @param {string} prefix - e.g. "btn"
 * @returns {string[]} Unique normalized selectors (e.g. [".btn", ".btn--primary"])
 */
function normalizedSelectorsForRule(fullSelector, prefix) {
  const out = new Set();
  const parts = fullSelector.split(',').map((s) => s.trim());
  const escaped = prefix.replace(/-/g, '[-]');
  const prefixRe = new RegExp(`\\.${escaped}(?:__[\\w-]+|--[\\w-]+)?(?!\\S)`);
  const anyPrefixRe = new RegExp(`\\.${escaped}(?:[-_]?[\\w-]*)*`, 'g');
  for (const part of parts) {
    const firstClassMatch = part.match(anyPrefixRe);
    if (!firstClassMatch) continue;
    const firstClass = firstClassMatch[0];
    if (!firstClass.startsWith('.' + prefix) && !firstClass.startsWith('.' + prefix + '-')) continue;
    out.add(firstClass);
  }
  return [...out];
}

/**
 * Discover component structure from components.css: selectors (root, __children, --modifiers) and their styles.
 * @param {string} componentName - e.g. 'Button', 'Alert', 'Dialog'
 * @param {string} cssPath - Path to components.css (relative to project root or absolute)
 * @returns {{ elements: { selector: string, tag: string, styles: Record<string, string>, children?: string[], parent?: string }[], modifiers: string[] }}
 */
export function discoverComponentStructure(componentName, cssPath = 'src/styles/components.css') {
  if (HARDCODED_STRUCTURE[componentName]) {
    const fromCss = discoverComponentStructureFromCss(componentName, cssPath);
    if (fromCss.elements.length <= 1) return HARDCODED_STRUCTURE[componentName];
  }

  return discoverComponentStructureFromCss(componentName, cssPath);
}

function discoverComponentStructureFromCss(componentName, cssPath) {
  const prefix = COMPONENT_CSS_PREFIX[componentName] ?? componentNameToSlug(componentName);
  if (!prefix) return { elements: [], modifiers: [] };

  const filePath = path.isAbsolute(cssPath) ? cssPath : path.join(ROOT, cssPath);
  let content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';

  if (prefix === 'header') {
    const layoutPath = path.join(ROOT, 'src/styles/layout.css');
    if (fs.existsSync(layoutPath)) content += '\n' + fs.readFileSync(layoutPath, 'utf-8');
  }

  if (!content.trim()) {
    if (HARDCODED_STRUCTURE[componentName]) return HARDCODED_STRUCTURE[componentName];
    return { elements: [], modifiers: [] };
  }

  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = parseCssRules(content);

  const escaped = prefix.replace(/-/g, '[-]');
  const selectorBelongsToComponent = (sel) => {
    const s = sel.trim();
    if (prefix === 'btn') {
      return s === '.btn' || s.startsWith('.btn__') || s.startsWith('.btn--');
    }
    if (prefix === 'header') {
      return s === '.header' || s.startsWith('.header__') || s.startsWith('.header--');
    }
    if (prefix === 'btn-group') {
      return s === '.btn-group' || s.startsWith('.btn-group__') || s.startsWith('.btn-group--');
    }
    return (
      s === '.' + prefix ||
      s.startsWith('.' + prefix + '__') ||
      s.startsWith('.' + prefix + '--') ||
      s.startsWith('.' + prefix + '-')
    );
  };

  const selectorToBase = (sel) => {
    const s = sel.trim();
    if (s.startsWith('.' + prefix + '__')) return s;
    if (s.startsWith('.' + prefix + '--')) return s;
    if (s.startsWith('.' + prefix + '-') && s.indexOf('__') === -1 && s.indexOf('--') === -1)
      return s;
    return '.' + prefix;
  };

  const bySelector = new Map();
  const modifiers = new Set();

  for (const { selector: ruleSelector, block } of rules) {
    const normalizedList = normalizedSelectorsForRule(ruleSelector, prefix);
    const isBaseRule =
      !ruleSelector.includes(':') &&
      !ruleSelector.includes('.is-') &&
      ruleSelector.split(',').every((part) => !part.trim().includes(' ')) &&
      normalizedList.some((n) => {
        const base = n.trim();
        return (
          base === '.' + prefix ||
          base.startsWith('.' + prefix + '__') ||
          (base.startsWith('.' + prefix + '-') && base !== '.' + prefix && !base.includes('--'))
        );
      });
    for (const norm of normalizedList) {
      const base = norm.trim();
      if (!selectorBelongsToComponent(base)) continue;
      if (base.includes('--')) {
        modifiers.add(base);
        continue;
      }
      const key = base.startsWith('.' + prefix + '__')
        ? base
        : base.startsWith('.' + prefix + '-') && !base.startsWith('.' + prefix + '--')
          ? base
          : '.' + prefix;
      if (!bySelector.has(key)) bySelector.set(key, {});
      if (isBaseRule) {
        const decl = parseDeclarations(block);
        Object.assign(bySelector.get(key), decl);
      }
    }
  }

  const rootSelectors = [];
  const elementSelectors = [];
  for (const sel of bySelector.keys()) {
    if (sel === '.' + prefix) rootSelectors.push(sel);
    else if (sel.startsWith('.' + prefix + '__')) elementSelectors.push(sel);
    else if (sel.startsWith('.' + prefix + '-') && !sel.startsWith('.' + prefix + '--'))
      rootSelectors.push(sel);
  }
  rootSelectors.sort((a, b) => b.length - a.length);
  elementSelectors.sort();

  const defaultRootTag =
    componentName === 'Button'
      ? 'button'
      : componentName === 'Input'
        ? 'input'
        : componentName === 'Label'
          ? 'label'
          : 'div';

  const rootKey = '.' + prefix;
  const innermostRoot =
    rootSelectors.length > 1 ? rootSelectors[rootSelectors.length - 1] : rootKey;

  const elements = [];
  for (const rootSel of rootSelectors) {
    const isInnermost = rootSel === innermostRoot;
    const children = isInnermost
      ? [...elementSelectors]
      : [rootSelectors[rootSelectors.indexOf(rootSel) + 1]].filter(Boolean);
    const el = {
      selector: rootSel,
      tag: rootSel === rootKey ? defaultRootTag : 'div',
      styles: bySelector.get(rootSel) || {},
    };
    if (children.length) el.children = children;
    if (rootSel !== rootKey) el.parent = rootSelectors[rootSelectors.indexOf(rootSel) - 1] || null;
    elements.push(el);
  }
  for (const sel of elementSelectors) {
    elements.push({
      selector: sel,
      tag: 'span',
      styles: bySelector.get(sel) || {},
      parent: innermostRoot,
    });
  }

  if (elements.length <= 1 && HARDCODED_STRUCTURE[componentName]) {
    return HARDCODED_STRUCTURE[componentName];
  }

  return {
    elements,
    modifiers: [...modifiers].sort(),
  };
}

/**
 * Build full spec key matrix for a component: theme-mode-size or variant-theme-mode-size.
 * @param {string} componentName - e.g. 'Avatar'
 * @returns {string[]} Spec keys (e.g. ['cp-light-sm', 'cp-light-md', ...])
 */
export function buildSpecMatrix(componentName) {
  const componentPath = getComponentPath(componentName);
  if (!fs.existsSync(componentPath)) {
    return [];
  }

  const { sizes, variants } = discoverComponentProps(componentPath);
  const keys = [];

  const themeModePairs = THEMES.flatMap((theme) => MODES.map((mode) => ({ theme, mode })));
  const variantsAreThemes = variants.length > 0 && variants.every((v) => THEMES.includes(v));

  if (variants.length > 0 && sizes.length > 0) {
    for (const v of variants) {
      for (const { theme, mode } of themeModePairs) {
        for (const size of sizes) {
          keys.push(`${v}-${theme}-${mode}-${size}`);
        }
      }
    }
  } else if (variantsAreThemes && sizes.length === 0) {
    for (const theme of variants) {
      for (const mode of MODES) {
        keys.push(`${theme}-${mode}`);
      }
    }
  } else if (variants.length > 0) {
    for (const v of variants) {
      for (const { theme, mode } of themeModePairs) {
        keys.push(`${v}-${theme}-${mode}`);
      }
    }
  } else if (sizes.length > 0) {
    for (const { theme, mode } of themeModePairs) {
      for (const size of sizes) {
        keys.push(`${theme}-${mode}-${size}`);
      }
    }
  } else {
    for (const { theme, mode } of themeModePairs) {
      keys.push(`${theme}-${mode}`);
    }
  }

  return keys;
}

// --- Run test when executed directly ---
if (import.meta.url === `file://${process.argv[1]}`) {
  const testStructure = process.argv[2] === '--structure';
  if (testStructure) {
    for (const name of ['Button', 'Alert', 'Dialog']) {
      console.log(`\n=== ${name} discovered structure ===`);
      const out = discoverComponentStructure(name);
      console.log(JSON.stringify(out, null, 2));
    }
    process.exit(0);
  }

  const componentName = 'Avatar';
  const componentPath = getComponentPath(componentName);

  console.log('=== Discovered props (Avatar.astro) ===');
  const props = discoverComponentProps(componentPath);
  console.log('  sizes:', props.sizes);
  console.log('  variants:', props.variants);

  console.log('\n=== Discovered CSS variables (Avatar) ===');
  const vars = discoverComponentVariables(componentName);
  console.log('  variables:', vars.variables);

  console.log('\n=== Full spec matrix (Avatar) ===');
  const matrix = buildSpecMatrix(componentName);
  console.log('  count:', matrix.length);
  console.log('  keys:', matrix);
}
