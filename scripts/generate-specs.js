#!/usr/bin/env node
/**
 * Generate execution-format specs from sources (tokens + component discovery).
 * Phase 3: Avatar and other simple components.
 *
 * Usage:
 *   node scripts/generate-specs.js [componentName]   # default: Avatar
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadColors, loadTokensCSS, CSS_VAR_TO_COLORS_PATH } from './lib/token-resolver.js';
import {
  discoverComponentVariables,
  buildSpecMatrix,
  getComponentPath,
  discoverComponentProps,
  discoverComponentStructure,
} from './lib/component-discovery.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'mcp-data', 'components');

const FORBIDDEN_MODIFICATIONS = [
  'Do not use Tailwind arbitrary values',
  'Do not change hex colors to named colors',
  'Do not simplify box-shadow values',
];

/**
 * Resolve a single CSS variable to a concrete value for (theme, mode, size).
 * @param {string} varName - e.g. 'theme-primary', 'avatar-size-sm', 'radius-08'
 * @param {object} ctx - { getColor, getToken, theme, mode, size, componentName }
 * @returns {string|undefined}
 */
function resolveVariable(varName, ctx) {
  const { getColor, getToken, theme, mode, size, componentName } = ctx;

  if (CSS_VAR_TO_COLORS_PATH[varName] != null) {
    return getColor(theme, mode, CSS_VAR_TO_COLORS_PATH[varName]);
  }

  const slug = componentName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
  const sizeTokenMatch = varName.match(new RegExp(`^${slug.replace(/-/g, '[-]')}-size-(\\w+)$`));
  if (sizeTokenMatch && size) {
    const tokenName = `${slug}-size-${size}`;
    return getToken(tokenName);
  }

  if (varName === 'btn-spinner-size' && size) {
    const v = getToken(`spinner-size-${size}`);
    if (v) return v;
    return getToken('spinner-size-md');
  }

  return getToken(varName);
}

/**
 * Resolve var(--name) in style values using ctx (getColor, getToken, theme, mode, size, componentName).
 * @param {Record<string, string>} styles
 * @param {object} ctx
 * @returns {Record<string, string>}
 */
function resolveStyles(styles, ctx) {
  if (!styles || typeof styles !== 'object') return {};
  const out = {};
  for (const [k, v] of Object.entries(styles)) {
    if (typeof v !== 'string') {
      out[k] = v;
      continue;
    }
    out[k] = v.replace(/var\s*\(\s*--([\w-]+)\s*\)/g, (_, name) => {
      const resolved = resolveVariable(name, ctx);
      return resolved != null ? resolved : `var(--${name})`;
    });
  }
  return out;
}

/**
 * Build CSS property name from declaration (e.g. background-color -> background for spec).
 * We use background for color for consistency with execution format.
 */
function cssPropName(decl) {
  if (decl === 'background-color') return 'background';
  return decl;
}

/**
 * Map from component to root selector and tag (for execution format).
 */
const COMPONENT_ROOT = {
  Avatar: { selector: '.avatar', tag: 'div' },
};

const CAMEL_TO_KEBAB = {
  flexDirection: 'flex-direction',
  alignItems: 'align-items',
  justifyContent: 'justify-content',
  paddingTop: 'padding-top',
  paddingRight: 'padding-right',
  paddingBottom: 'padding-bottom',
  paddingLeft: 'padding-left',
  minWidth: 'min-width',
  maxWidth: 'max-width',
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  lineHeight: 'line-height',
  borderRight: 'border-right',
  borderLeft: 'border-left',
  borderBottom: 'border-bottom',
  borderTop: 'border-top',
  borderRadius: 'border-radius',
  boxShadow: 'box-shadow',
  zIndex: 'z-index',
};

function camelToKebab(obj) {
  if (obj == null || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = CAMEL_TO_KEBAB[k] ?? k.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    out[key] = v;
  }
  return out;
}

