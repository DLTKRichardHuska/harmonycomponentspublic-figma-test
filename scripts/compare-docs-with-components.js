#!/usr/bin/env node
/**
 * Compare documentation pages with actual component Props interfaces.
 * Doc mappings are sourced from src/data/component-catalog.ts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, '..');
const docsDir = path.join(root, 'src/pages/components');
const inventoryFile = path.join(root, 'component-props-inventory.json');
const catalogFile = path.join(root, 'src/data/component-catalog.ts');

function readCatalogObject(constName) {
  const content = fs.readFileSync(catalogFile, 'utf-8');
  const match = content.match(
    new RegExp(`export const ${constName}(?:[^=]*)= \\{([\\s\\S]*?)\\};`)
  );
  if (!match) {
    throw new Error(`Could not parse ${constName} from component-catalog.ts`);
  }

  const entries = {};
  for (const line of match[1].split('\n')) {
    const entryMatch = line.match(/^\s*(\w+):\s*(?:'([^']*)'|null)/);
    if (entryMatch) {
      entries[entryMatch[1]] = entryMatch[2] ?? null;
    }
  }
  return entries;
}

const componentToDocMap = readCatalogObject('componentDocMapping');
const componentToPropsVar = readCatalogObject('componentDocPropsVar');

const inventory = JSON.parse(fs.readFileSync(inventoryFile, 'utf-8'));
const mismatches = {};

/**
 * Extract prop names from a doc file's props array.
 */
function extractPropsFromDoc(docContent, propsVariableName = 'props') {
  const names = [];
  const re = new RegExp(
    `const\\s+${propsVariableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*=\\s*\\[`,
    's'
  );
  const startMatch = docContent.match(re);
  if (!startMatch) return names;

  const startIndex = startMatch.index + startMatch[0].length;
  let depth = 1;
  let i = startIndex;
  while (i < docContent.length && depth > 0) {
    const c = docContent[i];
    if (c === '[') depth++;
    else if (c === ']') depth--;
    i++;
  }
  const arrayBody = docContent.slice(startIndex, i - 1);

  const nameRe = /name:\s*['"]([^'"]+)['"]/g;
  let nameMatch;
  while ((nameMatch = nameRe.exec(arrayBody)) !== null) {
    names.push(nameMatch[1]);
  }
  return names;
}

for (const [componentName, docFileName] of Object.entries(componentToDocMap)) {
  if (!docFileName || !inventory[componentName] || !inventory[componentName].hasProps) {
    continue;
  }

  const docFile = path.join(docsDir, `${docFileName}.astro`);
  if (!fs.existsSync(docFile)) {
    mismatches[componentName] = {
      error: `Documentation file not found: ${docFileName}.astro`,
    };
    continue;
  }

  const docContent = fs.readFileSync(docFile, 'utf-8');
  const propsVarName = componentToPropsVar[componentName] ?? 'props';
  const docPropNames = new Set(
    extractPropsFromDoc(docContent, propsVarName).filter((k) => k !== 'class')
  );
  const componentProps = inventory[componentName].props || {};
  const componentPropNames = new Set(
    Object.keys(componentProps).filter((k) => k !== 'class' && k !== '[key: string]')
  );

  const missingInDocs = Array.from(componentPropNames).filter((name) => !docPropNames.has(name));
  const extraInDocs = Array.from(docPropNames).filter((name) => !componentPropNames.has(name));

  if (missingInDocs.length > 0 || extraInDocs.length > 0) {
    mismatches[componentName] = {
      missingInDocs,
      extraInDocs,
      docProps: Array.from(docPropNames),
      componentProps: Array.from(componentPropNames),
    };
  }
}

const reportFile = path.join(root, 'docs-mismatch-report.json');
fs.writeFileSync(reportFile, JSON.stringify(mismatches, null, 2));

console.log('Documentation Mismatch Report');
console.log('=============================\n');
for (const [component, issues] of Object.entries(mismatches)) {
  console.log(`\n${component}:`);
  if (issues.error) {
    console.log(`  ERROR: ${issues.error}`);
  } else {
    if (issues.missingInDocs?.length > 0) {
      console.log(`  Missing in docs: ${issues.missingInDocs.join(', ')}`);
    }
    if (issues.extraInDocs?.length > 0) {
      console.log(`  Extra in docs: ${issues.extraInDocs.join(', ')}`);
    }
  }
}

console.log(`\nFull report written to: ${reportFile}`);

if (Object.keys(mismatches).length > 0) {
  process.exit(1);
}
