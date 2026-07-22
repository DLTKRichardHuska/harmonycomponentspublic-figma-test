import type { Components, Theme } from '@mui/material/styles';
import { spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

/** Harmony `--radius-lg` → radius-08. */
const radiusLg = spacing.borderRadius['radius-08'].value;
const space4 = spacing.scale['4'].value;
const space3 = spacing.scale['3'].value;

/**
 * Theme map for `@mui/material/Accordion` family — bordered card surface,
 * summary hover/focus grey, chevron rotation via MUI expandIcon.
 */
export function mapAccordionToTheme(
  product: HarmonyProduct,
): Pick<
  Components<Theme>,
  'MuiAccordion' | 'MuiAccordionSummary' | 'MuiAccordionDetails'
> {
  void product;

  return {
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'var(--mui-palette-background-paper)',
          border: '1px solid var(--mui-palette-divider)',
          borderBottom: 'none',
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          '&:first-of-type': {
            borderTopLeftRadius: radiusLg,
            borderTopRightRadius: radiusLg,
          },
          '&:last-of-type': {
            borderBottomLeftRadius: radiusLg,
            borderBottomRightRadius: radiusLg,
            borderBottom: '1px solid var(--mui-palette-divider)',
          },
          '&.Mui-disabled': {
            backgroundColor: 'var(--mui-palette-background-paper)',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: 'unset',
          padding: space4,
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: typography.fontSizes.sm.value,
          fontWeight: typography.fontWeights.medium.value,
          color: 'var(--mui-palette-text-primary)',
          transition: 'background-color 150ms ease',
          '&:hover': {
            backgroundColor: 'var(--mui-palette-action-hover)',
          },
          '&.Mui-focusVisible': {
            backgroundColor: 'var(--mui-palette-action-hover)',
          },
          '&.Mui-disabled': {
            opacity: 0.65,
            color: 'var(--mui-palette-text-disabled)',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },
          '@media (max-width: 768px)': {
            padding: `${space3} ${space3}`,
          },
        },
        content: {
          margin: 0,
          '&.Mui-expanded': {
            margin: 0,
          },
        },
        expandIconWrapper: {
          color: 'var(--mui-palette-text-secondary)',
          '&.Mui-expanded': {
            transform: 'rotate(180deg)',
          },
          '.Mui-disabled &': {
            color: 'var(--mui-palette-text-disabled)',
            opacity: 0.8,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: space4,
          fontSize: typography.fontSizes.sm.value,
          color: 'var(--mui-palette-text-secondary)',
          '@media (max-width: 768px)': {
            padding: space3,
          },
        },
      },
    },
  };
}
