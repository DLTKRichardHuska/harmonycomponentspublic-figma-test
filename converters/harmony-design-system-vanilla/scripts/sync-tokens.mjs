#!/usr/bin/env node
/**
 * Copy Harmony tokens from the Astro reference into the vanilla conversion
 * multi-product source, adapting html.theme-* selectors to html[data-product].
 * Agents invoke via Shell.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const converterRoot = resolve(__dirname, '..');
const repoRoot = resolve(converterRoot, '../..');
const conversionRoot = join(repoRoot, 'conversions', 'harmony-design-system-vanilla');
const sourceTokens = join(repoRoot, 'src/styles/tokens.css');
const destDir = join(conversionRoot, 'packages/ui/src/styles');
const destTokens = join(destDir, 'tokens.css');

if (!existsSync(sourceTokens)) {
  console.error(`Reference tokens not found: ${sourceTokens}`);
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });

let css = readFileSync(sourceTokens, 'utf8');
// Adapt reference theme classes to data-product for multi-product source + flatten.
css = css.replace(/html\.theme-(cp|vp|ppm|maconomy)(\.dark)?/g, (_, product, dark) => {
  return `html[data-product='${product}']${dark || ''}`;
});
css =
  `/* Adapted from reference tokens.css — product via data-product, mode via .dark / html.dark */\n` +
  css;

writeFileSync(destTokens, css, 'utf8');
console.log(`Synced tokens.css → ${destTokens}`);

// Optional: copy any reference style companions if present
const refStyles = join(repoRoot, 'src/styles');
for (const name of ['fonts.css']) {
  const src = join(refStyles, name);
  if (existsSync(src)) {
    copyFileSync(src, join(destDir, name));
    console.log(`Synced ${name}`);
  }
}

console.log('Foundation tokens sync complete.');
