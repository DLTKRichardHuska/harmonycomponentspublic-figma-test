/**
 * Harmony Design System — vendored token exports (synced from reference).
 */
import colorsJson from './colors.json';
import spacingJson from './spacing.json';
import elevationsJson from './elevations.json';
import typographyJson from './typography.json';

export const colors = colorsJson;
export const spacing = spacingJson;
export const elevations = elevationsJson;
export const typography = typographyJson;

export type Colors = typeof colorsJson;
export type Spacing = typeof spacingJson;
export type Elevations = typeof elevationsJson;
export type Typography = typeof typographyJson;

export type HarmonyProduct = keyof typeof colorsJson.themes;

export const semanticColors = colors.semantic;
export const themeColors = colors.themes;
export const buttonRoleTokens = colors.buttonRoleTokens;
export const pageHeaderButtonTokens = colors.pageHeaderButton;

export const spacingScale = spacing.scale;
export const spacingPatterns = spacing.patterns;
export const borderRadiusScale = spacing.borderRadius;

export const shadowScale = elevations.shadows;
export const elevationHierarchy = elevations.hierarchy;

export const fontFamilies = typography.fontFamilies;
export const fontSizes = typography.fontSizes;
export const fontWeights = typography.fontWeights;
export const textStyles = typography.textStyles;

export default {
  colors,
  spacing,
  elevations,
  typography,
};