function bordersToStyles(borders) {
  if (!borders || typeof borders !== 'object') return {};
  const out = {};
  if (borders.border != null) out.border = borders.border;
  if (borders.width != null) out['border-width'] = borders.width;
  if (borders.style != null) out['border-style'] = borders.style;
  if (borders.radius != null) out['border-radius'] = borders.radius;
  return out;
}

function stateToStyles(state) {
  if (!state || typeof state !== 'object') return {};
  const out = { ...camelToKebab(state) };
  if (out.text !== undefined) {
    out.color = out.text;
    delete out.text;
  }
  return out;
}

/**
 * @param {string} classStr - e.g. "right-sidebar__dela-logo right-sidebar__dela-logo--default"
 * @param {boolean} useFull - if true, return .c1.c2.c3 for unique selector; else first class only
 */
function selectorFromClass(classStr, useFull = false) {
  if (typeof classStr !== 'string') return '';
  const parts = classStr.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  if (useFull) return parts.map((c) => '.' + c).join('');
  return '.' + parts[0];
}

function collectIconsFromTemplate(template) {
  const icons = [];
  if (!template?.sections) return icons;
  for (const sec of template.sections) {
    if (!sec.items) continue;
    for (const item of sec.items) {
      if (item.isCustom && item.customSrc) {
        icons.push({
          name: item.label?.replace(/\s+/g, '-').toLowerCase() || 'custom',
          library: 'custom',
          icon: path.basename(item.customSrc, '.svg'),
          style: 'outline',
        });
        continue;
      }
      const iconPath = item.iconPath || item.icon;
      const name = item.icon || item.label?.replace(/\s+/g, '-').toLowerCase() || 'icon';
      const pathMatch = iconPath && typeof iconPath === 'string' && iconPath.match(/heroicons\/24\/(outline|solid)\/([^/]+)\.svg$/);
      if (pathMatch) {
        const style = pathMatch[1];
        const base = pathMatch[2].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const icon = base.charAt(0).toUpperCase() + base.slice(1) + 'Icon';
        icons.push({ name, library: 'heroicons', icon, style });
      } else {
        icons.push({ name, library: 'custom', icon: name, style: 'outline' });
      }
    }
  }
  return icons;
}

/**
 * Convert old-format spec (structure, layout, spacing, etc.) to execution format (elements, _buildContract).
 * Resolves all styles from tokens for theme/mode/size. Output: _meta, _buildContract, elements, icons only.
 */
