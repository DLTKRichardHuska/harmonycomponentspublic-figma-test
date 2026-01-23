/**
 * Generate NotificationBadge JSON
 * Creates a comprehensive notificationbadge.json file with all properties and resolved CSS variables
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
const COMPONENT_PATH = path.join(rootDir, 'src/components/ui/NotificationBadge.astro');
const OUTPUT_FILE = path.join(rootDir, 'mcp-data/components/notificationbadge.json');
const CSS_DIR = path.join(rootDir, 'src/styles');
const TOKENS_CSS = path.join(rootDir, 'src/styles/tokens.css');

const THEMES = ['cp', 'vp', 'ppm', 'maconomy'];
const MODES = ['light', 'dark'];
const TYPES = ['dot', 'number', 'overflow'];
const SIZES = ['sm', 'md', 'lg'];
const VARIANTS = ['error', 'primary'];

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
 * Build colors structure for NotificationBadge
 * Handles all combinations: variant (error/primary) × theme × mode × states (default, withBorder)
 */
function buildNotificationBadgeColors(componentStyles, variableMap) {
  const colors = {
    variants: {}
  };

  // Extract base colors
  const baseTextColor = 'var(--text-inverse, #ffffff)';
  const errorBgColor = 'var(--notification-badge-error)';
  const primaryBgColor = 'var(--theme-primary)';
  const borderColor = 'var(--text-inverse, #ffffff)';

  // Initialize structure for each variant
  for (const variant of VARIANTS) {
    colors.variants[variant] = {};
    
    for (const theme of THEMES) {
      colors.variants[variant][theme] = {
        light: {},
        dark: {}
      };
    }
  }

  // Build colors for each variant × theme × mode combination
  for (const variant of VARIANTS) {
    for (const theme of THEMES) {
      for (const mode of MODES) {
        const context = `${theme}-${mode}`;
        
        // Default state (no border)
        colors.variants[variant][theme][mode].default = {
          background: variant === 'error' 
            ? getResolvedValue(errorBgColor, variableMap, context)
            : getResolvedValue(primaryBgColor, variableMap, context),
          text: getResolvedValue(baseTextColor, variableMap, context),
          border: 'transparent',
          iconColor: null
        };

        // With border state
        colors.variants[variant][theme][mode].withBorder = {
          background: variant === 'error' 
            ? getResolvedValue(errorBgColor, variableMap, context)
            : getResolvedValue(primaryBgColor, variableMap, context),
          text: getResolvedValue(baseTextColor, variableMap, context),
          border: getResolvedValue(borderColor, variableMap, context),
          iconColor: null
        };

        // NotificationBadge doesn't have hover, focus, active, or disabled states
        // Set to empty objects instead of null to avoid null values
        colors.variants[variant][theme][mode].hover = {};
        colors.variants[variant][theme][mode].focus = {};
        colors.variants[variant][theme][mode].active = {};
        colors.variants[variant][theme][mode].disabled = {};
      }
    }
  }

  return colors;
}

/**
 * Helper to find selector that contains the pattern
 */
function findSelectorInStyles(componentStyles, pattern) {
  for (const selector of Object.keys(componentStyles)) {
    if (selector.includes(pattern)) {
      return componentStyles[selector];
    }
  }
  return null;
}

/**
 * Extract dimensions for each size and type combination
 */
