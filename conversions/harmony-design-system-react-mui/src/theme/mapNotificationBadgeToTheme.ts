import type { Components, Theme } from '@mui/material/styles';
import { colors, spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

const dotSizes = {
  sm: '6px',
  md: '10px',
  lg: '15px',
};

const notificationError = colors.notificationBadge.error.value;

export function mapNotificationBadgeToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiBadge'> {
  void product;

  return {
    MuiBadge: {
      styleOverrides: {
        badge: ({ theme }) => ({
          fontFamily: typography.fontFamilies.sans.css,
          fontWeight: typography.fontWeights.medium.value,
          fontSize: '10px',
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '&.MuiBadge-colorPrimary': {
            backgroundColor: theme.palette.primary.main,
          },
          '&.MuiBadge-colorError': {
            backgroundColor: notificationError,
          },
          '&.MuiBadge-dot': {
            minWidth: dotSizes.sm,
            width: dotSizes.sm,
            height: dotSizes.sm,
            padding: 0,
            borderRadius: '50%',
            aspectRatio: '1 / 1',
            lineHeight: 0,
          },
          '&:not(.MuiBadge-dot)': {
            lineHeight: 0,
            minHeight: '15px',
            minWidth: dotSizes.lg,
            padding: '0 4px',
            borderRadius: spacing.borderRadius['radius-100'].value,
          },
        }),
      },
    },
  };
}
