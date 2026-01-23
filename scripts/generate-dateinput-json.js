/**
 * Generate DateInput JSON
 * Creates a comprehensive dateinput.json file with all properties and resolved CSS variables
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
const COMPONENT_PATH = path.join(rootDir, 'src/components/ui/DateInput.astro');
const OUTPUT_FILE = path.join(rootDir, 'mcp-data/components/dateinput.json');
const CSS_DIR = path.join(rootDir, 'src/styles');
const TOKENS_CSS = path.join(rootDir, 'src/styles/tokens.css');

const THEMES = ['cp', 'vp', 'ppm', 'maconomy'];
const MODES = ['light', 'dark'];

/**
 * Resolve all var() references in a value for all themes/modes
 */
function resolveForAllThemes(value, variableMap) {
  const resolved = {
    raw: value,
    light: getResolvedValue(value, variableMap, 'cp-light'),
    dark: getResolvedValue(value, variableMap, 'cp-dark'),
  };
  
  for (const theme of THEMES) {
    for (const mode of MODES) {
      const context = `${theme}-${mode}`;
      resolved[context] = getResolvedValue(value, variableMap, context);
    }
  }
  
  return resolved;
}

/**
 * Extract all CSS styles for DateInput component
 */
function extractDateInputStyles(parsedCSS, variableMap) {
  const componentStyles = extractComponentStyles('DateInput', [
    'date-input',
    'date-input-wrapper',
    'date-input-wrapper__icon',
    'date-input-form-wrapper',
    'date-input-form-wrapper--inline',
    'date-input-form-wrapper--stacked',
    'date-input-form-wrapper__label',
  ], parsedCSS, variableMap);
  
  return componentStyles;
}

/**
 * Build visual specifications
 */
