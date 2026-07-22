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
 * Theme map for `@mui/material/Checkbox`.
 * Hover/ripple left as default MUI (user decision 2026-07-14).
 * Validation face colors inherit from parent FormControl via
 * {@link mapSelectionControlChromeToTheme}.
 */
export function mapCheckboxToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiCheckbox'> {
  void product;

  return {
    MuiCheckbox: {
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
          '&.Mui-disabled, &.MuiCheckbox-colorPrimary.Mui-disabled, &.MuiCheckbox-colorSecondary.Mui-disabled':
            {
              opacity: 0.5,
              color: 'var(--mui-palette-divider)',
            },
          '&.Mui-disabled.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-disabled.Mui-checked': {
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
