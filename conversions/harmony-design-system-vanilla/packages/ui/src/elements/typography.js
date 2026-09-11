import { createSheet } from './HarmonyElement.js';
import { typographyCss } from '../styles/generated/typographyCss.js';

/**
 * Harmony reset + typography (element defaults + `.text-*` classes) as a
 * constructable stylesheet.
 *
 * Document CSS does not pierce Shadow DOM, so adopt this in a Custom Element to
 * get the same reset, tag defaults, and classes inside its shadow root:
 *
 * ```js
 * class MyPanel extends HarmonyElement {
 *   static styles = [typographySheet, ownSheet];
 * }
 * ```
 *
 * List it first so element styles can override it.
 */
export const typographySheet = createSheet(typographyCss);

export { typographyCss };
