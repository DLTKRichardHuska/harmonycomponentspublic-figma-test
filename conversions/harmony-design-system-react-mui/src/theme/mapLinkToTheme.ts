import type { Components, Theme } from '@mui/material/styles';
import { colors, spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

function linkColorForMode(product: HarmonyProduct, mode: 'light' | 'dark') {
  return colors.themes[product].palette[mode].link;
}

function mutedColorForMode(product: HarmonyProduct, mode: 'light' | 'dark') {
  return colors.themes[product].palette[mode].mutedText;
}

export function mapLinkToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiLink'> {
  const normal = typography.fontWeights.normal.value;
  const externalIconGap = spacing.scale['1'].value;

  return {
    MuiLink: {
      defaultProps: {
        underline: 'hover',
        variant: 'subtitle2',
      },
      styleOverrides: {
        root: {
          fontWeight: normal,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
          '& [data-icon]': {
            display: 'inline-flex',
            verticalAlign: 'middle',
            marginLeft: externalIconGap,
          },
          variants: [
            {
              props: { color: 'primary' },
              style: ({ theme }: { theme: Theme }) => ({
                color: linkColorForMode(product, theme.palette.mode),
              }),
            },
            {
              props: { color: 'textSecondary' },
              style: ({ theme }: { theme: Theme }) => ({
                color: mutedColorForMode(product, theme.palette.mode),
                '&:hover': {
                  color: theme.palette.text.primary,
                },
              }),
            },
          ],
        },
      },
    },
  };
}
