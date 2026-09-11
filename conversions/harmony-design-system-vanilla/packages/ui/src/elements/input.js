import { createSheet } from './HarmonyElement.js';
import { inputCss } from '../styles/generated/inputCss.js';

/**
 * Native input/textarea/select recipe + form wrappers + harmony-form-layout as a
 * constructable stylesheet for Shadow DOM hosts (demo pages).
 * Document `styles.css` already includes this layer for light DOM.
 */
export const inputSheet = createSheet(inputCss);

export { inputCss };
