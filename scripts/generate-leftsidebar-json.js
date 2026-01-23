/**
 * Generate LeftSidebar JSON
 * Creates a comprehensive leftsidebar.json file with all properties and resolved CSS variables
 * Includes icon colors for all states (default, hover, active, panel-open)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  parseComponent,
  extractDependencies,
  extractDescription,
  getComponentName,
  loadCssSpacing,
} from './astro-parser.js';
import {
  parseCSSFiles,
  resolveCSSVariables,
  getResolvedValue,
  extractComponentStyles,
} from './css-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Paths
const COMPONENT_PATH = path.join(rootDir, 'src/components/ui/LeftSidebar.astro');
const OUTPUT_FILE = path.join(rootDir, 'mcp-data/components/leftsidebar.json');
const CSS_DIR = path.join(rootDir, 'src/styles');
const TOKENS_CSS = path.join(rootDir, 'src/styles/tokens.css');

const THEMES = ['cp', 'vp', 'ppm', 'maconomy'];
const MODES = ['light', 'dark'];

/**
 * Recursively resolve all var() references in an object
 */
function resolveAllVarReferences(obj, variableMap, context = 'cp-light') {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    if (obj.includes('var(')) {
      const resolved = getResolvedValue(obj, variableMap, context);
      if (resolved.includes('var(') && context !== 'light') {
        return getResolvedValue(resolved, variableMap, 'light');
      }
      return resolved;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => resolveAllVarReferences(item, variableMap, context));
  }

  if (typeof obj === 'object') {
    const resolved = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('_')) {
        resolved[key] = value;
      } else {
        resolved[key] = resolveAllVarReferences(value, variableMap, context);
      }
    }
    return resolved;
  }

  return obj;
}

/**
 * Build colors structure for LeftSidebar
 * Includes icon colors for all states
 */
