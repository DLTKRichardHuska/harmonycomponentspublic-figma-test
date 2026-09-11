import { createSheet } from './HarmonyElement.js';
import { buttonGroupCss } from '../styles/generated/buttonGroupCss.js';

/** Button-group recipe as a constructable stylesheet for Shadow DOM hosts. */
export const buttonGroupSheet = createSheet(buttonGroupCss);

export { buttonGroupCss };
