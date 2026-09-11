import { productLogoSvgs } from './productLogoSvgs.js';

/**
 * Product logo icon key for the active kit.
 * Product builds rewrite this constant.
 */
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
 * Make SVG fragment ids unique so clipPath/mask urls work in Shadow DOM.
 * @param {string} svg
 * @param {string} prefix
 */
export function uniquifySvgIds(svg, prefix) {
  return String(svg)
    .replace(/\bid="([^"]+)"/g, `id="${prefix}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`);
}

/**
 * @param {string} [key]
 * @param {string} [idPrefix]
 * @returns {string}
 */
export function productLogoMarkup(key = resolveProductLogoKey(), idPrefix = 'pl') {
  const svg = productLogoSvgs[key] || productLogoSvgs.CPVPLogo || '';
  return uniquifySvgIds(svg, idPrefix);
}