function buildDimensions(componentStyles, variableMap) {
  const dimensions = {};

  // Initialize with defaults
  for (const size of ['xs', 'sm', 'md', 'lg']) {
    dimensions[size] = {
      height: 'auto',
      width: 'auto',
      minWidth: 'auto',
      maxWidth: 'none',
      minHeight: 'auto'
    };
  }

  // Extract dot dimensions
  const dotSmPattern = '.notification-badge--sm.notification-badge--dot';
  const dotMdPattern = '.notification-badge--md.notification-badge--dot';
  const dotLgPattern = '.notification-badge--lg.notification-badge--dot';

  // Small dot
  const dotSmStyles = findSelectorInStyles(componentStyles, dotSmPattern);
  if (dotSmStyles) {
    const width = dotSmStyles.width?.raw || dotSmStyles.width;
    const height = dotSmStyles.height?.raw || dotSmStyles.height;
    if (width) dimensions.sm.width = getResolvedValue(width, variableMap, 'cp-light');
    if (height) dimensions.sm.height = getResolvedValue(height, variableMap, 'cp-light');
  }

  // Medium dot (same as small)
  const dotMdStyles = findSelectorInStyles(componentStyles, dotMdPattern);
  if (dotMdStyles) {
    const width = dotMdStyles.width?.raw || dotMdStyles.width;
    const height = dotMdStyles.height?.raw || dotMdStyles.height;
    if (width) dimensions.md.width = getResolvedValue(width, variableMap, 'cp-light');
    if (height) dimensions.md.height = getResolvedValue(height, variableMap, 'cp-light');
  }

  // Large dot (same as small)
  const dotLgStyles = findSelectorInStyles(componentStyles, dotLgPattern);
  if (dotLgStyles) {
    const width = dotLgStyles.width?.raw || dotLgStyles.width;
    const height = dotLgStyles.height?.raw || dotLgStyles.height;
    if (width) dimensions.lg.width = getResolvedValue(width, variableMap, 'cp-light');
    if (height) dimensions.lg.height = getResolvedValue(height, variableMap, 'cp-light');
  }

  // Helper to find selector that contains the pattern
  const findSelector = (pattern) => {
    for (const selector of Object.keys(componentStyles)) {
      if (selector.includes(pattern)) {
        return componentStyles[selector];
      }
    }
    return null;
  };

  // Extract number/overflow min-width (without border)
  const smNumberPattern = '.notification-badge--sm.notification-badge--number';
  const mdNumberPattern = '.notification-badge--md.notification-badge--number';
  const lgNumberPattern = '.notification-badge--lg.notification-badge--number';

  // Small - min-width: var(--badge-dot-size-lg) = 15px
  const smNumberStyles = findSelectorInStyles(componentStyles, smNumberPattern);
  if (smNumberStyles?.['min-width']) {
    const minWidth = smNumberStyles['min-width'].raw || smNumberStyles['min-width'];
    if (minWidth) dimensions.sm.minWidth = getResolvedValue(minWidth, variableMap, 'cp-light');
  }

  // Medium - min-width: var(--badge-dot-size-lg) = 15px
  const mdNumberStyles = findSelectorInStyles(componentStyles, mdNumberPattern);
  if (mdNumberStyles?.['min-width']) {
    const minWidth = mdNumberStyles['min-width'].raw || mdNumberStyles['min-width'];
    if (minWidth) dimensions.md.minWidth = getResolvedValue(minWidth, variableMap, 'cp-light');
  }

  // Large - no min-width in base, uses padding only
  // dimensions.lg.minWidth stays as 'auto'

  // Extract min-height and min-width for number/overflow with border
  const smBorderPattern = '.notification-badge--sm.notification-badge--number.notification-badge--border';
  const mdBorderPattern = '.notification-badge--md.notification-badge--number.notification-badge--border';
  const lgBorderPattern = '.notification-badge--lg.notification-badge--number.notification-badge--border';

  // Small with border: min-height: var(--badge-height-sm) = 19px, min-width: var(--badge-min-width-sm) = 19px
  const smBorderStyles = findSelectorInStyles(componentStyles, smBorderPattern);
  if (smBorderStyles) {
    const minHeight = smBorderStyles['min-height']?.raw || smBorderStyles['min-height'];
    const minWidth = smBorderStyles['min-width']?.raw || smBorderStyles['min-width'];
    if (minHeight) dimensions.sm.minHeight = getResolvedValue(minHeight, variableMap, 'cp-light');
    if (minWidth) dimensions.sm.minWidth = getResolvedValue(minWidth, variableMap, 'cp-light');
  }

  // Medium with border: min-height: var(--badge-height-md) = 19px, min-width: var(--badge-min-width-md) = 19px
  const mdBorderStyles = findSelectorInStyles(componentStyles, mdBorderPattern);
  if (mdBorderStyles) {
    const minHeight = mdBorderStyles['min-height']?.raw || mdBorderStyles['min-height'];
    const minWidth = mdBorderStyles['min-width']?.raw || mdBorderStyles['min-width'];
    if (minHeight) dimensions.md.minHeight = getResolvedValue(minHeight, variableMap, 'cp-light');
    if (minWidth) dimensions.md.minWidth = getResolvedValue(minWidth, variableMap, 'cp-light');
  }

  // Large with border: min-height: var(--badge-height-lg) = 19px, min-width: var(--badge-min-width-lg) = 32px
  const lgBorderStyles = findSelectorInStyles(componentStyles, lgBorderPattern);
  if (lgBorderStyles) {
    const minHeight = lgBorderStyles['min-height']?.raw || lgBorderStyles['min-height'];
    const minWidth = lgBorderStyles['min-width']?.raw || lgBorderStyles['min-width'];
    if (minHeight) dimensions.lg.minHeight = getResolvedValue(minHeight, variableMap, 'cp-light');
    if (minWidth) dimensions.lg.minWidth = getResolvedValue(minWidth, variableMap, 'cp-light');
  }

  // Extract base min-height for number/overflow
  const numberBasePattern = '.notification-badge--number';
  const numberBaseStyles = findSelectorInStyles(componentStyles, numberBasePattern);
  if (numberBaseStyles) {
    const minHeight = numberBaseStyles['min-height']?.raw || numberBaseStyles['min-height'];
    if (minHeight) {
      const resolved = getResolvedValue(minHeight, variableMap, 'cp-light');
      // Apply to all sizes if not already set
      if (!dimensions.sm.minHeight || dimensions.sm.minHeight === 'auto') dimensions.sm.minHeight = resolved;
      if (!dimensions.md.minHeight || dimensions.md.minHeight === 'auto') dimensions.md.minHeight = resolved;
      if (!dimensions.lg.minHeight || dimensions.lg.minHeight === 'auto') dimensions.lg.minHeight = resolved;
    }
  }

  return dimensions;
}

