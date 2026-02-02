/**
 * Fill missing base state keys (default, hover, active, focus, disabled) in
 * visualSpecifications.colors.variants so every variant/theme/mode has a
 * consistent shape for MCP to iterate.
 *
 * Run after generate-mcp-data or standalone:
 *   node scripts/fill-variant-state-keys.js
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, '..', 'mcp-data', 'components');

const BASE_STATE_KEYS = ['default', 'hover', 'active', 'focus', 'disabled'];
const THEMES = ['cp', 'vp', 'ppm', 'maconomy'];
const MODES = ['light', 'dark'];

function ensureStateKeys(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const key of BASE_STATE_KEYS) {
    if (!(key in obj)) {
      obj[key] = {};
    }
  }
}

function processComponent(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  const variants = data.visualSpecifications?.colors?.variants;
  if (!variants || typeof variants !== 'object') return { changed: false };

  let changed = false;
  for (const variantName of Object.keys(variants)) {
    const variant = variants[variantName];
    if (!variant || typeof variant !== 'object') continue;
    for (const theme of THEMES) {
      if (!variant[theme] || typeof variant[theme] !== 'object') continue;
      for (const mode of MODES) {
        const modeObj = variant[theme][mode];
        if (!modeObj || typeof modeObj !== 'object') continue;
        const before = Object.keys(modeObj).length;
        ensureStateKeys(modeObj);
        if (Object.keys(modeObj).length !== before) changed = true;
      }
    }
  }

  if (changed) {
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
  return { changed };
}

function main() {
  const files = readdirSync(COMPONENTS_DIR).filter((f) => f.endsWith('.json'));
  let updated = 0;
  for (const file of files) {
    const result = processComponent(join(COMPONENTS_DIR, file));
    if (result.changed) updated++;
  }
  console.log(`fill-variant-state-keys: ${updated} component(s) updated.`);
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