function convertOldSpecToExecutionFormat(oldSpec, componentName, theme, mode, size) {
  const colors = loadColors();
  const tokens = loadTokensCSS();
  const getColor = colors.getColor.bind(colors);
  const getToken = tokens.getToken.bind(tokens);

  const cardBg = getColor(theme, mode, 'palette.cardBackground');
  const navBg = getColor(theme, mode, 'palette.navBackground');
  const titleText = getColor(theme, mode, 'palette.titleText');
  const borderColor = getColor(theme, mode, 'palette.border');
  const primary = getColor(theme, mode, 'primary');
  const hoverBg = getColor(theme, mode, 'palette.hover');

  const resolvedStates = {
    default: { background: cardBg, color: titleText, border: borderColor != null ? `1px solid ${borderColor}` : undefined },
    hover: { background: hoverBg ?? cardBg, color: titleText, border: borderColor != null ? `1px solid ${borderColor}` : undefined },
    active: { background: hoverBg ?? cardBg, color: titleText, border: borderColor != null ? `1px solid ${borderColor}` : undefined },
    focus: { background: cardBg, color: titleText, border: borderColor != null ? `1px solid ${borderColor}` : undefined },
    disabled: { background: cardBg, color: titleText, border: borderColor != null ? `1px solid ${borderColor}` : undefined },
    item: { background: primary, color: '#FFFFFF', border: 'none' },
  };

  const spec = oldSpec;
  const hasStructure = spec.structure && typeof spec.structure === 'object';
  const hasSection = spec.section && typeof spec.section === 'object';
  const elements = [];
  const criticalSelectors = {};

  const mergeStyles = (...sources) => {
    const acc = {};
    for (const src of sources) {
      if (!src || typeof src !== 'object') continue;
      Object.assign(acc, camelToKebab(src));
    }
    return acc;
  };

  if (!hasStructure) {
    return null;
  }

  const rootNode = spec.structure.root;
  const rootTag = rootNode?.element || 'div';
  const rootClass = rootNode?.class || 'root';
  const rootSelector = selectorFromClass(rootClass) || '.root';

  let rootStyles = mergeStyles(spec.layout, spec.spacing, spec.positioning, spec.dimensions, spec.typography);
  Object.assign(rootStyles, bordersToStyles(spec.borders));
  Object.assign(rootStyles, stateToStyles(spec.states?.default));
  rootStyles.background = resolvedStates.default.background ?? rootStyles.background;
  rootStyles.color = resolvedStates.default.color ?? rootStyles.color;
  rootStyles.border = resolvedStates.default.border ?? rootStyles.border;
  if (borderColor != null && !rootStyles.border) rootStyles.border = `1px solid ${borderColor}`;
  if (rootStyles['padding-top'] != null && rootStyles['padding-right'] != null) {
    rootStyles.padding = `${rootStyles['padding-top']} ${rootStyles['padding-right']} ${rootStyles['padding-bottom']} ${rootStyles['padding-left']}`;
    delete rootStyles['padding-top'];
    delete rootStyles['padding-right'];
    delete rootStyles['padding-bottom'];
    delete rootStyles['padding-left'];
  }

  const rootElement = {
    selector: rootSelector,
    tag: rootTag,
    styles: rootStyles,
  };
  if (rootTag === 'nav') rootElement.role = 'complementary';
  const rootStates = {};
  if (spec.states) {
    for (const [stateKey, stateVal] of Object.entries(spec.states)) {
      if (stateKey === 'default' || stateKey === 'item') continue;
      rootStates[stateKey] = stateToStyles(stateVal);
      if (resolvedStates[stateKey]) {
        rootStates[stateKey].background = resolvedStates[stateKey].background ?? rootStates[stateKey].background;
        rootStates[stateKey].color = resolvedStates[stateKey].color ?? rootStates[stateKey].color;
        rootStates[stateKey].border = resolvedStates[stateKey].border ?? rootStates[stateKey].border;
      }
    }
  }
  if (Object.keys(rootStates).length) rootElement.states = rootStates;
  elements.push(rootElement);
  criticalSelectors[rootSelector] = { ...rootStyles };

  const structureKeys = Object.keys(spec.structure).filter((k) => k !== 'root');
  const rootChildren = [];
  let sectionSelector = null;
  let itemSelector = null;
  const sectionChildren = [];
  const itemChildren = [];

  for (const key of structureKeys) {
    const node = spec.structure[key];
    const tag = node?.element || 'div';
    const classStr = node?.class || '';
    let sel = selectorFromClass(classStr);
    if (!sel) continue;
    if (criticalSelectors[sel] != null) sel = selectorFromClass(classStr, true);
    if (!sel) continue;

    const isSection = key === 'section' || key === 'header' || key === 'body' || key === 'footer';
    const isItem = key === 'item';
    const isChildOfItem = ['icon', 'label', 'delaLogo', 'delaLogoActive'].includes(key);
    if (isSection) sectionSelector = sel;
    if (isItem) itemSelector = sel;

    let styles = {};
    if (isSection && hasSection) {
      styles = mergeStyles(spec.section, node);
      styles.background = resolvedStates.default.background ?? styles.background ?? navBg ?? spec.states?.default?.background;
      styles.color = styles.color ?? resolvedStates.default.color ?? spec.states?.default?.text;
      if (spec.states?.default?.iconColor) styles['icon-color'] = spec.states.default.iconColor;
      styles.border = resolvedStates.default.border ?? styles.border;
      if (styles.gap != null && styles.display == null) {
        styles.display = 'flex';
        styles['flex-direction'] = 'column';
      }
    } else if (isChildOfItem && spec.typography) {
      styles = mergeStyles(spec.typography, camelToKebab(node));
    } else {
      styles = camelToKebab(node);
    }
    delete styles.element;
    delete styles.class;

    if (spec.states?.default && (isSection || isItem)) {
      styles.background = styles.background ?? resolvedStates.default.background ?? spec.states.default.background;
      styles.color = styles.color ?? resolvedStates.default.color ?? spec.states.default.text;
      styles.border = styles.border ?? resolvedStates.default.border;
      if (spec.states.default.iconColor) styles['icon-color'] = spec.states.default.iconColor;
    }
    if (spec.states?.item && isItem) {
      styles.background = resolvedStates.item.background ?? spec.states.item.background;
      styles.color = resolvedStates.item.color ?? spec.states.item.text;
      styles.border = resolvedStates.item.border ?? spec.states.item.border;
      if (spec.states.item.iconColor) styles['icon-color'] = spec.states.item.iconColor;
    }
    if (spec.icons) {
      if (key === 'icon') {
        const sz = spec.icons.iconSizePx || '24';
        styles.width = `${sz}px`;
        styles.height = `${sz}px`;
      } else if (key === 'delaLogo' || key === 'delaLogoActive') {
        const sz = spec.icons.delaLogoSizePx || '36';
        styles.width = `${sz}px`;
        styles.height = `${sz}px`;
      }
    }
    if (isItem && !styles.display) {
      styles.display = 'flex';
      styles['align-items'] = 'center';
      styles['justify-content'] = 'center';
    }

    let parentSel;
    if (isChildOfItem && itemSelector) parentSel = itemSelector;
    else if (isItem && sectionSelector) parentSel = sectionSelector;
    else if (isSection) parentSel = rootSelector;
    else parentSel = undefined;

    const el = {
      selector: sel,
      tag,
      parent: parentSel,
      styles,
    };
    if (isSection && spec.structure.item) {
      const itemSel = selectorFromClass(spec.structure.item.class);
      if (itemSel) el.children = [itemSel];
    }
    if (isItem && spec.template?.sections?.length) el.repeat = 'icons';
    if (spec.states?.hover && isItem) {
      el.states = {
        hover: stateToStyles(spec.states.hover),
        active: spec.states.active ? stateToStyles(spec.states.active) : undefined,
      };
      if (el.states.active && Object.keys(el.states.active).length === 0) delete el.states.active;
    }
    elements.push(el);
    if (isSection) rootChildren.push(sel);
    if (isItem && sectionSelector) sectionChildren.push(sel);
    if (isChildOfItem) itemChildren.push(sel);
    criticalSelectors[sel] = { ...styles };
  }

  if (rootChildren.length) rootElement.children = rootChildren;
  const sectionEl = elements.find((e) => e.selector === sectionSelector);
  if (sectionEl && sectionChildren.length) sectionEl.children = sectionChildren;
  const itemEl = elements.find((e) => e.selector === itemSelector);
  if (itemEl && itemChildren.length) itemEl.children = [...new Set(itemChildren)];

  const icons = spec.template?.sections ? collectIconsFromTemplate(spec.template) : [];

  const out = {
    _meta: { theme, mode, locked: true },
    _buildContract: {
      criticalSelectors,
      forbiddenModifications: FORBIDDEN_MODIFICATIONS,
    },
    elements,
  };
  if (icons.length) out.icons = icons;
  if (spec.props) out.props = spec.props;
  if (spec.panelOpen) out.panelOpen = spec.panelOpen;
  return out;
}

