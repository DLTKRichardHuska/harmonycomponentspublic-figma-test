import { createSheet } from './HarmonyElement.js';
import { listMenuCss } from '../styles/generated/listMenuCss.js';

/** List-menu recipe as a constructable stylesheet for Shadow DOM hosts. */
export const listMenuSheet = createSheet(listMenuCss);

export { listMenuCss };
