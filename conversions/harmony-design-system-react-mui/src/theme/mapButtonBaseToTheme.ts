import type { Components, Theme } from '@mui/material/styles';
import type { HarmonyProduct } from '../tokens';

/** Soft double ring matching Harmony `--focus-ring-primary` (primary tint + paper hairline). */
function softFocusRing() {
  return {
    outline: 'none',
    outlineOffset: 0,
    boxShadow:
      '0 0 0 3px color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent), 0 0 0 4px var(--mui-palette-background-paper)',
  };
}

/**
 * Baseline focus-visible for bare `ButtonBase` (and composites that wrap it directly,
 * e.g. interactive Avatar). Higher-level MUI components (Button, IconButton, …) keep
 * their own focus treatments via their component theme slots (clear outline + boxShadow).
 */
export function mapButtonBaseToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiButtonBase'> {
  void product;

  return {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': softFocusRing(),
        },
      },
    },
  };
}
