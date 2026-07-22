/**
 * Maps Harmony named text styles to standard MUI Typography variant names.
 * Consumers should use MUI variants (h1, body1, etc.) with createHarmonyTheme().
 */
export const HARMONY_TYPOGRAPHY_MAP = {
  displayXL: 'h1',
  displayL: 'h2',
  displayM: 'h3',
  headingXL: 'h4',
  headingL: 'h5',
  headingM: 'h6',
  headingS: 'subtitle1',
  bodyDefault: 'body1',
  bodyEmphasized: 'body2',
  label: 'subtitle2',
  caption: 'caption',
  overline: 'overline',
} as const;

export type HarmonyTextStyleKey = keyof typeof HARMONY_TYPOGRAPHY_MAP;
export type MuiTypographyVariant = (typeof HARMONY_TYPOGRAPHY_MAP)[HarmonyTextStyleKey];
