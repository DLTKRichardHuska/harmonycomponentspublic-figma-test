/**
 * Shared shadcn-CLI registry generator.
 *
 * The registry is intentionally shim-based: each item is a tiny file that
 * re-exports the real component from the installed npm package, so
 * `npx shadcn add <name>` never copies a stale fork of the component. The item
 * set is derived from components/index.ts, so the registry is always complete
 * and stays in sync as components are added or (per product) filtered out.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Parse a components/index.ts into re-export blocks:
 *   [{ module: './button', body: '\n  Button,\n  ...\n' }, …]
 */
export function parseComponentExports(src) {
  const blocks = [];
  const re = /export\s*\{([\s\S]*?)\}\s*from\s*'([^']+)';/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const body = m[1];
    const module = m[2];
    const hasName = body
      .split(',')
      .map((s) => s.trim().replace(/^type\s+/, '').trim())
      .some(Boolean);
    if (hasName) blocks.push({ module, body });
  }
  return blocks;
}

/** './button' -> 'button', '../layouts' -> 'shell'. */
function itemId(module) {
  if (module === '../layouts') return 'shell';
  return module.replace(/^\.\//, '').replace(/\/index$/, '');
}

/** 'button-group' -> 'Button Group'. */
function toTitle(id) {
  return id
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

/**
 * Generate registry.json + registry/new-york/*.tsx under registryRoot.
 * `pkgName` is the npm package the shims import from (product-suffixed in
 * single-product builds). Returns the number of items written.
 */
export function generateRegistry({ registryRoot, pkgName, componentsIndexSrc, name, homepage }) {
  const blocks = parseComponentExports(componentsIndexSrc);
  const dir = join(registryRoot, 'registry', 'new-york');
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  const manifest = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name,
    homepage,
    items: [],
  };

  for (const { module, body } of blocks) {
    const id = itemId(module);
    const title = toTitle(id);
    const shim = `/**
 * Harmony registry shim — re-exports the package ${title}.
 * Do not replace with stock shadcn components or Lucide icons.
 *
 * Preferred (apps): import from the package directly:
 *   import { … } from '${pkgName}'
 */
export {${body}} from '${pkgName}/components';
`;
    writeFileSync(join(dir, `${id}.tsx`), shim);
    manifest.items.push({
      name: id,
      type: 'registry:ui',
      title,
      description: `Harmony ${title} — re-exports the package component. Prefer importing from '${pkgName}' directly.`,
      dependencies: [pkgName],
      files: [{ path: `registry/new-york/${id}.tsx`, type: 'registry:component' }],
    });
  }

  writeFileSync(join(registryRoot, 'registry.json'), JSON.stringify(manifest, null, 2) + '\n');
  return manifest.items.length;
}

/** Convenience: read the index from disk and generate. */
export function generateRegistryFromDisk({ registryRoot, pkgName, componentsIndexPath, name, homepage }) {
  const src = readFileSync(componentsIndexPath, 'utf8');
  return generateRegistry({ registryRoot, pkgName, componentsIndexSrc: src, name, homepage });
}
