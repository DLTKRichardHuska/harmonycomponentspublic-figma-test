import type { Components, Theme } from '@mui/material/styles';
import { colors, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';
import { getButtonDisabledColors, harmonyButtonSizes, harmonyIconButtonSizes } from './buttonTokens';

type ButtonSizeToken = 'sm' | 'md' | 'lg';

function buttonSizeStyles(size: ButtonSizeToken) {
  const token = harmonyButtonSizes[size];
  return {
    minHeight: token.minHeight,
    padding: `${token.paddingY} ${token.paddingX}`,
    fontSize: token.fontSize,
    lineHeight: 1.5,
  };
}

/**
 * Padding-around-icon sizing: set the icon size via `fontSize` (icons inside use
 * `fontSize="inherit"`) and equal padding on all sides. The box collapses to
 * `iconSize + 2 * padding`, so no fixed width/height is needed.
 */
function iconButtonSizeStyles(size: ButtonSizeToken) {
  const token = harmonyIconButtonSizes[size];
  return {
    fontSize: token.iconSize,
    padding: token.padding,
  };
}

export function mapButtonToTheme(product: HarmonyProduct): Pick<Components<Theme>, 'MuiButton' | 'MuiIconButton'> {
  void product;
  const disabled = getButtonDisabledColors();
  const phb = colors.pageHeaderButton;

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained',
        color: 'primary',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: typography.fontWeights.medium.value,
          textTransform: 'none',
          boxShadow: 'none',
          gap: 8,
          '&:hover': { boxShadow: 'none' },
          // Prefer component focus treatment over global MuiButtonBase soft ring.
          '&.Mui-focusVisible': {
            outline: 'none',
            outlineOffset: 0,
            boxShadow: 'none',
          },
          variants: [
            { props: { size: 'small' }, style: buttonSizeStyles('sm') },
            { props: { size: 'medium' }, style: buttonSizeStyles('md') },
            { props: { size: 'large' }, style: buttonSizeStyles('lg') },
            {
              props: { variant: 'outlined', color: 'primary' },
              style: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: disabled.secondaryHoverBackground,
                },
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.background.paper,
                  color: disabled.secondaryForeground,
                  borderColor: disabled.secondaryForeground,
                  opacity: 0.5,
                },
              }),
            },
            {
              props: { variant: 'contained', color: 'primary' },
              style: {
                '&.Mui-disabled': {
                  backgroundColor: disabled.primaryBackground,
                  color: disabled.primaryForeground,
                  opacity: 1,
                },
              },
            },
            {
              props: { variant: 'text', color: 'primary' },
              style: {
                '&:hover': {
                  backgroundColor: disabled.tertiaryHoverBackground,
                },
                '&.Mui-disabled': {
                  color: disabled.tertiaryForeground,
                  opacity: 1,
                },
              },
            },
            {
              props: { variant: 'contained', color: 'error' },
              style: {
                '&:hover': {
                  filter: 'brightness(0.9)',
                },
              },
            },
            {
              props: { variant: 'outlined', color: 'pageHeader' },
              style: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                color:
                  theme.palette.mode === 'dark'
                    ? phb.secondary.default.foreground.dark
                    : phb.secondary.default.foreground.light,
                borderColor:
                  theme.palette.mode === 'dark'
                    ? phb.secondary.default.stroke.dark
                    : phb.secondary.default.stroke.light,
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? phb.secondary.hover.background.dark
                      : phb.secondary.hover.background.light,
                  color:
                    theme.palette.mode === 'dark'
                      ? phb.secondary.hover.foreground.dark
                      : phb.secondary.hover.foreground.light,
                  borderColor:
                    theme.palette.mode === 'dark'
                      ? phb.secondary.hover.stroke.dark
                      : phb.secondary.hover.stroke.light,
                },
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.background.paper,
                  color: phb.secondary.disabled.foreground,
                  borderColor: phb.secondary.disabled.foreground,
                  opacity: 1,
                },
              }),
            },
            {
              props: { variant: 'text', color: 'pageHeader' },
              style: ({ theme }) => ({
                color:
                  theme.palette.mode === 'dark'
                    ? phb.tertiary.default.foreground.dark
                    : phb.tertiary.default.foreground.light,
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? phb.tertiary.hover.background.dark
                      : phb.tertiary.hover.background.light,
                },
                '&.Mui-disabled': {
                  color: phb.tertiary.disabled.foreground,
                  opacity: 1,
                },
              }),
            },
            {
              props: { variant: 'contained', color: 'pageHeader' },
              style: {
                '&.Mui-disabled': {
                  backgroundColor: phb.primary.disabled.background,
                  color: phb.primary.disabled.foreground,
                  opacity: 1,
                },
              },
            },
          ],
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          '&.Mui-focusVisible': {
            outline: 'none',
            outlineOffset: 0,
            boxShadow: 'none',
          },
          variants: [
            { props: { size: 'small' }, style: iconButtonSizeStyles('sm') },
            { props: { size: 'medium' }, style: iconButtonSizeStyles('md') },
            { props: { size: 'large' }, style: iconButtonSizeStyles('lg') },
            // `edge` aligns the icon's edge (not the padded box) with the
            // container edge by negating the known per-size padding. This
            // overrides MUI's fixed -12px / -3px edge defaults.
            { props: { size: 'small', edge: 'start' }, style: { marginLeft: -harmonyIconButtonSizes.sm.padding } },
            { props: { size: 'small', edge: 'end' }, style: { marginRight: -harmonyIconButtonSizes.sm.padding } },
            { props: { size: 'medium', edge: 'start' }, style: { marginLeft: -harmonyIconButtonSizes.md.padding } },
            { props: { size: 'medium', edge: 'end' }, style: { marginRight: -harmonyIconButtonSizes.md.padding } },
            { props: { size: 'large', edge: 'start' }, style: { marginLeft: -harmonyIconButtonSizes.lg.padding } },
            { props: { size: 'large', edge: 'end' }, style: { marginRight: -harmonyIconButtonSizes.lg.padding } },
          ],
        },
      },
    },
  };
}
