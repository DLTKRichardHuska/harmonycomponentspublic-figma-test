import type { Components, Theme } from '@mui/material/styles';
import { spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

/** Harmony `--radius-lg` (0.5rem / 8px) → radius-08. */
const radiusLg = spacing.borderRadius['radius-08'].value;
const space3 = spacing.scale['3'].value;
const space4 = spacing.scale['4'].value;
const space5 = spacing.scale['5'].value;
const textSm = typography.fontSizes.sm.value;

/**
 * Theme map for `@mui/material/List` + list item chrome — Harmony ListMenu.
 * Separators use documented `ListItemButton` `divider` prop (omit for no-borders).
 * Selected maps to Harmony `.is-active` (primary fill + white text).
 */
export function mapListToTheme(
  product: HarmonyProduct,
): Pick<
  Components<Theme>,
  'MuiList' | 'MuiListItemButton' | 'MuiListItemIcon' | 'MuiListItemText'
> {
  void product;

  return {
    MuiList: {
      defaultProps: {
        disablePadding: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'var(--mui-palette-background-paper)',
          border: '1px solid var(--mui-palette-divider)',
          borderRadius: radiusLg,
          overflow: 'hidden',
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          gap: space3,
          paddingTop: space3,
          paddingBottom: space3,
          paddingLeft: space4,
          paddingRight: space4,
          fontSize: textSm,
          color: 'var(--mui-palette-text-primary)',
          transition: 'background-color 150ms ease',
          '@media (max-width: 768px)': {
            minHeight: '44px',
          },
          '&:hover': {
            backgroundColor: 'var(--mui-palette-action-hover)',
          },
          '&:hover:not(.Mui-selected) .MuiListItemIcon-root': {
            color: 'var(--mui-palette-primary-main)',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--mui-palette-primary-main)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'var(--mui-palette-primary-dark)',
            },
            '& .MuiListItemIcon-root': {
              color: '#fff',
            },
            '& .MuiListItemText-primary': {
              color: '#fff',
            },
          },
          '&.MuiListItemButton-divider': {
            borderBottomColor: 'var(--mui-palette-divider)',
          },
          // Link composition (component="a") — match button item chrome
          textDecoration: 'none',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          marginRight: 0,
          // Harmony `--text-muted` maps to palette text.disabled in createHarmonyTheme
          color: 'var(--mui-palette-text-disabled)',
          fontSize: space5,
          '& img': {
            width: space5,
            height: space5,
            objectFit: 'contain',
            display: 'block',
          },
        },
      },
    },
    MuiListItemText: {
      defaultProps: {
        primaryTypographyProps: {
          variant: 'body2',
          fontSize: textSm,
        },
      },
      styleOverrides: {
        root: {
          marginTop: 0,
          marginBottom: 0,
        },
        primary: {
          fontSize: textSm,
          color: 'inherit',
        },
      },
    },
  };
}
