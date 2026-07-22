import { colors, spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

export const DELA_GRADIENT =
  'linear-gradient(119deg, #8A33C2 17.59%, #423FE2 77.78%)';

export const DELA_GRADIENT_HOVER =
  'rgba(255, 255, 255, 0.1)';

export const buttonRoleTokens = colors.buttonRoleTokens.theme;

export const harmonyButtonSizes = {
  xs: {
    minHeight: 24,
    paddingX: spacing.componentDefaults.button.sm.px,
    paddingY: spacing.componentDefaults.button.sm.py,
    fontSize: typography.fontSizes.xs.value,
  },
  sm: {
    minHeight: 32,
    paddingX: spacing.componentDefaults.button.sm.px,
    paddingY: spacing.componentDefaults.button.sm.py,
    fontSize: typography.fontSizes.sm.value,
  },
  md: {
    minHeight: 40,
    paddingX: spacing.componentDefaults.button.md.px,
    paddingY: spacing.componentDefaults.button.md.py,
    fontSize: typography.fontSizes.base.value,
  },
  lg: {
    minHeight: 48,
    paddingX: spacing.componentDefaults.button.lg.px,
    paddingY: spacing.componentDefaults.button.lg.py,
    fontSize: typography.fontSizes.lg.value,
  },
} as const;

export type HarmonyButtonSize = keyof typeof harmonyButtonSizes;

/**
 * Icon-only buttons are sized by **padding around the icon** rather than a fixed
 * box with a centered icon. The icon inherits its size from the button
 * (`fontSize`), and equal padding on all sides produces the reference box size.
 * Because the padding is known, `edge` alignment simply negates that padding so
 * the icon's edge — not the padded box — aligns with the container edge.
 *
 * | Harmony | MUI size | icon | padding | box |
 * |---------|----------|------|---------|-----|
 * | sm      | small    | 16   | 8       | 32  |
 * | md      | medium   | 20   | 10      | 40  |
 * | lg      | large    | 24   | 12      | 48  |
 *
 * `xs` is intentionally unsupported — MUI has no equivalent size.
 */
export const harmonyIconButtonSizes = {
  sm: { iconSize: 16, padding: 8 },
  md: { iconSize: 20, padding: 10 },
  lg: { iconSize: 24, padding: 12 },
} as const;

export type HarmonyIconButtonSize = keyof typeof harmonyIconButtonSizes;

export function getButtonDisabledColors() {
  return {
    primaryBackground: buttonRoleTokens.primary.disabled.background,
    primaryForeground: buttonRoleTokens.primary.disabled.foreground,
    secondaryForeground: buttonRoleTokens.secondary.disabled.foreground,
    tertiaryForeground: buttonRoleTokens.tertiary.disabled.foreground,
    secondaryHoverBackground: buttonRoleTokens.secondary.hover.background,
    tertiaryHoverBackground: buttonRoleTokens.tertiary.hover.background,
  };
}

export function getProductButtonColors(product: HarmonyProduct, mode: 'light' | 'dark') {
  const primary = colors.themes[product].primary[mode];
  const primaryHover = colors.themes[product].primaryHover[mode];
  const disabled = getButtonDisabledColors();

  return {
    primary,
    primaryHover,
    ...disabled,
  };
}
