import type { Components, Theme } from '@mui/material/styles';
import { spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

const gap = spacing.scale['2'].value;
const padY = spacing.scale['2'].value;
const padX = spacing.scale['3'].value;
/** Harmony `--radius-md` (0.375rem / 6px). */
const radiusMd = spacing.scale['1.5'].value;

export function mapTooltipToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiTooltip'> {
  void product;

  return {
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        placement: 'top',
        enterDelay: 0,
        leaveDelay: 0,
        enterTouchDelay: 0,
      },
      styleOverrides: {
        tooltip: {
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: typography.fontSizes.xs.value,
          fontWeight: typography.fontWeights.normal.value,
          lineHeight: 1.4,
          padding: `${padY} ${padX}`,
          borderRadius: radiusMd,
          whiteSpace: 'nowrap',
          maxWidth: 'none',
          boxShadow: 'none',
          // CSS vars so light/dark colorSchemes invert correctly
          backgroundColor: 'var(--mui-palette-text-primary)',
          color: 'var(--mui-palette-primary-contrastText)',
        },
        arrow: {
          color: 'var(--mui-palette-text-primary)',
        },
        tooltipPlacementTop: {
          marginBottom: `${gap} !important`,
        },
        tooltipPlacementBottom: {
          marginTop: `${gap} !important`,
        },
        tooltipPlacementLeft: {
          marginRight: `${gap} !important`,
        },
        tooltipPlacementRight: {
          marginLeft: `${gap} !important`,
        },
      },
    },
  };
}
