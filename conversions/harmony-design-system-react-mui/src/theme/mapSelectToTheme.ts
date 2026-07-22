import type { Components, Theme } from '@mui/material/styles';
import { elevations, spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';
import { getHarmonyPaletteTokens } from './mapColorsToPalette';

/** CP compact field height — mirrors `--dropdown-height-cp` / `--input-height-cp`. */
const INPUT_HEIGHT_CP = '20px';

function softFocusRing(colorVar: string) {
  return {
    outline: 'none',
    borderColor: colorVar,
    boxShadow: `0 0 0 3px color-mix(in srgb, ${colorVar} 10%, transparent), 0 0 0 4px var(--mui-palette-background-paper)`,
  };
}

type SelectMetrics = {
  height: string;
  padX: string;
  fontSize: string;
  radius: string;
  menuMaxHeight: string;
  minWidth: string;
};

function selectMetricsForProduct(product: HarmonyProduct): SelectMetrics {
  if (product === 'cp') {
    return {
      height: INPUT_HEIGHT_CP,
      padX: spacing.scale['2'].value,
      fontSize: typography.fontSizes.xs.value,
      radius: spacing.borderRadius['radius-04'].value,
      menuMaxHeight: '300px',
      minWidth: '180px',
    };
  }
  return {
    height: spacing.scale['10'].value,
    padX: spacing.scale['4'].value,
    fontSize: typography.fontSizes.base.value,
    radius: spacing.borderRadius['radius-08'].value,
    menuMaxHeight: '300px',
    minWidth: '200px',
  };
}

/**
 * Theme map for `@mui/material/Select` + `MenuItem` menu chrome.
 * Outlined field chrome aligns with Harmony Dropdown / Input density.
 */
export function mapSelectToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiSelect' | 'MuiMenuItem' | 'MuiMenu'> {
  const light = getHarmonyPaletteTokens(product, 'light');
  const metrics = selectMetricsForProduct(product);
  const shadowLg = elevations.shadows.lg.value;

  return {
    MuiSelect: {
      defaultProps: {
        variant: 'outlined',
        displayEmpty: true,
        // Harmony Dropdown is an anchored list — no modal screen dim.
        MenuProps: {
          slotProps: {
            backdrop: {
              invisible: true,
            },
          },
        },
      },
      styleOverrides: {
        root: {
          minWidth: metrics.minWidth,
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: metrics.fontSize,
          color: 'var(--mui-palette-text-primary)',
          backgroundColor: light.inputBackground,
          borderRadius: metrics.radius,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-divider)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-divider)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1,
            ...softFocusRing('var(--mui-palette-primary-main)'),
          },
          '&.Mui-disabled': {
            opacity: 0.5,
          },
        },
        select: {
          minHeight: metrics.height,
          height: metrics.height,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: metrics.padX,
          paddingRight: `calc(${metrics.padX} + 1.5rem)`,
          lineHeight: 1.2,
        },
        icon: {
          color: 'var(--mui-palette-text-secondary)',
          right: metrics.padX,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          maxHeight: metrics.menuMaxHeight,
          border: '1px solid var(--mui-palette-divider)',
          borderRadius: metrics.radius,
          boxShadow: shadowLg,
          marginTop: spacing.scale['1'].value,
        },
        list: {
          paddingTop: spacing.scale['1'].value,
          paddingBottom: spacing.scale['1'].value,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: typography.fontSizes.sm.value,
          color: 'var(--mui-palette-text-primary)',
          paddingTop: spacing.scale['2'].value,
          paddingBottom: spacing.scale['2'].value,
          paddingLeft: spacing.scale['4'].value,
          paddingRight: spacing.scale['4'].value,
          '&.Mui-selected': {
            backgroundColor: 'color-mix(in srgb, var(--mui-palette-primary-main) 12%, transparent)',
            fontWeight: typography.fontWeights.medium.value,
            '&:hover': {
              backgroundColor: 'color-mix(in srgb, var(--mui-palette-primary-main) 16%, transparent)',
            },
          },
          '&.Mui-disabled': {
            opacity: 0.5,
          },
        },
      },
    },
  };
}
