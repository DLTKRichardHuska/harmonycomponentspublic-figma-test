import type { Components, Theme } from '@mui/material/styles';
import { spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

const gap2 = spacing.scale['2'].value;
const gap1 = spacing.scale['1'].value;
const textSm = typography.fontSizes.sm.value;
const weightSemibold = typography.fontWeights.semibold.value;

/**
 * Shared FormControl chrome for Checkbox / Radio demos.
 * Validation colors on Checkbox/Radio inherit from parent FormControl
 * (`error` / `color="warning"`) via descendant selectors — consumers do not
 * set color on each control.
 */
export function mapSelectionControlChromeToTheme(
  product: HarmonyProduct,
): Pick<
  Components<Theme>,
  | 'MuiFormControl'
  | 'MuiFormControlLabel'
  | 'MuiFormGroup'
  | 'MuiFormLabel'
  | 'MuiFormHelperText'
  | 'MuiRadioGroup'
> {
  void product;

  return {
    MuiFormControl: {
      styleOverrides: {
        root: ({ ownerState }) => {
          const errorMain = 'var(--mui-palette-error-main)';
          const warningMain = 'var(--mui-palette-warning-main)';
          const primaryMain = 'var(--mui-palette-primary-main)';

          const controlSelectors = '& .MuiCheckbox-root, & .MuiRadio-root';

          if (ownerState.error) {
            return {
              [controlSelectors]: {
                color: errorMain,
                '&.Mui-checked': {
                  color: primaryMain,
                  // Harmony checked+error: primary face + 2px error outer ring
                  '& .MuiSvgIcon-root': {
                    borderRadius: 2,
                    boxShadow: `0 0 0 2px ${errorMain}`,
                  },
                },
                // Keep border/error face + 50% opacity — not MUI action.disabled
                '&.Mui-disabled': {
                  opacity: 0.5,
                  color: errorMain,
                },
                '&.Mui-disabled.Mui-checked': {
                  color: primaryMain,
                },
              },
              '& .MuiFormHelperText-root .MuiSvgIcon-root': {
                color: errorMain,
              },
            };
          }

          if (ownerState.color === 'warning') {
            return {
              [controlSelectors]: {
                color: warningMain,
                '&.Mui-checked': {
                  color: primaryMain,
                  // Harmony checked+warning: primary face + 1px warning outer ring
                  '& .MuiSvgIcon-root': {
                    borderRadius: 2,
                    boxShadow: `0 0 0 1px ${warningMain}`,
                  },
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                  color: warningMain,
                },
                '&.Mui-disabled.Mui-checked': {
                  color: primaryMain,
                },
              },
              '& .MuiFormHelperText-root .MuiSvgIcon-root': {
                color: warningMain,
              },
            };
          }

          return {};
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
          gap: gap2,
          alignItems: 'center',
          // Radio size → label type scale (Harmony radio--sm / --lg)
          '&:has(.MuiRadio-sizeSmall) .MuiFormControlLabel-label': {
            fontSize: typography.fontSizes.xs.value,
          },
          '&:has(.MuiRadio-sizeLarge) .MuiFormControlLabel-label': {
            fontSize: typography.fontSizes.base.value,
          },
        },
        label: {
          fontSize: textSm,
          fontWeight: typography.fontWeights.normal.value,
          lineHeight: spacing.scale['5'].value,
          color: 'var(--mui-palette-text-primary)',
        },
      },
    },
    MuiFormGroup: {
      styleOverrides: {
        root: {
          gap: gap2,
          alignItems: 'flex-start',
        },
        row: {
          gap: spacing.scale['4'].value,
          flexWrap: 'wrap',
        },
      },
    },
    MuiRadioGroup: {
      styleOverrides: {
        root: {
          gap: gap2,
          alignItems: 'flex-start',
        },
        row: {
          gap: spacing.scale['6'].value,
          flexWrap: 'wrap',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: textSm,
          fontWeight: weightSemibold,
          lineHeight: spacing.scale['5'].value,
          color: 'var(--mui-palette-text-primary)',
          marginBottom: gap2,
          [`&.Mui-error`]: {
            color: 'var(--mui-palette-error-main)',
          },
          [`&.MuiFormLabel-colorWarning`]: {
            color: 'var(--mui-palette-warning-main)',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: gap1,
          marginTop: gap1,
          marginLeft: 0,
          fontSize: textSm,
          lineHeight: spacing.scale['5'].value,
          color: 'var(--mui-palette-text-secondary)',
          // Harmony Input errorMessage uses error red; Checkbox/Radio helpers inherit the same.
          [`&.Mui-error`]: {
            color: 'var(--mui-palette-error-main)',
          },
        },
      },
    },
  };
}