/**
 * Generate one spec for (componentName, theme, mode, size).
 * If existingSpec has structure, convert to execution format (elements array) with resolved tokens.
 * Otherwise use discoverComponentStructure() and merge resolved token values into discovered styles.
 */
export function generateSpec(componentName, theme, mode, size, existingSpec = null) {
  if (existingSpec?.structure) {
    const converted = convertOldSpecToExecutionFormat(existingSpec, componentName, theme, mode, size);
    if (converted) return converted;
  }

  const colors = loadColors();
  const tokens = loadTokensCSS();
  const getColor = colors.getColor.bind(colors);
  const getToken = tokens.getToken.bind(tokens);
  const ctx = { getColor, getToken, theme, mode, size, componentName };

  const discovered = discoverComponentStructure(componentName);
  if (discovered.elements?.length > 0) {
    const criticalSelectors = {};
    const elements = discovered.elements.map((el) => {
      const resolvedStyles = resolveStyles(el.styles || {}, ctx);
      const out = {
        selector: el.selector,
        tag: el.tag || 'div',
        styles: resolvedStyles,
      };
      if (el.children?.length) out.children = el.children;
      if (el.parent) out.parent = el.parent;
      criticalSelectors[el.selector] = { ...resolvedStyles };
      return out;
    });
    return {
      _meta: { theme, mode, locked: true },
      _buildContract: {
        criticalSelectors,
        forbiddenModifications: FORBIDDEN_MODIFICATIONS,
      },
      elements,
    };
  }

  const { variables } = discoverComponentVariables(componentName);
  const resolved = {};
  for (const varName of variables) {
    const value = resolveVariable(varName, ctx);
    if (value != null) resolved[varName] = value;
  }

  const root = COMPONENT_ROOT[componentName] ?? {
    selector: `.${componentName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')}`,
    tag: 'div',
  };

  const slug = componentName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
  const sizeToken = size ? getToken(`${slug}-size-${size}`) : null;
  const primaryColor = getColor(theme, mode, 'primary');
  const radius = getToken('radius-08');

  const styles = {
    display: 'inline-flex',
    'align-items': 'center',
    'justify-content': 'center',
    'flex-shrink': '0',
    'border-radius': radius ?? '8px',
    background: primaryColor ?? resolved['theme-primary'],
  };

  if (sizeToken) {
    styles.width = sizeToken;
    styles.height = sizeToken;
    styles['min-width'] = sizeToken;
    styles['max-width'] = sizeToken;
  }

  return {
    _meta: { theme, mode, locked: true },
    _buildContract: {
      criticalSelectors: {
        [root.selector]: { ...styles },
      },
      forbiddenModifications: FORBIDDEN_MODIFICATIONS,
    },
    elements: [
      {
        selector: root.selector,
        tag: root.tag,
        styles,
      },
    ],
  };
}