/**
 * Extract spacing (padding) for each size and type combination
 */
function buildSpacing(componentStyles, variableMap) {
  const spacing = {};

  // Initialize with defaults
  for (const size of ['xs', 'sm', 'md', 'lg']) {
    spacing[size] = {
      paddingTop: '0',
      paddingRight: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      gap: '0'
    };
  }

  // Extract padding for number/overflow types (without border)
  // Selectors are combined with commas, so we search for patterns
  const smNumberPattern = '.notification-badge--sm.notification-badge--number';
  const mdNumberPattern = '.notification-badge--md.notification-badge--number';
  const lgNumberPattern = '.notification-badge--lg.notification-badge--number';

  // Small - number/overflow without border: padding: 0 4px
  const smNumberStyles = findSelectorInStyles(componentStyles, smNumberPattern);
  if (smNumberStyles?.padding) {
    const padding = smNumberStyles.padding.raw || smNumberStyles.padding;
    if (padding) {
      const parts = padding.split(' ');
      if (parts.length === 2) {
        spacing.sm.paddingTop = '0';
        spacing.sm.paddingRight = parts[1];
        spacing.sm.paddingBottom = '0';
        spacing.sm.paddingLeft = parts[1];
      }
    }
  }

  // Medium - number/overflow without border: padding: 0 4px
  const mdNumberStyles = findSelectorInStyles(mdNumberPattern);
  if (mdNumberStyles?.padding) {
    const padding = mdNumberStyles.padding.raw || mdNumberStyles.padding;
    if (padding) {
      const parts = padding.split(' ');
      if (parts.length === 2) {
        spacing.md.paddingTop = '0';
        spacing.md.paddingRight = parts[1];
        spacing.md.paddingBottom = '0';
        spacing.md.paddingLeft = parts[1];
      }
    }
  }

  // Large - number/overflow without border: padding: 0 5px
  const lgNumberStyles = findSelectorInStyles(componentStyles, lgNumberPattern);
  if (lgNumberStyles?.padding) {
    const padding = lgNumberStyles.padding.raw || lgNumberStyles.padding;
    if (padding) {
      const parts = padding.split(' ');
      if (parts.length === 2) {
        spacing.lg.paddingTop = '0';
        spacing.lg.paddingRight = parts[1];
        spacing.lg.paddingBottom = '0';
        spacing.lg.paddingLeft = parts[1];
      }
    }
  }

  // Extract padding for number/overflow with border
  const smBorderPattern = '.notification-badge--sm.notification-badge--number.notification-badge--border';
  const mdBorderPattern = '.notification-badge--md.notification-badge--number.notification-badge--border';
  const lgBorderPattern = '.notification-badge--lg.notification-badge--number.notification-badge--border';

  // Small with border: padding: var(--space-1) var(--space-1-5) = 4px 6px
  const smBorderStyles = findSelectorInStyles(smBorderPattern);
  if (smBorderStyles?.padding) {
    const padding = smBorderStyles.padding.raw || smBorderStyles.padding;
    if (padding) {
      let resolved = padding;
      if (padding.includes('var(')) {
        resolved = getResolvedValue(padding, variableMap, 'cp-light');
      }
      const parts = resolved.split(' ');
      if (parts.length === 2) {
        spacing.sm.paddingTop = parts[0];
        spacing.sm.paddingRight = parts[1];
        spacing.sm.paddingBottom = parts[0];
        spacing.sm.paddingLeft = parts[1];
      }
    }
  }

  // Medium with border: padding: var(--space-1) var(--space-1-5) = 4px 6px
  const mdBorderStyles = findSelectorInStyles(componentStyles, mdBorderPattern);
  if (mdBorderStyles?.padding) {
    const padding = mdBorderStyles.padding.raw || mdBorderStyles.padding;
    if (padding) {
      let resolved = padding;
      if (padding.includes('var(')) {
        resolved = getResolvedValue(padding, variableMap, 'cp-light');
      }
      const parts = resolved.split(' ');
      if (parts.length === 2) {
        spacing.md.paddingTop = parts[0];
        spacing.md.paddingRight = parts[1];
        spacing.md.paddingBottom = parts[0];
        spacing.md.paddingLeft = parts[1];
      }
    }
  }

  // Large with border: padding: var(--space-1) var(--space-2) = 4px 8px
  const lgBorderStyles = findSelectorInStyles(componentStyles, lgBorderPattern);
  if (lgBorderStyles?.padding) {
    const padding = lgBorderStyles.padding.raw || lgBorderStyles.padding;
    if (padding) {
      let resolved = padding;
      if (padding.includes('var(')) {
        resolved = getResolvedValue(padding, variableMap, 'cp-light');
      }
      const parts = resolved.split(' ');
      if (parts.length === 2) {
        spacing.lg.paddingTop = parts[0];
        spacing.lg.paddingRight = parts[1];
        spacing.lg.paddingBottom = parts[0];
        spacing.lg.paddingLeft = parts[1];
      }
    }
  }

  // Resolve all spacing values that still have var()
  for (const size of ['xs', 'sm', 'md', 'lg']) {
    for (const prop of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']) {
      if (spacing[size][prop] && typeof spacing[size][prop] === 'string' && spacing[size][prop].includes('var(')) {
        spacing[size][prop] = getResolvedValue(spacing[size][prop], variableMap, 'cp-light');
      }
    }
  }

  return spacing;
}

