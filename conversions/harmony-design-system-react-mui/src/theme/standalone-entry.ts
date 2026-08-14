/**
 * Standalone bundle entry — no fonts side-effect.
 * Used only by `npm run build:standalone`; not the published `./theme` entry.
 */
export { createHarmonyTheme, HARMONY_DELA } from './createHarmonyTheme';
export type { CreateHarmonyThemeOptions, HarmonyProduct, HarmonyTheme } from './createHarmonyTheme';
