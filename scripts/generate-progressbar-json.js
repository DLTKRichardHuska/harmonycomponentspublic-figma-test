/**
 * Generate ProgressBar JSON
 * Creates a comprehensive progressbar.json file with all properties and resolved CSS variables
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
const COMPONENT_PATH = path.join(rootDir, 'src/components/ui/ProgressBar.astro');
const OUTPUT_FILE = path.join(rootDir, 'mcp-data/components/progressbar.json');
const CSS_DIR = path.join(rootDir, 'src/styles');
const TOKENS_CSS = path.join(rootDir, 'src/styles/tokens.css');

const THEMES = ['cp', 'vp', 'ppm', 'maconomy'];
const MODES = ['light', 'dark'];
const VARIANTS = ['default', 'success', 'warning', 'error'];
const SIZES = ['sm', 'md', 'lg'];

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
 * Recursively replace null values with appropriate defaults
 */
function replaceNullValues(obj) {
  if (obj === null) {
    return '';
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceNullValues(item));
  }

  if (typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === null) {
        // Replace null with empty string
        // For props.default, use empty string for string types, 0 for numbers, false for booleans
        if (key === 'default' && obj.type) {
          const type = obj.type;
          if (type.includes('string')) {
            cleaned[key] = '';
          } else if (type.includes('number')) {
            cleaned[key] = 0;
          } else if (type.includes('boolean')) {
            cleaned[key] = false;
          } else {
            cleaned[key] = '';
          }
        } else {
          cleaned[key] = '';
        }
      } else {
        cleaned[key] = replaceNullValues(value);
      }
    }
    return cleaned;
  }

  return obj;
}

/**
 * Build colors structure for ProgressBar
 */
function buildProgressBarColors(componentStyles, variableMap) {
  const colors = {
    variants: {}
  };

  // Initialize structure for all variants, themes and modes
  for (const variant of VARIANTS) {
    colors.variants[variant] = {};
    for (const theme of THEMES) {
      colors.variants[variant][theme] = {
        light: { default: {} },
        dark: { default: {} }
      };
    }
  }

  // Extract track background (container)
  const trackStyles = componentStyles['.progress'] || {};
  const trackBackground = trackStyles['background-color']?.raw || trackStyles['background-color'] || 'var(--border-color)';

  // Extract fill backgrounds for each variant
  const defaultBarStyles = componentStyles['.progress__bar'] || {};
  const defaultFillBackground = defaultBarStyles['background-color']?.raw || defaultBarStyles['background-color'] || 'var(--theme-primary)';

  const successBarStyles = componentStyles['.progress--success .progress__bar'] || {};
  const successFillBackground = successBarStyles['background-color']?.raw || successBarStyles['background-color'] || 'var(--color-success)';

  const warningBarStyles = componentStyles['.progress--warning .progress__bar'] || {};
  const warningFillBackground = warningBarStyles['background-color']?.raw || warningBarStyles['background-color'] || 'var(--color-warning)';

  const errorBarStyles = componentStyles['.progress--error .progress__bar'] || {};
  const errorFillBackground = errorBarStyles['background-color']?.raw || errorBarStyles['background-color'] || 'var(--color-error)';

  // Extract label text color (from utility class .text-secondary)
  // This is used when showLabel is true
  const labelTextColor = 'var(--text-secondary)';

  // Resolve colors for all variants, themes and modes
  for (const variant of VARIANTS) {
    let fillBackground = defaultFillBackground;
    
    if (variant === 'success') {
      fillBackground = successFillBackground;
    } else if (variant === 'warning') {
      fillBackground = warningFillBackground;
    } else if (variant === 'error') {
      fillBackground = errorFillBackground;
    }

    for (const theme of THEMES) {
      for (const mode of MODES) {
        const context = `${theme}-${mode}`;
        
        const defaultState = {
          trackBackground: getResolvedValue(trackBackground, variableMap, context),
          fillBackground: getResolvedValue(fillBackground, variableMap, context),
          labelText: getResolvedValue(labelTextColor, variableMap, context),
          text: 'transparent',
          border: 'transparent',
          iconColor: 'transparent',
        };

        colors.variants[variant][theme][mode].default = defaultState;
      }
    }
  }

  return colors;
}

/**
 * Generate ProgressBar JSON
 */
