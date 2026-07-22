#!/usr/bin/env node
/**
 * Validate canonical button token alignment between colors.json and tokens.css.
 * Ensures legacy themeButton keys are removed and role constants match CSS variables.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const colorsFile = path.join(root, 'src/tokens/colors.json');
const tokensCssFile = path.join(root, 'src/styles/tokens.css');

const colors = JSON.parse(fs.readFileSync(colorsFile, 'utf-8'));
const tokensCss = fs.readFileSync(tokensCssFile, 'utf-8');

const errors = [];

function fail(message) {
  errors.push(message);
}

function normalizeHex(value) {
  return value.trim().toLowerCase();
}

/** Extract CSS custom properties from the first block matching a selector. */
function extractCssVars(selector) {
  const selectorIndex = tokensCss.indexOf(selector);
  if (selectorIndex === -1) {
    fail(`Missing CSS selector block: ${selector}`);
    return {};
  }

  const braceStart = tokensCss.indexOf('{', selectorIndex);
  if (braceStart === -1) {
    fail(`Malformed CSS block for selector: ${selector}`);
    return {};
  }

  let depth = 0;
  let braceEnd = -1;
  for (let i = braceStart; i < tokensCss.length; i += 1) {
    if (tokensCss[i] === '{') depth += 1;
    if (tokensCss[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        braceEnd = i;
        break;
      }
    }
  }

  if (braceEnd === -1) {
    fail(`Unclosed CSS block for selector: ${selector}`);
    return {};
  }

  const block = tokensCss.slice(braceStart + 1, braceEnd);
  const vars = {};
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    vars[match[1]] = match[2].trim();
  }
  return vars;
}

function expectCssVar(vars, cssVar, expected, label) {
  if (!(cssVar in vars)) {
    fail(`${label}: missing ${cssVar} in tokens.css`);
    return;
  }
  const actual = vars[cssVar];
  if (actual.startsWith('var(')) {
    return;
  }
  if (normalizeHex(actual) !== normalizeHex(expected)) {
    fail(`${label}: ${cssVar} is ${actual}, expected ${expected} from colors.json`);
  }
}

function expectCssVarUsesThemePrimary(vars, cssVar, label) {
  if (!(cssVar in vars)) {
    fail(`${label}: missing ${cssVar} in tokens.css`);
    return;
  }
  if (vars[cssVar] !== 'var(--theme-primary)') {
    fail(`${label}: ${cssVar} must be var(--theme-primary), got ${vars[cssVar]}`);
  }
}

function expectForbiddenCssVar(cssVar) {
  if (tokensCss.includes(`${cssVar}:`)) {
    fail(`Forbidden legacy CSS variable still present: ${cssVar}`);
  }
}

// --- Structural checks ---
if ('themeButton' in colors) {
  fail('colors.json still contains legacy themeButton — use buttonRoleTokens instead');
}

const roles = colors.buttonRoleTokens?.theme;
if (!roles) {
  fail('colors.json missing buttonRoleTokens.theme');
}

if (!colors.pageHeaderButton) {
  fail('colors.json missing pageHeaderButton');
}

// --- Legacy CSS vars must not exist ---
expectForbiddenCssVar('--theme-btn-primary');
expectForbiddenCssVar('--theme-btn-primary-hover');

// --- Role constants: same values in every theme block; validate against CP light ---
const cpLight = extractCssVars('html.theme-cp {');
const cpDark = extractCssVars('html.theme-cp.dark {');

// --- Semantic colors: colors.json light/dark must mirror rendered --color-* per mode ---
const semantic = colors.semantic;
if (semantic) {
  const semanticVars = { success: '--color-success', warning: '--color-warning', error: '--color-error', info: '--color-info' };
  for (const [key, cssVar] of Object.entries(semanticVars)) {
    const entry = semantic[key];
    if (!entry) {
      fail(`colors.json semantic.${key} missing`);
      continue;
    }
    expectCssVar(cpLight, cssVar, entry.light, `semantic.${key}.light`);
    expectCssVar(cpDark, cssVar, entry.dark, `semantic.${key}.dark`);
  }
}

if (roles) {
  const primaryDisabled = roles.primary?.disabled;
  if (primaryDisabled) {
    expectCssVar(cpLight, '--theme-btn-primary-disabled-bg', primaryDisabled.background, 'buttonRoleTokens.primary.disabled');
    expectCssVar(cpLight, '--theme-btn-primary-disabled-fg', primaryDisabled.foreground, 'buttonRoleTokens.primary.disabled');
  }

  const secondary = roles.secondary;
  if (secondary) {
    expectCssVar(cpLight, '--theme-btn-secondary-hover-bg', secondary.hover.background, 'buttonRoleTokens.secondary.hover');
    expectCssVar(cpLight, '--theme-btn-secondary-disabled-fg', secondary.disabled.foreground, 'buttonRoleTokens.secondary.disabled');
    expectCssVarUsesThemePrimary(cpLight, '--theme-btn-secondary-stroke', 'buttonRoleTokens.secondary');
    expectCssVarUsesThemePrimary(cpLight, '--theme-btn-secondary-hover-fg', 'buttonRoleTokens.secondary.hover');
  }

  const tertiary = roles.tertiary;
  if (tertiary) {
    expectCssVar(cpLight, '--theme-btn-tertiary-hover-bg', tertiary.hover.background, 'buttonRoleTokens.tertiary.hover');
    expectCssVar(cpLight, '--theme-btn-tertiary-disabled-fg', tertiary.disabled.foreground, 'buttonRoleTokens.tertiary');
    expectCssVarUsesThemePrimary(cpLight, '--theme-btn-tertiary-fg', 'buttonRoleTokens.tertiary');
  }
}

// --- Page header: light palette in CP light block (dark varies per product in tokens.css) ---
const ph = colors.pageHeaderButton;
if (ph) {
  expectCssVar(cpLight, '--page-header-btn-primary', ph.primary.default.light, 'pageHeaderButton.primary.default');
  expectCssVar(cpLight, '--page-header-btn-primary-fg', ph.primary.default.foreground.light, 'pageHeaderButton.primary.default.foreground');
  expectCssVar(cpLight, '--page-header-btn-primary-hover', ph.primary.hover.light, 'pageHeaderButton.primary.hover');
  expectCssVar(cpLight, '--page-header-btn-primary-disabled-bg', ph.primary.disabled.background, 'pageHeaderButton.primary.disabled');
  expectCssVar(cpLight, '--page-header-btn-primary-disabled-fg', ph.primary.disabled.foreground, 'pageHeaderButton.primary.disabled');
  expectCssVar(cpLight, '--page-header-btn-secondary-stroke', ph.secondary.default.stroke.light, 'pageHeaderButton.secondary.default.stroke');
  expectCssVar(cpLight, '--page-header-btn-secondary-default-fg', ph.secondary.default.foreground.light, 'pageHeaderButton.secondary.default.foreground');
}

if (errors.length > 0) {
  console.error('Token validation failed:\n');
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log('Token validation passed (buttonRoleTokens ↔ tokens.css).');
