/**
 * Generate MonthPicker JSON
 * Creates a comprehensive monthpicker.json file with all properties and resolved CSS variables
 * Includes icon specifications for chevron-left and chevron-right navigation buttons
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
const COMPONENT_PATH = path.join(rootDir, 'src/components/ui/MonthPicker.astro');
const OUTPUT_FILE = path.join(rootDir, 'mcp-data/components/monthpicker.json');
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
 * Build colors structure for MonthPicker
 * Includes navigation button colors, year text colors, and month button colors for all states
 */
function buildMonthPickerColors(componentStyles, variableMap) {
  const colors = {
    variants: {
      default: {}
    }
  };

  // Initialize structure for all themes and modes
  for (const theme of THEMES) {
    colors.variants.default[theme] = {
      light: {
        navigationButton: {
          default: {},
          hover: {},
          disabled: {}
        },
        yearText: {
          default: {}
        },
        monthButton: {
          default: {},
          hover: {},
          selected: {},
          selectedHover: {},
          disabled: {},
          disabledHover: {},
          focus: {}
        }
      },
      dark: {
        navigationButton: {
          default: {},
          hover: {},
          disabled: {}
        },
        yearText: {
          default: {}
        },
        monthButton: {
          default: {},
          hover: {},
          selected: {},
          selectedHover: {},
          disabled: {},
          disabledHover: {},
          focus: {}
        }
      }
    };
  }

  // Extract styles from component CSS
  const navBtnStyles = componentStyles['.month-picker__nav-btn'] || {};
  const navBtnHoverStyles = componentStyles['.month-picker__nav-btn:hover:not(:disabled)'] || {};
  const navBtnDisabledStyles = componentStyles['.month-picker__nav-btn:disabled'] || {};
  const yearStyles = componentStyles['.month-picker__year'] || {};
  const monthStyles = componentStyles['.month-picker__month'] || {};
  const monthHoverStyles = componentStyles['.month-picker__month:hover:not(:disabled)'] || {};
  const monthSelectedStyles = componentStyles['.month-picker__month--selected'] || {};
  const monthSelectedHoverStyles = componentStyles['.month-picker__month--selected:hover:not(:disabled)'] || {};
  const monthDisabledStyles = componentStyles['.month-picker__month--disabled'] || {};
  const monthDisabledHoverStyles = componentStyles['.month-picker__month--disabled:hover'] || {};
  const monthFocusStyles = componentStyles['.month-picker__month:focus'] || {};

  // Extract color values
  const navBtnColor = navBtnStyles.color?.raw || navBtnStyles.color || null;
  const navBtnBg = navBtnStyles.background?.raw || navBtnStyles.background || 'transparent';
  const navBtnBorder = navBtnStyles.border?.raw || navBtnStyles.border || null;
  const navBtnHoverColor = navBtnHoverStyles.color?.raw || navBtnHoverStyles.color || null;
  const navBtnHoverBg = navBtnHoverStyles['background-color']?.raw || navBtnHoverStyles['background-color'] || null;
  const navBtnHoverBorder = navBtnHoverStyles['border-color']?.raw || navBtnHoverStyles['border-color'] || null;

  const yearColor = yearStyles.color?.raw || yearStyles.color || null;

  const monthColor = monthStyles.color?.raw || monthStyles.color || null;
  const monthBg = monthStyles.background?.raw || monthStyles.background || 'transparent';
  const monthBorder = monthStyles.border?.raw || monthStyles.border || null;
  const monthHoverBg = monthHoverStyles['background-color']?.raw || monthHoverStyles['background-color'] || null;
  const monthHoverBorder = monthHoverStyles['border-color']?.raw || monthHoverStyles['border-color'] || null;
  const monthSelectedBg = monthSelectedStyles['background-color']?.raw || monthSelectedStyles['background-color'] || null;
  const monthSelectedColor = monthSelectedStyles.color?.raw || monthSelectedStyles.color || null;
  const monthSelectedBorder = monthSelectedStyles['border-color']?.raw || monthSelectedStyles['border-color'] || null;
  const monthSelectedHoverBg = monthSelectedHoverStyles['background-color']?.raw || monthSelectedHoverStyles['background-color'] || null;
  const monthSelectedHoverBorder = monthSelectedHoverStyles['border-color']?.raw || monthSelectedHoverStyles['border-color'] || null;
  const monthDisabledColor = monthDisabledStyles.color?.raw || monthDisabledStyles.color || null;
  const monthDisabledHoverBg = monthDisabledHoverStyles.background?.raw || monthDisabledHoverStyles.background || 'transparent';
  const monthDisabledHoverBorder = monthDisabledHoverStyles['border-color']?.raw || monthDisabledHoverStyles['border-color'] || null;
  const monthFocusShadow = monthFocusStyles['box-shadow']?.raw || monthFocusStyles['box-shadow'] || null;

  // Resolve colors for all themes and modes
  for (const theme of THEMES) {
    for (const mode of MODES) {
      const context = `${theme}-${mode}`;
      
      // Navigation button states
      colors.variants.default[theme][mode].navigationButton.default = {
        text: navBtnColor ? getResolvedValue(navBtnColor, variableMap, context) : '',
        background: navBtnBg === 'transparent' ? 'transparent' : (navBtnBg ? getResolvedValue(navBtnBg, variableMap, context) : 'transparent'),
        border: navBtnBorder ? getResolvedValue(navBtnBorder, variableMap, context) : '',
        iconColor: navBtnColor ? getResolvedValue(navBtnColor, variableMap, context) : '',
      };

      colors.variants.default[theme][mode].navigationButton.hover = {
        text: navBtnHoverColor ? getResolvedValue(navBtnHoverColor, variableMap, context) : '',
        background: navBtnHoverBg ? getResolvedValue(navBtnHoverBg, variableMap, context) : '',
        border: navBtnHoverBorder ? getResolvedValue(navBtnHoverBorder, variableMap, context) : '',
        iconColor: navBtnHoverColor ? getResolvedValue(navBtnHoverColor, variableMap, context) : '',
      };

      colors.variants.default[theme][mode].navigationButton.disabled = {
        text: navBtnColor ? getResolvedValue(navBtnColor, variableMap, context) : '',
        background: navBtnBg === 'transparent' ? 'transparent' : (navBtnBg ? getResolvedValue(navBtnBg, variableMap, context) : 'transparent'),
        border: navBtnBorder ? getResolvedValue(navBtnBorder, variableMap, context) : '',
        iconColor: navBtnColor ? getResolvedValue(navBtnColor, variableMap, context) : '',
        opacity: '0.5',
      };

      // Year text
      colors.variants.default[theme][mode].yearText.default = {
        text: yearColor ? getResolvedValue(yearColor, variableMap, context) : '',
      };

      // Month button states
      colors.variants.default[theme][mode].monthButton.default = {
        text: monthColor ? getResolvedValue(monthColor, variableMap, context) : '',
        background: monthBg === 'transparent' ? 'transparent' : (monthBg ? getResolvedValue(monthBg, variableMap, context) : 'transparent'),
        border: monthBorder ? getResolvedValue(monthBorder, variableMap, context) : '',
      };

      colors.variants.default[theme][mode].monthButton.hover = {
        text: monthColor ? getResolvedValue(monthColor, variableMap, context) : '',
        background: monthHoverBg ? getResolvedValue(monthHoverBg, variableMap, context) : '',
        border: monthHoverBorder ? getResolvedValue(monthHoverBorder, variableMap, context) : '',
      };

      colors.variants.default[theme][mode].monthButton.selected = {
        text: monthSelectedColor ? getResolvedValue(monthSelectedColor, variableMap, context) : '',
        background: monthSelectedBg ? getResolvedValue(monthSelectedBg, variableMap, context) : '',
        border: monthSelectedBorder ? getResolvedValue(monthSelectedBorder, variableMap, context) : '',
      };

      colors.variants.default[theme][mode].monthButton.selectedHover = {
        text: monthSelectedColor ? getResolvedValue(monthSelectedColor, variableMap, context) : '',
        background: monthSelectedHoverBg ? getResolvedValue(monthSelectedHoverBg, variableMap, context) : '',
        border: monthSelectedHoverBorder ? getResolvedValue(monthSelectedHoverBorder, variableMap, context) : '',
      };

      colors.variants.default[theme][mode].monthButton.disabled = {
        text: monthDisabledColor ? getResolvedValue(monthDisabledColor, variableMap, context) : '',
        background: monthBg === 'transparent' ? 'transparent' : (monthBg ? getResolvedValue(monthBg, variableMap, context) : 'transparent'),
        border: monthBorder ? getResolvedValue(monthBorder, variableMap, context) : '',
        opacity: '0.4',
      };

      colors.variants.default[theme][mode].monthButton.disabledHover = {
        text: monthDisabledColor ? getResolvedValue(monthDisabledColor, variableMap, context) : '',
        background: monthDisabledHoverBg === 'transparent' ? 'transparent' : (monthDisabledHoverBg ? getResolvedValue(monthDisabledHoverBg, variableMap, context) : 'transparent'),
        border: monthDisabledHoverBorder ? getResolvedValue(monthDisabledHoverBorder, variableMap, context) : '',
        opacity: '0.4',
      };

      colors.variants.default[theme][mode].monthButton.focus = {
        text: monthColor ? getResolvedValue(monthColor, variableMap, context) : '',
        background: monthBg === 'transparent' ? 'transparent' : (monthBg ? getResolvedValue(monthBg, variableMap, context) : 'transparent'),
        border: monthBorder ? getResolvedValue(monthBorder, variableMap, context) : '',
        boxShadow: monthFocusShadow ? getResolvedValue(monthFocusShadow, variableMap, context) : '',
      };
    }
  }

  return colors;
}