async function generateProgressBarJSON() {
  console.log('🔧 Generating ProgressBar JSON...\n');

  // Load CSS spacing map
  const cssSpacingMap = loadCssSpacing();

  // Parse component
  console.log('📦 Parsing ProgressBar component...');
  const parsed = await parseComponent(COMPONENT_PATH, cssSpacingMap);
  const componentName = getComponentName(COMPONENT_PATH);
  const description = extractDescription(COMPONENT_PATH) || 'ProgressBar Component';
  console.log(`✅ Parsed ${componentName}\n`);

  // Parse CSS files and resolve variables
  console.log('🎨 Parsing CSS files and resolving variables...');
  const parsedCSS = parseCSSFiles(CSS_DIR);
  const tokensCssContent = fs.readFileSync(TOKENS_CSS, 'utf-8');
  const variableMap = resolveCSSVariables(tokensCssContent);
  console.log(`✅ Resolved ${Object.keys(variableMap).length} CSS variables\n`);

  // Extract component styles
  const componentStyles = extractComponentStyles(componentName, parsed.cssClasses || [], parsedCSS, variableMap);

  // Also extract utility class styles for label
  const utilitiesCss = parsedCSS['utilities.css'];
  let labelFontSize = null;
  let labelColor = null;
  let labelMarginTop = null;

  if (utilitiesCss) {
    utilitiesCss.walkRules((rule) => {
      if (rule.selector === '.text-sm') {
        rule.walkDecls((decl) => {
          if (decl.prop === 'font-size') {
            labelFontSize = decl.value;
          }
        });
      }
      if (rule.selector === '.text-secondary') {
        rule.walkDecls((decl) => {
          if (decl.prop === 'color') {
            labelColor = decl.value;
          }
        });
      }
      if (rule.selector === '.mt-1') {
        rule.walkDecls((decl) => {
          if (decl.prop === 'margin-top') {
            labelMarginTop = decl.value;
          }
        });
      }
    });
  }

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
      availableVariants: VARIANTS,
    },
  };

  // Build visual specifications
  console.log('📐 Building visual specifications...');

  // Extract base styles
  const progressStyles = componentStyles['.progress'] || {};
  const progressBarStyles = componentStyles['.progress__bar'] || {};
  const progressSmStyles = componentStyles['.progress--sm'] || {};
  const progressLgStyles = componentStyles['.progress--lg'] || {};

  // Dimensions
  const dimensions = {};
  const heightSm = progressSmStyles.height?.raw || progressSmStyles.height || 'var(--space-1)';
  const heightMd = progressStyles.height?.raw || progressStyles.height || 'var(--space-2)';
  const heightLg = progressLgStyles.height?.raw || progressLgStyles.height || 'var(--space-3)';

  dimensions.sm = {
    height: getResolvedValue(heightSm, variableMap, 'cp-light'),
    width: '100%',
    minWidth: 'auto',
    maxWidth: 'none',
  };

  dimensions.md = {
    height: getResolvedValue(heightMd, variableMap, 'cp-light'),
    width: '100%',
    minWidth: 'auto',
    maxWidth: 'none',
  };

  dimensions.lg = {
    height: getResolvedValue(heightLg, variableMap, 'cp-light'),
    width: '100%',
    minWidth: 'auto',
    maxWidth: 'none',
  };

  // Spacing
  const spacing = {};
  for (const size of SIZES) {
    spacing[size] = {
      paddingTop: '0',
      paddingRight: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      gap: '0',
      marginTop: size === 'md' && labelMarginTop ? getResolvedValue(labelMarginTop, variableMap, 'cp-light') : '0',
    };
  }

  // Typography (for label when showLabel is true)
  const resolvedLabelFontSize = labelFontSize ? getResolvedValue(labelFontSize, variableMap, 'cp-light') : '0.875rem';
  const resolvedLabelColor = labelColor ? getResolvedValue(labelColor, variableMap, 'cp-light') : null;

  const typography = {
    fontFamily: '',
    fontWeight: '',
    lineHeight: '',
    letterSpacing: '',
    textTransform: '',
    sizes: {},
  };

  for (const size of SIZES) {
    typography.sizes[size] = {
      fontSize: resolvedLabelFontSize,
      lineHeight: '',
    };
  }

  // Borders
  const borderRadius = progressStyles['border-radius']?.raw || progressStyles['border-radius'] || 'var(--radius-full)';
  const resolvedBorderRadius = getResolvedValue(borderRadius, variableMap, 'cp-light');

  const borders = {
    width: '0',
    style: 'none',
    radius: {
      default: resolvedBorderRadius,
    },
  };

  // Colors
  const colors = buildProgressBarColors(componentStyles, variableMap);

  // Elevation
  const elevation = {
    default: 'none',
    hover: 'none',
    active: 'none',
    focus: 'none',
  };

  // Transitions
  const transition = progressBarStyles.transition?.raw || progressBarStyles.transition || 'width var(--transition-slow)';
  const resolvedTransition = getResolvedValue(transition, variableMap, 'cp-light');

  const transitions = {
    default: resolvedTransition,
    properties: {
      width: resolvedTransition,
    },
  };

  // Layout
  const display = progressStyles.display?.raw || progressStyles.display || 'block';
  const resolvedDisplay = display.includes('var(') ? getResolvedValue(display, variableMap, 'cp-light') : display;

  const layout = {
    display: resolvedDisplay || 'block',
    alignItems: '',
    justifyContent: '',
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
    iconSpecs: {},
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
  
  // .progress
  if (progressStyles) {
    const resolvedProgressStyles = {};
    for (const [prop, value] of Object.entries(progressStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedProgressStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.progress'] = resolvedProgressStyles;
  }

  // .progress--sm
  if (progressSmStyles) {
    const resolvedSmStyles = {};
    for (const [prop, value] of Object.entries(progressSmStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedSmStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.progress--sm'] = resolvedSmStyles;
  }

  // .progress--lg
  if (progressLgStyles) {
    const resolvedLgStyles = {};
    for (const [prop, value] of Object.entries(progressLgStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedLgStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.progress--lg'] = resolvedLgStyles;
  }

  // .progress__bar
  if (progressBarStyles) {
    const resolvedBarStyles = {};
    for (const [prop, value] of Object.entries(progressBarStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedBarStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.progress__bar'] = resolvedBarStyles;
  }

  // .progress--success .progress__bar
  const successBarStyles = componentStyles['.progress--success .progress__bar'] || {};
  if (Object.keys(successBarStyles).length > 0) {
    const resolvedSuccessStyles = {};
    for (const [prop, value] of Object.entries(successBarStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedSuccessStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.progress--success .progress__bar'] = resolvedSuccessStyles;
  }

  // .progress--warning .progress__bar
  const warningBarStyles = componentStyles['.progress--warning .progress__bar'] || {};
  if (Object.keys(warningBarStyles).length > 0) {
    const resolvedWarningStyles = {};
    for (const [prop, value] of Object.entries(warningBarStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedWarningStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.progress--warning .progress__bar'] = resolvedWarningStyles;
  }

  // .progress--error .progress__bar
  const errorBarStyles = componentStyles['.progress--error .progress__bar'] || {};
  if (Object.keys(errorBarStyles).length > 0) {
    const resolvedErrorStyles = {};
    for (const [prop, value] of Object.entries(errorBarStyles)) {
      if (prop.startsWith('_')) continue;
      resolvedErrorStyles[prop] = resolveStyleValue(value);
    }
    cssClassStyles['.progress--error .progress__bar'] = resolvedErrorStyles;
  }

  // Resolve all variables in CSS class styles (final pass)
  const resolvedCssClassStyles = resolveAllVarReferences(cssClassStyles, variableMap);

  // Build accessibility
  const accessibility = {
    role: 'progressbar',
    tabIndex: '',
    keyboardSupport: {},
    ariaAttributes: {
      'aria-valuenow': 'value',
      'aria-valuemin': '0',
      'aria-valuemax': 'max',
    },
    focusVisible: {},
  };

  // Final component data
  componentData.visualSpecifications = resolvedVisualSpecs;
  componentData.accessibility = accessibility;
  componentData.cssClassStyles = resolvedCssClassStyles;
  componentData._variantIndex = {};
  componentData._variantMetadata = {
    availableVariants: VARIANTS,
  };

  // Replace null values with appropriate defaults (except in props.default)
  console.log('🧹 Cleaning up null values...');
  const cleanedData = replaceNullValues(componentData);

  // Write to file
  console.log('💾 Writing progressbar.json...');
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleanedData, null, 2), 'utf-8');
  console.log(`✅ Generated ${OUTPUT_FILE}\n`);

  return cleanedData;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateProgressBarJSON().catch(console.error);
}

export { generateProgressBarJSON };
