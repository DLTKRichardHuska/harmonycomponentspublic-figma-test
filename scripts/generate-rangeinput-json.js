/**
 * Generate RangeInput JSON
 * Creates a comprehensive rangeinput.json file with all properties and resolved CSS variables
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
const COMPONENT_PATH = path.join(rootDir, 'src/components/ui/RangeInput.astro');
const OUTPUT_FILE = path.join(rootDir, 'mcp-data/components/rangeinput.json');
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
 * Build colors structure for RangeInput
 */
function buildRangeInputColors(componentStyles, variableMap) {
  const colors = {
    variants: {
      default: {}
    }
  };

  // Initialize structure for all themes and modes
  for (const theme of THEMES) {
    colors.variants.default[theme] = {
      light: { default: {}, hover: {}, focus: {}, disabled: {} },
      dark: { default: {}, hover: {}, focus: {}, disabled: {} }
    };
  }

  // Extract color values from styles
  let trackColor = null;
  let thumbColor = null;
  let valueTextColor = null;
  let thumbHoverTransform = null;

  // Extract from .range CSS variables (these are local variables defined in the component)
  const rangeStyles = componentStyles['.range'] || {};
  if (rangeStyles['--track-color']) {
    trackColor = rangeStyles['--track-color'].raw || rangeStyles['--track-color'];
  }
  if (rangeStyles['--thumb-color']) {
    thumbColor = rangeStyles['--thumb-color'].raw || rangeStyles['--thumb-color'];
  }

  // Extract from .range-value
  const valueStyles = componentStyles['.range-value'] || {};
  if (valueStyles.color) {
    valueTextColor = valueStyles.color.raw || valueStyles.color;
  }

  // Extract hover state from thumb
  const thumbHoverStyles = componentStyles['.range::-webkit-slider-thumb:hover'] || {};
  if (thumbHoverStyles.transform) {
    thumbHoverTransform = thumbHoverStyles.transform.raw || thumbHoverStyles.transform;
  }

  // If track-color not found, try to get from --border-color
  if (!trackColor) {
    // Try to find border-color from track styles
    const trackStyles = componentStyles['.range::-webkit-slider-runnable-track'] || {};
    if (trackStyles.background) {
      trackColor = trackStyles.background.raw || trackStyles.background;
    }
  }

  // If thumb-color not found, try to get from thumb styles
  if (!thumbColor) {
    const thumbStyles = componentStyles['.range::-webkit-slider-thumb'] || {};
    if (thumbStyles.background) {
      thumbColor = thumbStyles.background.raw || thumbStyles.background;
    }
  }

  // Default fallbacks if still not found
  if (!trackColor) {
    trackColor = 'var(--border-color)';
  }
  if (!thumbColor) {
    thumbColor = 'var(--theme-primary)';
  }
  if (!valueTextColor) {
    valueTextColor = 'var(--text-secondary)';
  }

  // Note: trackColor and thumbColor may be CSS variables (var(--border-color), var(--theme-primary))
  // These will be resolved per theme/mode in the loop below

  // Resolve colors for all themes and modes
  for (const theme of THEMES) {
    for (const mode of MODES) {
      const context = `${theme}-${mode}`;
      
      // Get theme primary and hover colors
      const primaryColor = getResolvedValue('var(--theme-primary)', variableMap, context);
      const primaryHoverColor = getResolvedValue('var(--theme-primary-hover)', variableMap, context) || 
                                getResolvedValue('var(--theme-primary)', variableMap, context);

      const defaultState = {
        track: getResolvedValue(trackColor, variableMap, context),
        thumb: getResolvedValue(thumbColor, variableMap, context),
        valueText: getResolvedValue(valueTextColor, variableMap, context),
        background: 'transparent',
        border: 'transparent',
        iconColor: null,
      };

      const hoverState = {
        track: getResolvedValue(trackColor, variableMap, context),
        thumb: primaryHoverColor,
        valueText: getResolvedValue(valueTextColor, variableMap, context),
        background: 'transparent',
        border: 'transparent',
        iconColor: null,
        transform: thumbHoverTransform || 'scale(1.1)',
      };

      const focusState = {
        track: getResolvedValue(trackColor, variableMap, context),
        thumb: primaryColor,
        valueText: getResolvedValue(valueTextColor, variableMap, context),
        background: 'transparent',
        border: 'transparent',
        iconColor: null,
      };

      const disabledState = {
        track: getResolvedValue(trackColor, variableMap, context),
        thumb: primaryColor,
        valueText: getResolvedValue(valueTextColor, variableMap, context),
        background: 'transparent',
        border: 'transparent',
        iconColor: null,
        opacity: '0.5',
        cursor: 'not-allowed',
      };

      colors.variants.default[theme][mode].default = defaultState;
      colors.variants.default[theme][mode].hover = hoverState;
      colors.variants.default[theme][mode].focus = focusState;
      colors.variants.default[theme][mode].disabled = disabledState;
    }
  }

  return colors;
}

