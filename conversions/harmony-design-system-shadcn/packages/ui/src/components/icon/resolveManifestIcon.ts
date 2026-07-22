import type { HarmonyProduct } from '../../theme';
import iconManifest from '../../data/icon-manifest.json';

export type ManifestIconSource = 'hero' | 'tabler' | 'custom';

export interface ManifestIconEntry {
  source: ManifestIconSource;
  path?: string;
  svg?: string;
}

type ProductManifest = Record<string, ManifestIconEntry>;

const manifest = iconManifest as Record<HarmonyProduct, ProductManifest>;

export function resolveManifestIcon(
  name: string,
  product: HarmonyProduct = 'cp',
): ManifestIconEntry | null {
  return manifest[product]?.[name] ?? null;
}
