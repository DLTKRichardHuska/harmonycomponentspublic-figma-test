/**
 * Component discovery: extract props (sizes, variants) from .astro files
 * and CSS variables from components.css. Build full spec key matrix.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { selectorFromAstNode } from '../astro-parser.js';
import { COMPONENT_DIMENSIONS, DIMENSION_KEY_ORDER, getDimensionValuesForComponent } from './dimension-config.js';

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
  TabStrip: 'tabstrip',
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
      { selector: '.tabstrip', tag: 'div', styles: {}, children: ['.tabstrip__nav', '.tabstrip__container'] },
      { selector: '.tabstrip__nav', tag: 'nav', styles: {}, parent: '.tabstrip' },
      { selector: '.tabstrip__container', tag: 'div', styles: {}, parent: '.tabstrip', children: ['.tabstrip__tabs'] },
      { selector: '.tabstrip__tabs', tag: 'div', styles: {}, parent: '.tabstrip__container' },
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

/** Pseudo-classes we treat as states. */
const STATE_PSEUDOS = ['hover', 'focus', 'active', 'disabled', 'focus-visible', 'focus-within'];

/**
 * Normalize state name to camelCase for use in state keys (e.g. focus-visible -> focusVisible).
 * @param {string} state - e.g. 'hover', 'focus-visible'
 * @returns {string}
 */
function stateToKeySegment(state) {
  if (!state.includes('-')) return state.charAt(0).toUpperCase() + state.slice(1);
  return state
    .split('-')
    .map((seg, i) => (i === 0 ? seg.charAt(0).toUpperCase() + seg.slice(1) : seg.charAt(0).toUpperCase() + seg.slice(1)))
    .join('');
}

/**
 * Parse a compound selector of the form "ancestor:pseudo descendant" (exactly two segments).
 * Used to capture descendant states: styles applied to a descendant when an ancestor has a pseudo state.
 * @param {string} part - e.g. ".right-sidebar:hover .right-sidebar__label"
 * @param {string} prefix - e.g. "right-sidebar"
 * @returns {{ ancestor: string, state: string, descendant: string } | null}
 */
function parseDescendantState(part, prefix) {
  const segments = part.trim().split(/\s+/).filter(Boolean);
  if (segments.length !== 2) return null;
  let ancestorSegment = null;
  let state = null;
  for (const seg of segments) {
    for (const p of STATE_PSEUDOS) {
      const pseudo = ':' + p;
      if (seg.includes(pseudo)) {
        if (ancestorSegment != null) return null;
        ancestorSegment = seg;
        state = p;
        break;
      }
    }
  }
  if (ancestorSegment == null || state == null) return null;
  const descendantSegment = segments.find((s) => s !== ancestorSegment);
  if (!descendantSegment) return null;
  const ancestor = ancestorSegment.replace(/:[a-z-]+(?:\([^)]*\))?/gi, '').trim();
  return { ancestor, state, descendant: descendantSegment };
}

/**
 * Split selector into base (no pseudo) and state name.
 * For compound selectors (e.g. ".alert--info .alert__close:hover"), returns the element that has the pseudo.
 * @param {string} selector - e.g. ".alert__close:hover" or ".alert--info .alert__close:hover"
 * @param {string} prefix - e.g. "alert"
 * @returns {{ base: string, state: string } | null}
 */
function parseSelectorState(selector, prefix) {
  const trimmed = selector.trim();
  for (const state of STATE_PSEUDOS) {
    const pseudo = ':' + state;
    const idx = trimmed.indexOf(pseudo);
    if (idx === -1) continue;
    const beforePseudo = trimmed.slice(0, idx).trim();
    const parts = beforePseudo.split(/\s+/).filter(Boolean);
    const escaped = prefix.replace(/-/g, '[-]');
    const classRe = new RegExp(`\\.${escaped}(?:__[\\w-]+|--[\\w-]+)?`);
    const lastPart = parts[parts.length - 1] || beforePseudo;
    const base = lastPart.match(classRe) ? lastPart : beforePseudo;
    return { base, state };
  }
  return null;
}

