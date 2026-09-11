import { createSheet } from './HarmonyElement.js';
import { tabStripCss } from '../styles/generated/tabStripCss.js';

/** Tab-strip recipe as a constructable stylesheet for Shadow DOM hosts (CE-only). */
export const tabStripSheet = createSheet(tabStripCss);

export { tabStripCss };
