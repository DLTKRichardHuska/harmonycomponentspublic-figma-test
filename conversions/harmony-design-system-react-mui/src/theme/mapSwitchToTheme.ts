import type { Components, Theme } from '@mui/material/styles';
import { elevations, spacing } from '../tokens';
import type { HarmonyProduct } from '../tokens';

const trackMdW = spacing.scale['11'].value; // 44px
const trackMdH = spacing.scale['6'].value; // 24px
const thumbMd = spacing.scale['5'].value; // 20px
const trackSmW = spacing.scale['9'].value; // 36px
const trackSmH = spacing.scale['5'].value; // 20px
const thumbSm = spacing.scale['4'].value; // 16px
const pad = spacing.scale['0.5'].value; // 2px
const shadowSm = elevations.shadows.sm.value;

function softFocusRing() {
  return {
    outline: 'none',
    boxShadow: `0 0 0 3px color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent), 0 0 0 4px var(--mui-palette-background-paper)`,
  };
}

/**
 * Theme map for `@mui/material/Switch` — Harmony default toggle track/thumb sizes.
 * Segmented variant is skipped (no MUI equivalent).
 * FormControlLabel chrome stays in {@link mapSelectionControlChromeToTheme}.
 */
export function mapSwitchToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiSwitch'> {
  void product;

  return {
    MuiSwitch: {
      defaultProps: {
        color: 'primary',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          width: trackMdW,
          height: trackMdH,
          padding: 0,
          overflow: 'visible',
          variants: [
            {
              props: { size: 'small' },
              style: {
                width: trackSmW,
                height: trackSmH,
                '& .MuiSwitch-switchBase': {
                  padding: pad,
                  '&.Mui-checked': {
                    transform: `translateX(calc(${trackSmW} - ${thumbSm} - ${pad} * 2))`,
                  },
                },
                '& .MuiSwitch-thumb': {
                  width: thumbSm,
                  height: thumbSm,
                },
              },
            },
          ],
        },
        switchBase: {
          padding: pad,
          color: '#fff',
          '&.Mui-checked': {
            transform: `translateX(calc(${trackMdW} - ${thumbMd} - ${pad} * 2))`,
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: 'var(--mui-palette-primary-main)',
              opacity: 1,
            },
          },
          '&.Mui-focusVisible + .MuiSwitch-track, &:focus-visible + .MuiSwitch-track': softFocusRing(),
          '&.Mui-disabled': {
            color: '#fff',
            '& + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-disabled.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'var(--mui-palette-primary-main)',
            opacity: 0.5,
          },
        },
        thumb: {
          width: thumbMd,
          height: thumbMd,
          boxShadow: shadowSm,
          backgroundColor: '#fff',
        },
        track: {
          borderRadius: spacing.borderRadius['radius-100'].value,
          backgroundColor: 'var(--mui-palette-divider)',
          opacity: 1,
          transition: 'background-color 150ms ease',
        },
      },
    },
  };
}