/**
 * From a compound selector (e.g. ".alert--info .alert__icon"), extract modifier class and target element selector.
 * @param {string} ruleSelector - single part (no comma)
 * @param {string} prefix - e.g. "alert"
 * @returns {{ modifier: string, element: string } | null}
 */
function parseCompoundModifierElement(ruleSelector, prefix) {
  const parts = ruleSelector.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return null;
  let modifier = null;
  let element = null;
  const escaped = prefix.replace(/-/g, '[-]');
  const classRe = new RegExp(`\\.${escaped}(?:__[\\w-]+|--[\\w-]+)?`);
  for (const part of parts) {
    const clean = part.replace(/:[\w-]+(?:\([^)]*\))?/g, '').trim();
    if (!classRe.test(clean)) continue;
    if (clean.includes('--')) modifier = clean;
    else if (clean === '.' + prefix || clean.startsWith('.' + prefix + '__')) element = clean;
  }
  if (modifier && element) return { modifier, element };
  if (modifier && parts.some((p) => p.startsWith('.' + prefix + '__')))
    element = parts.find((p) => p.startsWith('.' + prefix + '__')).replace(/:[\w-]+(?:\([^)]*\))?/g, '').trim();
  if (modifier && !element) element = '.' + prefix;
  return modifier && element ? { modifier, element } : null;
}

/**
 * Build structure object and selector→parent map from AST structure (extractDetailedStructure output).
 * @param {Object} astStructure - { root: { element, class, children }, children }
 * @param {string} componentSlug - e.g. 'alert', 'dialog'
 * @returns {{ structure: { root: string, children: Array }, selectorToParent: Record<string, string> }}
 */
export function buildStructureFromAst(astStructure, componentSlug) {
  const selectorToParent = {};
  if (!astStructure?.root) {
    return { structure: { root: '', children: [] }, selectorToParent };
  }

  function nodeToStructureNode(node, parentSelector) {
    const sel = selectorFromAstNode(node);
    if (!sel) return null;
    if (parentSelector) selectorToParent[sel] = parentSelector;
    const out = { class: sel };
    const kids = node.children || [];
    if (kids.length) {
      out.children = kids
        .map((c) => nodeToStructureNode(c, sel))
        .filter(Boolean);
    }
    return out;
  }

  let rootSel = selectorFromAstNode(astStructure.root);
  const fallbackRoot = '.' + componentSlug.replace(/-/g, '-');
  const useFallbackRoot = !rootSel || rootSel === '.classes';
  if (useFallbackRoot) rootSel = fallbackRoot;
  if (!rootSel) {
    return { structure: { root: '', children: [] }, selectorToParent };
  }

  const rootChildren = (astStructure.root.children || [])
    .map((c) => nodeToStructureNode(c, rootSel))
    .filter(Boolean);

  const structure = {
    root: rootSel,
    children: rootChildren,
  };

  return { structure, selectorToParent };
}

/**
 * Discover component structure from components.css: selectors (root, __children, --modifiers) and their styles.
 * When options.astStructure is provided (from extractDetailedStructure), element parents and a structure tree are derived from the AST.
 * @param {string} componentName - e.g. 'Button', 'Alert', 'Dialog'
 * @param {string} cssPath - Path to components.css (relative to project root or absolute)
 * @param {{ astStructure?: Object }} options - Optional. astStructure from parseComponent(...).structure
 * @returns {{ elements: Array, modifiers: string[], structure?: Object, ... }}
 */
const EMPTY_DISCOVERY_EXTRA = {
  modifierRootStyles: {},
  modifierElementStyles: {},
  stateStyles: {},
  descendantStateStyles: {},
};

