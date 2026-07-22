export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const iconSizeDimensions: Record<IconSize, { width: number; height: number }> = {
  xs: { width: 12, height: 12 },
  sm: { width: 16, height: 16 },
  md: { width: 20, height: 20 },
  lg: { width: 24, height: 24 },
  xl: { width: 32, height: 32 },
};

export const buttonIconSizeMap = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
} as const satisfies Record<'xs' | 'sm' | 'md' | 'lg', IconSize>;

export type HarmonyButtonSize = keyof typeof buttonIconSizeMap;
