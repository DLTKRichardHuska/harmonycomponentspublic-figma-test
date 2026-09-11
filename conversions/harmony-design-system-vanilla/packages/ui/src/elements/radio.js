import { createSheet } from './HarmonyElement.js';
import { radioCss } from '../styles/generated/radioCss.js';

/** Radio recipe as a constructable stylesheet for Shadow DOM hosts. */
export const radioSheet = createSheet(radioCss);

export { radioCss };
