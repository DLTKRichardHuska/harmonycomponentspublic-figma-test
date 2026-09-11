import { createSheet } from './HarmonyElement.js';
import { labelCss } from '../styles/generated/labelCss.js';

/**
 * Label recipe (`.label`) as a constructable stylesheet for Shadow DOM hosts.
 * Document `styles.css` already includes this layer for light DOM.
 */
export const labelSheet = createSheet(labelCss);

export { labelCss };
