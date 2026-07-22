import type { Components, Theme } from '@mui/material/styles';
import { spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

const textSm = typography.fontSizes.sm.value;
const gap15 = spacing.scale['1.5'].value;

/**
 * Harmony form labels (external FormLabel / InputLabel above or beside fields).
 * Applied after selection-control chrome so field labels match reference `.label`.
 */
export function mapFormLabelToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiFormLabel' | 'MuiInputLabel'> {
  void product;

  const labelRoot = {
    fontFamily: typography.fontFamilies.display.css,
    fontSize: textSm,
    fontWeight: typography.fontWeights.normal.value,
    lineHeight: spacing.scale['5'].value,
    color: 'var(--mui-palette-text-primary)',
    marginBottom: gap15,
    '&.Mui-focused': {
      color: 'var(--mui-palette-text-primary)',
    },
    '&.Mui-error': {
      color: 'var(--mui-palette-text-primary)',
    },
    '&.Mui-disabled': {
      color: 'var(--mui-palette-text-disabled)',
    },
    '&.Mui-required:not(.MuiFormLabel-asterisk) .MuiFormLabel-asterisk, & .MuiFormLabel-asterisk': {
      color: 'var(--mui-palette-error-main)',
    },
  };

  return {
    MuiFormLabel: {
      styleOverrides: {
        root: labelRoot,
        asterisk: {
          color: 'var(--mui-palette-error-main)',
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
      styleOverrides: {
        root: {
          ...labelRoot,
          position: 'relative',
          transform: 'none',
          transition: 'none',
        },
        shrink: {
          transform: 'none',
        },
        outlined: {
          transform: 'none',
          '&.MuiInputLabel-shrink': {
            transform: 'none',
          },
        },
        asterisk: {
          color: 'var(--mui-palette-error-main)',
        },
      },
    },
  };
}
