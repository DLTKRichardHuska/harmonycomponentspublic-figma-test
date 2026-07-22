import type { Components, Theme } from '@mui/material/styles';
import type { HarmonyProduct } from '../tokens';

/**
 * Visual SVG sizes — bumped vs reference CSS boxes so MUI icons read the same
 * visual weight as Harmony faces (user tweak 2026-07-14).
 */
const selectionIconPx = {
  small: 16,
  medium: 22,
  large: 26,
} as const;

/** Compact hit padding to match denser Harmony layouts (was MUI default 9). */
const selectionControlPadding = 4;

/**
 * Theme map for `@mui/material/Radio`.
 * Hover/ripple left as default MUI (user decision 2026-07-14).
 * Harmony `size="large"` → MUI `size="large"` via theme variants.
 * Validation face colors inherit from parent FormControl via
 * {@link mapSelectionControlChromeToTheme}.
 */
export function mapRadioToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiRadio'> {
  void product;

  return {
    MuiRadio: {
      defaultProps: {
        color: 'primary',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          padding: selectionControlPadding,
          // Harmony unchecked face uses border color (not MUI action gray)
          color: 'var(--mui-palette-divider)',
          '&.Mui-checked': {
            color: 'var(--mui-palette-primary-main)',
          },
          // Keep MUI default :hover / ripple — do not override hover opacity
          // Disabled: border face + 50% opacity (Harmony) — beat MUI color* + action.disabled
          '&.Mui-disabled, &.MuiRadio-colorPrimary.Mui-disabled, &.MuiRadio-colorSecondary.Mui-disabled':
            {
              opacity: 0.5,
              color: 'var(--mui-palette-divider)',
            },
          '&.Mui-disabled.Mui-checked, &.MuiRadio-colorPrimary.Mui-disabled.Mui-checked': {
            color: 'var(--mui-palette-primary-main)',
          },
          variants: [
            {
              props: { size: 'small' },
              style: {
                '& .MuiSvgIcon-root': {
                  fontSize: selectionIconPx.small,
                },
              },
            },
            {
              props: { size: 'medium' },
              style: {
                '& .MuiSvgIcon-root': {
                  fontSize: selectionIconPx.medium,
                },
              },
            },
            {
              props: { size: 'large' },
              style: {
                '& .MuiSvgIcon-root': {
                  fontSize: selectionIconPx.large,
                },
              },
            },
          ],
        },
      },
    },
  };
}
