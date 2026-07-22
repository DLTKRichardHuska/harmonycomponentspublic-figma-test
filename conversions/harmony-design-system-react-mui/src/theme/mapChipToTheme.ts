import type { Components, Theme } from '@mui/material/styles';
import { colors, spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

const alertChipDisabled = colors.alertChip.disabled;
const radius04 = spacing.borderRadius['radius-04'].value;

function chipSizeStyles(size: 'sm' | 'md') {
  if (size === 'sm') {
    return {
      height: spacing.scale['4'].value,
      fontSize: '0.625rem',
      lineHeight: spacing.scale['4'].value,
      padding: `${spacing.scale['1'].value} ${spacing.scale['2'].value}`,
      '& .MuiChip-icon': {
        width: spacing.scale['3'].value,
        height: spacing.scale['3'].value,
        marginLeft: spacing.scale['1'].value,
        marginRight: `-${spacing.scale['0.5'].value}`,
      },
      '& .MuiChip-deleteIcon': {
        width: spacing.scale['3'].value,
        height: spacing.scale['3'].value,
        marginRight: spacing.scale['1'].value,
        marginLeft: `-${spacing.scale['0.5'].value}`,
      },
    };
  }
  return {
    height: spacing.scale['6'].value,
    fontSize: typography.fontSizes.sm.value,
    lineHeight: spacing.scale['5'].value,
    padding: `${spacing.scale['1'].value} ${spacing.scale['2'].value}`,
    '& .MuiChip-icon': {
      width: spacing.scale['4'].value,
      height: spacing.scale['4'].value,
      marginLeft: spacing.scale['1'].value,
      marginRight: `-${spacing.scale['0.5'].value}`,
    },
    '& .MuiChip-deleteIcon': {
      width: spacing.scale['4'].value,
      height: spacing.scale['4'].value,
      marginRight: spacing.scale['1'].value,
      marginLeft: `-${spacing.scale['0.5'].value}`,
    },
  };
}

export function mapChipToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiChip'> {
  void product;

  return {
    MuiChip: {
      defaultProps: {
        variant: 'filled',
        color: 'primary',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          fontFamily: typography.fontFamilies.sans.css,
          fontWeight: typography.fontWeights.normal.value,
          borderRadius: radius04,
          gap: spacing.scale['1'].value,
          transition: 'all 150ms ease',
          '&.MuiChip-filledPrimary': {
            backgroundColor: 'var(--mui-palette-primary-main)',
            borderColor: 'var(--mui-palette-primary-main)',
            color: '#FFFFFF',
          },
          '&.MuiChip-outlinedPrimary': {
            backgroundColor: 'transparent',
            borderColor: 'var(--mui-palette-primary-main)',
            color: 'var(--mui-palette-primary-main)',
          },
          '&.MuiChip-clickable': {
            cursor: 'pointer',
            '&.MuiChip-filledPrimary': {
              '&:hover': {
                backgroundColor: 'var(--mui-palette-primary-dark)',
                borderColor: 'var(--mui-palette-primary-dark)',
              },
              '&:focus-visible': {
                outline: '1px solid var(--mui-palette-background-paper)',
                outlineOffset: 0,
                boxShadow: '0 0 0 2px var(--mui-palette-primary-main)',
              },
              '&:active': {
                backgroundColor: 'var(--mui-palette-primary-main)',
                borderColor: 'var(--mui-palette-primary-main)',
              },
            },
            '&.MuiChip-outlinedPrimary': {
              '&:hover': {
                backgroundColor: 'var(--mui-palette-action-hover)',
              },
              '&:focus-visible': {
                backgroundColor: 'var(--mui-palette-action-hover)',
                outline: '1px solid var(--mui-palette-background-paper)',
                outlineOffset: 0,
                boxShadow: '0 0 0 2px var(--mui-palette-primary-main)',
              },
              '&:active': {
                backgroundColor: 'var(--mui-palette-primary-main)',
                borderColor: 'var(--mui-palette-primary-main)',
                color: '#FFFFFF',
              },
            },
          },
          '&.Mui-disabled': {
            opacity: 1,
            '&.MuiChip-filled': {
              backgroundColor: alertChipDisabled.background,
              borderColor: alertChipDisabled.background,
              color: alertChipDisabled.foreground,
            },
            '&.MuiChip-outlined': {
              backgroundColor: 'transparent',
              borderColor: alertChipDisabled.border,
              color: alertChipDisabled.foreground,
            },
          },
          variants: [
            {
              props: { size: 'small' },
              style: chipSizeStyles('sm'),
            },
            {
              props: { size: 'medium' },
              style: chipSizeStyles('md'),
            },
          ],
        },
        label: {
          padding: 0,
        },
        icon: {
          color: 'inherit',
        },
        deleteIcon: {
          color: 'inherit',
          '&:hover': {
            color: 'inherit',
            opacity: 0.8,
          },
        },
      },
    },
  };
}