export function discoverComponentStructure(componentName, cssPath = 'src/styles/components.css', options = {}) {
  if (HARDCODED_STRUCTURE[componentName]) {
    const fromCss = discoverComponentStructureFromCss(componentName, cssPath);
    if (fromCss.elements.length <= 1) {
      const result = {
        ...HARDCODED_STRUCTURE[componentName],
        modifierRootStyles: fromCss.modifierRootStyles || {},
        modifierElementStyles: fromCss.modifierElementStyles || {},
        stateStyles: fromCss.stateStyles || {},
        descendantStateStyles: fromCss.descendantStateStyles || {},
      };
      if (options.astStructure) {
        const slug = componentNameToSlug(componentName);
        const { structure, selectorToParent } = buildStructureFromAst(options.astStructure, slug);
        if (structure.root) {
          result.structure = structure;
          result.elements = (result.elements || []).map((el) => ({
            ...el,
            parent: selectorToParent[el.selector] ?? el.parent,
          }));
        }
      }
      return result;
    }
  }

  const fromCss = discoverComponentStructureFromCss(componentName, cssPath);
  if (!options.astStructure) return fromCss;

  const slug = componentNameToSlug(componentName);
  const { structure, selectorToParent } = buildStructureFromAst(options.astStructure, slug);
  const result = {
    ...fromCss,
    elements: fromCss.elements.map((el) => ({
      ...el,
      parent: selectorToParent[el.selector] ?? el.parent,
    })),
  };
  if (structure.root) result.structure = structure;
  return result;
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
  /** Modifier root: modifier selector -> styles applied to root element (e.g. .alert--info -> styles for .alert). */
  const modifierRootStyles = {};
  /** Modifier + element: modifier -> element selector -> styles (e.g. .alert--info -> .alert__icon -> styles). */
  const modifierElementStyles = {};
  /** State: element selector -> state name -> styles (e.g. .alert__close -> hover -> styles). */
  const stateStyles = {};
  /** Descendant state: descendant selector -> stateKey (e.g. rootHover) -> styles. When root has pseudo, descendant gets these styles. */
  const descendantStateStyles = {};

  const rootKey = '.' + prefix;

  for (const { selector: ruleSelector, block } of rules) {
    const decl = parseDeclarations(block);
    const parts = ruleSelector.split(',').map((s) => s.trim());

    for (const part of parts) {
      const hasSpace = part.includes(' ');
      const hasPseudo = STATE_PSEUDOS.some((p) => part.includes(':' + p));

      if (hasPseudo && hasSpace) {
        const descendantParsed = parseDescendantState(part, prefix);
        if (
          descendantParsed &&
          selectorBelongsToComponent(descendantParsed.ancestor) &&
          selectorBelongsToComponent(descendantParsed.descendant) &&
          descendantParsed.ancestor === rootKey
        ) {
          const stateKey = 'root' + stateToKeySegment(descendantParsed.state);
          if (!descendantStateStyles[descendantParsed.descendant]) descendantStateStyles[descendantParsed.descendant] = {};
          if (!descendantStateStyles[descendantParsed.descendant][stateKey]) descendantStateStyles[descendantParsed.descendant][stateKey] = {};
          Object.assign(descendantStateStyles[descendantParsed.descendant][stateKey], decl);
          continue;
        }
      }

      if (hasPseudo) {
        const parsed = parseSelectorState(part, prefix);
        if (parsed) {
          const { base, state } = parsed;
          if (selectorBelongsToComponent(base)) {
            if (!stateStyles[base]) stateStyles[base] = {};
            if (!stateStyles[base][state]) stateStyles[base][state] = {};
            Object.assign(stateStyles[base][state], decl);
          }
          continue;
        }
      }

      if (hasSpace) {
        const compound = parseCompoundModifierElement(part, prefix);
        if (compound && selectorBelongsToComponent(compound.modifier)) {
          const { modifier, element } = compound;
          modifiers.add(modifier);
          if (selectorBelongsToComponent(element)) {
            if (!modifierElementStyles[modifier]) modifierElementStyles[modifier] = {};
            if (!modifierElementStyles[modifier][element]) modifierElementStyles[modifier][element] = {};
            Object.assign(modifierElementStyles[modifier][element], decl);
          }
        }
        continue;
      }

      const normalizedList = normalizedSelectorsForRule(part, prefix);
      const isBaseRule =
        !part.includes(':') &&
        !part.includes('.is-') &&
        !part.includes(' ') &&
        normalizedList.some((n) => {
          const base = n.trim();
          return (
            base === rootKey ||
            base.startsWith('.' + prefix + '__') ||
            (base.startsWith('.' + prefix + '-') && base !== rootKey && !base.includes('--'))
          );
        });

      for (const norm of normalizedList) {
        const base = norm.trim();
        if (!selectorBelongsToComponent(base)) continue;
        if (base.includes('--')) {
          const prefixWithDot = '.' + prefix + '__';
          const isElementModifier =
            base.startsWith(prefixWithDot) && base.indexOf('--') !== -1;
          if (isElementModifier) {
            const element = base.slice(0, base.indexOf('--'));
            modifiers.add(base);
            if (!modifierElementStyles[base]) modifierElementStyles[base] = {};
            if (!modifierElementStyles[base][element]) modifierElementStyles[base][element] = {};
            Object.assign(modifierElementStyles[base][element], decl);
          } else {
            modifiers.add(base);
            modifierRootStyles[base] = { ...(modifierRootStyles[base] || {}), ...decl };
          }
          continue;
        }
        const key = base.startsWith('.' + prefix + '__')
          ? base
          : base.startsWith('.' + prefix + '-') && !base.startsWith('.' + prefix + '--')
            ? base
            : rootKey;
        if (!bySelector.has(key)) bySelector.set(key, {});
        if (isBaseRule) Object.assign(bySelector.get(key), decl);
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
    modifierRootStyles,
    modifierElementStyles,
    stateStyles,
    descendantStateStyles,
  };
}

/**
 * Cartesian product of arrays: [ [a1,b1], [a2,b2] ] -> [ [a1,a2], [a1,b2], [b1,a2], [b1,b2] ].
 * @param {any[][]} arrays
 * @returns {any[][]}
 */
function cartesian(arrays) {
  if (arrays.length === 0) return [[]];
  const [first, ...rest] = arrays;
  const restProduct = cartesian(rest);
  const out = [];
  for (const v of first) {
    for (const row of restProduct) {
      out.push([v, ...row]);
    }
  }
  return out;
}

/**
 * Build full spec key matrix for a component: one key per combination of dimensions (variant, style, theme, mode, size, buttonType, headerVariant, ...).
 * When dimensionValues is provided (from getDimensionValuesForComponent(componentName, parsed.props)), uses dimension config and full product.
 * When dimensionValues is null, falls back to legacy discoverComponentProps (sizes, variants) + theme/mode.
 * @param {string} componentName - e.g. 'Avatar', 'Alert', 'Button'
 * @param {Record<string, string[]>} [dimensionValues] - e.g. { variant: ['primary','secondary'], size: ['sm','md'] }; theme and mode are always added.
 * @returns {string[]} Spec keys (e.g. ['info-cp-light-default', 'primary-cp-light-md-theme', ...])
 */
export function buildSpecMatrix(componentName, dimensionValues = null) {
  const componentPath = getComponentPath(componentName);
  if (!fs.existsSync(componentPath)) {
    return [];
  }

  const useDimensionConfig =
    dimensionValues &&
    COMPONENT_DIMENSIONS[componentName] &&
    Object.keys(dimensionValues).length > 0;

  if (useDimensionConfig) {
    const orderedDimNames = DIMENSION_KEY_ORDER.filter(
      (d) => d === 'theme' || d === 'mode' || dimensionValues[d]
    );
    const valueArrays = orderedDimNames.map((dim) =>
      dim === 'theme' ? THEMES : dim === 'mode' ? MODES : dimensionValues[dim]
    );
    const product = cartesian(valueArrays);
    return product.map((row) => row.join('-'));
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
