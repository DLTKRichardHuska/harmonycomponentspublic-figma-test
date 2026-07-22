#!/usr/bin/env node
/**
 * Build SVG strings for curated Icon names from @heroicons/react 24/outline.
 * Writes converters/figma/scripts/.icon-svgs.json for use_figma import.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const dir = join(
  root,
  'conversions/harmony-design-system-shadcn/node_modules/@heroicons/react/24/outline',
);

const map = {
  'arrow-down': 'ArrowDownIcon',
  'arrow-down-tray': 'ArrowDownTrayIcon',
  'arrow-left': 'ArrowLeftIcon',
  'arrow-path': 'ArrowPathIcon',
  'arrow-right': 'ArrowRightIcon',
  'arrow-up': 'ArrowUpIcon',
  check: 'CheckIcon',
  'check-circle': 'CheckCircleIcon',
  'chevron-down': 'ChevronDownIcon',
  'cog-6-tooth': 'Cog6ToothIcon',
  'cursor-arrow-rays': 'CursorArrowRaysIcon',
  'ellipsis-vertical': 'EllipsisVerticalIcon',
  'exclamation-triangle': 'ExclamationTriangleIcon',
  eye: 'EyeIcon',
  funnel: 'FunnelIcon',
  home: 'HomeIcon',
  'information-circle': 'InformationCircleIcon',
  // Heroicons has no "keyboard" — use CommandLine as curated stand-in
  keyboard: 'CommandLineIcon',
  'no-symbol': 'NoSymbolIcon',
  pencil: 'PencilIcon',
  star: 'StarIcon',
  trash: 'TrashIcon',
  user: 'UserIcon',
  'x-mark': 'XMarkIcon',
};

const existing = new Set([
  'plus',
  'magnifying-glass',
  'bell',
  'calendar-days',
  'document',
  'pencil-square',
  'share',
  'moon',
]);

const svgs = {};
const missing = [];

for (const [name, file] of Object.entries(map)) {
  if (existing.has(name)) continue;
  const p = join(dir, `${file}.js`);
  if (!existsSync(p)) {
    missing.push({ name, file });
    continue;
  }
  const src = readFileSync(p, 'utf8');
  const paths = [...src.matchAll(/d:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (!paths.length) {
    missing.push({ name, file, reason: 'no-path' });
    continue;
  }
  const inner = paths.map((d) => `<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="${d}"/>`).join('');
  svgs[name] = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24">${inner}</svg>`;
}

const out = join(dirname(fileURLToPath(import.meta.url)), '.icon-svgs.json');
writeFileSync(out, JSON.stringify({ svgs, missing, existing: [...existing] }, null, 2));
console.log(`Wrote ${Object.keys(svgs).length} svgs → ${out}`);
if (missing.length) console.log('Missing:', missing);
