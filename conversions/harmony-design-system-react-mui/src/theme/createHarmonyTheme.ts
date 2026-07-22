import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { HarmonyProduct } from '../tokens';
import { DELA_GRADIENT, DELA_GRADIENT_HOVER } from './buttonTokens';
import { mapFoundationTokens } from './mapFoundationTokens';
import './themeAugmentation';

export type { HarmonyProduct };

export interface CreateHarmonyThemeOptions {
  product?: HarmonyProduct;
}

/** Shared Dela surface — also used to populate `theme.dela`. */
export const HARMONY_DELA = {
  gradient: DELA_GRADIENT,
  gradientHover: DELA_GRADIENT_HOVER,
  contrastText: '#FFFFFF',
} as const;

/**
 * Creates a Harmony MUI theme with light + dark colorSchemes and CSS variables.
 * Product selects CP / VP / PPM / Maconomy palette tokens.
 */
export function createHarmonyTheme(options: CreateHarmonyThemeOptions = {}): Theme {
  const product = options.product ?? 'cp';
  const foundation = mapFoundationTokens(product);

  return createTheme({
    cssVariables: {
      colorSchemeSelector: 'class',
    },
    typography: foundation.typography,
    spacing: foundation.spacing,
    shape: foundation.shape,
    shadows: foundation.shadows,
    colorSchemes: foundation.colorSchemes,
    components: foundation.components,
    dela: { ...HARMONY_DELA },
  });
}

export type HarmonyTheme = ReturnType<typeof createHarmonyTheme>;
