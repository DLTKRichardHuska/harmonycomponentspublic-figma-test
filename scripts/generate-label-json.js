/**
 * Generate Label JSON
 * Creates a comprehensive label.json file with all properties and resolved CSS variables
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
const COMPONENT_PATH = path.join(rootDir, 'src/components/ui/Label.astro');
const OUTPUT_FILE = path.join(rootDir, 'mcp-data/components/label.json');
const CSS_DIR = path.join(rootDir, 'src/styles');
const TOKENS_CSS = path.join(rootDir, 'src/styles/tokens.css');

const THEMES = ['cp', 'vp', 'ppm', 'maconomy'];
const MODES = ['light', 'dark'];

/**
 * Resolve a value for all theme/mode combinations
 */
function resolveForAllThemes(value, variableMap) {
  const resolved = {
    raw: value,
  };
  
  for (const theme of THEMES) {
    for (const mode of MODES) {
      const context = `${theme}-${mode}`;
      resolved[context] = getResolvedValue(value, variableMap, context);
    }
  }
  
  // Also add generic light/dark
  resolved.light = getResolvedValue(value, variableMap, 'cp-light');
  resolved.dark = getResolvedValue(value, variableMap, 'cp-dark');
  
  return resolved;
}

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
 * Build colors structure for Label
 */
function buildLabelColors(componentStyles, variableMap) {
  const colors = {
    variants: {
      default: {}
    }
  };

  // Initialize structure for all themes and modes
  for (const theme of THEMES) {
    colors.variants.default[theme] = {
      light: { default: {} },
      dark: { default: {} }
    };
  }

  // Extract base label color from .label
  let labelColor = null;
  let requiredColor = null;
  let helperColor = null;
  let helperFontWeight = null;

  for (const [selector, styles] of Object.entries(componentStyles)) {
    if (selector === '.label' && styles.color) {
      labelColor = styles.color.raw || styles.color;
    }
    if (selector === '.label--required::after' && styles.color) {
      requiredColor = styles.color.raw || styles.color;
    }
    if (selector === '.label__helper') {
      if (styles.color) {
        helperColor = styles.color.raw || styles.color;
      }
      if (styles['font-weight']) {
        helperFontWeight = styles['font-weight'].raw || styles['font-weight'];
      }
    }
  }

  // Resolve colors for all themes and modes
  for (const theme of THEMES) {
    for (const mode of MODES) {
      const context = `${theme}-${mode}`;
      
      const defaultState = {
        text: labelColor ? getResolvedValue(labelColor, variableMap, context) : null,
        background: 'transparent',
        border: 'transparent',
        iconColor: null,
        requiredIndicator: requiredColor ? getResolvedValue(requiredColor, variableMap, context) : null,
        helperText: helperColor ? getResolvedValue(helperColor, variableMap, context) : null,
        helperFontWeight: helperFontWeight ? getResolvedValue(helperFontWeight, variableMap, context) : null,
      };

      colors.variants.default[theme][mode].default = defaultState;
    }
  }

  return colors;
}

/**
 * Generate Label JSON
 */
async function generateLabelJSON() {
  console.log('🔧 Generating Label JSON...\n');

  // Load CSS spacing map
  const cssSpacingMap = loadCssSpacing();

  // Parse component
  console.log('📦 Parsing Label component...');
  const parsed = await parseComponent(COMPONENT_PATH, cssSpacingMap);
  const componentName = getComponentName(COMPONENT_PATH);
  const description = extractDescription(COMPONENT_PATH) || 'Label Component';
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
  const labelStyles = componentStyles['.label'] || {};
  const requiredStyles = componentStyles['.label--required::after'] || {};
  const helperStyles = componentStyles['.label__helper'] || {};

  // Dimensions (Label has no size variants, but structure needs them)
  const dimensions = {};
  for (const size of ['xs', 'sm', 'md', 'lg']) {
    dimensions[size] = {
      height: null,
      width: null,
      minWidth: 'auto',
      maxWidth: 'none',
    };
  }

  // Spacing
  const spacing = {};
  let marginBottom = '0';
  if (labelStyles['margin-bottom']) {
    marginBottom = labelStyles['margin-bottom'].raw || labelStyles['margin-bottom'];
    // Resolve if it contains var()
    if (typeof marginBottom === 'string' && marginBottom.includes('var(')) {
      marginBottom = getResolvedValue(marginBottom, variableMap, 'cp-light');
    }
  }

  for (const size of ['xs', 'sm', 'md', 'lg']) {
    spacing[size] = {
      paddingTop: '0',
      paddingRight: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      gap: '0',
      marginBottom: marginBottom,
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
  const borders = {
    width: null,
    style: null,
    radius: {
      default: null,
    },
  };

  // Colors
  const colors = buildLabelColors(componentStyles, variableMap);

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
  let display = 'block';
  if (labelStyles.display) {
    display = labelStyles.display.raw || labelStyles.display;
    if (display.includes('var(')) {
      display = getResolvedValue(display, variableMap, 'cp-light');
    }
  }

  const layout = {
    display: display,
    alignItems: null,
    justifyContent: null,
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
  // Note: cssClassStyles typically shows resolved values for the base theme
  // Theme-specific overrides would be in the colors.variants structure
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
  
  // .label
  if (labelStyles) {
    const resolvedLabelStyles = {};
    for (const [prop, value] of Object.entries(labelStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedLabelStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.label'] = resolvedLabelStyles;
  }

  // .label--required::after
  if (requiredStyles) {
    const resolvedRequiredStyles = {};
    for (const [prop, value] of Object.entries(requiredStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedRequiredStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.label--required::after'] = resolvedRequiredStyles;
  }

  // .label__helper
  if (helperStyles) {
    const resolvedHelperStyles = {};
    for (const [prop, value] of Object.entries(helperStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedHelperStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.label__helper'] = resolvedHelperStyles;
  }

  // Resolve all variables in CSS class styles (final pass)
  const resolvedCssClassStyles = resolveAllVarReferences(cssClassStyles, variableMap);

  // Build accessibility
  // Label element has implicit role, no tabIndex needed
  const accessibility = {
    role: 'label',
    tabIndex: null,
    keyboardSupport: {},
    ariaAttributes: {},
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
  console.log('💾 Writing label.json...');
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
  generateLabelJSON().catch(console.error);
}

export { generateLabelJSON };
