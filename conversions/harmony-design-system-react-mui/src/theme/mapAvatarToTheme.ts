import type { Components, Theme } from '@mui/material/styles';
import { spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

const sizeMd = spacing.scale['8'].value;
const radiusMd = spacing.borderRadius['radius-08'].value;
const fontSemibold = typography.fontWeights.semibold.value;

export function mapAvatarToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiAvatar'> {
  void product;

  return {
    MuiAvatar: {
      defaultProps: {
        variant: 'rounded',
      },
      styleOverrides: {
        root: {
          width: sizeMd,
          height: sizeMd,
          fontFamily: typography.fontFamilies.sans.css,
          fontWeight: fontSemibold,
          fontSize: typography.fontSizes.xs.value,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          backgroundColor: 'var(--mui-palette-primary-main)',
          // Reference `.avatar` uses white glyphs in light and dark (not primary.contrastText).
          color: '#FFFFFF',
          transition: 'background-color 150ms ease',
          '& .MuiSvgIcon-root, & svg': {
            color: 'inherit',
          },
          // Interactive composite: ButtonBase wraps Avatar (MUI Avatar-upload pattern).
          '.MuiButtonBase-root:hover:not(.Mui-disabled) > &': {
            backgroundColor: 'var(--mui-palette-primary-dark)',
          },
          // Disabled interactive Avatar ~50% opacity (reference button.avatar:disabled)
          '.MuiButtonBase-root.Mui-disabled > &': {
            opacity: 0.5,
          },
        },
        rounded: {
          borderRadius: radiusMd,
        },
        img: {
          objectFit: 'cover',
        },
      },
    },
  };
}
