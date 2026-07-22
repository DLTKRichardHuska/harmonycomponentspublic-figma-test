#!/usr/bin/env node
/**
 * Validate that src/data/component-catalog.ts matches src/components/ui/index.ts exports.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const indexFile = path.join(root, 'src/components/ui/index.ts');
const catalogFile = path.join(root, 'src/data/component-catalog.ts');

function readIndexExports() {
  const content = fs.readFileSync(indexFile, 'utf-8');
  return [...content.matchAll(/export \{ default as (\w+)/g)].map((match) => match[1]).sort();
}

function readCatalogExports() {
  const content = fs.readFileSync(catalogFile, 'utf-8');
  const names = [...content.matchAll(/'([A-Z][A-Za-z0-9]+)'/g)].map((match) => match[1]);
  const categoryBlock = content.match(/export const componentCategories = \{[\s\S]*?\} as const;/);
  if (!categoryBlock) {
    throw new Error('Could not parse componentCategories from component-catalog.ts');
  }
  const categoryNames = [...categoryBlock[0].matchAll(/'([A-Z][A-Za-z0-9]+)'/g)].map((match) => match[1]);
  return [...new Set(categoryNames)].sort();
}

function readCatalogCount() {
  const content = fs.readFileSync(catalogFile, 'utf-8');
  const match = content.match(/EXPORTED_UI_COMPONENT_COUNT = (\d+)/);
  return match ? Number(match[1]) : null;
}

const indexExports = readIndexExports();
const catalogExports = readCatalogExports();
const catalogCount = readCatalogCount();

const missingInCatalog = indexExports.filter((name) => !catalogExports.includes(name));
const extraInCatalog = catalogExports.filter((name) => !indexExports.includes(name));
const errors = [];

if (missingInCatalog.length > 0) {
  errors.push(`Missing from component-catalog.ts: ${missingInCatalog.join(', ')}`);
}
if (extraInCatalog.length > 0) {
  errors.push(`Extra in component-catalog.ts (not in index.ts): ${extraInCatalog.join(', ')}`);
}
if (catalogCount !== indexExports.length) {
  errors.push(
    `EXPORTED_UI_COMPONENT_COUNT is ${catalogCount}, but index.ts exports ${indexExports.length} components`
  );
}

if (errors.length > 0) {
  console.error('Component catalog validation failed:\n');
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(`Component catalog OK (${indexExports.length} exported UI components).`);
