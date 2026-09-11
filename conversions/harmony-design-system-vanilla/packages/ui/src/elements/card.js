import { createSheet } from './HarmonyElement.js';
import { cardCss } from '../styles/generated/cardCss.js';

/**
 * Card BEM recipe as a constructable stylesheet for Shadow DOM hosts.
 *
 * Document `styles.css` already includes this layer for light DOM. Adopt
 * `cardSheet` inside Custom Elements so `.card` look works in the shadow tree.
 *
 * ```js
 * class MyPanel extends HarmonyElement {
 *   static styles = [typographySheet, cardSheet, ownSheet];
 * }
 * ```
 */
export const cardSheet = createSheet(cardCss);

export { cardCss };
