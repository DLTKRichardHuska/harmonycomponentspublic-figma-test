import type { Components, Theme } from '@mui/material/styles';
import { spacing } from '../tokens';
import type { HarmonyProduct } from '../tokens';

type ProgressColor = 'primary' | 'success' | 'warning' | 'error';

const defaultHeight = spacing.scale['2'].value;

function barColorStyle(theme: Theme, color: ProgressColor) {
  return {
    '& .MuiLinearProgress-bar': {
      backgroundColor: theme.palette[color].main,
    },
  };
}

export function mapProgressBarToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiLinearProgress'> {
  void product;

  const colorVariants: ProgressColor[] = ['primary', 'success', 'warning', 'error'];

  return {
    MuiLinearProgress: {
      defaultProps: {
        variant: 'determinate',
        color: 'primary',
      },
      styleOverrides: {
        root: {
          width: '100%',
          height: defaultHeight,
          borderRadius: 9999,
          overflow: 'hidden',
          backgroundColor: 'var(--mui-palette-divider)',
          variants: colorVariants.map((color) => ({
            props: { color },
            style: ({ theme }: { theme: Theme }) => barColorStyle(theme, color),
          })),
        },
        bar: {
          borderRadius: 9999,
          transition: 'width 300ms ease',
        },
      },
    },
  };
}