function buildVisualSpecs(componentStyles, variableMap) {
  const specs = {
    dimensions: {},
    spacing: {},
    borderRadius: {},
    typography: {},
    borders: {},
    transitions: {},
    layout: {},
    iconSpecs: {},
  };
  
  // Extract from .date-input base styles
  const dateInputStyles = componentStyles['.date-input'] || {};
  
  // Dimensions
  if (dateInputStyles.height) {
    specs.dimensions.height = resolveForAllThemes(dateInputStyles.height.raw, variableMap);
    specs.dimensions.width = resolveForAllThemes(dateInputStyles.width?.raw || '100%', variableMap);
  }
  
  // Spacing
  if (dateInputStyles.padding) {
    specs.spacing.padding = resolveForAllThemes(dateInputStyles.padding.raw, variableMap);
  }
  if (dateInputStyles['padding-top']) {
    specs.spacing.paddingTop = resolveForAllThemes(dateInputStyles['padding-top'].raw, variableMap);
  }
  if (dateInputStyles['padding-right']) {
    specs.spacing.paddingRight = resolveForAllThemes(dateInputStyles['padding-right'].raw, variableMap);
  }
  if (dateInputStyles['padding-bottom']) {
    specs.spacing.paddingBottom = resolveForAllThemes(dateInputStyles['padding-bottom'].raw, variableMap);
  }
  if (dateInputStyles['padding-left']) {
    specs.spacing.paddingLeft = resolveForAllThemes(dateInputStyles['padding-left'].raw, variableMap);
  }
  
  // Border radius
  if (dateInputStyles['border-radius']) {
    const radiusValue = dateInputStyles['border-radius'].raw;
    specs.borderRadius = {
      base: getResolvedValue(radiusValue, variableMap, 'cp-light'),
      value: getResolvedValue(radiusValue, variableMap, 'cp-light'),
      cssVar: radiusValue.includes('var(') ? radiusValue.match(/var\(([^)]+)\)/)?.[1] : null,
      ...resolveForAllThemes(radiusValue, variableMap),
    };
  }
  
  // Typography
  if (dateInputStyles['font-family']) {
    specs.typography.fontFamily = resolveForAllThemes(dateInputStyles['font-family'].raw, variableMap);
  }
  if (dateInputStyles['font-size']) {
    specs.typography.fontSize = resolveForAllThemes(dateInputStyles['font-size'].raw, variableMap);
  }
  if (dateInputStyles['font-weight']) {
    specs.typography.fontWeight = resolveForAllThemes(dateInputStyles['font-weight'].raw || '400', variableMap);
  }
  if (dateInputStyles['line-height']) {
    specs.typography.lineHeight = resolveForAllThemes(dateInputStyles['line-height'].raw, variableMap);
  }
  
  // Borders
  if (dateInputStyles.border) {
    specs.borders.border = resolveForAllThemes(dateInputStyles.border.raw, variableMap);
  }
  if (dateInputStyles['border-width']) {
    specs.borders.width = resolveForAllThemes(dateInputStyles['border-width'].raw || '1px', variableMap);
  }
  if (dateInputStyles['border-style']) {
    specs.borders.style = resolveForAllThemes(dateInputStyles['border-style'].raw || 'solid', variableMap);
  }
  if (dateInputStyles['border-color']) {
    specs.borders.color = resolveForAllThemes(dateInputStyles['border-color'].raw, variableMap);
  }
  if (dateInputStyles['border-radius']) {
    specs.borders.radius = resolveForAllThemes(dateInputStyles['border-radius'].raw, variableMap);
  }
  
  // Transitions
  if (dateInputStyles.transition) {
    const transitionValue = dateInputStyles.transition.raw;
    specs.transitions = {
      property: 'all',
      duration: transitionValue.includes('var(') ? getResolvedValue(transitionValue, variableMap, 'cp-light') : transitionValue,
      timingFunction: 'ease',
      cssVar: transitionValue.includes('var(') ? transitionValue.match(/var\(([^)]+)\)/)?.[1] : null,
      ...resolveForAllThemes(transitionValue, variableMap),
    };
  }
  
  // Layout
  if (dateInputStyles.display) {
    specs.layout.display = resolveForAllThemes(dateInputStyles.display.raw, variableMap);
  }
  if (dateInputStyles.position) {
    specs.layout.position = resolveForAllThemes(dateInputStyles.position.raw, variableMap);
  }
  
  // Icon specs
  const iconStyles = componentStyles['.date-input-wrapper__icon'] || {};
  if (iconStyles.color) {
    specs.iconSpecs.color = resolveForAllThemes(iconStyles.color.raw, variableMap);
  }
  if (iconStyles.position) {
    specs.iconSpecs.position = resolveForAllThemes(iconStyles.position.raw, variableMap);
  }
  specs.iconSpecs.size = 'sm'; // From component code
  
  return specs;
}

/**
 * Build states object
 */
function buildStates(componentStyles, variableMap) {
  const states = {
    default: {},
    focus: {},
    disabled: {},
    hover: {},
  };
  
  // Default state from .date-input
  const defaultStyles = componentStyles['.date-input'] || {};
  for (const [prop, value] of Object.entries(defaultStyles)) {
    if (prop !== 'raw' && typeof value === 'object' && value.raw) {
      states.default[prop] = resolveForAllThemes(value.raw, variableMap);
    }
  }
  
  // Focus state from .date-input:focus
  const focusStyles = componentStyles['.date-input:focus'] || {};
  for (const [prop, value] of Object.entries(focusStyles)) {
    if (prop !== 'raw' && typeof value === 'object' && value.raw) {
      states.focus[prop] = resolveForAllThemes(value.raw, variableMap);
    }
  }
  
  // Disabled state from .date-input:disabled
  const disabledStyles = componentStyles['.date-input:disabled'] || {};
  for (const [prop, value] of Object.entries(disabledStyles)) {
    if (prop !== 'raw' && typeof value === 'object' && value.raw) {
      states.disabled[prop] = resolveForAllThemes(value.raw, variableMap);
    }
  }
  
  // Icon disabled state
  const iconDisabledStyles = componentStyles['.date-input-wrapper__icon:disabled'] || {};
  for (const [prop, value] of Object.entries(iconDisabledStyles)) {
    if (prop !== 'raw' && typeof value === 'object' && value.raw) {
      states.disabled[`icon_${prop}`] = resolveForAllThemes(value.raw, variableMap);
    }
  }
  
  return states;
}