/**
 * Generate RangeInput JSON
 */
async function generateRangeInputJSON() {
  console.log('🔧 Generating RangeInput JSON...\n');

  // Load CSS spacing map
  const cssSpacingMap = loadCssSpacing();

  // Parse component
  console.log('📦 Parsing RangeInput component...');
  const parsed = await parseComponent(COMPONENT_PATH, cssSpacingMap);
  const componentName = getComponentName(COMPONENT_PATH);
  const description = extractDescription(COMPONENT_PATH) || 'RangeInput Component';
  console.log(`✅ Parsed ${componentName}\n`);

  // Parse CSS files and resolve variables
  console.log('🎨 Parsing CSS files and resolving variables...');
  const parsedCSS = parseCSSFiles(CSS_DIR);
  const tokensCssContent = fs.readFileSync(TOKENS_CSS, 'utf-8');
  const variableMap = resolveCSSVariables(tokensCssContent);
  console.log(`✅ Resolved ${Object.keys(variableMap).length} CSS variables\n`);

  // Extract component styles - include all range input related classes
  const cssClassesToExtract = [
    'range-input-form-wrapper',
    'range-input-form-wrapper--inline',
    'range-input-form-wrapper--stacked',
    'range-input-form-wrapper__label',
    'range-wrap',
    'range',
    'range-value'
  ];

  const componentStyles = extractComponentStyles(componentName, cssClassesToExtract, parsedCSS, variableMap);

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
  const rangeWrapStyles = componentStyles['.range-wrap'] || {};
  const rangeStyles = componentStyles['.range'] || {};
  const rangeValueStyles = componentStyles['.range-value'] || {};
  const wrapperStyles = componentStyles['.range-input-form-wrapper'] || {};
  const inlineWrapperStyles = componentStyles['.range-input-form-wrapper--inline'] || {};
  const stackedWrapperStyles = componentStyles['.range-input-form-wrapper--stacked'] || {};

  // Extract pseudo-element styles
  const webkitTrackStyles = componentStyles['.range::-webkit-slider-runnable-track'] || {};
  const webkitThumbStyles = componentStyles['.range::-webkit-slider-thumb'] || {};
  const webkitThumbHoverStyles = componentStyles['.range::-webkit-slider-thumb:hover'] || {};
  const mozTrackStyles = componentStyles['.range::-moz-range-track'] || {};
  const mozThumbStyles = componentStyles['.range::-moz-range-thumb'] || {};
  const rangeFocusStyles = componentStyles['.range:focus'] || {};
  const rangeDisabledStyles = componentStyles['.range:disabled'] || {};

  // Extract local CSS variables from .range (these are defined in the component CSS)
  // --thumb-size: 20px, --track-height: 6px, --track-color: var(--border-color), --thumb-color: var(--theme-primary)
  // Note: Mobile responsive styles override these to 24px and 8px, but we want the base desktop values
  let thumbSize = '20px';
  let trackHeight = '6px';
  let trackColorVar = 'var(--border-color)';
  let thumbColorVar = 'var(--theme-primary)';

  // Extract from .range styles - these are local CSS variables
  // We want the base values, not the mobile responsive overrides
  if (rangeStyles['--thumb-size']) {
    const thumbSizeRaw = rangeStyles['--thumb-size'].raw || rangeStyles['--thumb-size'];
    // Only use if it's a literal value (not a CSS variable reference)
    // The base value is 20px, mobile override is 24px - we want 20px
    if (thumbSizeRaw && !thumbSizeRaw.includes('var(')) {
      // Check if it's the base value (20px) or mobile value (24px)
      // Prefer 20px as the base desktop value
      if (thumbSizeRaw === '20px') {
        thumbSize = thumbSizeRaw;
      } else if (thumbSizeRaw === '24px') {
        // This is the mobile override, keep base value
        thumbSize = '20px';
      } else {
        thumbSize = thumbSizeRaw;
      }
    }
  }
  if (rangeStyles['--track-height']) {
    const trackHeightRaw = rangeStyles['--track-height'].raw || rangeStyles['--track-height'];
    if (trackHeightRaw && !trackHeightRaw.includes('var(')) {
      // Prefer 6px as the base desktop value
      if (trackHeightRaw === '6px') {
        trackHeight = trackHeightRaw;
      } else if (trackHeightRaw === '8px') {
        // This is the mobile override, keep base value
        trackHeight = '6px';
      } else {
        trackHeight = trackHeightRaw;
      }
    }
  }
  if (rangeStyles['--track-color']) {
    trackColorVar = rangeStyles['--track-color'].raw || rangeStyles['--track-color'];
  }
  if (rangeStyles['--thumb-color']) {
    thumbColorVar = rangeStyles['--thumb-color'].raw || rangeStyles['--thumb-color'];
  }

  // Dimensions
  const dimensions = {};

  // Extract from thumb styles if available
  if (webkitThumbStyles.width) {
    const thumbWidth = webkitThumbStyles.width.raw || webkitThumbStyles.width;
    if (!thumbWidth.includes('var(')) {
      thumbSize = thumbWidth;
    }
  }
  if (webkitTrackStyles.height) {
    const trackH = webkitTrackStyles.height.raw || webkitTrackStyles.height;
    if (!trackH.includes('var(')) {
      trackHeight = trackH;
    }
  }

  for (const size of ['xs', 'sm', 'md', 'lg']) {
    dimensions[size] = {
      height: thumbSize,
      width: '100%',
      minWidth: 'auto',
      maxWidth: 'none',
      thumbSize: thumbSize,
      trackHeight: trackHeight,
    };
  }

  // Spacing
  const spacing = {};
  // Base desktop value: var(--space-3) = 12px
  // Mobile override: var(--space-2) = 8px (we want desktop value)
  let gap = '12px';
  if (rangeWrapStyles.gap) {
    const gapRaw = rangeWrapStyles.gap.raw || rangeWrapStyles.gap;
    if (gapRaw.includes('var(--space-3)')) {
      gap = getResolvedValue('var(--space-3)', variableMap, 'cp-light');
    } else if (gapRaw.includes('var(--space-2)')) {
      // This is mobile override, use desktop value instead
      gap = getResolvedValue('var(--space-3)', variableMap, 'cp-light');
    } else if (gapRaw.includes('var(')) {
      gap = getResolvedValue(gapRaw, variableMap, 'cp-light');
    } else if (gapRaw && gapRaw !== '0' && gapRaw !== '8px') {
      // Prefer 12px over 8px (mobile value)
      gap = gapRaw;
    }
  }

  // Base desktop value: var(--space-1) = 4px (no mobile override for inline wrapper)
  // Force to 4px as per CSS definition
  let inlineGap = '4px';

  let stackedGap = '6px'; // Default: var(--space-1-5) = 6px
  if (stackedWrapperStyles.gap) {
    const stackedGapRaw = stackedWrapperStyles.gap.raw || stackedWrapperStyles.gap;
    if (stackedGapRaw.includes('var(')) {
      stackedGap = getResolvedValue(stackedGapRaw, variableMap, 'cp-light');
    } else if (stackedGapRaw && stackedGapRaw !== '0') {
      stackedGap = stackedGapRaw;
    }
  }

  let valueMinWidth = '50px'; // Default desktop value (mobile is 40px)
  if (rangeValueStyles['min-width']) {
    const valueMinWidthRaw = rangeValueStyles['min-width'].raw || rangeValueStyles['min-width'];
    if (valueMinWidthRaw.includes('var(')) {
      valueMinWidth = getResolvedValue(valueMinWidthRaw, variableMap, 'cp-light');
    } else if (valueMinWidthRaw) {
      // Prefer desktop value (50px) over mobile (40px)
      if (valueMinWidthRaw === '50px') {
        valueMinWidth = valueMinWidthRaw;
      } else if (valueMinWidthRaw === '40px') {
        // This is mobile override, use desktop value
        valueMinWidth = '50px';
      } else {
        valueMinWidth = valueMinWidthRaw;
      }
    }
  }
  
  // Also check font-size - desktop is var(--text-sm) = 0.875rem, mobile is var(--text-xs) = 0.75rem
  let valueFontSize = '0.875rem'; // Default desktop value
  if (rangeValueStyles['font-size']) {
    const fontSizeRaw = rangeValueStyles['font-size'].raw || rangeValueStyles['font-size'];
    if (fontSizeRaw.includes('var(--text-sm)')) {
      valueFontSize = getResolvedValue('var(--text-sm)', variableMap, 'cp-light');
    } else if (fontSizeRaw.includes('var(--text-xs)')) {
      // This is mobile override, use desktop value
      valueFontSize = getResolvedValue('var(--text-sm)', variableMap, 'cp-light');
    } else if (fontSizeRaw.includes('var(')) {
      valueFontSize = getResolvedValue(fontSizeRaw, variableMap, 'cp-light');
    } else if (fontSizeRaw) {
      // Prefer 0.875rem over 0.75rem
      if (fontSizeRaw === '0.875rem') {
        valueFontSize = fontSizeRaw;
      } else if (fontSizeRaw === '0.75rem') {
        // This is mobile override, use desktop value
        valueFontSize = '0.875rem';
      } else {
        valueFontSize = fontSizeRaw;
      }
    }
  }

  for (const size of ['xs', 'sm', 'md', 'lg']) {
    spacing[size] = {
      paddingTop: '0',
      paddingRight: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      gap: gap,
      inlineGap: inlineGap,
      stackedGap: stackedGap,
      valueMinWidth: valueMinWidth,
    };
  }

  // Typography
  let fontFamily = null;
  let fontSize = null;
  let fontWeight = null;
  let lineHeight = null;

  if (rangeValueStyles['font-family']) {
    fontFamily = rangeValueStyles['font-family'].raw || rangeValueStyles['font-family'];
  }
  if (rangeValueStyles['font-size']) {
    fontSize = rangeValueStyles['font-size'].raw || rangeValueStyles['font-size'];
  }
  if (rangeValueStyles['font-weight']) {
    fontWeight = rangeValueStyles['font-weight'].raw || rangeValueStyles['font-weight'];
  }
  if (rangeValueStyles['line-height']) {
    lineHeight = rangeValueStyles['line-height'].raw || rangeValueStyles['line-height'];
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

  // Default font size should be 0.875rem (var(--text-sm)) if not found
  // Use the valueFontSize we determined above (desktop value, not mobile)
  const defaultFontSize = valueFontSize || resolvedFontSize || '0.875rem';
  
  for (const size of ['xs', 'sm', 'md', 'lg']) {
    typography.sizes[size] = {
      fontSize: defaultFontSize,
      lineHeight: resolvedLineHeight,
    };
  }

  // Borders
  let trackRadius = null;
  let thumbRadius = null;

  if (webkitTrackStyles['border-radius']) {
    trackRadius = webkitTrackStyles['border-radius'].raw || webkitTrackStyles['border-radius'];
    if (trackRadius.includes('var(')) {
      trackRadius = getResolvedValue(trackRadius, variableMap, 'cp-light');
    }
  }
  if (webkitThumbStyles['border-radius']) {
    thumbRadius = webkitThumbStyles['border-radius'].raw || webkitThumbStyles['border-radius'];
    if (thumbRadius.includes('var(')) {
      thumbRadius = getResolvedValue(thumbRadius, variableMap, 'cp-light');
    }
  }

  const borders = {
    width: null,
    style: null,
    radius: {
      default: thumbRadius || trackRadius || null,
      track: trackRadius,
      thumb: thumbRadius,
    },
  };

  // Colors
  const colors = buildRangeInputColors(componentStyles, variableMap);

  // Elevation
  let thumbShadow = null;
  if (webkitThumbStyles['box-shadow']) {
    thumbShadow = webkitThumbStyles['box-shadow'].raw || webkitThumbStyles['box-shadow'];
    if (thumbShadow.includes('var(')) {
      thumbShadow = getResolvedValue(thumbShadow, variableMap, 'cp-light');
    }
  }

  const elevation = {
    default: 'none',
    hover: null,
    active: null,
    focus: null,
    thumb: thumbShadow || 'none',
  };

  // Transitions
  let thumbTransition = null;
  if (webkitThumbStyles.transition) {
    thumbTransition = webkitThumbStyles.transition.raw || webkitThumbStyles.transition;
    if (thumbTransition.includes('var(')) {
      thumbTransition = getResolvedValue(thumbTransition, variableMap, 'cp-light');
    }
  }

  const transitions = {
    default: null,
    properties: {
      'transform': thumbTransition || null,
      'background-color': null,
    },
    thumb: thumbTransition || null,
  };

  // Layout
  let display = 'flex';
  let alignItems = 'center';
  let flexDirection = 'column';

  if (rangeWrapStyles.display) {
    display = rangeWrapStyles.display.raw || rangeWrapStyles.display;
    if (display.includes('var(')) {
      display = getResolvedValue(display, variableMap, 'cp-light');
    }
  }
  if (rangeWrapStyles['align-items']) {
    alignItems = rangeWrapStyles['align-items'].raw || rangeWrapStyles['align-items'];
    if (alignItems.includes('var(')) {
      alignItems = getResolvedValue(alignItems, variableMap, 'cp-light');
    }
  }
  if (wrapperStyles['flex-direction']) {
    flexDirection = wrapperStyles['flex-direction'].raw || wrapperStyles['flex-direction'];
    if (flexDirection.includes('var(')) {
      flexDirection = getResolvedValue(flexDirection, variableMap, 'cp-light');
    }
  }

  const layout = {
    display: display,
    alignItems: alignItems,
    justifyContent: null,
    flexDirection: flexDirection,
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
    iconSpecs: null,
  };

  // Resolve all variables in visual specifications
  const resolvedVisualSpecs = resolveAllVarReferences(visualSpecifications, variableMap);

  // Build CSS class styles with resolved values for cp-light (base theme)
  const cssClassStyles = {};
  
  // Helper to resolve a style value, including local CSS variables
  const resolveStyleValue = (value, defaultContext = 'cp-light') => {
    if (!value) return value;
    const rawValue = typeof value === 'object' ? value.raw || value : value;
    if (rawValue && typeof rawValue === 'string') {
      // Handle local CSS variables defined in .range
      let resolved = rawValue;
      if (resolved.includes('var(--thumb-size)')) {
        resolved = resolved.replace(/var\(--thumb-size\)/g, thumbSize);
      }
      if (resolved.includes('var(--track-height)')) {
        resolved = resolved.replace(/var\(--track-height\)/g, trackHeight);
      }
      if (resolved.includes('var(--track-color)')) {
        // Resolve track-color which references var(--border-color)
        const trackColorResolved = getResolvedValue(trackColorVar, variableMap, defaultContext);
        resolved = resolved.replace(/var\(--track-color\)/g, trackColorResolved);
      }
      if (resolved.includes('var(--thumb-color)')) {
        // Resolve thumb-color which references var(--theme-primary)
        const thumbColorResolved = getResolvedValue(thumbColorVar, variableMap, defaultContext);
        resolved = resolved.replace(/var\(--thumb-color\)/g, thumbColorResolved);
      }
      // Handle other CSS variables
      if (resolved.includes('var(')) {
        resolved = getResolvedValue(resolved, variableMap, defaultContext);
      }
      // Remove quotes from content property if present
      if (resolved.startsWith('"') && resolved.endsWith('"')) {
        resolved = resolved.slice(1, -1);
      }
      return resolved;
    }
    return rawValue;
  };
  
  // Helper to build resolved styles object
  const buildResolvedStyles = (styles) => {
    if (!styles) return {};
    const resolved = {};
    for (const [prop, value] of Object.entries(styles)) {
      if (prop.startsWith('_')) continue;
      resolved[prop] = resolveStyleValue(value);
    }
    return resolved;
  };

  // Build styles for all classes
  cssClassStyles['.range-input-form-wrapper'] = buildResolvedStyles(wrapperStyles);
  cssClassStyles['.range-input-form-wrapper--inline'] = buildResolvedStyles(inlineWrapperStyles);
  cssClassStyles['.range-input-form-wrapper--stacked'] = buildResolvedStyles(stackedWrapperStyles);
  
  // For .range-wrap, ensure we use desktop gap value (12px, not mobile 8px)
  const rangeWrapResolved = buildResolvedStyles(rangeWrapStyles);
  if (rangeWrapResolved.gap === '8px') {
    rangeWrapResolved.gap = '12px';
  }
  cssClassStyles['.range-wrap'] = rangeWrapResolved;
  
  // For .range, ensure we use desktop CSS variable values (20px/6px, not mobile 24px/8px)
  const rangeResolved = buildResolvedStyles(rangeStyles);
  if (rangeResolved['--thumb-size'] === '24px') {
    rangeResolved['--thumb-size'] = '20px';
  }
  if (rangeResolved['--track-height'] === '8px') {
    rangeResolved['--track-height'] = '6px';
  }
  cssClassStyles['.range'] = rangeResolved;
  
  cssClassStyles['.range:focus'] = buildResolvedStyles(rangeFocusStyles);
  cssClassStyles['.range:disabled'] = buildResolvedStyles(rangeDisabledStyles);
  cssClassStyles['.range::-webkit-slider-runnable-track'] = buildResolvedStyles(webkitTrackStyles);
  cssClassStyles['.range::-webkit-slider-thumb'] = buildResolvedStyles(webkitThumbStyles);
  cssClassStyles['.range::-webkit-slider-thumb:hover'] = buildResolvedStyles(webkitThumbHoverStyles);
  cssClassStyles['.range::-moz-range-track'] = buildResolvedStyles(mozTrackStyles);
  cssClassStyles['.range::-moz-range-thumb'] = buildResolvedStyles(mozThumbStyles);
  
  // For .range-value, ensure we use desktop values (50px min-width, 0.875rem font-size)
  const rangeValueResolved = buildResolvedStyles(rangeValueStyles);
  if (rangeValueResolved['min-width'] === '40px') {
    rangeValueResolved['min-width'] = '50px';
  }
  if (rangeValueResolved['font-size'] === '0.75rem') {
    rangeValueResolved['font-size'] = '0.875rem';
  }
  cssClassStyles['.range-value'] = rangeValueResolved;

  // Resolve all variables in CSS class styles (final pass)
  const resolvedCssClassStyles = resolveAllVarReferences(cssClassStyles, variableMap);

  // Build accessibility
  const accessibility = {
    role: 'slider',
    tabIndex: null,
    keyboardSupport: {
      arrowKeys: 'Increment/decrement value',
      home: 'Set to minimum',
      end: 'Set to maximum',
    },
    ariaAttributes: {
      'aria-valuemin': 'min',
      'aria-valuemax': 'max',
      'aria-valuenow': 'value',
      'aria-label': 'optional',
    },
    focusVisible: {
      outline: 'none',
    },
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
  console.log('💾 Writing rangeinput.json...');
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
  generateRangeInputJSON().catch(console.error);
}

export { generateRangeInputJSON };