function buildLeftSidebarColors(componentStyles, variableMap) {
  const colors = {
    variants: {
      default: {}
    }
  };

  // Initialize structure for all themes and modes
  for (const theme of THEMES) {
    colors.variants.default[theme] = {
      light: {
        default: {},
        hover: {},
        active: {},
        activeHover: {},
        panelOpen: {
          inactive: {},
          active: {},
          activeHover: {}
        }
      },
      dark: {
        default: {},
        hover: {},
        active: {},
        activeHover: {},
        panelOpen: {
          inactive: {},
          active: {},
          activeHover: {}
        }
      }
    };
  }

  // Extract colors from CSS styles
  const rootStyles = componentStyles['.left-sidebar'] || {};
  const sectionStyles = componentStyles['.left-sidebar__section'] || {};
  const itemStyles = componentStyles['.left-sidebar__item'] || {};
  const itemHoverStyles = componentStyles['.left-sidebar__item:hover'] || {};
  const itemActiveStyles = componentStyles['.left-sidebar__item--active'] || {};
  const itemActiveHoverStyles = componentStyles['.left-sidebar__item--active:hover'] || {};
  const iconActiveStyles = componentStyles['.left-sidebar__item--active .left-sidebar__icon'] || {};
  const labelStyles = componentStyles['.left-sidebar__label'] || {};
  const panelOpenInactiveStyles = componentStyles['.left-sidebar[data-panel-open="true"] .left-sidebar__item--active:not([data-active="true"])'] || {};
  const panelOpenInactiveIconStyles = componentStyles['.left-sidebar[data-panel-open="true"] .left-sidebar__item--active:not([data-active="true"]) .left-sidebar__icon'] || {};
  const panelOpenActiveStyles = componentStyles['.left-sidebar[data-panel-open="true"] .left-sidebar__item[data-active="true"]'] || {};
  const panelOpenActiveIconStyles = componentStyles['.left-sidebar[data-panel-open="true"] .left-sidebar__item[data-active="true"] .left-sidebar__icon'] || {};
  const panelOpenActiveHoverStyles = componentStyles['.left-sidebar[data-panel-open="true"] .left-sidebar__item[data-active="true"]:hover'] || {};

  // Extract raw values
  const rootBg = rootStyles['background-color']?.raw || null;
  const sectionBg = sectionStyles['background-color']?.raw || null;
  const sectionBorder = sectionStyles['border']?.raw || sectionStyles['border-color']?.raw || null;
  const itemColor = itemStyles['color']?.raw || null;
  const itemBg = itemStyles['background-color']?.raw || null;
  const itemHoverBg = itemHoverStyles['background-color']?.raw || null;
  const itemActiveBg = itemActiveStyles['background-color']?.raw || null;
  const itemActiveColor = itemActiveStyles['color']?.raw || null;
  const itemActiveHoverBg = itemActiveHoverStyles['background-color']?.raw || null;
  const itemActiveHoverColor = itemActiveHoverStyles['color']?.raw || null;
  const iconActiveColor = iconActiveStyles['color']?.raw || null;
  const labelColor = labelStyles['color']?.raw || null;
  const panelOpenInactiveBg = panelOpenInactiveStyles['background-color']?.raw || null;
  const panelOpenInactiveColor = panelOpenInactiveStyles['color']?.raw || null;
  const panelOpenInactiveIconColor = panelOpenInactiveIconStyles['color']?.raw || null;
  const panelOpenActiveBg = panelOpenActiveStyles['background-color']?.raw || null;
  const panelOpenActiveColor = panelOpenActiveStyles['color']?.raw || null;
  const panelOpenActiveIconColor = panelOpenActiveIconStyles['color']?.raw || null;
  const panelOpenActiveHoverBg = panelOpenActiveHoverStyles['background-color']?.raw || null;

  // Resolve colors for all themes and modes
  for (const theme of THEMES) {
    for (const mode of MODES) {
      const context = `${theme}-${mode}`;
      
      // Default state
      const defaultState = {
        root: {
          background: rootBg ? getResolvedValue(rootBg, variableMap, context) : 'transparent',
          border: 'transparent'
        },
        section: {
          background: sectionBg ? getResolvedValue(sectionBg, variableMap, context) : 'transparent',
          border: sectionBorder ? getResolvedValue(sectionBorder, variableMap, context) : 'transparent'
        },
        item: {
          background: itemBg ? getResolvedValue(itemBg, variableMap, context) : 'transparent',
          text: itemColor ? getResolvedValue(itemColor, variableMap, context) : '#000000',
          border: 'transparent'
        },
        icon: {
          color: itemColor ? getResolvedValue(itemColor, variableMap, context) : '#000000' // Inherits from item text
        },
        label: {
          text: labelColor ? getResolvedValue(labelColor, variableMap, context) : (itemColor ? getResolvedValue(itemColor, variableMap, context) : '#000000')
        }
      };

      // Hover state
      const hoverState = {
        root: defaultState.root,
        section: defaultState.section,
        item: {
          background: itemHoverBg ? getResolvedValue(itemHoverBg, variableMap, context) : 'transparent',
          text: itemColor ? getResolvedValue(itemColor, variableMap, context) : '#000000',
          border: 'transparent'
        },
        icon: {
          color: itemColor ? getResolvedValue(itemColor, variableMap, context) : '#000000' // Inherits from item text
        },
        label: defaultState.label
      };

      // Active state
      const activeState = {
        root: defaultState.root,
        section: defaultState.section,
        item: {
          background: itemActiveBg ? getResolvedValue(itemActiveBg, variableMap, context) : 'transparent',
          text: itemActiveColor ? getResolvedValue(itemActiveColor, variableMap, context) : '#FFFFFF',
          border: 'transparent'
        },
        icon: {
          color: iconActiveColor ? getResolvedValue(iconActiveColor, variableMap, context) : '#FFFFFF' // Uses --text-inverse
        },
        label: {
          text: itemActiveColor ? getResolvedValue(itemActiveColor, variableMap, context) : '#FFFFFF'
        }
      };

      // Active hover state
      const activeHoverState = {
        root: defaultState.root,
        section: defaultState.section,
        item: {
          background: itemActiveHoverBg ? getResolvedValue(itemActiveHoverBg, variableMap, context) : (itemActiveBg ? getResolvedValue(itemActiveBg, variableMap, context) : 'transparent'),
          text: itemActiveHoverColor ? getResolvedValue(itemActiveHoverColor, variableMap, context) : (itemActiveColor ? getResolvedValue(itemActiveColor, variableMap, context) : '#FFFFFF'),
          border: 'transparent'
        },
        icon: {
          color: iconActiveColor ? getResolvedValue(iconActiveColor, variableMap, context) : '#FFFFFF' // Uses --text-inverse
        },
        label: {
          text: itemActiveHoverColor ? getResolvedValue(itemActiveHoverColor, variableMap, context) : (itemActiveColor ? getResolvedValue(itemActiveColor, variableMap, context) : '#FFFFFF')
        }
      };

      // Panel open inactive state
      // When icon color is "inherit", it inherits from the item text color (default state)
      const defaultItemTextColor = itemColor ? getResolvedValue(itemColor, variableMap, context) : '#000000';
      const panelOpenInactiveIconColorResolved = panelOpenInactiveIconColor 
        ? (panelOpenInactiveIconColor === 'inherit' 
            ? defaultItemTextColor 
            : getResolvedValue(panelOpenInactiveIconColor, variableMap, context))
        : defaultItemTextColor;
      const panelOpenInactiveTextColorResolved = panelOpenInactiveColor 
        ? (panelOpenInactiveColor === 'inherit' 
            ? defaultItemTextColor 
            : getResolvedValue(panelOpenInactiveColor, variableMap, context))
        : defaultItemTextColor;
      
      const panelOpenInactiveState = {
        root: defaultState.root,
        section: {
          background: 'transparent',
          border: 'transparent'
        },
        item: {
          background: panelOpenInactiveBg ? getResolvedValue(panelOpenInactiveBg, variableMap, context) : 'transparent',
          text: panelOpenInactiveTextColorResolved,
          border: 'transparent'
        },
        icon: {
          color: panelOpenInactiveIconColorResolved // Resolved from inherit to actual color
        },
        label: {
          text: panelOpenInactiveTextColorResolved
        }
      };

      // Panel open active state
      const panelOpenActiveState = {
        root: defaultState.root,
        section: {
          background: 'transparent',
          border: 'transparent'
        },
        item: {
          background: panelOpenActiveBg ? getResolvedValue(panelOpenActiveBg, variableMap, context) : (itemActiveBg ? getResolvedValue(itemActiveBg, variableMap, context) : 'transparent'),
          text: panelOpenActiveColor ? getResolvedValue(panelOpenActiveColor, variableMap, context) : (itemActiveColor ? getResolvedValue(itemActiveColor, variableMap, context) : '#FFFFFF'),
          border: 'transparent'
        },
        icon: {
          color: panelOpenActiveIconColor ? getResolvedValue(panelOpenActiveIconColor, variableMap, context) : (iconActiveColor ? getResolvedValue(iconActiveColor, variableMap, context) : '#FFFFFF') // Uses --text-inverse
        },
        label: {
          text: panelOpenActiveColor ? getResolvedValue(panelOpenActiveColor, variableMap, context) : (itemActiveColor ? getResolvedValue(itemActiveColor, variableMap, context) : '#FFFFFF')
        }
      };

      // Panel open active hover state
      const panelOpenActiveHoverState = {
        root: defaultState.root,
        section: {
          background: 'transparent',
          border: 'transparent'
        },
        item: {
          background: panelOpenActiveHoverBg ? getResolvedValue(panelOpenActiveHoverBg, variableMap, context) : (itemActiveHoverBg ? getResolvedValue(itemActiveHoverBg, variableMap, context) : 'transparent'),
          text: panelOpenActiveColor ? getResolvedValue(panelOpenActiveColor, variableMap, context) : (itemActiveColor ? getResolvedValue(itemActiveColor, variableMap, context) : '#FFFFFF'),
          border: 'transparent'
        },
        icon: {
          color: panelOpenActiveIconColor ? getResolvedValue(panelOpenActiveIconColor, variableMap, context) : (iconActiveColor ? getResolvedValue(iconActiveColor, variableMap, context) : '#FFFFFF') // Uses --text-inverse
        },
        label: {
          text: panelOpenActiveColor ? getResolvedValue(panelOpenActiveColor, variableMap, context) : (itemActiveColor ? getResolvedValue(itemActiveColor, variableMap, context) : '#FFFFFF')
        }
      };

      colors.variants.default[theme][mode].default = defaultState;
      colors.variants.default[theme][mode].hover = hoverState;
      colors.variants.default[theme][mode].active = activeState;
      colors.variants.default[theme][mode].activeHover = activeHoverState;
      colors.variants.default[theme][mode].panelOpen.inactive = panelOpenInactiveState;
      colors.variants.default[theme][mode].panelOpen.active = panelOpenActiveState;
      colors.variants.default[theme][mode].panelOpen.activeHover = panelOpenActiveHoverState;
    }
  }

  return colors;
}

