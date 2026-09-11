import { createSheet } from './HarmonyElement.js';
import { linkCss } from '../styles/generated/linkCss.js';

/**
 * Link extras (`.link--muted`, icon inherit) for Shadow DOM hosts.
 * Default unclassed `a` look comes from `typographySheet` (reset).
 */
export const linkSheet = createSheet(linkCss);

export { linkCss };
