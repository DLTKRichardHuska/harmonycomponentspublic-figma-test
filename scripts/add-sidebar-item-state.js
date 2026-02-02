/**
 * One-off: Add "item" state (selected item / [data-active="true"]) colors to
 * RightSidebar and LeftSidebar so MCP can read selected-item and Dela-active colors.
 * Uses design tokens so values resolve per theme/mode.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, '..', 'mcp-data', 'components');

const THEMES = ['cp', 'vp', 'ppm', 'maconomy'];
const MODES = ['light', 'dark'];

const ITEM_STATE = {
  background: 'var(--theme-primary)',
  text: 'var(--text-inverse)',
  border: 'transparent',
  iconColor: 'var(--text-inverse)'
};

function addItemState(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  const variants = data.visualSpecifications?.colors?.variants;
  if (!variants || typeof variants !== 'object') return false;

  let added = false;
  for (const variantName of Object.keys(variants)) {
    const variant = variants[variantName];
    if (!variant || typeof variant !== 'object') continue;
    for (const theme of THEMES) {
      if (!variant[theme] || typeof variant[theme] !== 'object') continue;
      for (const mode of MODES) {
        const modeObj = variant[theme][mode];
        if (!modeObj || typeof modeObj !== 'object') continue;
        if (!('item' in modeObj)) {
          modeObj.item = { ...ITEM_STATE };
          added = true;
        }
      }
    }
  }

  if (added) {
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
  return added;
}

function main() {
  const rightPath = join(COMPONENTS_DIR, 'rightsidebar.json');
  const leftPath = join(COMPONENTS_DIR, 'leftsidebar.json');
  const rightAdded = addItemState(rightPath);
  const leftAdded = addItemState(leftPath);
  console.log('add-sidebar-item-state: rightsidebar=%s leftsidebar=%s', rightAdded, leftAdded);
}

main();
