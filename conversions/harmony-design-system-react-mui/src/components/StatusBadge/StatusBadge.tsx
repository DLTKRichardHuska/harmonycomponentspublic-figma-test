import { forwardRef } from 'react';
import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import type { StatusBadgePalette } from '../../theme/themeAugmentation';
import { HarmonyIcon } from '../HarmonyIcon';

export type StatusBadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'orange'
  | 'pink'
  | 'disabled';

export type StatusBadgeSize = 'small' | 'medium' | 'large';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusBadgeVariant;
  size?: StatusBadgeSize;
  icon?: string;
  children?: React.ReactNode;
  /** MUI-style system overrides (same pattern as Chip / Box). */
  sx?: SxProps<Theme>;
}

const iconSizeMap: Record<StatusBadgeSize, 'xs' | 'sm'> = {
  small: 'xs',
  medium: 'xs',
  large: 'sm',
};

type StatusBadgeToneKey = keyof StatusBadgePalette;

function variantStyles(theme: Theme, variant: StatusBadgeVariant) {
  if (variant === 'default') {
    return {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.secondary,
      border: `1px solid ${theme.palette.divider}`,
    };
  }

  const tone = theme.palette.statusBadge[variant as StatusBadgeToneKey];
  return {
    backgroundColor: tone.background,
    color: tone.foreground,
    border: `1px solid ${tone.border ?? tone.foreground}`,
  };
}

function sizeStyles(theme: Theme, size: StatusBadgeSize) {
  const height =
    size === 'small' ? theme.spacing(4) : size === 'medium' ? theme.spacing(5) : theme.spacing(6);
  const padX = size === 'large' ? theme.spacing(2) : theme.spacing(1.5);
  const fontSize =
    size === 'small'
      ? theme.typography.overline.fontSize
      : size === 'medium'
        ? theme.typography.caption.fontSize
        : theme.typography.body2.fontSize;

  return {
    height,
    minHeight: height,
    padding: `0 ${padX}`,
    fontSize,
    lineHeight: size === 'small' ? 1 : size === 'medium' ? 1.25 : 1.5,
  };
}

const StatusBadgeRoot = styled('span', {
  shouldForwardProp: (prop) => prop !== 'badgeVariant' && prop !== 'badgeSize',
})<{ badgeVariant: StatusBadgeVariant; badgeSize: StatusBadgeSize }>(
  ({ badgeVariant, badgeSize, theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    boxSizing: 'border-box',
    fontFamily: theme.typography.h1.fontFamily ?? theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightRegular ?? 400,
    borderRadius: theme.shape.harmony?.['radius-100'] ?? 9999,
    whiteSpace: 'nowrap',
    ...sizeStyles(theme, badgeSize),
    ...variantStyles(theme, badgeVariant),
  }),
);

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(function StatusBadge(
  { variant = 'default', size = 'large', icon, children, ...props },
  ref,
) {
  const iconSize = icon ? iconSizeMap[size] : undefined;

  return (
    <StatusBadgeRoot ref={ref} badgeVariant={variant} badgeSize={size} {...props}>
      {icon && iconSize && <HarmonyIcon name={icon} size={iconSize} />}
      {children}
    </StatusBadgeRoot>
  );
});
