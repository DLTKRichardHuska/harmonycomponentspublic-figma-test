#!/usr/bin/env node
/**
 * Validate that a Figma file's pages match the Harmony demo nav
 * (one page per leaf, no section buckets) and optionally that each
 * leaf has Page chrome (title + status + content).
 *
 * Agents: dump pages via use_figma to JSON, then run this script.
 * Do not instruct humans to run conversion scripts — agents invoke via Shell.
 *
 * Usage:
 *   node converters/figma/scripts/validate-figma-pages.mjs --pages path/to/dump.json
 *   node converters/figma/scripts/validate-figma-pages.mjs --expected-only
 *
 * Dump shape:
 * {
 *   "pages": [
 *     { "name": "Coversheet", "id": "0:1", "hasChrome": false },
 *     { "name": "Components / Buttons", "id": "…", "hasChrome": true,
 *       "chrome": { "title": true, "status": true, "content": true } }
 *   ]
 * }
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');

const SKIP_SECTIONS = new Set(['Changelog', 'Getting Started']);
const BUCKET_NAMES = new Set(['Foundation', 'Shell Layout', 'Components']);

/**
 * Parse nav sections/items from src/data/navigation.ts (same source as the demo).
 * @returns {{ title: string, items: { title: string }[] }[]}
 */
export function parseNavigationSections() {
  const navPath = join(repoRoot, 'src/data/navigation.ts');
  const text = readFileSync(navPath, 'utf8');
  const sections = [];
  const sectionRe =
    /\{\s*title:\s*'([^']+)',\s*items:\s*\[([\s\S]*?)\],\s*\}/g;
  let m;
  while ((m = sectionRe.exec(text))) {
    const title = m[1];
    const itemsBlock = m[2];
    const items = [...itemsBlock.matchAll(/title:\s*'([^']+)'/g)].map((x) => ({
      title: x[1],
    }));
    sections.push({ title, items });
  }
  if (!sections.length) {
    throw new Error(`Could not parse sections from ${navPath}`);
  }
  return sections;
}

/** Expected Figma page names in order. */
export function getExpectedFigmaPageNames() {
  const sections = parseNavigationSections().filter((s) => !SKIP_SECTIONS.has(s.title));
  const leaves = sections.flatMap((s) =>
    s.items.map((item) => `${s.title} / ${item.title}`),
  );
  return ['Coversheet', ...leaves, '_internal'];
}

function isBucketPage(name) {
  return BUCKET_NAMES.has(name);
}

function validate(dump, { requireChrome = true } = {}) {
  const errors = [];
  const warnings = [];
  const expected = getExpectedFigmaPageNames();
  const actual = (dump.pages || []).map((p) => p.name);

  if (actual.length !== expected.length) {
    errors.push(
      `Page count ${actual.length} !== expected ${expected.length} (from navigation.ts + Coversheet + _internal)`,
    );
  }

  for (const name of actual) {
    if (isBucketPage(name)) {
      errors.push(
        `Bucket page forbidden: "${name}" — use one page per nav leaf ("${name} / …")`,
      );
    }
  }

  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  for (const name of expected) {
    if (!actualSet.has(name)) errors.push(`Missing page: "${name}"`);
  }
  for (const name of actual) {
    if (!expectedSet.has(name)) errors.push(`Unexpected page: "${name}"`);
  }

  for (let i = 0; i < Math.min(expected.length, actual.length); i++) {
    if (expected[i] !== actual[i]) {
      errors.push(`Order mismatch at index ${i}: expected "${expected[i]}", got "${actual[i]}"`);
      break;
    }
  }

  if (requireChrome) {
    for (const page of dump.pages || []) {
      if (page.name === 'Coversheet' || page.name === '_internal') continue;
      if (!expectedSet.has(page.name)) continue;
      if (!page.hasChrome) {
        errors.push(`Missing Page chrome on "${page.name}"`);
        continue;
      }
      const c = page.chrome || {};
      if (!c.title) errors.push(`Missing Page title on "${page.name}"`);
      if (!c.status) errors.push(`Missing Page status on "${page.name}"`);
      if (!c.content) errors.push(`Missing Page content on "${page.name}"`);
    }
  }

  return { ok: errors.length === 0, errors, warnings, expected, actual };
}

function printExpected() {
  const expected = getExpectedFigmaPageNames();
  console.log(JSON.stringify({ expected, count: expected.length }, null, 2));
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--expected-only')) {
    printExpected();
    process.exit(0);
  }

  const pagesIdx = args.indexOf('--pages');
  if (pagesIdx === -1 || !args[pagesIdx + 1]) {
    console.error(
      'Usage: node converters/figma/scripts/validate-figma-pages.mjs --pages <dump.json> [--no-chrome]\n' +
        '       node converters/figma/scripts/validate-figma-pages.mjs --expected-only',
    );
    process.exit(2);
  }

  const dumpPath = resolve(args[pagesIdx + 1]);
  if (!existsSync(dumpPath)) {
    console.error(`File not found: ${dumpPath}`);
    process.exit(2);
  }

  const requireChrome = !args.includes('--no-chrome');
  const dump = JSON.parse(readFileSync(dumpPath, 'utf8'));
  const result = validate(dump, { requireChrome });

  if (result.ok) {
    console.log(`OK — ${result.expected.length} pages match navigation.ts` +
      (requireChrome ? ' (chrome present on leaves)' : ''));
    process.exit(0);
  }

  console.error('FAIL — Figma pages do not match demo nav / page anatomy:');
  for (const e of result.errors) console.error(`  ERROR: ${e}`);
  for (const w of result.warnings) console.error(`  WARN: ${w}`);
  process.exit(1);
}

main();
