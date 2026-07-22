import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const src = path.join(root, 'src/styles/tokens.css');
const dest = path.join(
  root,
  'conversions/harmony-design-system-shadcn/packages/ui/src/styles/tokens.css',
);

let out = fs.readFileSync(src, 'utf8');
for (const p of ['cp', 'vp', 'ppm', 'maconomy']) {
  out = out.replaceAll(`html.theme-${p}.dark`, `html[data-product='${p}'].dark`);
  out = out.replaceAll(`html.theme-${p}`, `html[data-product='${p}']`);
}

const header = `/* Adapted from reference tokens.css — product via data-product, mode via .dark */\n`;
fs.writeFileSync(dest, header + out);
const leftover = out.match(/html\.theme-/g)?.length ?? 0;
console.log(`Wrote ${dest}`);
console.log(`leftover theme- selectors: ${leftover}`);
console.log(`data-product count: ${(out.match(/data-product/g) || []).length}`);
