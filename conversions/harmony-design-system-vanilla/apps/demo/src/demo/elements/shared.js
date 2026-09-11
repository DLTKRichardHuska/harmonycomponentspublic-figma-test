import { createSheet } from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import cpStylesUrl from '@dltkrichardhuska/harmony-design-system-vanilla/cp/styles.css?url';
import vpStylesUrl from '@dltkrichardhuska/harmony-design-system-vanilla/vp/styles.css?url';
import ppmStylesUrl from '@dltkrichardhuska/harmony-design-system-vanilla/ppm/styles.css?url';
import maconomyStylesUrl from '@dltkrichardhuska/harmony-design-system-vanilla/maconomy/styles.css?url';

/** Shared demo chrome tokens (uses Harmony CSS variables when present). */
export const demoChromeSheet = createSheet(`
  :host {
    display: block;
    box-sizing: border-box;
    font-family: var(--font-sans);
    font-size: var(--body-default);
    font-weight: var(--font-normal);
    line-height: var(--leading-normal);
    color: var(--text-primary);
  }
  *, *::before, *::after { box-sizing: border-box; }
  a { color: var(--link-color); }
  /* Do not reset button color/font — buttonSheet / product button.css own those. */
  select {
    font: inherit;
    color: inherit;
    cursor: pointer;
  }
  @media (forced-colors: active) {
    :host { color: CanvasText; }
    a { color: LinkText; }
    select {
      border: var(--border-width-thin) solid ButtonText;
      background: ButtonFace;
      color: ButtonText;
    }
    select:focus-visible,
    a:focus-visible {
      outline: var(--border-width-standard) solid Highlight;
      outline-offset: var(--space-0-5);
    }
    select:disabled {
      color: GrayText;
      border-color: GrayText;
    }
  }
`);

export const PRODUCTS = [
  { id: 'vp', label: 'Vantagepoint' },
  { id: 'cp', label: 'Costpoint' },
  { id: 'ppm', label: 'PPM' },
  { id: 'maconomy', label: 'Maconomy' },
];

export const STORAGE_PRODUCT = 'harmony-vanilla-demo-product';

/** Vite-resolved URLs for flattened single-product stylesheets. */
export const PRODUCT_STYLE_URLS = {
  cp: cpStylesUrl,
  vp: vpStylesUrl,
  ppm: ppmStylesUrl,
  maconomy: maconomyStylesUrl,
};

/**
 * Point the demo at a flattened product stylesheet (never html[data-product]).
 * @param {string} product
 */
export function applyProductStylesheet(product) {
  const id = PRODUCT_STYLE_URLS[product] ? product : 'vp';
  const link = document.getElementById('harmony-product-styles');
  if (link) {
    link.href = PRODUCT_STYLE_URLS[id];
  }
  document.documentElement.removeAttribute('data-product');
  try {
    localStorage.setItem(STORAGE_PRODUCT, id);
  } catch {
    /* ignore */
  }
  return id;
}
