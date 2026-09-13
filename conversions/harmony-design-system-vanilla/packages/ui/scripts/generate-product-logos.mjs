import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
// scripts → ui → packages → conversion → conversions → repo root
const root = join(here, '../../../../../');
const outDir = join(here, '../assets/logos');

const logos = {
  CPVPLogo: join(root, 'public/logos/CPVPLogo.svg'),
  PPMLogo: join(root, 'public/logos/PPMLogo.svg'),
  MacLogo: join(root, 'public/logos/MacLogo.svg'),
};

mkdirSync(outDir, { recursive: true });

const written = [];
for (const [name, src] of Object.entries(logos)) {
  if (!existsSync(src)) {
    console.error(`generate-product-logos: missing ${src}`);
    process.exit(1);
  }
  const dest = join(outDir, `${name}.svg`);
  cpSync(src, dest);
  written.push(`${name}.svg`);
}

console.log('Wrote assets/logos/', written.join(', '));
