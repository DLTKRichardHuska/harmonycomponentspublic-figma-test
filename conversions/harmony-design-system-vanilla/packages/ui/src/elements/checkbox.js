import { createSheet } from './HarmonyElement.js';
import { checkboxCss } from '../styles/generated/checkboxCss.js';

/** Checkbox recipe as a constructable stylesheet for Shadow DOM hosts. */
export const checkboxSheet = createSheet(checkboxCss);

export { checkboxCss };
