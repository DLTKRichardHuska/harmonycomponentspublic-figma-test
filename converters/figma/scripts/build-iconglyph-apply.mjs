#!/usr/bin/env node
/**
 * Build Icons-library use_figma apply batches (one-pass import + remediate).
 * Creates/updates standalone glyph components (name = shadcn Icon name) in the
 * shared Icons library — not product-file IconGlyph VARIANT sets.
 *
 * Usage:
 *   node build-iconglyph-apply.mjs --from custom [--dry-run]
 *   node build-iconglyph-apply.mjs --from curated [--dry-run]
 *   node build-iconglyph-apply.mjs --from file --file path/to/svgs.json [--dry-run]
 *   node build-iconglyph-apply.mjs --names gantt-chart,pin [--dry-run]
 *
 * Emits converters/figma/scripts/.iconglyph-apply-N.js (gitignored).
 * Agent: Shell this script, then parent use_figma against iconsLibrary.fileKey
 * (external.config.json) — do not Read files into chat.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildApplyCode } from './lib/iconglyph-apply-template.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../../..');
const publicDir = join(root, 'public');
const outDir = __dirname;
const CODE_BUDGET = 35000;
const SIMPLIFY_BYTES = 25000;

const CUSTOM_NAMES = [
  'gantt-chart', 'ms-project', 'template', 'tree', 'Contract', 'Report', 'Resource',
  'Risk Shield', 'riskcategories', 'riskhandelingstrategies', 'riskresponsetype', 'riskstatuses',
  'mitigationplan', 'impacttypes', 'bullseye', 'history',
  'dock-center', 'dock-right', 'dock', 'undock', 'minimize', 'restore', 'window', 'two-columns', 'orientation',
  'drag', 'pin', 'pinned', 'related', 'upload-download', 'swap',
  'API Schema', 'Network Graph', 'png', 'oracle',
  'mic-slash', 'multiview-disable', 'open-apps',
  'keyboard', 'Dela D in dark circle 1',
];

function parseArgs(argv) {
  const args = {
    from: null,
    file: null,
    names: null,
    dryRun: false,
    textPrimaryId: '',
    pageName: 'Icons',
    masterName: 'plus',
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--from') args.from = argv[++i];
    else if (a === '--file') args.file = argv[++i];
    else if (a === '--names') args.names = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--text-primary') args.textPrimaryId = argv[++i];
    else if (a === '--page') args.pageName = argv[++i];
    else if (a === '--master') args.masterName = argv[++i];
    else if (a === '--set-id') { /* deprecated (IconGlyph); ignored */ argv[++i]; }
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function minifySvg(raw) {
  return raw.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
}

function cleanSvg(raw) {
  return minifySvg(
    raw
      .replace(/<defs>[\s\S]*?<\/defs>/gi, '')
      .replace(/\sclip-path="[^"]*"/gi, '')
      .replace(/<g([^>]*)>/gi, (_m, attrs) => `<g${String(attrs).replace(/\sclip-path="[^"]*"/gi, '')}>`),
  );
}