/**
 * Generate NotificationBadge JSON
 */
async function generateNotificationBadgeJSON() {
  console.log('🔧 Generating NotificationBadge JSON...\n');

  // Load CSS spacing map
  const cssSpacingMap = loadCssSpacing();

  // Parse component
  console.log('📦 Parsing NotificationBadge component...');
  const parsed = await parseComponent(COMPONENT_PATH, cssSpacingMap);
  const componentName = getComponentName(COMPONENT_PATH);
  const description = extractDescription(COMPONENT_PATH) || 'NotificationBadge Component';
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
      availableVariants: ['dot', 'number', 'overflow', 'error', 'primary'],
    },
  };

  // Build visual specifications
  console.log('📐 Building visual specifications...');

  // Extract base styles
  const baseStyles = componentStyles['.notification-badge'] || {};

  // Dimensions
  const dimensions = buildDimensions(componentStyles, variableMap);

  // Spacing
  const spacing = buildSpacing(componentStyles, variableMap);

  // Typography
  let fontFamily = null;
  let fontSize = null;
  let fontWeight = null;
  let lineHeight = null;

  if (baseStyles['font-family']) {
    fontFamily = baseStyles['font-family'].raw || baseStyles['font-family'];
  }
  if (baseStyles['font-size']) {
    fontSize = baseStyles['font-size'].raw || baseStyles['font-size'];
  }
  if (baseStyles['font-weight']) {
    fontWeight = baseStyles['font-weight'].raw || baseStyles['font-weight'];
  }
  if (baseStyles['line-height']) {
    lineHeight = baseStyles['line-height'].raw || baseStyles['line-height'];
  }

  // Resolve typography values
  const resolvedFontFamily = fontFamily ? getResolvedValue(fontFamily, variableMap, 'cp-light') : null;
  const resolvedFontSize = fontSize ? (fontSize.includes('var(') ? getResolvedValue(fontSize, variableMap, 'cp-light') : fontSize) : null;
  const resolvedFontWeight = fontWeight ? getResolvedValue(fontWeight, variableMap, 'cp-light') : null;
  const resolvedLineHeight = lineHeight ? (lineHeight.includes('var(') ? getResolvedValue(lineHeight, variableMap, 'cp-light') : lineHeight) : null;

  const typography = {
    fontFamily: resolvedFontFamily || "'Figtree', sans-serif",
    fontWeight: resolvedFontWeight || '500',
    lineHeight: resolvedLineHeight || '0',
    letterSpacing: null,
    textTransform: null,
    sizes: {},
  };

  for (const size of ['xs', 'sm', 'md', 'lg']) {
    typography.sizes[size] = {
      fontSize: resolvedFontSize || '10px',
      lineHeight: resolvedLineHeight || '0',
    };
  }

  // Borders
  let borderRadius = null;
  if (baseStyles['border-radius']) {
    borderRadius = baseStyles['border-radius'].raw || baseStyles['border-radius'];
  }

  const resolvedBorderRadius = borderRadius ? getResolvedValue(borderRadius, variableMap, 'cp-light') : '9999px';

  // Extract border width from border variants
  let borderWidth = null;
  const borderSelector = '.notification-badge--sm.notification-badge--dot.notification-badge--border';
  if (componentStyles[borderSelector]?.border) {
    const border = componentStyles[borderSelector].border.raw || componentStyles[borderSelector].border;
    if (border) {
      const parts = border.split(' ');
      if (parts.length >= 2) {
        borderWidth = parts[0];
      }
    }
  }

  const resolvedBorderWidth = borderWidth ? getResolvedValue(borderWidth, variableMap, 'cp-light') : '2px';

  const borders = {
    width: resolvedBorderWidth,
    style: 'solid',
    radius: {
      default: resolvedBorderRadius,
      dot: '50%',
    },
  };

  // Colors
  const colors = buildNotificationBadgeColors(componentStyles, variableMap);

  // Elevation
  const elevation = {
    default: 'none',
    hover: null,
    active: null,
    focus: null,
  };

  // Transitions
  const transitions = {
    default: null,
    properties: {},
  };

  // Layout
  let display = 'inline-flex';
  let alignItems = 'center';
  let justifyContent = 'center';

  if (baseStyles.display) {
    display = baseStyles.display.raw || baseStyles.display;
    if (display.includes('var(')) {
      display = getResolvedValue(display, variableMap, 'cp-light');
    }
  }
  if (baseStyles['align-items']) {
    alignItems = baseStyles['align-items'].raw || baseStyles['align-items'];
    if (alignItems.includes('var(')) {
      alignItems = getResolvedValue(alignItems, variableMap, 'cp-light');
    }
  }
  if (baseStyles['justify-content']) {
    justifyContent = baseStyles['justify-content'].raw || baseStyles['justify-content'];
    if (justifyContent.includes('var(')) {
      justifyContent = getResolvedValue(justifyContent, variableMap, 'cp-light');
    }
  }

  const layout = {
    display: display,
    alignItems: alignItems,
    justifyContent: justifyContent,
  };

  // Icon specs (NotificationBadge doesn't use icons)
  const iconSpecs = null;

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
    '.notification-badge',
    '.notification-badge--dot',
    '.notification-badge--number',
    '.notification-badge--overflow',
    '.notification-badge--sm.notification-badge--dot',
    '.notification-badge--sm.notification-badge--dot.notification-badge--border',
    '.notification-badge--sm.notification-badge--number',
    '.notification-badge--sm.notification-badge--overflow',
    '.notification-badge--sm.notification-badge--number.notification-badge--border',
    '.notification-badge--sm.notification-badge--overflow.notification-badge--border',
    '.notification-badge--md.notification-badge--dot',
    '.notification-badge--md.notification-badge--dot.notification-badge--border',
    '.notification-badge--md.notification-badge--number',
    '.notification-badge--md.notification-badge--overflow',
    '.notification-badge--md.notification-badge--number.notification-badge--border',
    '.notification-badge--md.notification-badge--overflow.notification-badge--border',
    '.notification-badge--lg.notification-badge--dot',
    '.notification-badge--lg.notification-badge--dot.notification-badge--border',
    '.notification-badge--lg.notification-badge--number',
    '.notification-badge--lg.notification-badge--overflow',
    '.notification-badge--lg.notification-badge--number.notification-badge--border',
    '.notification-badge--lg.notification-badge--overflow.notification-badge--border',
    '.notification-badge--error',
    '.notification-badge--primary',
  ];

  for (const selector of selectors) {
    if (componentStyles[selector]) {
      const resolvedStyles = {};
      for (const [prop, value] of Object.entries(componentStyles[selector])) {
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
    role: null,
    tabIndex: null,
    keyboardSupport: {},
    ariaAttributes: {
      'aria-label': 'Notification indicator or count'
    },
    focusVisible: {},
  };

  // Final component data
  componentData.visualSpecifications = resolvedVisualSpecs;
  componentData.accessibility = accessibility;
  componentData.cssClassStyles = resolvedCssClassStyles;
  componentData._variantIndex = {};
  componentData._variantMetadata = {
    availableVariants: ['dot', 'number', 'overflow', 'error', 'primary'],
  };

  // Write to file
  console.log('💾 Writing notificationbadge.json...');
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
  generateNotificationBadgeJSON().catch(console.error);
}

export { generateNotificationBadgeJSON };
