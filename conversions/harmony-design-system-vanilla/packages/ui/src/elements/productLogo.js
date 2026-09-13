/**
 * Product logo URL for the active kit / demo stylesheet.
 * Source tree resolves files under packages/ui/assets/logos/.
 * Product builds rewrite this module to a single ./assets/logo.svg.
 */

/** @type {string} */
export const PRODUCT_LOGO_ICON = 'CPVPLogo';

/** @type {Record<string, string>} */
export const PRODUCT_LOGO_BY_ID = {
  cp: 'CPVPLogo',
  vp: 'CPVPLogo',
  ppm: 'PPMLogo',
  maconomy: 'MacLogo',
};

/**
 * Resolve product logo key for the current kit / demo stylesheet.
 * @returns {string}
 */
export function resolveProductLogoKey() {
  if (typeof document !== 'undefined') {
    const link = document.getElementById('harmony-product-styles');
    const href = link?.getAttribute?.('href') || '';
    for (const [id, icon] of Object.entries(PRODUCT_LOGO_BY_ID)) {
      if (href.includes(`/${id}/`) || href.includes(`-${id}`) || href.includes(`${id}/styles`)) {
        return icon;
      }
    }
  }
  return PRODUCT_LOGO_ICON;
}

/**
 * Absolute URL to the product logo SVG asset.
 * @param {string} [key]
 * @returns {string}
 */
export function resolveProductLogoUrl(key = resolveProductLogoKey()) {
  const name = PRODUCT_LOGO_BY_ID[key] || key || PRODUCT_LOGO_ICON;
  const file = Object.values(PRODUCT_LOGO_BY_ID).includes(name) ? name : PRODUCT_LOGO_ICON;
  return new URL(`../../assets/logos/${file}.svg`, import.meta.url).href;
}
