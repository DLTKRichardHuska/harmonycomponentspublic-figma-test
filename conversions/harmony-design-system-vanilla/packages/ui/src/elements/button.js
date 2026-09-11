import { createSheet } from './HarmonyElement.js';
import { buttonCss } from '../styles/generated/buttonCss.js';

/**
 * Button recipe (defaults on button / button-type inputs + `.btn` opt-in) as a
 * constructable stylesheet for Shadow DOM hosts.
 *
 * Document `styles.css` already includes this layer for light DOM. Adopt
 * `buttonSheet` inside Custom Elements so `.btn` / native button look works
 * in the shadow tree.
 *
 * ```js
 * class MyPanel extends HarmonyElement {
 *   static styles = [typographySheet, buttonSheet, ownSheet];
 * }
 * ```
 */
export const buttonSheet = createSheet(buttonCss);

export { buttonCss };
