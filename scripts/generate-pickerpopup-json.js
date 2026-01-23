/**
 * Generate PickerPopup JSON
 * Creates a comprehensive pickerpopup.json file with all properties and resolved CSS variables
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
const COMPONENT_PATH = path.join(rootDir, 'src/components/ui/PickerPopup.astro');
const OUTPUT_FILE = path.join(rootDir, 'mcp-data/components/pickerpopup.json');
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
 * Build colors structure for PickerPopup
 */
function buildPickerPopupColors(componentStyles, variableMap) {
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
        focus: {},
        active: {},
        disabled: {}
      },
      dark: {
        default: {},
        hover: {},
        focus: {},
        active: {},
        disabled: {}
      }
    };
  }

  // Extract colors from CSS classes
  const popupStyles = componentStyles['.picker-popup'] || {};
  const headerStyles = componentStyles['.picker-popup__header'] || {};
  const titleStyles = componentStyles['.picker-popup__title'] || {};
  const closeStyles = componentStyles['.picker-popup__close'] || {};
  const closeHoverStyles = componentStyles['.picker-popup__close:hover'] || {};

  // Extract raw values
  const popupBg = popupStyles['background-color']?.raw || popupStyles['background-color'] || null;
  const popupBorder = popupStyles.border?.raw || popupStyles.border || null;
  const headerBorder = headerStyles['border-bottom']?.raw || headerStyles['border-bottom'] || null;
  const titleColor = titleStyles.color?.raw || titleStyles.color || null;
  const closeColor = closeStyles.color?.raw || closeStyles.color || null;
  const closeBg = closeStyles['background-color']?.raw || closeStyles['background-color'] || null;
  const closeHoverBg = closeHoverStyles['background-color']?.raw || closeHoverStyles['background-color'] || null;
  const closeHoverColor = closeHoverStyles.color?.raw || closeHoverStyles.color || null;

  // Extract border color from border property (format: "1px solid #color")
  let popupBorderColor = null;
  if (popupBorder && typeof popupBorder === 'string') {
    const borderMatch = popupBorder.match(/(?:var\([^)]+\)|#[0-9A-Fa-f]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/);
    if (borderMatch) {
      popupBorderColor = borderMatch[0];
    }
  }

  let headerBorderColor = null;
  if (headerBorder && typeof headerBorder === 'string') {
    const borderMatch = headerBorder.match(/(?:var\([^)]+\)|#[0-9A-Fa-f]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/);
    if (borderMatch) {
      headerBorderColor = borderMatch[0];
    }
  }

  // Resolve colors for all themes and modes
  for (const theme of THEMES) {
    for (const mode of MODES) {
      const context = `${theme}-${mode}`;
      
      // Default state - popup container
      const defaultState = {
        background: popupBg ? getResolvedValue(popupBg, variableMap, context) : null,
        text: titleColor ? getResolvedValue(titleColor, variableMap, context) : null,
        border: popupBorderColor ? getResolvedValue(popupBorderColor, variableMap, context) : null,
        iconColor: closeColor ? getResolvedValue(closeColor, variableMap, context) : null,
        headerBorder: headerBorderColor ? getResolvedValue(headerBorderColor, variableMap, context) : null,
      };

      // Hover state - close button
      const hoverState = {
        background: popupBg ? getResolvedValue(popupBg, variableMap, context) : null,
        text: titleColor ? getResolvedValue(titleColor, variableMap, context) : null,
        border: popupBorderColor ? getResolvedValue(popupBorderColor, variableMap, context) : null,
        iconColor: closeHoverColor ? getResolvedValue(closeHoverColor, variableMap, context) : (closeColor ? getResolvedValue(closeColor, variableMap, context) : null),
        closeButtonBackground: closeHoverBg ? getResolvedValue(closeHoverBg, variableMap, context) : null,
        closeButtonIconColor: closeHoverColor ? getResolvedValue(closeHoverColor, variableMap, context) : null,
      };

      // Focus state - close button (similar to hover for now)
      const focusState = {
        background: popupBg ? getResolvedValue(popupBg, variableMap, context) : null,
        text: titleColor ? getResolvedValue(titleColor, variableMap, context) : null,
        border: popupBorderColor ? getResolvedValue(popupBorderColor, variableMap, context) : null,
        iconColor: closeColor ? getResolvedValue(closeColor, variableMap, context) : null,
        closeButtonBackground: closeHoverBg ? getResolvedValue(closeHoverBg, variableMap, context) : null,
        closeButtonIconColor: closeHoverColor ? getResolvedValue(closeHoverColor, variableMap, context) : null,
      };

      // Active state - close button (same as default for popup)
      const activeState = {
        background: popupBg ? getResolvedValue(popupBg, variableMap, context) : null,
        text: titleColor ? getResolvedValue(titleColor, variableMap, context) : null,
        border: popupBorderColor ? getResolvedValue(popupBorderColor, variableMap, context) : null,
        iconColor: closeColor ? getResolvedValue(closeColor, variableMap, context) : null,
      };

      // Disabled state - not typically used for popup, but include for completeness
      const disabledState = {
        background: popupBg ? getResolvedValue(popupBg, variableMap, context) : null,
        text: titleColor ? getResolvedValue(titleColor, variableMap, context) : null,
        border: popupBorderColor ? getResolvedValue(popupBorderColor, variableMap, context) : null,
        iconColor: closeColor ? getResolvedValue(closeColor, variableMap, context) : null,
        opacity: '0.5',
      };

      colors.variants.default[theme][mode].default = defaultState;
      colors.variants.default[theme][mode].hover = hoverState;
      colors.variants.default[theme][mode].focus = focusState;
      colors.variants.default[theme][mode].active = activeState;
      colors.variants.default[theme][mode].disabled = disabledState;
    }
  }

  return colors;
}

/**
 * Generate PickerPopup JSON
 */
async function generatePickerPopupJSON() {
  console.log('🔧 Generating PickerPopup JSON...\n');

  // Load CSS spacing map
  const cssSpacingMap = loadCssSpacing();

  // Parse component
  console.log('📦 Parsing PickerPopup component...');
  const parsed = await parseComponent(COMPONENT_PATH, cssSpacingMap);
  const componentName = getComponentName(COMPONENT_PATH);
  const description = extractDescription(COMPONENT_PATH) || 'PickerPopup Component';
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
  const popupStyles = componentStyles['.picker-popup'] || {};
  const headerStyles = componentStyles['.picker-popup__header'] || {};
  const titleStyles = componentStyles['.picker-popup__title'] || {};
  const closeStyles = componentStyles['.picker-popup__close'] || {};
  const closeHoverStyles = componentStyles['.picker-popup__close:hover'] || {};

  // Dimensions
  // Extract base values (not from media queries)
  // Base CSS has: min-width: 280px, max-width: 320px
  // Media query has responsive values, but we want base for dimensions
  const dimensions = {};
  
  // Get base values - use hardcoded base values from CSS since extractComponentStyles
  // might include media query overrides
  let minWidth = '280px'; // Base value from .picker-popup CSS
  let maxWidth = '320px'; // Base value from .picker-popup CSS
  let width = null;

  // Check if we have explicit values in styles (non-media-query)
  // If the value contains 'calc' or 'vw', it's likely from media query, so ignore it
  if (popupStyles['min-width']) {
    const rawMinWidth = popupStyles['min-width'].raw || popupStyles['min-width'];
    if (rawMinWidth && typeof rawMinWidth === 'string' && 
        !rawMinWidth.includes('calc') && !rawMinWidth.includes('vw') && 
        rawMinWidth !== 'auto') {
      // Only use if it's a pixel value (base style)
      if (rawMinWidth.includes('px') || rawMinWidth.match(/^\d+$/)) {
        minWidth = rawMinWidth;
      }
    }
  }
  if (popupStyles['max-width']) {
    const rawMaxWidth = popupStyles['max-width'].raw || popupStyles['max-width'];
    if (rawMaxWidth && typeof rawMaxWidth === 'string' && 
        !rawMaxWidth.includes('calc') && !rawMaxWidth.includes('vw')) {
      // Only use if it's a pixel value (base style)
      if (rawMaxWidth.includes('px') || rawMaxWidth.match(/^\d+$/)) {
        maxWidth = rawMaxWidth;
      }
    }
  }
  if (popupStyles.width) {
    const rawWidth = popupStyles.width.raw || popupStyles.width;
    if (rawWidth && typeof rawWidth === 'string' && 
        !rawWidth.includes('calc') && !rawWidth.includes('vw')) {
      width = rawWidth;
    }
  }

  // Resolve dimension values (280px and 320px don't need resolution, but do it for consistency)
  const resolvedMinWidth = minWidth ? getResolvedValue(minWidth, variableMap, 'cp-light') : '280px';
  const resolvedMaxWidth = maxWidth ? getResolvedValue(maxWidth, variableMap, 'cp-light') : '320px';
  const resolvedWidth = width ? getResolvedValue(width, variableMap, 'cp-light') : null;

  for (const size of ['xs', 'sm', 'md', 'lg']) {
    dimensions[size] = {
      height: null,
      width: resolvedWidth || null,
      minWidth: resolvedMinWidth,
      maxWidth: resolvedMaxWidth,
    };
  }

  // Spacing
  const spacing = {};
  let padding = null;
  if (popupStyles.padding) {
    padding = popupStyles.padding.raw || popupStyles.padding;
  }

  // Resolve padding
  let resolvedPadding = '0';
  if (padding) {
    resolvedPadding = getResolvedValue(padding, variableMap, 'cp-light');
    // If padding is a single value, apply to all sides
    if (resolvedPadding && !resolvedPadding.includes(' ')) {
      for (const size of ['xs', 'sm', 'md', 'lg']) {
        spacing[size] = {
          paddingTop: resolvedPadding,
          paddingRight: resolvedPadding,
          paddingBottom: resolvedPadding,
          paddingLeft: resolvedPadding,
          gap: '0',
        };
      }
    } else if (resolvedPadding) {
      // Handle multiple values (e.g., "16px 12px")
      const parts = resolvedPadding.split(/\s+/);
      for (const size of ['xs', 'sm', 'md', 'lg']) {
        spacing[size] = {
          paddingTop: parts[0] || '0',
          paddingRight: parts[1] || parts[0] || '0',
          paddingBottom: parts[2] || parts[0] || '0',
          paddingLeft: parts[3] || parts[1] || parts[0] || '0',
          gap: '0',
        };
      }
    }
  } else {
    for (const size of ['xs', 'sm', 'md', 'lg']) {
      spacing[size] = {
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
        gap: '0',
      };
    }
  }

  // Typography
  // Default font family from tokens
  let fontFamily = "'Figtree', sans-serif"; // Default from tokens.css
  let fontSize = null;
  let fontWeight = null;
  let lineHeight = null;

  if (titleStyles['font-family']) {
    fontFamily = titleStyles['font-family'].raw || titleStyles['font-family'];
  }
  if (titleStyles['font-size']) {
    fontSize = titleStyles['font-size'].raw || titleStyles['font-size'];
  }
  if (titleStyles['font-weight']) {
    fontWeight = titleStyles['font-weight'].raw || titleStyles['font-weight'];
  }
  if (titleStyles['line-height']) {
    lineHeight = titleStyles['line-height'].raw || titleStyles['line-height'];
  }

  // Resolve typography values
  const resolvedFontFamily = fontFamily ? getResolvedValue(fontFamily, variableMap, 'cp-light') : null;
  const resolvedFontSize = fontSize ? getResolvedValue(fontSize, variableMap, 'cp-light') : null;
  const resolvedFontWeight = fontWeight ? getResolvedValue(fontWeight, variableMap, 'cp-light') : null;
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
  let borderWidth = null;
  let borderStyle = null;
  let borderRadius = null;

  if (popupStyles.border) {
    const border = popupStyles.border.raw || popupStyles.border;
    if (typeof border === 'string') {
      const parts = border.split(/\s+/);
      borderWidth = parts[0] || null;
      borderStyle = parts[1] || null;
    }
  }
  if (popupStyles['border-radius']) {
    borderRadius = popupStyles['border-radius'].raw || popupStyles['border-radius'];
  }

  const resolvedBorderWidth = borderWidth ? getResolvedValue(borderWidth, variableMap, 'cp-light') : null;
  const resolvedBorderStyle = borderStyle || null;
  const resolvedBorderRadius = borderRadius ? getResolvedValue(borderRadius, variableMap, 'cp-light') : null;

  const borders = {
    width: resolvedBorderWidth,
    style: resolvedBorderStyle,
    radius: {
      default: resolvedBorderRadius,
    },
  };

  // Colors
  const colors = buildPickerPopupColors(componentStyles, variableMap);

  // Elevation (box-shadow)
  let boxShadow = null;
  if (popupStyles['box-shadow']) {
    boxShadow = popupStyles['box-shadow'].raw || popupStyles['box-shadow'];
  }

  const resolvedBoxShadow = boxShadow ? getResolvedValue(boxShadow, variableMap, 'cp-light') : 'none';

  const elevation = {
    default: resolvedBoxShadow,
    hover: null,
    active: null,
    focus: null,
  };

  // Transitions
  let transition = null;
  if (closeStyles.transition) {
    transition = closeStyles.transition.raw || closeStyles.transition;
  }

  const resolvedTransition = transition ? getResolvedValue(transition, variableMap, 'cp-light') : null;

  const transitions = {
    default: resolvedTransition,
    properties: resolvedTransition ? {
      'background-color': resolvedTransition,
      'color': resolvedTransition,
      'all': resolvedTransition,
    } : {},
  };

  // Layout
  // Base values: display: none, position: absolute
  // Media query overrides position to 'fixed', but we want base for layout
  let display = 'none';
  let position = 'absolute'; // Base value
  let alignItems = null;
  let justifyContent = null;

  if (popupStyles.display) {
    display = popupStyles.display.raw || popupStyles.display;
  }
  // Only use position from styles if it's not 'fixed' (which is from media query)
  if (popupStyles.position) {
    const rawPosition = popupStyles.position.raw || popupStyles.position;
    // 'fixed' is from media query, use base 'absolute' instead
    if (rawPosition !== 'fixed') {
      position = rawPosition;
    }
  }
  if (headerStyles.display) {
    const headerDisplay = headerStyles.display.raw || headerStyles.display;
    if (headerDisplay === 'flex') {
      alignItems = headerStyles['align-items']?.raw || headerStyles['align-items'] || null;
      justifyContent = headerStyles['justify-content']?.raw || headerStyles['justify-content'] || null;
    }
  }

  const resolvedDisplay = display ? getResolvedValue(display, variableMap, 'cp-light') : 'none';
  const resolvedPosition = position ? getResolvedValue(position, variableMap, 'cp-light') : 'absolute';

  const layout = {
    display: resolvedDisplay,
    position: resolvedPosition,
    alignItems: alignItems ? getResolvedValue(alignItems, variableMap, 'cp-light') : null,
    justifyContent: justifyContent ? getResolvedValue(justifyContent, variableMap, 'cp-light') : null,
  };

  // Icon Specifications
  const iconSpecs = {
    closeButton: {
      name: 'x-mark',
      size: 'sm',
      dimensions: {
        width: '16px',
        height: '16px',
      },
      colors: {}
    }
  };

  // Build icon colors for all themes and modes
  const closeColor = closeStyles.color?.raw || closeStyles.color || null;
  const closeHoverColor = closeHoverStyles.color?.raw || closeHoverStyles.color || null;

  for (const theme of THEMES) {
    iconSpecs.closeButton.colors[theme] = {};
    for (const mode of MODES) {
      const context = `${theme}-${mode}`;
      iconSpecs.closeButton.colors[theme][mode] = {
        default: closeColor ? getResolvedValue(closeColor, variableMap, context) : null,
        hover: closeHoverColor ? getResolvedValue(closeHoverColor, variableMap, context) : null,
        focus: closeHoverColor ? getResolvedValue(closeHoverColor, variableMap, context) : null,
        active: closeColor ? getResolvedValue(closeColor, variableMap, context) : null,
        disabled: closeColor ? getResolvedValue(closeColor, variableMap, context) : null,
      };
    }
  }

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
    iconSpecs,
  };

  // Resolve all variables in visual specifications
  const resolvedVisualSpecs = resolveAllVarReferences(visualSpecifications, variableMap);

  // Build CSS class styles with resolved values for cp-light (base theme)
  const cssClassStyles = {};
  
  // Helper to resolve a style value
  const resolveStyleValue = (value, defaultContext = 'cp-light') => {
    if (!value) return value;
    const rawValue = typeof value === 'object' ? value.raw || value : value;
    if (rawValue && typeof rawValue === 'string') {
      if (rawValue.includes('var(')) {
        return getResolvedValue(rawValue, variableMap, defaultContext);
      }
      // Remove quotes from content property if present
      if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
        return rawValue.slice(1, -1);
      }
      return rawValue;
    }
    return rawValue;
  };
  
  // .picker-popup
  if (popupStyles) {
    const resolvedPopupStyles = {};
    for (const [prop, value] of Object.entries(popupStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedPopupStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.picker-popup'] = resolvedPopupStyles;
  }

  // .picker-popup.is-open
  const openStyles = componentStyles['.picker-popup.is-open'] || {};
  if (openStyles) {
    const resolvedOpenStyles = {};
    for (const [prop, value] of Object.entries(openStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedOpenStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.picker-popup.is-open'] = resolvedOpenStyles;
  }

  // .picker-popup__header
  if (headerStyles) {
    const resolvedHeaderStyles = {};
    for (const [prop, value] of Object.entries(headerStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedHeaderStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.picker-popup__header'] = resolvedHeaderStyles;
  }

  // .picker-popup__title
  if (titleStyles) {
    const resolvedTitleStyles = {};
    for (const [prop, value] of Object.entries(titleStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedTitleStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.picker-popup__title'] = resolvedTitleStyles;
  }

  // .picker-popup__close
  if (closeStyles) {
    const resolvedCloseStyles = {};
    for (const [prop, value] of Object.entries(closeStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedCloseStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.picker-popup__close'] = resolvedCloseStyles;
  }

  // .picker-popup__close:hover
  if (closeHoverStyles) {
    const resolvedCloseHoverStyles = {};
    for (const [prop, value] of Object.entries(closeHoverStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedCloseHoverStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.picker-popup__close:hover'] = resolvedCloseHoverStyles;
  }

  // Resolve all variables in CSS class styles (final pass)
  const resolvedCssClassStyles = resolveAllVarReferences(cssClassStyles, variableMap);

  // Build accessibility
  const accessibility = {
    role: 'dialog',
    tabIndex: null,
    keyboardSupport: {
      escape: 'Closes the popup',
    },
    ariaAttributes: {
      'aria-modal': 'true',
      'aria-labelledby': 'Conditional - set when title prop is provided',
    },
    focusVisible: {},
  };

  // Final component data
  componentData.visualSpecifications = resolvedVisualSpecs;
  componentData.accessibility = accessibility;
  componentData.cssClassStyles = resolvedCssClassStyles;
  componentData._variantIndex = {};
  componentData._variantMetadata = {
    availableVariants: [],
  };

  // Write to file
  console.log('💾 Writing pickerpopup.json...');
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
  generatePickerPopupJSON().catch(console.error);
}

export { generatePickerPopupJSON };
