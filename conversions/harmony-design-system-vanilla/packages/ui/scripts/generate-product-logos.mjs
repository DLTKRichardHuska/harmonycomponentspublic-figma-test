import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
// scripts → ui → packages → conversion → conversions → repo root
const root = join(here, '../../../../../');
const outFile = join(here, '../src/elements/productLogoSvgs.js');

const logos = {
  CPVPLogo: join(root, 'public/logos/CPVPLogo.svg'),
  PPMLogo: join(root, 'public/logos/PPMLogo.svg'),
  MacLogo: join(root, 'public/logos/MacLogo.svg'),
};

function normalize(source) {
  return source
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    // Only strip root svg width/height — keep clipPath/mask geometry attributes.
    .replace(/<svg([^>]*)\swidth="[^"]*"/i, '<svg$1')
    .replace(/<svg([^>]*)\sheight="[^"]*"/i, '<svg$1')
    .replace(/\s+/g, ' ')
    .trim();
}

const out = {};
for (const [name, path] of Object.entries(logos)) {
  out[name] = normalize(readFileSync(path, 'utf8'));
}

writeFileSync(
  outFile,
  `/* Generated product logo SVGs with original fills — do not edit. */\nexport const productLogoSvgs = ${JSON.stringify(out, null, 2)};\n`,
);
console.log('Wrote productLogoSvgs.js', Object.keys(out).join(', '));
