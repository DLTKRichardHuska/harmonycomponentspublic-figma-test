import type { Components, Theme } from '@mui/material/styles';
import { buttonGroupClasses } from '@mui/material/ButtonGroup';
import { spacing } from '../tokens';
import type { HarmonyProduct } from '../tokens';
import { getHarmonyPaletteTokens } from './mapColorsToPalette';
import { harmonyButtonSizes } from './buttonTokens';

const radius08 = spacing.borderRadius['radius-08'].value;
const radius06 = spacing.scale['1.5'].value;
const radiusLg = spacing.borderRadius['radius-08'].value;
const space1 = spacing.scale['1'].value;
const space2 = spacing.scale['2'].value;

const grouped = buttonGroupClasses.grouped;
const first = buttonGroupClasses.firstButton;
const middle = buttonGroupClasses.middleButton;
const last = buttonGroupClasses.lastButton;

/** CSS vars that switch with colorSchemes — avoid baking light hex at theme build. */
const css = {
  primary: 'var(--mui-palette-primary-main)',
  primaryHover: 'var(--mui-palette-primary-dark)',
  primaryContrast: 'var(--mui-palette-primary-contrastText)',
  textPrimary: 'var(--mui-palette-text-primary)',
  divider: 'var(--mui-palette-divider)',
  paper: 'var(--mui-palette-background-paper)',
  actionHover: 'var(--mui-palette-action-hover)',
};

function focusRing() {
  return {
    outline: `1px solid ${css.paper}`,
    outlineOffset: 0,
    boxShadow: `0 0 0 3px color-mix(in srgb, ${css.primary} 35%, transparent), 0 0 0 4px ${css.paper}`,
  };
}

function iconOnlySquare(size: 'sm' | 'md' | 'lg') {
  const dim = harmonyButtonSizes[size].minHeight;
  return {
    padding: 0,
    minWidth: dim,
    width: dim,
    height: dim,
  };
}