/**
 * Generate MonthPicker JSON
 */
async function generateMonthPickerJSON() {
  console.log('🔧 Generating MonthPicker JSON...\n');

  // Load CSS spacing map
  const cssSpacingMap = loadCssSpacing();

  // Parse component
  console.log('📦 Parsing MonthPicker component...');
  const parsed = await parseComponent(COMPONENT_PATH, cssSpacingMap);
  const componentName = getComponentName(COMPONENT_PATH);
  const description = extractDescription(COMPONENT_PATH) || 'MonthPicker Component';
  console.log(`✅ Parsed ${componentName}\n`);

  // Parse CSS files and resolve variables
  console.log('🎨 Parsing CSS files and resolving variables...');
  const parsedCSS = parseCSSFiles(CSS_DIR);
  const tokensCssContent = fs.readFileSync(TOKENS_CSS, 'utf-8');
  const variableMap = resolveCSSVariables(tokensCssContent);
  console.log(`✅ Resolved ${Object.keys(variableMap).length} CSS variables\n`);

  // Extract component styles
  const cssClasses = [
    'month-picker',
    'month-picker__header',
    'month-picker__nav-btn',
    'month-picker__year',
    'month-picker__grid',
    'month-picker__month',
    'month-picker__month--selected',
    'month-picker__month--disabled',
  ];
  const componentStyles = extractComponentStyles(componentName, cssClasses, parsedCSS, variableMap);

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
  const pickerStyles = componentStyles['.month-picker'] || {};
  const headerStyles = componentStyles['.month-picker__header'] || {};
  const navBtnStyles = componentStyles['.month-picker__nav-btn'] || {};
  const yearStyles = componentStyles['.month-picker__year'] || {};
  const gridStyles = componentStyles['.month-picker__grid'] || {};
  const monthStyles = componentStyles['.month-picker__month'] || {};

  // Dimensions
  const dimensions = {};
  for (const size of ['xs', 'sm', 'md', 'lg']) {
    dimensions[size] = {
      height: null,
      width: pickerStyles.width ? (pickerStyles.width.raw || pickerStyles.width) : '100%',
      minWidth: 'auto',
      maxWidth: 'none',
    };
    // Resolve width if it contains var()
    if (dimensions[size].width && typeof dimensions[size].width === 'string' && dimensions[size].width.includes('var(')) {
      dimensions[size].width = getResolvedValue(dimensions[size].width, variableMap, 'cp-light');
    }
  }

  // Spacing
  const spacing = {};
  let headerMarginBottom = '0';
  if (headerStyles['margin-bottom']) {
    headerMarginBottom = headerStyles['margin-bottom'].raw || headerStyles['margin-bottom'];
    if (typeof headerMarginBottom === 'string' && headerMarginBottom.includes('var(')) {
      headerMarginBottom = getResolvedValue(headerMarginBottom, variableMap, 'cp-light');
    }
  }

  let monthPadding = '0 12px';
  if (monthStyles.padding) {
    monthPadding = monthStyles.padding.raw || monthStyles.padding;
    if (typeof monthPadding === 'string' && monthPadding.includes('var(')) {
      monthPadding = getResolvedValue(monthPadding, variableMap, 'cp-light');
    }
  }

  let gridGap = '8px';
  if (gridStyles.gap) {
    gridGap = gridStyles.gap.raw || gridStyles.gap;
    if (typeof gridGap === 'string' && gridGap.includes('var(')) {
      gridGap = getResolvedValue(gridGap, variableMap, 'cp-light');
    }
  }

  for (const size of ['xs', 'sm', 'md', 'lg']) {
    spacing[size] = {
      paddingTop: '0',
      paddingRight: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      gap: gridGap,
      marginBottom: headerMarginBottom,
    };
  }

  // Typography
  let yearFontFamily = null;
  let yearFontSize = null;
  let yearFontWeight = null;
  let monthFontFamily = null;
  let monthFontSize = null;

  if (yearStyles['font-family']) {
    yearFontFamily = yearStyles['font-family'].raw || yearStyles['font-family'];
  }
  if (yearStyles['font-size']) {
    yearFontSize = yearStyles['font-size'].raw || yearStyles['font-size'];
  }
  if (yearStyles['font-weight']) {
    yearFontWeight = yearStyles['font-weight'].raw || yearStyles['font-weight'];
  }
  if (monthStyles['font-family']) {
    monthFontFamily = monthStyles['font-family'].raw || monthStyles['font-family'];
  }
  if (monthStyles['font-size']) {
    monthFontSize = monthStyles['font-size'].raw || monthStyles['font-size'];
  }

  // Resolve typography values
  const resolvedYearFontFamily = yearFontFamily ? getResolvedValue(yearFontFamily, variableMap, 'cp-light') : null;
  const resolvedYearFontSize = yearFontSize ? getResolvedValue(yearFontSize, variableMap, 'cp-light') : null;
  const resolvedYearFontWeight = yearFontWeight ? getResolvedValue(yearFontWeight, variableMap, 'cp-light') : null;
  const resolvedMonthFontFamily = monthFontFamily ? getResolvedValue(monthFontFamily, variableMap, 'cp-light') : null;
  const resolvedMonthFontSize = monthFontSize ? getResolvedValue(monthFontSize, variableMap, 'cp-light') : null;

  const typography = {
    fontFamily: resolvedMonthFontFamily || resolvedYearFontFamily,
    fontWeight: resolvedYearFontWeight,
    lineHeight: null,
    letterSpacing: null,
    textTransform: null,
    sizes: {},
  };

  for (const size of ['xs', 'sm', 'md', 'lg']) {
    typography.sizes[size] = {
      fontSize: resolvedMonthFontSize || resolvedYearFontSize,
      lineHeight: null,
    };
  }

  // Borders
  let borderRadius = null;
  if (navBtnStyles['border-radius']) {
    borderRadius = navBtnStyles['border-radius'].raw || navBtnStyles['border-radius'];
    if (typeof borderRadius === 'string' && borderRadius.includes('var(')) {
      borderRadius = getResolvedValue(borderRadius, variableMap, 'cp-light');
    }
  }

  const borders = {
    width: null,
    style: null,
    radius: {
      default: borderRadius || null,
    },
  };

  // Colors
  const colors = buildMonthPickerColors(componentStyles, variableMap);

  // Elevation
  let focusShadow = null;
  const monthFocusStyles = componentStyles['.month-picker__month:focus'] || {};
  if (monthFocusStyles['box-shadow']) {
    focusShadow = monthFocusStyles['box-shadow'].raw || monthFocusStyles['box-shadow'];
    if (typeof focusShadow === 'string' && focusShadow.includes('var(')) {
      focusShadow = getResolvedValue(focusShadow, variableMap, 'cp-light');
    }
  }

  const elevation = {
    default: 'none',
    hover: null,
    active: null,
    focus: focusShadow || null,
  };

  // Transitions
  let transition = null;
  if (navBtnStyles.transition) {
    transition = navBtnStyles.transition.raw || navBtnStyles.transition;
    if (typeof transition === 'string' && transition.includes('var(')) {
      transition = getResolvedValue(transition, variableMap, 'cp-light');
    }
  }

  const transitions = {
    default: transition || null,
    properties: {},
  };

  // Layout
  let display = 'block';
  if (pickerStyles.display) {
    display = pickerStyles.display.raw || pickerStyles.display;
    if (display.includes('var(')) {
      display = getResolvedValue(display, variableMap, 'cp-light');
    }
  }

  const layout = {
    display: display,
    alignItems: null,
    justifyContent: null,
  };

  // Icon specs
  // Chevron icons are size="sm" which is 24px based on Icon component
  const iconSpecs = {
    chevronLeft: {
      name: 'chevron-left',
      size: 'sm',
      width: '24px',
      height: '24px',
    },
    chevronRight: {
      name: 'chevron-right',
      size: 'sm',
      width: '24px',
      height: '24px',
    },
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
  
  // Process all selectors
  const selectors = [
    '.month-picker',
    '.month-picker__header',
    '.month-picker__nav-btn',
    '.month-picker__nav-btn:hover:not(:disabled)',
    '.month-picker__nav-btn:disabled',
    '.month-picker__year',
    '.month-picker__grid',
    '.month-picker__month',
    '.month-picker__month:hover:not(:disabled)',
    '.month-picker__month--selected',
    '.month-picker__month--selected:hover:not(:disabled)',
    '.month-picker__month--disabled',
    '.month-picker__month--disabled:hover',
    '.month-picker__month:focus',
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
    role: 'grid',
    tabIndex: null,
    keyboardSupport: {
      arrowKeys: 'Navigate between months',
      enter: 'Select month',
      space: 'Select month',
    },
    ariaAttributes: {
      'aria-label': 'Months for {year}',
      'role': 'grid',
    },
    focusVisible: {
      enabled: true,
      style: 'box-shadow',
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
  console.log('💾 Writing monthpicker.json...');
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
  generateMonthPickerJSON().catch(console.error);
}

export { generateMonthPickerJSON };