/**
 * Parse spec key into theme, mode, size. Handles theme-mode, variant-theme-mode, theme-mode-size.
 */
function parseSpecKeyToThemeModeSize(key) {
  const parts = key.split('-');
  let theme, mode, size;
  if (parts.length >= 3 && ['light', 'dark'].includes(parts[parts.length - 2])) {
    mode = parts[parts.length - 2];
    theme = parts[parts.length - 3];
    size = parts[parts.length - 1] !== 'light' && parts[parts.length - 1] !== 'dark' ? parts[parts.length - 1] : undefined;
  } else if (parts.length >= 2 && ['light', 'dark'].includes(parts[parts.length - 1])) {
    mode = parts[parts.length - 1];
    theme = parts[parts.length - 2];
    size = undefined;
  }
  return { theme, mode, size };
}

/**
 * Generate full specs object for a component.
 * When existingSpecs is provided, uses existing keys and merges token overrides (keeps structure/template/icons).
 * Otherwise uses buildSpecMatrix and generates from scratch.
 */
export function generateComponentSpecs(componentName, existingSpecs = null) {
  const matrixKeys = buildSpecMatrix(componentName);
  const existingKeys = existingSpecs ? Object.keys(existingSpecs) : [];
  const keys = existingKeys.length > 0 ? existingKeys : matrixKeys;
  const specs = {};
  for (const key of keys) {
    const { theme, mode, size } = parseSpecKeyToThemeModeSize(key);
    const existingSpec = existingSpecs?.[key] ?? null;
    specs[key] = generateSpec(componentName, theme, mode, size, existingSpec);
  }
  return specs;
}

