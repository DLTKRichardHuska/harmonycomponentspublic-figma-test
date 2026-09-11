import { createSheet } from './HarmonyElement.js';
import { spinnerCss } from '../styles/generated/spinnerCss.js';

/**
 * Spinner recipe as a constructable stylesheet for Shadow DOM hosts.
 */
export const spinnerSheet = createSheet(spinnerCss);

export { spinnerCss };
