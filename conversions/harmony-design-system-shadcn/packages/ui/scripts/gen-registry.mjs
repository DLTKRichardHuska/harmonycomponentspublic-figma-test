/**
 * Regenerate the source package's complete shadcn-CLI registry from
 * components/index.ts. Run after adding/removing a component: npm run gen:registry.
 * Product builds regenerate their own (product-scoped) registry in build-product.mjs.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateRegistryFromDisk } from './lib/registry.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const PKG = join(here, '..');
const basePkg = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf8'));

const count = generateRegistryFromDisk({
  registryRoot: PKG,
  pkgName: basePkg.name,
  componentsIndexPath: join(PKG, 'src', 'components', 'index.ts'),
  name: 'harmony-design-system-shadcn',
  homepage:
    'https://github.com/DLTKRichardHuska/harmonycomponentspublic-figma-test/tree/main/conversions/harmony-design-system-shadcn',
});

console.log(`gen-registry: wrote ${count} registry items`);