/**
 * Generate LeftSidebar JSON
 */
async function generateLeftSidebarJSON() {
  console.log('🔧 Generating LeftSidebar JSON...\n');

  // Load CSS spacing map
  const cssSpacingMap = loadCssSpacing();

  // Parse component
  console.log('📦 Parsing LeftSidebar component...');
  const parsed = await parseComponent(COMPONENT_PATH, cssSpacingMap);
  const componentName = getComponentName(COMPONENT_PATH);
  const description = extractDescription(COMPONENT_PATH) || 'LeftSidebar Component';
  console.log(`✅ Parsed ${componentName}\n`);

  // Parse CSS files and resolve variables
  console.log('🎨 Parsing CSS files and resolving variables...');
  const parsedCSS = parseCSSFiles(CSS_DIR);
  const tokensCssContent = fs.readFileSync(TOKENS_CSS, 'utf-8');
  const variableMap = resolveCSSVariables(tokensCssContent);
  console.log(`✅ Resolved ${Object.keys(variableMap).length} CSS variables\n`);

  // Extract component styles
  const componentStyles = extractComponentStyles(componentName, parsed.cssClasses || [], parsedCSS, variableMap);

  // Build component data structure
  const componentData = {
    name: componentName,
    type: 'component',
    filePath: path.relative(rootDir, COMPONENT_PATH).replace(/\\/g, '/'),
    description,
    props: parsed.props || {},
    imports: parsed.imports || {},
    dependencies: extractDependencies(parsed.frontmatter ? { children: [{ type: 'frontmatter', value: parsed.frontmatter }] } : {}),
    cssClasses: parsed.cssClasses || [],
    themeSupport: {
      themes: THEMES,
      darkMode: true,
    },
    slots: parsed.slots || {},
    structure: parsed.structure || null,
    _metadata: {
      lastGenerated: new Date().toISOString(),
      generatedWith: '@astrojs/compiler@2.13.0',
      includesVisualSpecs: true,
      availableVariants: [],
    },
  };

  // Build visual specifications
  console.log('📐 Building visual specifications...');

  // Extract base styles
  const rootStyles = componentStyles['.left-sidebar'] || {};
  const sectionStyles = componentStyles['.left-sidebar__section'] || {};
  const itemStyles = componentStyles['.left-sidebar__item'] || {};
  const iconStyles = componentStyles['.left-sidebar__icon'] || {};
  const labelStyles = componentStyles['.left-sidebar__label'] || {};

  // Dimensions
  const dimensions = {};
  for (const size of ['xs', 'sm', 'md', 'lg']) {
    dimensions[size] = {
      height: 'auto',
      width: size === 'md' ? '52px' : '52px', // Collapsed width
      minWidth: '52px',
      maxWidth: '220px', // Expanded width
      expandedWidth: '220px'
    };
  }

  // Spacing
  const spacing = {};
  let rootGap = '16px'; // var(--space-4)
  let sectionPadding = '8px'; // var(--space-2)
  let sectionGap = '16px'; // var(--space-4)
  let itemPadding = '6px'; // var(--space-1-5)
  let itemGap = '8px'; // var(--space-2)
  let iconSize = '24px'; // var(--space-6)

  if (rootStyles.gap) {
    rootGap = rootStyles.gap.raw || rootStyles.gap;
    if (typeof rootGap === 'string' && rootGap.includes('var(')) {
      rootGap = getResolvedValue(rootGap, variableMap, 'cp-light');
    }
  }
  if (sectionStyles.padding) {
    sectionPadding = sectionStyles.padding.raw || sectionStyles.padding;
    if (typeof sectionPadding === 'string' && sectionPadding.includes('var(')) {
      sectionPadding = getResolvedValue(sectionPadding, variableMap, 'cp-light');
    }
  }
  if (sectionStyles.gap) {
    sectionGap = sectionStyles.gap.raw || sectionStyles.gap;
    if (typeof sectionGap === 'string' && sectionGap.includes('var(')) {
      sectionGap = getResolvedValue(sectionGap, variableMap, 'cp-light');
    }
  }
  if (itemStyles.padding) {
    itemPadding = itemStyles.padding.raw || itemStyles.padding;
    if (typeof itemPadding === 'string' && itemPadding.includes('var(')) {
      itemPadding = getResolvedValue(itemPadding, variableMap, 'cp-light');
    }
  }
  if (itemStyles.gap) {
    itemGap = itemStyles.gap.raw || itemStyles.gap;
    if (typeof itemGap === 'string' && itemGap.includes('var(')) {
      itemGap = getResolvedValue(itemGap, variableMap, 'cp-light');
    }
  }
  if (iconStyles.width) {
    iconSize = iconStyles.width.raw || iconStyles.width;
    if (typeof iconSize === 'string' && iconSize.includes('var(')) {
      iconSize = getResolvedValue(iconSize, variableMap, 'cp-light');
    }
  }

  for (const size of ['xs', 'sm', 'md', 'lg']) {
    spacing[size] = {
      paddingTop: itemPadding,
      paddingRight: itemPadding,
      paddingBottom: itemPadding,
      paddingLeft: itemPadding,
      gap: itemGap,
      sectionPadding: sectionPadding,
      sectionGap: sectionGap,
      rootGap: rootGap
    };
  }

  // Typography
  let fontFamily = null;
  let fontSize = null;
  let fontWeight = null;
  let lineHeight = null;

  if (labelStyles['font-family']) {
    fontFamily = labelStyles['font-family'].raw || labelStyles['font-family'];
  }
  if (labelStyles['font-size']) {
    fontSize = labelStyles['font-size'].raw || labelStyles['font-size'];
  }
  if (labelStyles['font-weight']) {
    fontWeight = labelStyles['font-weight'].raw || labelStyles['font-weight'];
  }
  if (labelStyles['line-height']) {
    lineHeight = labelStyles['line-height'].raw || labelStyles['line-height'];
  }

  // Resolve typography values
  const resolvedFontFamily = fontFamily ? getResolvedValue(fontFamily, variableMap, 'cp-light') : "'Figtree', sans-serif";
  const resolvedFontSize = fontSize ? getResolvedValue(fontSize, variableMap, 'cp-light') : '0.875rem';
  const resolvedFontWeight = fontWeight ? getResolvedValue(fontWeight, variableMap, 'cp-light') : '400';
  const resolvedLineHeight = lineHeight ? getResolvedValue(lineHeight, variableMap, 'cp-light') : null;

  const typography = {
    fontFamily: resolvedFontFamily,
    fontWeight: resolvedFontWeight,
    lineHeight: resolvedLineHeight,
    letterSpacing: null,
    textTransform: null,
    sizes: {},
  };

  for (const size of ['xs', 'sm', 'md', 'lg']) {
    typography.sizes[size] = {
      fontSize: resolvedFontSize,
      lineHeight: resolvedLineHeight,
    };
  }

  // Borders
  let sectionBorderRadius = '0 12px 12px 0';
  let itemBorderRadius = '8px';

  if (sectionStyles['border-radius']) {
    sectionBorderRadius = sectionStyles['border-radius'].raw || sectionStyles['border-radius'];
    if (typeof sectionBorderRadius === 'string' && sectionBorderRadius.includes('var(')) {
      sectionBorderRadius = getResolvedValue(sectionBorderRadius, variableMap, 'cp-light');
    }
  }
  if (itemStyles['border-radius']) {
    itemBorderRadius = itemStyles['border-radius'].raw || itemStyles['border-radius'];
    if (typeof itemBorderRadius === 'string' && itemBorderRadius.includes('var(')) {
      itemBorderRadius = getResolvedValue(itemBorderRadius, variableMap, 'cp-light');
    }
  }

  const borders = {
    width: '1px',
    style: 'solid',
    radius: {
      default: itemBorderRadius,
      section: sectionBorderRadius
    },
  };

  // Colors
  const colors = buildLeftSidebarColors(componentStyles, variableMap);

  // Elevation
  let sectionShadow = 'none';
  if (sectionStyles['box-shadow']) {
    sectionShadow = sectionStyles['box-shadow'].raw || sectionStyles['box-shadow'];
    if (typeof sectionShadow === 'string' && sectionShadow.includes('var(')) {
      sectionShadow = getResolvedValue(sectionShadow, variableMap, 'cp-light');
    }
  }

  const elevation = {
    default: 'none',
    hover: 'none',
    active: 'none',
    focus: 'none',
    section: sectionShadow
  };

  // Transitions
  let rootTransition = 'width 0.2s ease';
  let itemTransition = 'background-color 150ms ease';
  let labelTransition = 'opacity 0.2s ease, visibility 0.2s ease';

  if (rootStyles.transition) {
    rootTransition = rootStyles.transition.raw || rootStyles.transition;
    if (typeof rootTransition === 'string' && rootTransition.includes('var(')) {
      rootTransition = getResolvedValue(rootTransition, variableMap, 'cp-light');
    }
  }
  if (itemStyles.transition) {
    itemTransition = itemStyles.transition.raw || itemStyles.transition;
    if (typeof itemTransition === 'string' && itemTransition.includes('var(')) {
      itemTransition = getResolvedValue(itemTransition, variableMap, 'cp-light');
    }
  }
  if (labelStyles.transition) {
    labelTransition = labelStyles.transition.raw || labelStyles.transition;
    if (typeof labelTransition === 'string' && labelTransition.includes('var(')) {
      labelTransition = getResolvedValue(labelTransition, variableMap, 'cp-light');
    }
  }

  const transitions = {
    default: rootTransition,
    properties: {
      width: rootTransition,
      'background-color': itemTransition,
      opacity: labelTransition,
      visibility: labelTransition
    }
  };

  // Layout
  let rootDisplay = 'flex';
  let rootFlexDirection = 'column';
  let itemDisplay = 'flex';
  let itemAlignItems = 'center';

  if (rootStyles.display) {
    rootDisplay = rootStyles.display.raw || rootStyles.display;
    if (rootDisplay.includes('var(')) {
      rootDisplay = getResolvedValue(rootDisplay, variableMap, 'cp-light');
    }
  }
  if (rootStyles['flex-direction']) {
    rootFlexDirection = rootStyles['flex-direction'].raw || rootStyles['flex-direction'];
    if (rootFlexDirection.includes('var(')) {
      rootFlexDirection = getResolvedValue(rootFlexDirection, variableMap, 'cp-light');
    }
  }
  if (itemStyles.display) {
    itemDisplay = itemStyles.display.raw || itemStyles.display;
    if (itemDisplay.includes('var(')) {
      itemDisplay = getResolvedValue(itemDisplay, variableMap, 'cp-light');
    }
  }
  if (itemStyles['align-items']) {
    itemAlignItems = itemStyles['align-items'].raw || itemStyles['align-items'];
    if (itemAlignItems.includes('var(')) {
      itemAlignItems = getResolvedValue(itemAlignItems, variableMap, 'cp-light');
    }
  }

  const layout = {
    display: rootDisplay,
    alignItems: itemAlignItems,
    justifyContent: null,
    flexDirection: rootFlexDirection
  };

  // Icon specs
  const iconSpecs = {
    size: iconSize,
    width: iconSize,
    height: iconSize,
    svgSize: iconSize
  };

  // Build visual specifications
  const visualSpecifications = {
    dimensions,
    spacing,
    typography,
    borders,
    colors,
    elevation,
    transitions,
    layout,
    iconSpecs
  };

  // Resolve all variables in visual specifications
  const resolvedVisualSpecs = resolveAllVarReferences(visualSpecifications, variableMap);

  // Build CSS class styles with resolved values
  const cssClassStyles = {};
  
  // Helper to resolve a style value
  const resolveStyleValue = (value, defaultContext = 'cp-light') => {
    if (!value) return value;
    const rawValue = typeof value === 'object' ? value.raw || value : value;
    if (rawValue && typeof rawValue === 'string') {
      if (rawValue.includes('var(')) {
        return getResolvedValue(rawValue, variableMap, defaultContext);
      }
      return rawValue;
    }
    return rawValue;
  };
  
  // Build styles for each selector
  const selectors = [
    '.left-sidebar',
    '.left-sidebar:hover',
    '.left-sidebar__section',
    '.left-sidebar__item',
    '.left-sidebar__item:hover',
    '.left-sidebar__item--active',
    '.left-sidebar__item--active:hover',
    '.left-sidebar__icon',
    '.left-sidebar__icon svg',
    '.left-sidebar__item--active .left-sidebar__icon',
    '.left-sidebar__label',
    '.left-sidebar:hover .left-sidebar__label',
    '.left-sidebar[data-panel-open="true"] .left-sidebar__section',
    '.left-sidebar[data-panel-open="true"]:hover',
    '.left-sidebar[data-panel-open="true"] .left-sidebar__label',
    '.left-sidebar[data-panel-open="true"] .left-sidebar__item--active:not([data-active="true"])',
    '.left-sidebar[data-panel-open="true"] .left-sidebar__item--active:not([data-active="true"]) .left-sidebar__icon',
    '.left-sidebar[data-panel-open="true"] .left-sidebar__item[data-active="true"]',
    '.left-sidebar[data-panel-open="true"] .left-sidebar__item[data-active="true"] .left-sidebar__icon',
    '.left-sidebar[data-panel-open="true"] .left-sidebar__item[data-active="true"]:hover',
    'html.dark .left-sidebar__item:hover'
  ];

  for (const selector of selectors) {
    const styles = componentStyles[selector];
    if (styles) {
      const resolvedStyles = {};
      for (const [prop, value] of Object.entries(styles)) {
        if (prop.startsWith('_')) continue;
        resolvedStyles[prop] = resolveStyleValue(value);
      }
      cssClassStyles[selector] = resolvedStyles;
    }
  }

  // Resolve all variables in CSS class styles (final pass)
  const resolvedCssClassStyles = resolveAllVarReferences(cssClassStyles, variableMap);

  // Build accessibility
  const accessibility = {
    role: 'navigation',
    tabIndex: null,
    keyboardSupport: {},
    ariaAttributes: {},
    focusVisible: {}
  };

  // Default sections for each theme
  const defaultSections = {
    cp: [
      {
        items: [
          { icon: 'home', label: 'Welcome screen' },
          { icon: 'squares-2x2', label: 'Dashboard' },
          { icon: 'star', label: 'My menu' },
          { icon: 'clock', label: 'Recent' }
        ]
      },
      {
        items: [
          { icon: 'magnifying-glass', label: 'Search' },
          { icon: 'squares-plus', label: 'Command Center' },
          { icon: 'calculator', label: 'Accounting' },
          { icon: 'chart-bar', label: 'Planning' },
          { icon: 'document-arrow-down', label: 'Capture & contracts' },
          { icon: 'clipboard-document-list', label: 'Projects' },
          { icon: 'cube', label: 'Materials' },
          { icon: 'clock', label: 'Time & expense' },
          { icon: 'users', label: 'People' },
          { icon: 'document-chart-bar', label: 'Reports' },
          { icon: 'cog-6-tooth', label: 'Admin' }
        ]
      }
    ],
    vp: [
      {
        items: [
          { icon: 'rectangle-group', label: 'Command Center', active: true },
          { icon: 'book-open', label: 'Programs' },
          { icon: 'briefcase', label: 'Portfolios' },
          { icon: 'building-office', label: 'Projects' },
          { icon: 'Risk Shield', label: 'Risk' },
          { icon: 'Report', label: 'Reports' },
          { icon: 'calendar-days', label: 'Calendars' },
          { icon: 'document', label: 'Codes' },
          { icon: 'wallet', label: 'Rates' },
          { icon: 'Resource', label: 'Resources' },
          { icon: 'cog-6-tooth', label: 'Settings' },
          { icon: 'plus', label: 'Add Menu' }
        ]
      }
    ],
    ppm: [
      {
        items: [
          { icon: 'rectangle-group', label: 'Command Center', active: true },
          { icon: 'book-open', label: 'Programs' },
          { icon: 'briefcase', label: 'Portfolios' },
          { icon: 'building-office', label: 'Projects' },
          { icon: 'Risk Shield', label: 'Risk' },
          { icon: 'Report', label: 'Reports' },
          { icon: 'calendar-days', label: 'Calendars' },
          { icon: 'document', label: 'Codes' },
          { icon: 'wallet', label: 'Rates' },
          { icon: 'Resource', label: 'Resources' },
          { icon: 'cog-6-tooth', label: 'Settings' },
          { icon: 'plus', label: 'Add Menu' }
        ]
      }
    ],
    maconomy: [
      {
        items: [
          { icon: 'rectangle-group', label: 'Command Center', active: true },
          { icon: 'book-open', label: 'Programs' },
          { icon: 'briefcase', label: 'Portfolios' },
          { icon: 'building-office', label: 'Projects' },
          { icon: 'Risk Shield', label: 'Risk' },
          { icon: 'Report', label: 'Reports' },
          { icon: 'calendar-days', label: 'Calendars' },
          { icon: 'document', label: 'Codes' },
          { icon: 'wallet', label: 'Rates' },
          { icon: 'Resource', label: 'Resources' },
          { icon: 'cog-6-tooth', label: 'Settings' },
          { icon: 'plus', label: 'Add Menu' }
        ]
      }
    ]
  };

  // Final component data
  componentData.visualSpecifications = resolvedVisualSpecs;
  componentData.accessibility = accessibility;
  componentData.cssClassStyles = resolvedCssClassStyles;
  componentData.defaultSections = defaultSections;
  componentData._variantIndex = {};
  componentData._variantMetadata = {
    availableVariants: []
  };

  // Write to file
  console.log('💾 Writing leftsidebar.json...');
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(componentData, null, 2), 'utf-8');
  console.log(`✅ Generated ${OUTPUT_FILE}\n`);

  return componentData;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateLeftSidebarJSON().catch(console.error);
}

export { generateLeftSidebarJSON };
