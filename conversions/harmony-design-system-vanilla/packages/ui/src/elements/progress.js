import { createSheet } from './HarmonyElement.js';
import { progressCss } from '../styles/generated/progressCss.js';

/**
 * Progress bar recipe as a constructable stylesheet for Shadow DOM hosts
 * that need the same visuals (e.g. composing progress inside another shadow tree).
 */
export const progressSheet = createSheet(progressCss);

export { progressCss };