/**
 * Build theme colors
 */
function buildThemeColors(variableMap) {
  const colorTokens = [
    '--text-primary',
    '--text-secondary',
    '--text-muted',
    '--input-bg',
    '--input-disabled-bg',
    '--border-color',
    '--theme-primary',
    '--card-bg',
    '--elevated-bg',
    '--hover-bg',
  ];
  
  const themeColors = {};
  
  for (const theme of THEMES) {
    themeColors[theme] = {
      light: {},
      dark: {},
    };
    
    for (const token of colorTokens) {
      const lightValue = getResolvedValue(`var(${token})`, variableMap, `${theme}-light`);
      const darkValue = getResolvedValue(`var(${token})`, variableMap, `${theme}-dark`);
      
      const tokenName = token.replace('--', '').replace(/-/g, '');
      themeColors[theme].light[tokenName] = lightValue;
      themeColors[theme].dark[tokenName] = darkValue;
    }
  }
  
  return themeColors;
}

/**
 * Build elevations
 */
function buildElevations(variableMap) {
  const elevations = {
    focusRings: {
      primary: resolveForAllThemes('var(--focus-ring-primary)', variableMap),
    },
    shadows: {
      xl: resolveForAllThemes('var(--shadow-xl)', variableMap),
    },
    cssVars: {
      focusRingPrimary: '--focus-ring-primary',
      shadowXl: '--shadow-xl',
    },
  };
  
  // Resolve focus rings for all themes
  elevations.focusRings.resolved = {};
  for (const theme of THEMES) {
    elevations.focusRings.resolved[theme] = {
      light: getResolvedValue('var(--focus-ring-primary)', variableMap, `${theme}-light`),
      dark: getResolvedValue('var(--focus-ring-primary)', variableMap, `${theme}-dark`),
    };
  }
  
  return elevations;
}

/**
 * Build CSS class styles with resolved values
 */
function buildCssClassStyles(componentStyles, variableMap) {
  const cssClassStyles = {};
  
  for (const [selector, styles] of Object.entries(componentStyles)) {
    const classStyles = {};
    
    for (const [prop, value] of Object.entries(styles)) {
      if (typeof value === 'object' && value.raw) {
        classStyles[prop] = resolveForAllThemes(value.raw, variableMap);
      }
    }
    
    cssClassStyles[selector] = classStyles;
  }
  
  return cssClassStyles;
}

/**
 * Build resolved section
 */
function buildResolvedSection(componentStyles, variableMap) {
  const resolved = {
    default: {},
  };
  
  // Build resolved values for each theme/mode
  for (const theme of THEMES) {
    resolved.default[theme] = {
      light: {},
      dark: {},
    };
    
    // Default state
    const defaultStyles = componentStyles['.date-input'] || {};
    for (const [prop, value] of Object.entries(defaultStyles)) {
      if (prop !== 'raw' && typeof value === 'object' && value.raw) {
        resolved.default[theme].light[prop] = getResolvedValue(value.raw, variableMap, `${theme}-light`);
        resolved.default[theme].dark[prop] = getResolvedValue(value.raw, variableMap, `${theme}-dark`);
      }
    }
  }
  
  // Focus state
  resolved.focus = {};
  for (const theme of THEMES) {
    resolved.focus[theme] = {
      light: {},
      dark: {},
    };
    
    const focusStyles = componentStyles['.date-input:focus'] || {};
    for (const [prop, value] of Object.entries(focusStyles)) {
      if (prop !== 'raw' && typeof value === 'object' && value.raw) {
        resolved.focus[theme].light[prop] = getResolvedValue(value.raw, variableMap, `${theme}-light`);
        resolved.focus[theme].dark[prop] = getResolvedValue(value.raw, variableMap, `${theme}-dark`);
      }
    }
  }
  
  // Disabled state
  resolved.disabled = {};
  for (const theme of THEMES) {
    resolved.disabled[theme] = {
      light: {},
      dark: {},
    };
    
    const disabledStyles = componentStyles['.date-input:disabled'] || {};
    for (const [prop, value] of Object.entries(disabledStyles)) {
      if (prop !== 'raw' && typeof value === 'object' && value.raw) {
        resolved.disabled[theme].light[prop] = getResolvedValue(value.raw, variableMap, `${theme}-light`);
        resolved.disabled[theme].dark[prop] = getResolvedValue(value.raw, variableMap, `${theme}-dark`);
      }
    }
  }
  
  return resolved;
}

