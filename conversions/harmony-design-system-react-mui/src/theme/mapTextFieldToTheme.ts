import type { Components, Theme } from '@mui/material/styles';
import { spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';
import { getHarmonyPaletteTokens } from './mapColorsToPalette';

/** CP compact field height — mirrors `--input-height-cp` (20px). */
const INPUT_HEIGHT_CP = '20px';

function softFocusRing(colorVar: string) {
  return {
    outline: 'none',
    borderColor: colorVar,
    boxShadow: `0 0 0 3px color-mix(in srgb, ${colorVar} 10%, transparent), 0 0 0 4px var(--mui-palette-background-paper)`,
  };
}

type FieldMetrics = {
  height: string;
  padX: string;
  padYTextarea: string;
  fontSize: string;
  radius: string;
  textareaMinHeight: string;
  adornmentPad: string;
  /** Adornment icon size — the interactive `IconButton` inherits this via `fontSize`. */
  iconSizePx: number;
  /** Equal padding around the adornment icon; the button box collapses to
   *  `iconSizePx + 2 * iconPadPx`, and `edge` negates exactly this value. */
  iconPadPx: number;
};

function fieldMetricsForProduct(product: HarmonyProduct): FieldMetrics {
  if (product === 'cp') {
    return {
      height: INPUT_HEIGHT_CP,
      padX: spacing.scale['2'].value,
      padYTextarea: spacing.scale['2'].value,
      fontSize: typography.fontSizes.xs.value,
      radius: spacing.borderRadius['radius-04'].value,
      textareaMinHeight: '60px',
      adornmentPad: spacing.scale['1'].value,
      // 14 + 2*3 = 20 → fits the compact 20px field.
      iconSizePx: 14,
      iconPadPx: 3,
    };
  }
  return {
    height: spacing.scale['10'].value,
    padX: spacing.scale['4'].value,
    padYTextarea: spacing.scale['3'].value,
    fontSize: typography.fontSizes.base.value,
    radius: spacing.borderRadius['radius-08'].value,
    textareaMinHeight: '100px',
    adornmentPad: spacing.scale['2'].value,
    // 18 + 2*7 = 32 → sits within the 40px field with breathing room.
    iconSizePx: 18,
    iconPadPx: 7,
  };
}

/**
 * Harmony field chrome on **outlined** TextField / OutlinedInput only.
 * filled / standard keep stock MUI styles (beyond Harmony, still usable).
 *
 * Product density: CP uses compact 20px fields (`--input-height-cp`); other
 * products use the default 40px (`--space-10`) field.
 */
export function mapTextFieldToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiTextField' | 'MuiOutlinedInput' | 'MuiInputAdornment'> {
  const light = getHarmonyPaletteTokens(product, 'light');
  const dark = getHarmonyPaletteTokens(product, 'dark');
  const metrics = fieldMetricsForProduct(product);
  // Padding-around-icon sizing: the icon inherits `iconFontSize`, and equal
  // padding (`iconPad`) on all sides sets the box size. Because the padding is
  // known, `edge` alignment simply negates it so the icon's edge — not the
  // padded box — lands on the field content edge.
  const iconFontSize = `${metrics.iconSizePx}px`;
  const iconPad = `${metrics.iconPadPx}px`;
  const edgeInset = iconPad;

  return {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        notched: false,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: metrics.fontSize,
          color: 'var(--mui-palette-text-primary)',
          backgroundColor: light.inputBackground,
          borderRadius: metrics.radius,
          transition: 'border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
          // Single-line density: CP 20px (`--input-height-cp`); others 40px (`--space-10`).
          '&:not(.MuiInputBase-multiline)': {
            height: metrics.height,
            minHeight: metrics.height,
          },
          ...theme.applyStyles('dark', {
            backgroundColor: dark.inputBackground,
          }),
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-divider)',
            borderWidth: 1,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-divider)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1,
          },
          '&.Mui-focused': softFocusRing('var(--mui-palette-primary-main)'),
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-error-main)',
          },
          '&.Mui-error.Mui-focused': softFocusRing('var(--mui-palette-error-main)'),
          '&.Mui-disabled': {
            backgroundColor: light.inputDisabled,
            color: 'var(--mui-palette-text-disabled)',
            ...theme.applyStyles('dark', {
              backgroundColor: dark.inputDisabled,
            }),
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--mui-palette-divider)',
            },
          },
        }),
        input: {
          height: '100%',
          boxSizing: 'border-box',
          padding: `0 ${metrics.padX}`,
          fontSize: metrics.fontSize,
          lineHeight: 1.25,
          '&::placeholder': {
            color: 'var(--mui-palette-text-disabled)',
            opacity: 1,
          },
          '&.MuiInputBase-inputMultiline': {
            height: 'auto',
            lineHeight: 1.5,
            minHeight: metrics.textareaMinHeight,
            padding: `${metrics.padYTextarea} ${metrics.padX}`,
          },
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
          },
        },
        adornedStart: {
          paddingLeft: metrics.adornmentPad,
        },
        adornedEnd: {
          paddingRight: metrics.adornmentPad,
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: 'var(--mui-palette-text-disabled)',
          margin: 0,
          height: '100%',
          maxHeight: '100%',
          alignItems: 'center',
          '& .MuiSvgIcon-root': {
            fontSize: iconFontSize,
          },
          '& .MuiIconButton-root': {
            color: 'var(--mui-palette-text-secondary)',
            fontSize: iconFontSize,
            padding: iconPad,
            margin: 0,
          },
          // `edge` aligns the icon edge with the field content edge by negating
          // the (known) padding around the icon.
          '& .MuiIconButton-edgeStart': {
            marginLeft: `-${edgeInset}`,
          },
          '& .MuiIconButton-edgeEnd': {
            marginRight: `-${edgeInset}`,
          },
        },
      },
    },
  };
}
