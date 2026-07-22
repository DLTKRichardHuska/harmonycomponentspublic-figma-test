import type { Components, Theme } from '@mui/material/styles';
import { spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

const sansFont = typography.fontFamilies.sans.css;
const textSm = typography.fontSizes.sm.value;
const weightMedium = typography.fontWeights.medium.value;
const space3 = spacing.scale['3'].value;
const space4 = spacing.scale['4'].value;
const indicatorHeight = spacing.scale['0.5'].value; // 2px thick bottom border

/**
 * Theme map for `@mui/material/Tabs` + `Tab` — Harmony TabStrip default variant.
 * Underline indicator + secondary label that turns primary on select/hover.
 * Compact/pill variants and browser-tab chrome are skipped per manifest gaps.
 */
export function mapTabsToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiTabs' | 'MuiTab'> {
  void product;

  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 'unset',
          borderBottom: '1px solid var(--mui-palette-divider)',
        },
        indicator: {
          height: indicatorHeight,
          backgroundColor: 'var(--mui-palette-primary-main)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: sansFont,
          fontSize: textSm,
          fontWeight: weightMedium,
          color: 'var(--mui-palette-text-secondary)',
          minHeight: 'unset',
          minWidth: 'unset',
          padding: `${space3} ${space4}`,
          transition: 'color 150ms ease',
          '&:hover': {
            color: 'var(--mui-palette-text-primary)',
          },
          '&.Mui-selected': {
            color: 'var(--mui-palette-primary-main)',
          },
          '&.Mui-disabled': {
            color: 'var(--mui-palette-text-disabled)',
            opacity: 0.6,
          },
        },
      },
    },
  };
}
