import { createSheet } from './HarmonyElement.js';
import { toggleCss } from '../styles/generated/toggleCss.js';

/** Toggle recipe as a constructable stylesheet for Shadow DOM hosts (CE-only). */
export const toggleSheet = createSheet(toggleCss);

export { toggleCss };
