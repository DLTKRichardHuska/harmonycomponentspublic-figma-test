import { typography } from '../tokens';

type FontFamilyKey = keyof typeof typography.fontFamilies;
type FontWeightKey = keyof typeof typography.fontWeights;
type LineHeightKey = keyof typeof typography.lineHeights;

function resolveFontFamily(key: FontFamilyKey): string {
  return typography.fontFamilies[key].css;
}

function resolveFontWeight(key: FontWeightKey): number {
  return typography.fontWeights[key].value;
}

function resolveLineHeight(key: LineHeightKey): number {
  return typography.lineHeights[key].value;
}

function pxToNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  const numeric = Number.parseFloat(value);
  if (value.endsWith('rem')) return numeric * 16;
  return numeric;
}

function buildVariant(
  style: (typeof typography.textStyles)[keyof typeof typography.textStyles],
) {
  const fontFamily = resolveFontFamily(style.fontFamily as FontFamilyKey);
  const fontWeight = resolveFontWeight(style.fontWeight as FontWeightKey);
  const lineHeight = resolveLineHeight(style.lineHeight as LineHeightKey);

  return {
    fontFamily,
    fontSize: pxToNumber(style.fontSize),
    fontWeight,
    lineHeight,
    ...('textTransform' in style && style.textTransform
      ? { textTransform: style.textTransform as 'uppercase' }
      : {}),
    ...('letterSpacing' in style && style.letterSpacing
      ? { letterSpacing: style.letterSpacing }
      : {}),
  };
}

const bodyDefault = buildVariant(typography.textStyles.bodyDefault);

export function mapTypographyToTheme() {
  return {
    typography: {
      ...bodyDefault,
      fontFamily: typography.fontFamilies.sans.css,
      h1: buildVariant(typography.textStyles.displayXL),
      h2: buildVariant(typography.textStyles.displayL),
      h3: buildVariant(typography.textStyles.displayM),
      h4: buildVariant(typography.textStyles.headingXL),
      h5: buildVariant(typography.textStyles.headingL),
      h6: buildVariant(typography.textStyles.headingM),
      subtitle1: buildVariant(typography.textStyles.headingS),
      subtitle2: buildVariant(typography.textStyles.label),
      body1: bodyDefault,
      body2: buildVariant(typography.textStyles.bodyEmphasized),
      caption: buildVariant(typography.textStyles.caption),
      overline: buildVariant(typography.textStyles.overline),
      button: {
        fontFamily: typography.fontFamilies.sans.css,
        fontWeight: typography.fontWeights.medium.value,
        textTransform: 'none' as const,
      },
      code: {
        fontFamily: typography.fontFamilies.mono.css,
        fontSize: pxToNumber(typography.fontSizes.sm.value),
        fontWeight: typography.fontWeights.normal.value,
        lineHeight: resolveLineHeight('normal'),
      },
    },
  };
}
