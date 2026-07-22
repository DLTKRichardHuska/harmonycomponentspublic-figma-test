import type { Components, Theme } from '@mui/material/styles';
import { spacing } from '../tokens';
import type { HarmonyProduct } from '../tokens';

const thumbSize = spacing.scale['5'].value; // 20px
const trackHeight = '6px';

/**
 * Harmony RangeInput → MUI Slider (track / thumb / rail).
 */
export function mapSliderToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiSlider'> {
  void product;

  return {
    MuiSlider: {
      defaultProps: {
        color: 'primary',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          height: thumbSize,
          padding: `${spacing.scale['1.5'].value} 0`,
          '&.Mui-disabled': {
            opacity: 0.5,
          },
        },
        rail: {
          height: trackHeight,
          borderRadius: 9999,
          backgroundColor: 'var(--mui-palette-divider)',
          opacity: 1,
        },
        // Reference fill (min → thumb) uses theme primary; remainder stays border/divider.
        track: {
          height: trackHeight,
          borderRadius: 9999,
          border: 'none',
          backgroundColor: 'var(--mui-palette-primary-main)',
        },
        thumb: {
          width: thumbSize,
          height: thumbSize,
          backgroundColor: 'var(--mui-palette-primary-main)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
          '&:hover, &.Mui-focusVisible': {
            boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
            outline: 'none',
          },
          '&.Mui-active': {
            boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  };
}