/**
 * Build complete component JSON: existing props/guidance/examples + generated specs.
 * When existing JSON has specs, merges token overrides into them (keeps structure, template, icons).
 */
export function generateComponentJSON(componentName) {
  const existingPath = path.join(COMPONENTS_DIR, `${componentName.toLowerCase()}.json`);
  let existing = {};
  if (fs.existsSync(existingPath)) {
    existing = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));
  }

  const { name, type, filePath, description, props, defaults, guidance, interactivity, examples } = existing;

  const base = {
    name: name ?? componentName,
    type: type ?? 'component',
    filePath: filePath ?? `src/components/ui/${componentName}.astro`,
    description: description ?? `${componentName} Component`,
    props: props ?? {},
    defaults: defaults ?? { theme: 'cp', mode: 'light' },
    specs: generateComponentSpecs(componentName, existing.specs ?? null),
    guidance: guidance ?? { patterns: {}, guidelines: {} },
  };
  if (interactivity) base.interactivity = interactivity;
  if (examples) base.examples = examples;

  return base;
}

/**
 * Write generated component JSON to outputDir/<componentName>.json (lowercase filename).
 * @param {string} componentName - e.g. 'Avatar'
 * @param {string} outputDir - Path relative to project root (default: mcp-data/components-v2)
 * @returns {string} Path to written file
 */
export function writeComponentJSON(componentName, outputDir = 'mcp-data/components-v2') {
  const json = generateComponentJSON(componentName);
  const outPath = path.join(ROOT, outputDir, `${componentName.toLowerCase()}.json`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2) + '\n', 'utf-8');
  return outPath;
}

/**
 * Validate specs: execution-format specs must have elements (array), _meta, _buildContract;
 * each element must have selector, tag, styles. Merged (old-format) specs with structure/template are allowed.
 * @param {object} specs - specs object keyed by spec key
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateComponentSpecs(specs) {
  const errors = [];
  for (const [key, spec] of Object.entries(specs || {})) {
    if (Array.isArray(spec.elements)) {
      if (!spec._meta) errors.push(`${key}: missing _meta`);
      if (!spec._buildContract) errors.push(`${key}: missing _buildContract`);
      for (let i = 0; i < spec.elements.length; i++) {
        const el = spec.elements[i];
        if (!el.selector) errors.push(`${key}: elements[${i}] missing selector`);
        if (!el.tag) errors.push(`${key}: elements[${i}] missing tag`);
        if (!el.styles || typeof el.styles !== 'object') errors.push(`${key}: elements[${i}] missing styles object`);
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Get all component names from mcp-data/components/*.json (uses "name" field).
 * @returns {string[]} PascalCase component names
 */
export function getAllComponentNames() {
  if (!fs.existsSync(COMPONENTS_DIR)) return [];
  const names = [];
  for (const f of fs.readdirSync(COMPONENTS_DIR).sort()) {
    if (!f.endsWith('.json')) continue;
    const filePath = path.join(COMPONENTS_DIR, f);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (data.name) names.push(data.name);
    } catch (_) {
      const base = path.basename(f, '.json');
      names.push(base.charAt(0).toUpperCase() + base.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase()));
    }
  }
  return [...new Set(names)].sort();
}

/**
 * List info for all components: name, expected spec count, has structure in existing JSON.
 * @returns {{ name: string, expectedSpecCount: number, hasStructure: boolean }[]}
 */