/**
 * Main generation function
 */
async function generateDateInputJSON() {
  console.log('🔧 Generating DateInput JSON...\n');
  
  // Load CSS spacing map
  const cssSpacingMap = loadCssSpacing();
  
  // Parse component
  console.log('📦 Parsing DateInput component...');
  const parsed = await parseComponent(COMPONENT_PATH, cssSpacingMap);
  const componentName = getComponentName(COMPONENT_PATH);
  const description = extractDescription(COMPONENT_PATH) || 'Input for date and time values using custom pickers. Replaces native HTML5 date/time inputs with fully customizable pickers.';
  
  // Parse CSS and resolve variables
  console.log('🎨 Parsing CSS and resolving variables...');
  const parsedCSS = parseCSSFiles(CSS_DIR);
  const tokensCssContent = fs.readFileSync(TOKENS_CSS, 'utf-8');
  const variableMap = resolveCSSVariables(tokensCssContent);
  console.log(`✅ Resolved ${Object.keys(variableMap).length} CSS variables\n`);
  
  // Extract component styles
  console.log('📐 Extracting component styles...');
  const componentStyles = extractDateInputStyles(parsedCSS, variableMap);
  
  // Build component data
  const componentData = {
    name: componentName,
    type: 'component',
    filePath: 'src/components/ui/DateInput.astro',
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
      availableVariants: ['date', 'time', 'datetime-local', 'month', 'week', 'inline', 'stacked'],
    },
  };
  
  // Build visual specifications
  console.log('🎨 Building visual specifications...');
  componentData.visualSpecifications = buildVisualSpecs(componentStyles, variableMap);
  
  // Build states
  console.log('🔘 Building states...');
  componentData.states = buildStates(componentStyles, variableMap);
  
  // Build theme colors
  console.log('🌈 Building theme colors...');
  componentData.themeColors = buildThemeColors(variableMap);
  
  // Build elevations
  console.log('📊 Building elevations...');
  componentData.elevations = buildElevations(variableMap);
  
  // Build CSS class styles
  console.log('💅 Building CSS class styles...');
  componentData.cssClassStyles = buildCssClassStyles(componentStyles, variableMap);
  
  // Build resolved section
  console.log('✅ Building resolved section...');
  componentData.variants = {
    default: {
      states: {
        default: {},
        focus: {},
        disabled: {},
      },
      resolved: buildResolvedSection(componentStyles, variableMap),
    },
  };
  
  // Ensure no null values
  function removeNulls(obj) {
    if (obj === null || obj === undefined) {
      return '';
    }
    if (Array.isArray(obj)) {
      return obj.map(removeNulls);
    }
    if (typeof obj === 'object') {
      const cleaned = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined) {
          cleaned[key] = removeNulls(value);
        }
      }
      return cleaned;
    }
    return obj;
  }
  
  const cleanedData = removeNulls(componentData);
  
  // Write to file
  console.log('💾 Writing to file...');
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleanedData, null, 2), 'utf-8');
  
  console.log(`\n✅ DateInput JSON generated successfully: ${OUTPUT_FILE}\n`);
  
  return cleanedData;
}

// Run generation
try {
  await generateDateInputJSON();
  console.log('✨ Generation complete!\n');
} catch (error) {
  console.error('\n❌ Generation failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
