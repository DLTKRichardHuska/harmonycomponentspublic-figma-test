/**
 * Token resolvers for migration: load colors.json and tokens.css :root,
 * resolve theme/mode colors and size tokens.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');

/**
 * CSS variable name (without --) -> colors.json dot path for getColor(theme, mode, path).
 * Used to resolve var(--name) in generated specs to theme/mode-specific colors.
 * @type {Record<string, string>}
 */
export const CSS_VAR_TO_COLORS_PATH = {
  'theme-primary': 'primary',
  'theme-primary-hover': 'primaryHover',
  'text-muted': 'palette.mutedText',
  'text-secondary': 'palette.secondaryText',
  'text-primary': 'palette.titleText',
  'link-color': 'palette.link',
  'border-color': 'palette.border',
  'border-light': 'palette.border',
  'card-bg': 'palette.cardBackground',
  'page-bg': 'palette.pageBackground',
  'nav-bg': 'palette.navBackground',
  'hover-bg': 'palette.hover',
  'input-bg': 'palette.inputBackground',
  'table-header-gray-bg': 'palette.hover',
  'surface-bg': 'palette.cardBackground',
  'elevated-bg': 'palette.cardBackground',
  'color-error': 'semantic.error',
  'color-warning': 'semantic.warning',
};

/**
 * Load and parse colors.json.
 * @param {string} relPath - Path relative to project root (default: src/tokens/colors.json)
 * @returns {{ data: object, getColor: (theme: string, mode: string, tokenPath: string) => string|undefined }}
 */
export function loadColors(relPath = 'src/tokens/colors.json') {
  const filePath = path.join(ROOT, relPath);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);

  /**
   * Get a resolved color for theme + mode.
   * @param {string} theme - e.g. 'cp', 'vp', 'ppm', 'maconomy'
   * @param {string} mode - 'light' or 'dark'
   * @param {string} tokenPath - Dot path: 'primary', 'primaryHover', 'palette.cardBackground', etc.
   * @returns {string|undefined} Resolved hex/rgba or undefined if missing
   */
  function getColor(theme, mode, tokenPath) {
    const parts = tokenPath.split('.');
    let current;

    if (parts[0] === 'semantic' && data.semantic) {
      current = data.semantic;
      for (let i = 1; i < parts.length; i++) {
        current = current?.[parts[i]];
      }
      current = current?.[mode];
      return typeof current === 'string' ? current : undefined;
    }

    const themeData = data.themes?.[theme];
    if (!themeData) return undefined;

    current = themeData;

    for (let i = 0; i < parts.length; i++) {
      const key = parts[i];
      if (current == null) return undefined;
      if (key === 'palette' && current.palette) {
        current = current.palette[mode];
        continue;
      }
      if (key === 'primary' || key === 'primaryHover') {
        current = current[key]?.[mode];
        continue;
      }
      current = current[key];
    }

    return typeof current === 'string' ? current : undefined;
  }

  return { data, getColor };
}

/**
 * Parse :root { ... } from tokens.css and extract --name: value; into a Map.
 * Strips comments from values; does not resolve var() references.
 * @param {string} relPath - Path relative to project root (default: src/styles/tokens.css)
 * @returns {{ map: Map<string, string>, getToken: (name: string) => string|undefined }}
 */
export function loadTokensCSS(relPath = 'src/styles/tokens.css') {
  const filePath = path.join(ROOT, relPath);
  const css = fs.readFileSync(filePath, 'utf-8');

  const map = new Map();

  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/m);
  if (!rootMatch) return { map, getToken: (name) => map.get(name) ?? undefined };

  const block = rootMatch[1];
  const varRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = varRegex.exec(block)) !== null) {
    const name = m[1];
    let value = m[2].trim();
    const commentStart = value.indexOf('/*');
    if (commentStart >= 0) value = value.slice(0, commentStart).trim();
    map.set(name, value);
  }

  /**
   * Get a token value by name (without the -- prefix).
   * @param {string} name - e.g. 'avatar-size-sm', 'radius-08'
   * @returns {string|undefined}
   */
  function getToken(name) {
    return map.get(name) ?? undefined;
  }

  return { map, getToken };
}

// --- Run test when executed directly ---
if (import.meta.url === `file://${process.argv[1]}`) {
  const colors = loadColors();
  const tokens = loadTokensCSS();

  console.log('=== Avatar-related tokens (from tokens.css :root) ===');
  console.log('  --avatar-size-sm:', tokens.getToken('avatar-size-sm'));
  console.log('  --avatar-size-md:', tokens.getToken('avatar-size-md'));
  console.log('  --avatar-size-lg:', tokens.getToken('avatar-size-lg'));

  console.log('\n=== CP light primary (from colors.json) ===');
  console.log('  getColor("cp", "light", "primary"):', colors.getColor('cp', 'light', 'primary'));

  console.log('\n=== VP dark cardBackground (from colors.json) ===');
  console.log('  getColor("vp", "dark", "palette.cardBackground"):', colors.getColor('vp', 'dark', 'palette.cardBackground'));

  console.log('\n=== radius-08 (from tokens.css) ===');
  console.log('  getToken("radius-08"):', tokens.getToken('radius-08'));
}
