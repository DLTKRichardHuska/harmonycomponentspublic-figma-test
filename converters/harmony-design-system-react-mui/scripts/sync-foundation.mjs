#!/usr/bin/env node
/** Copy Harmony token JSON from the Astro reference into the conversion output (standalone vendoring). */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const converterRoot = resolve(__dirname, '..');
const repoRoot = resolve(converterRoot, '../..');
const conversionRoot = join(repoRoot, 'conversions', 'harmony-design-system-react-mui');
const sourceDir = join(repoRoot, 'src/tokens');
const destDir = join(conversionRoot, 'src/tokens');

if (!existsSync(sourceDir)) {
  console.error(`Reference tokens not found: ${sourceDir}`);
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });

const files = readdirSync(sourceDir).filter((f) => f.endsWith('.json'));
for (const file of files) {
  copyFileSync(join(sourceDir, file), join(destDir, file));
  console.log(`Synced ${file}`);
}

console.log(`Foundation tokens synced (${files.length} files) → ${destDir}`);
