import raw from './product-meta.json';

/** The four Harmony product surfaces. Kept here (not in the theme module) to avoid a cycle. */
export type ProductId = 'cp' | 'vp' | 'ppm' | 'maconomy';

export interface ProductMeta {
  /** Display name shown in ShellHeader (e.g. "Vantagepoint"). */
  name: string;
  /** Product logo as a self-contained SVG data URI — no asset hosting required. */
  logo: string;
}

/** Turn inline SVG markup into an `<img src>`-ready data URI. */
export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface RawEntry {
  name: string;
  svg: string;
}

/**
 * Product identity (name + logo) baked from `product-meta.json`. This is the single
 * source of brand truth: the theme provider exposes the active product's entry, and
 * `build-product.mjs` bakes the chosen product's values into each single-product build.
 */
export const PRODUCT_META: Record<ProductId, ProductMeta> = Object.fromEntries(
  Object.entries(raw as Record<string, RawEntry>).map(([id, entry]) => [
    id,
    { name: entry.name, logo: svgToDataUri(entry.svg) },
  ]),
) as Record<ProductId, ProductMeta>;

/**
 * Neutral logo used only when there is no theme provider and no explicit prop.
 * Uses the first available product so it stays valid in single-product builds,
 * where `build-product.mjs` prunes this map to just the shipped product.
 */
export const FALLBACK_LOGO: string = Object.values(PRODUCT_META)[0]?.logo ?? '';
