import { createSheet } from './HarmonyElement.js';
import { tableCss } from '../styles/generated/tableCss.js';

/** Table recipe as a constructable stylesheet for Shadow DOM hosts. */
export const tableSheet = createSheet(tableCss);

export { tableCss };
