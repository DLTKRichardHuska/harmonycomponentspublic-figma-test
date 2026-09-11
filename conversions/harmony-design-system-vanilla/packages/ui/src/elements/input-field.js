import { createSheet } from './HarmonyElement.js';
import { inputFieldCss } from '../styles/generated/inputFieldCss.js';

/**
 * Field control styles for Shadow DOM hosts (`harmony-input` / `harmony-textarea` / `harmony-select`).
 * Document `styles.css` covers the native dual path (type selectors + wrappers).
 */
export const inputFieldSheet = createSheet(inputFieldCss);

export { inputFieldCss };