export function mapButtonGroupToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiButtonGroup'> {
  const light = getHarmonyPaletteTokens(product, 'light');
  const dark = getHarmonyPaletteTokens(product, 'dark');

  return {
    MuiButtonGroup: {
      defaultProps: {
        variant: 'contained',
        size: 'medium',
        orientation: 'horizontal',
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          display: 'inline-flex',
          variants: [
            {
              props: { variant: 'contained' },
              style: {
                border: `1px solid ${light.border}`,
                borderRadius: radius08,
                padding: space1,
                backgroundColor: light.inputBackground,
                gap: space2,
                alignItems: 'center',
                boxShadow: 'none',
                ...theme.applyStyles('dark', {
                  border: `1px solid ${dark.border}`,
                  backgroundColor: dark.inputBackground,
                }),
                [`& .${grouped}`]: {
                  minWidth: 0,
                  margin: 0,
                  border: 'none',
                  boxShadow: 'none',
                  '&:hover': { boxShadow: 'none' },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                    pointerEvents: 'none',
                  },
                },
                // Selected segment — keep primary colors when disabled (opacity only)
                [`& .${grouped}.MuiButton-contained`]: {
                  backgroundColor: css.primary,
                  color: css.primaryContrast,
                  border: 'none',
                  '&:hover': {
                    backgroundColor: css.primaryHover,
                  },
                  '&:focus-visible': focusRing(),
                  '&.Mui-disabled': {
                    backgroundColor: css.primary,
                    color: css.primaryContrast,
                    opacity: 0.5,
                  },
                },
                // Unselected segment inside segmented shell
                [`& .${grouped}.MuiButton-outlined, & .${grouped}.MuiButton-text`]: {
                  backgroundColor: light.inputBackground,
                  color: css.primary,
                  border: 'none',
                  ...theme.applyStyles('dark', {
                    backgroundColor: dark.inputBackground,
                  }),
                  '&:hover': {
                    backgroundColor: `color-mix(in srgb, ${css.primary} 8%, transparent)`,
                    border: 'none',
                  },
                  '&:focus-visible': focusRing(),
                  '&.Mui-disabled': {
                    backgroundColor: light.inputBackground,
                    color: css.primary,
                    opacity: 0.5,
                    ...theme.applyStyles('dark', {
                      backgroundColor: dark.inputBackground,
                    }),
                  },
                },
                // Icon-only: direct HarmonyIcon / SvgIcon child (not startIcon)
                [`& .${grouped}.MuiButton-root:has(> .MuiSvgIcon-root:only-child)`]: {
                  ...iconOnlySquare('md'),
                },
                [`& .${grouped}.MuiIconButton-root`]: {
                  padding: 0,
                },
              },
            },
            {
              props: { variant: 'contained', size: 'small' },
              style: {
                [`& .${grouped}.MuiButton-root:has(> .MuiSvgIcon-root:only-child)`]:
                  iconOnlySquare('sm'),
              },
            },
            {
              props: { variant: 'contained', size: 'medium' },
              style: {
                [`& .${grouped}.MuiButton-root:has(> .MuiSvgIcon-root:only-child)`]:
                  iconOnlySquare('md'),
              },
            },
            {
              props: { variant: 'contained', size: 'large' },
              style: {
                [`& .${grouped}.MuiButton-root:has(> .MuiSvgIcon-root:only-child)`]:
                  iconOnlySquare('lg'),
              },
            },
            {
              props: { variant: 'contained', orientation: 'horizontal' },
              style: {
                flexDirection: 'row',
                [`& .${first}, & .${middle}`]: {
                  borderRight: 'none',
                },
                [`& .${last}, & .${middle}`]: {
                  marginLeft: 0,
                },
                [`& .${first}.MuiButton-contained`]: {
                  borderRadius: `${radius08} ${radius06} ${radius06} ${radius08}`,
                },
                [`& .${middle}.MuiButton-contained`]: {
                  borderRadius: radius06,
                },
                [`& .${last}.MuiButton-contained`]: {
                  borderRadius: `${radius06} ${radius08} ${radius08} ${radius06}`,
                },
                [`& .${first}:not(.MuiButton-contained)`]: {
                  borderRadius: `${radius08} 0 0 ${radius08}`,
                },
                [`& .${middle}:not(.MuiButton-contained)`]: {
                  borderRadius: 0,
                },
                [`& .${last}:not(.MuiButton-contained)`]: {
                  borderRadius: `0 ${radius08} ${radius08} 0`,
                },
              },
            },
            {
              props: { variant: 'contained', orientation: 'vertical' },
              style: {
                flexDirection: 'column',
                gap: 0,
                [`& .${grouped}`]: {
                  width: '100%',
                },
                [`& .${first}, & .${middle}`]: {
                  borderBottom: 'none',
                },
                [`& .${last}, & .${middle}`]: {
                  marginTop: 0,
                },
                [`& .${first}.MuiButton-contained`]: {
                  borderRadius: `${radius08} ${radius08} ${radius06} ${radius06}`,
                },
                [`& .${middle}.MuiButton-contained`]: {
                  borderRadius: radius06,
                },
                [`& .${last}.MuiButton-contained`]: {
                  borderRadius: `${radius06} ${radius06} ${radius08} ${radius08}`,
                },
                [`& .${first}:not(.MuiButton-contained)`]: {
                  borderRadius: `${radius08} ${radius08} 0 0`,
                },
                [`& .${middle}:not(.MuiButton-contained)`]: {
                  borderRadius: 0,
                },
                [`& .${last}:not(.MuiButton-contained)`]: {
                  borderRadius: `0 0 ${radius08} ${radius08}`,
                },
              },
            },
            {
              props: { variant: 'outlined' },
              style: {
                border: 'none',
                padding: 0,
                backgroundColor: 'transparent',
                boxShadow: 'none',
                gap: 0,
                [`& .${grouped}`]: {
                  borderRadius: 0,
                },
                // Harmony outline strip: transparent fill + text-primary labels
                [`& .${grouped}.MuiButton-outlined, & .${grouped}.MuiButton-text, & .${grouped}.MuiButton-contained`]:
                  {
                    backgroundColor: 'transparent',
                    color: css.textPrimary,
                    borderColor: css.divider,
                    '&:hover': {
                      backgroundColor: css.actionHover,
                      borderColor: css.divider,
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'transparent',
                      color: css.textPrimary,
                      borderColor: css.divider,
                      opacity: 0.5,
                    },
                  },
                [`& .${first}`]: {
                  borderTopLeftRadius: radiusLg,
                  borderBottomLeftRadius: radiusLg,
                },
                [`& .${last}`]: {
                  borderTopRightRadius: radiusLg,
                  borderBottomRightRadius: radiusLg,
                },
                [`&.${buttonGroupClasses.vertical} .${first}`]: {
                  borderTopLeftRadius: radiusLg,
                  borderTopRightRadius: radiusLg,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
                [`&.${buttonGroupClasses.vertical} .${last}`]: {
                  borderBottomLeftRadius: radiusLg,
                  borderBottomRightRadius: radiusLg,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                },
              },
            },
            {
              props: { variant: 'outlined', orientation: 'horizontal' },
              style: {
                [`& .${first}, & .${middle}`]: {
                  borderRightColor: 'transparent',
                  '&:hover': {
                    borderRightColor: 'transparent',
                  },
                },
                [`& .${last}, & .${middle}`]: {
                  marginLeft: -1,
                },
              },
            },
            {
              props: { variant: 'outlined', orientation: 'vertical' },
              style: {
                [`& .${first}, & .${middle}`]: {
                  borderBottomColor: 'transparent',
                  '&:hover': {
                    borderBottomColor: 'transparent',
                  },
                },
                [`& .${last}, & .${middle}`]: {
                  marginTop: -1,
                },
              },
            },
          ],
          '@media (max-width: 768px)': {
            [`&.${buttonGroupClasses.horizontal}`]: {
              flexDirection: 'column',
              width: '100%',
            },
            [`&.${buttonGroupClasses.horizontal}.${buttonGroupClasses.contained}`]: {
              gap: space2,
              [`& .${grouped}`]: {
                width: '100%',
                marginLeft: 0,
                borderRadius: radiusLg,
              },
            },
            [`&.${buttonGroupClasses.horizontal}.${buttonGroupClasses.outlined}`]: {
              gap: space2,
              [`& .${grouped}`]: {
                width: '100%',
                marginLeft: 0,
                borderRadius: radiusLg,
                borderRightColor: css.divider,
              },
              [`& .${first}, & .${last}, & .${middle}`]: {
                borderRadius: radiusLg,
              },
            },
          },
        }),
      },
    },
  };
}
