import type { Components, Theme } from '@mui/material/styles';
import { elevations, spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

/** Harmony `--radius-xl` (0.75rem / 12px) → radius-12 token. */
const radiusXl = spacing.borderRadius['radius-12'].value;
const space1 = spacing.scale['1'].value;
const space2 = spacing.scale['2'].value;
const space4 = spacing.scale['4'].value;
const space5 = spacing.scale['5'].value;
const space6 = spacing.scale['6'].value;

const shadowSmLight = elevations.shadows.sm.value;
const shadowSmDark = elevations.shadows.sm.valueDark;
const shadowLgLight = elevations.shadows.lg.value;
const shadowLgDark = elevations.shadows.lg.valueDark;

export function mapCardToTheme(
  product: HarmonyProduct,
): Pick<
  Components<Theme>,
  'MuiCard' | 'MuiCardHeader' | 'MuiCardContent' | 'MuiCardActions' | 'MuiCardActionArea'
> {
  void product;

  return {
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: 'var(--mui-palette-background-paper)',
          borderColor: 'var(--mui-palette-divider)',
          borderRadius: radiusXl,
          overflow: 'hidden',
          boxShadow: shadowSmLight,
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
          ...theme.applyStyles('dark', {
            boxShadow: shadowSmDark,
          }),
          variants: [
            {
              props: { raised: true },
              style: {
                boxShadow: shadowLgLight,
                ...theme.applyStyles('dark', {
                  boxShadow: shadowLgDark,
                }),
              },
            },
          ],
          // Interactive: CardActionArea inside Card — match .card--interactive:hover
          '&:has(.MuiCardActionArea-root:hover), &:has(.MuiCardActionArea-root.Mui-focusVisible)': {
            borderColor: 'var(--mui-palette-primary-main)',
            boxShadow: shadowLgLight,
            ...theme.applyStyles('dark', {
              boxShadow: shadowLgDark,
            }),
          },
        }),
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: `${space4} ${space4} 0 ${space4}`,
          alignItems: 'flex-start',
        },
        content: {
          display: 'flex',
          flexDirection: 'column',
          gap: space1,
        },
        title: {
          fontFamily: typography.fontFamilies.display.css,
          fontSize: typography.textStyles.headingS.fontSize,
          fontWeight: typography.fontWeights.normal.value,
          lineHeight: space6,
          color: 'var(--mui-palette-text-primary)',
        },
        subheader: {
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: typography.fontSizes.sm.value,
          fontWeight: typography.fontWeights.normal.value,
          lineHeight: space5,
          color: 'var(--mui-palette-text-secondary)',
        },
        action: {
          margin: 0,
          alignSelf: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          gap: space2,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: space4,
          '&:last-child': {
            paddingBottom: space4,
          },
          // Harmony card body uses text-sm (14px); body1 alone is 16px
          '& > .MuiTypography-body1': {
            fontSize: typography.fontSizes.sm.value,
            fontWeight: typography.fontWeights.normal.value,
            lineHeight: space5,
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: space4,
          borderTop: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
        },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          transition: 'inherit',
          '&:hover .MuiCardActionArea-focusHighlight': {
            opacity: 0,
          },
        },
        focusHighlight: {
          // Suppress default MUI grey wash — Harmony uses border/shadow only
          backgroundColor: 'transparent',
        },
      },
    },
  };
}