export function listComponentsWithInfo() {
  const componentNames = getAllComponentNames();
  const rows = [];
  for (const name of componentNames) {
    const componentPath = getComponentPath(name);
    const existingPath = path.join(COMPONENTS_DIR, `${name.toLowerCase()}.json`);
    let expectedSpecCount = 0;
    let hasStructure = false;
    if (fs.existsSync(existingPath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));
        const specKeys = Object.keys(existing.specs || {});
        expectedSpecCount = specKeys.length;
        hasStructure = specKeys.some((k) => existing.specs[k]?.structure != null);
      } catch (_) {
        expectedSpecCount = buildSpecMatrix(name).length;
      }
    } else {
      expectedSpecCount = buildSpecMatrix(name).length;
    }
    if (expectedSpecCount === 0 && fs.existsSync(componentPath)) {
      expectedSpecCount = buildSpecMatrix(name).length;
    }
    rows.push({ name, expectedSpecCount, hasStructure });
  }
  return rows;
}

// --- CLI / test ---
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const list = args.includes('--list');
  const all = args.includes('--all');
  const componentName = args.find((a) => !a.startsWith('--')) ?? (all ? null : 'Avatar');

  if (list) {
    const rows = listComponentsWithInfo();
    console.log('Name\tExpected spec count\tHas structure in existing JSON');
    console.log('-'.repeat(60));
    for (const r of rows) {
      console.log(`${r.name}\t${r.expectedSpecCount}\t${r.hasStructure ? 'yes' : 'no'}`);
    }
    console.log('-'.repeat(60));
    console.log(`Total: ${rows.length} components`);
  } else if (all && write) {
    const componentNames = getAllComponentNames();
    const results = [];
    let totalSpecs = 0;
    for (const name of componentNames) {
      const result = { name, specs: 0, valid: true, errors: [] };
      try {
        const json = generateComponentJSON(name);
        result.specs = Object.keys(json.specs || {}).length;
        totalSpecs += result.specs;
        const validation = validateComponentSpecs(json.specs);
        result.valid = validation.valid;
        result.errors = validation.errors;
        const outPath = path.join(ROOT, 'mcp-data', 'components-v2', `${name.toLowerCase()}.json`);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, JSON.stringify(json, null, 2) + '\n', 'utf-8');
      } catch (err) {
        result.valid = false;
        result.errors = [err.message || String(err)];
      }
      results.push(result);
    }
    console.log('=== Summary ===');
    console.log(`Total components processed: ${results.length}`);
    console.log(`Total specs generated: ${totalSpecs}`);
    console.log('\nValidation per component:');
    const failed = [];
    for (const r of results) {
      const status = r.valid ? 'pass' : 'fail';
      console.log(`  ${r.name}: ${status} (${r.specs} specs)`);
      if (!r.valid) {
        failed.push(r);
        for (const e of r.errors) console.log(`    - ${e}`);
      }
    }
    if (failed.length > 0) {
      console.log('\n--- Failed components ---');
      for (const r of failed) {
        console.log(`${r.name}:`);
        for (const e of r.errors) console.log(`  ${e}`);
      }
    }
  } else if (all) {
    console.log('Use --all --write to generate and write all components to mcp-data/components-v2/');
  } else if (write) {
    const outPath = writeComponentJSON(componentName);
    console.log(`Wrote ${componentName} to ${outPath}`);
    const json = generateComponentJSON(componentName);
    const result = validateComponentSpecs(json.specs);
    if (result.valid) {
      console.log('Validation: OK (all specs have elements, _meta, _buildContract; each element has selector, tag, styles)');
    } else {
      console.log('Validation errors:', result.errors);
    }
    const stat = fs.statSync(outPath);
    const lines = fs.readFileSync(outPath, 'utf-8').split('\n').length;
    console.log(`File: ${stat.size} bytes, ${lines} lines`);
  } else {
    const json = generateComponentJSON(componentName);
    console.log(`=== Generated ${Object.keys(json.specs).length} specs for ${componentName} ===\n`);
    console.log('--- cp-light-sm ---');
    console.log(JSON.stringify(json.specs['cp-light-sm'], null, 2));
    console.log('\n--- vp-dark-lg ---');
    console.log(JSON.stringify(json.specs['vp-dark-lg'], null, 2));
  }
}