/** Flatten oversized gradient/brand SVG to solid monochrome paths. */
function simplifyToMonochrome(raw, name) {
  const viewBox = (raw.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 24 24';
  const paths = [...raw.matchAll(/<path\b[^>]*>/gi)];
  if (!paths.length) return null;
  const parts = [];
  for (const m of paths) {
    const tag = m[0];
    const d = (tag.match(/\bd="([^"]+)"/) || [])[1];
    if (!d) continue;
    const fillNone = /fill="none"/i.test(tag) && !/stroke=/i.test(tag);
    if (fillNone) continue;
    parts.push(`<path d="${d}" fill="#373F4E"/>`);
  }
  if (!parts.length) return null;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="24" height="24" fill="none">${parts.join('')}</svg>`;
  console.error(`simplified ${name}: ${parts.length} paths → ${Buffer.byteLength(svg)} bytes`);
  return minifySvg(svg);
}

function loadPublicSvg(name) {
  const p = join(publicDir, `${name}.svg`);
  if (!existsSync(p)) throw new Error(`Missing public SVG: ${p}`);
  let raw = cleanSvg(readFileSync(p, 'utf8'));
  if (Buffer.byteLength(raw) > SIMPLIFY_BYTES) {
    const simple = simplifyToMonochrome(raw, name);
    if (simple) raw = simple;
  }
  return raw;
}

function loadSvgsMap(args) {
  if (args.names) {
    const map = {};
    for (const n of args.names) map[n] = loadPublicSvg(n);
    return map;
  }
  if (args.from === 'custom') {
    const map = {};
    for (const n of CUSTOM_NAMES) map[n] = loadPublicSvg(n);
    return map;
  }
  if (args.from === 'curated') {
    const iconPath = join(outDir, '.icon-svgs.json');
    if (!existsSync(iconPath)) {
      throw new Error(`Missing ${iconPath} — run build-icon-svgs.mjs first`);
    }
    const data = JSON.parse(readFileSync(iconPath, 'utf8'));
    return data.svgs || data;
  }
  if (args.from === 'file') {
    if (!args.file) throw new Error('--from file requires --file <path>');
    const data = JSON.parse(readFileSync(args.file, 'utf8'));
    return data.svgs || data;
  }
  throw new Error('Specify --from custom|curated|file or --names a,b,c');
}

function batchSvgs(svgs, budget) {
  const names = Object.keys(svgs);
  const batches = [];
  let cur = {};
  let curSize = 0;
  const emptyCode = buildApplyCode({}, {});
  const templateOverhead = Buffer.byteLength(emptyCode) + 64;
  for (const n of names) {
    const svg = svgs[n];
    const entrySize = Buffer.byteLength(JSON.stringify(n)) + Buffer.byteLength(JSON.stringify(svg)) + 8;
    if (Object.keys(cur).length && curSize + entrySize + templateOverhead > budget) {
      batches.push(cur);
      cur = {};
      curSize = 0;
    }
    cur[n] = svg;
    curSize += entrySize;
  }
  if (Object.keys(cur).length) batches.push(cur);
  return batches;
}

function clearPriorOutputs() {
  for (const f of readdirSync(outDir)) {
    if (/^\.iconglyph-apply-\d+\.js$/.test(f)) unlinkSync(join(outDir, f));
  }
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || (!args.from && !args.names)) {
    console.log(`Usage:
  node build-iconglyph-apply.mjs --from custom|curated|file [--file path] [--dry-run]
  node build-iconglyph-apply.mjs --names name1,name2 [--dry-run]
  Options: --page Icons --master plus --text-primary <VariableID>
  Apply batches with use_figma against iconsLibrary.fileKey (external.config.json).`);
    process.exit(args.help ? 0 : 1);
  }

  const svgs = loadSvgsMap(args);
  const batches = batchSvgs(svgs, CODE_BUDGET);

  if (!args.dryRun) {
    mkdirSync(outDir, { recursive: true });
    clearPriorOutputs();
  }

  const summary = [];
  batches.forEach((batch, i) => {
    const code = buildApplyCode(batch, {
      textPrimaryId: args.textPrimaryId,
      pageName: args.pageName,
      masterName: args.masterName,
    });
    const bytes = Buffer.byteLength(code);
    const names = Object.keys(batch);
    if (bytes > CODE_BUDGET) {
      console.error(`WARN batch ${i} exceeds budget: ${bytes} > ${CODE_BUDGET} names=${names.join(',')}`);
    }
    summary.push({ batch: i, names, bytes, underBudget: bytes <= CODE_BUDGET });
    if (!args.dryRun) {
      const out = join(outDir, `.iconglyph-apply-${i}.js`);
      writeFileSync(out, code);
      console.log(`wrote ${out} (${bytes} bytes, ${names.length} icons)`);
    } else {
      console.log(`dry-run batch ${i}: ${bytes} bytes, ${names.length} icons — ${names.join(', ')}`);
    }
  });

  console.log(JSON.stringify({
    dryRun: args.dryRun,
    target: 'icons-library',
    totalIcons: Object.keys(svgs).length,
    batchCount: batches.length,
    codeBudget: CODE_BUDGET,
    batches: summary,
  }, null, 2));
}

main();
