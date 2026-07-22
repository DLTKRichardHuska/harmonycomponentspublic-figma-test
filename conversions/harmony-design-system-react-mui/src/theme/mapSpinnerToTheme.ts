import type { Components, Theme } from '@mui/material/styles';
import { spacing } from '../tokens';
import type { HarmonyProduct } from '../tokens';

/** Harmony md spinner — 24×24 (`--space-6`). */
const defaultSize = Number.parseInt(spacing.scale['6'].value, 10);

export function mapSpinnerToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiCircularProgress'> {
  void product;

  return {
    MuiCircularProgress: {
      defaultProps: {
        variant: 'indeterminate',
        color: 'primary',
        size: defaultSize,
        enableTrackSlot: true,
        thickness: 3.5,
      },
      styleOverrides: {
        root: {
          display: 'inline-flex',
        },
        track: {
          color: 'var(--mui-palette-divider)',
          opacity: 1,
        },
      },
    },
  };
}
