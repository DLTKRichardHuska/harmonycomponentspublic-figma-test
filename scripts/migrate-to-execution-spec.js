#!/usr/bin/env node
/**
 * Migrate component JSON from documentation-oriented spec to execution-oriented spec.
 * Outputs to mcp-data/components-v2/ (does not overwrite originals).
 *
 * Usage:
 *   node scripts/migrate-to-execution-spec.js                    # all components
 *   node scripts/migrate-to-execution-spec.js --pilot            # avatar, card, rightsidebar only
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'mcp-data', 'components');
const OUT_DIR = path.join(ROOT, 'mcp-data', 'components-v2');

const PILOT_FILES = new Set(['avatar.json', 'card.json', 'rightsidebar.json']);

const FORBIDDEN_MODIFICATIONS = [
  'Do not use Tailwind arbitrary values',
  'Do not change hex colors to named colors',
  'Do not simplify box-shadow values',
];

// CamelCase to kebab-case for CSS properties
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

function mergeStyles(...sources) {
  const acc = {};
  for (const src of sources) {
    if (!src || typeof src !== 'object') continue;
    const kebab = camelToKebab(src);
    Object.assign(acc, kebab);
  }
  return acc;
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

function parseSpecKey(specKey) {
  const parts = specKey.split('-');
  let theme = 'cp';
  let mode = 'light';
  if (parts.includes('light')) mode = 'light';
  if (parts.includes('dark')) mode = 'dark';
  const themeIdx = parts.findIndex((p) => ['cp', 'vp', 'ppm', 'maconomy'].includes(p));
  if (themeIdx >= 0) theme = parts[themeIdx];
  return { theme, mode };
}

function firstClass(classStr) {
  if (typeof classStr !== 'string') return '';
  return classStr.split(/\s+/)[0]?.trim() || '';
}

function selectorFromClass(classStr) {
  const c = firstClass(classStr);
  return c ? `.${c}` : '';
}

// heroicons path: node_modules/heroicons/24/outline/bell.svg → { library: 'heroicons', icon: 'BellIcon', style: 'outline' }
function iconPathToLibraryIconStyle(iconPath, fallbackName) {
  if (!iconPath || typeof iconPath !== 'string') {
    return { name: fallbackName || 'unknown', library: 'custom', icon: fallbackName || 'Unknown', style: 'outline' };
  }
  const match = iconPath.match(/heroicons\/24\/(outline|solid)\/([^/]+)\.svg$/);
  if (match) {
    const style = match[1];
    const base = match[2].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const icon = base.charAt(0).toUpperCase() + base.slice(1) + 'Icon';
    return { library: 'heroicons', icon, style };
  }
  // public/* or other
  const name = fallbackName || path.basename(iconPath, '.svg').replace(/\s+/g, '-');
  return { name, library: 'custom', icon: name, style: 'outline' };
}

function kebabToPascal(kebab) {
  return kebab
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join('') + 'Icon';
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
      const parsed = iconPathToLibraryIconStyle(iconPath, name);
      if (parsed.library === 'heroicons' && parsed.icon === (name + 'Icon')) {
        parsed.icon = kebabToPascal(name);
      } else if (parsed.library === 'custom') {
        parsed.name = name;
      }
      icons.push({ name, ...parsed });
    }
  }
  return icons;
}

function migrateSpec(spec, specKey, componentName) {
  if (!spec || typeof spec !== 'object') return spec;

  const { theme, mode } = parseSpecKey(specKey);
  const elements = [];
  const hasStructure = spec.structure && typeof spec.structure === 'object';
  const hasTemplate = spec.template?.sections?.length > 0;
  const hasSection = spec.section && typeof spec.section === 'object';

  // --- Root element ---
  const rootStyles = mergeStyles(
    spec.layout,
    spec.spacing,
    spec.positioning,
    spec.dimensions,
    spec.typography
  );
  Object.assign(rootStyles, bordersToStyles(spec.borders));
  Object.assign(rootStyles, stateToStyles(spec.states?.default));
  // Padding shorthand if all four set
  if (rootStyles['padding-top'] != null && rootStyles['padding-right'] != null && rootStyles['padding-bottom'] != null && rootStyles['padding-left'] != null) {
    rootStyles.padding = `${rootStyles['padding-top']} ${rootStyles['padding-right']} ${rootStyles['padding-bottom']} ${rootStyles['padding-left']}`;
    delete rootStyles['padding-top'];
    delete rootStyles['padding-right'];
    delete rootStyles['padding-bottom'];
    delete rootStyles['padding-left'];
  }

  const rootTag = hasStructure && spec.structure.root ? spec.structure.root.element : 'div';
  const rootClass = hasStructure && spec.structure.root ? spec.structure.root.class : (componentName ? componentName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '') : 'root');
  const rootSelector = selectorFromClass(rootClass) || '.root';

  const rootElement = {
    selector: rootSelector,
    tag: rootTag,
    styles: rootStyles,
  };
  if (rootTag === 'nav') rootElement.role = 'complementary';
  const rootStates = {};
  if (spec.states) {
    for (const [stateKey, stateVal] of Object.entries(spec.states)) {
      if (stateKey === 'default') continue;
      rootStates[stateKey] = stateToStyles(stateVal);
    }
  }
  if (Object.keys(rootStates).length) rootElement.states = rootStates;
  elements.push(rootElement);

  // --- Structure-derived elements (section, header, body, footer, item, icon, label, etc.) ---
  if (hasStructure) {
    const structureKeys = Object.keys(spec.structure).filter((k) => k !== 'root');
    const rootChildren = [];
    let sectionSelector = null;

    for (const key of structureKeys) {
      const node = spec.structure[key];
      const tag = node?.element || 'div';
      const classStr = node?.class || '';
      const sel = selectorFromClass(classStr);
      if (!sel) continue;

      const isSection = key === 'section' || key === 'header' || key === 'body' || key === 'footer';
      const isItem = key === 'item';
      const isIcon = key === 'icon' || key === 'delaLogo' || key === 'delaLogoActive';
      if (isSection) sectionSelector = sel;

      let styles = {};
      if (isSection && hasSection) {
        styles = mergeStyles(spec.section, node);
        if (styles.gap != null && styles.display == null) {
          styles.display = 'flex';
          styles['flex-direction'] = 'column';
        }
      } else {
        styles = camelToKebab(node);
      }
      if (spec.states?.default && (isSection || isItem)) {
        Object.assign(styles, stateToStyles(spec.states.default));
      }
      if (spec.states?.item && isItem) {
        const itemStyles = stateToStyles(spec.states.item);
        Object.assign(styles, itemStyles);
      }
      if (spec.icons && (isIcon || isItem)) {
        const size = spec.icons.iconSizePx || spec.icons.delaLogoSizePx || '24';
        styles['width'] = `${size}px`;
        styles['height'] = `${size}px`;
      }
      if (isItem && !styles.display) {
        styles.display = 'flex';
        styles['align-items'] = 'center';
        styles['justify-content'] = 'center';
      }
      delete styles.element;
      delete styles.class;

      const parentSel = isItem && sectionSelector ? sectionSelector : (isSection ? rootSelector : undefined);
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
      if (isItem && hasTemplate) el.repeat = 'icons';
      if (spec.states?.hover && isItem) {
        el.states = {
          hover: stateToStyles(spec.states.hover),
          active: spec.states.active ? stateToStyles(spec.states.active) : undefined,
        };
        if (el.states.active && Object.keys(el.states.active).length === 0) delete el.states.active;
      }
      elements.push(el);
      if (isSection) rootChildren.push(sel);
    }

    if (rootChildren.length) rootElement.children = rootChildren;
  } else {
    // Single root, no children
  }

  // --- Icons from template ---
  const icons = hasTemplate ? collectIconsFromTemplate(spec.template) : [];

  // --- _buildContract ---
  const criticalSelectors = {};
  for (const el of elements) {
    if (el.selector && (el.selector === rootSelector || el.selector.includes('__section') || el.selector.includes('__header'))) {
      criticalSelectors[el.selector] = { ...el.styles };
    }
  }
  if (rootSelector && !criticalSelectors[rootSelector]) {
    criticalSelectors[rootSelector] = { ...rootStyles };
  }

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

function migrateComponent(filePath, outPath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  const componentName = data.name;

  const migrated = {
    name: data.name,
    type: data.type || 'component',
    filePath: data.filePath,
    description: data.description || '',
    props: data.props || {},
    defaults: data.defaults || {},
    specs: {},
    guidance: data.guidance || { patterns: {}, guidelines: {} },
  };
  if (data.interactivity) migrated.interactivity = data.interactivity;
  if (data.examples) migrated.examples = data.examples;

  for (const [specKey, spec] of Object.entries(data.specs || {})) {
    migrated.specs[specKey] = migrateSpec(spec, specKey, componentName);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(migrated, null, 2) + '\n', 'utf-8');
  return migrated;
}

function main() {
  const pilotOnly = process.argv.includes('--pilot');
  const files = fs.readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith('.json'));
  const toProcess = pilotOnly ? files.filter((f) => PILOT_FILES.has(f)) : files;

  console.log(`Output directory: ${OUT_DIR}`);
  console.log(`Processing ${toProcess.length} file(s)${pilotOnly ? ' (pilot only)' : ''}...\n`);

  for (const file of toProcess) {
    const inPath = path.join(COMPONENTS_DIR, file);
    const outPath = path.join(OUT_DIR, file);
    try {
      const result = migrateComponent(inPath, outPath);
      console.log(`  ${result.name}: ${Object.keys(result.specs).length} spec(s) -> ${outPath}`);
    } catch (err) {
      console.error(`  ${file}: ${err.message}`);
      throw err;
    }
  }
  console.log('\nDone.');
}

main();
