import type {} from '@mui/x-date-pickers/themeAugmentation';
import type { Components, Theme } from '@mui/material/styles';
import { spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';
import { getHarmonyPaletteTokens } from './mapColorsToPalette';

type DatePickerComponentName =
  | 'MuiDatePicker'
  | 'MuiTimePicker'
  | 'MuiDateTimePicker'
  | 'MuiPickersOutlinedInput'
  | 'MuiDateCalendar'
  | 'MuiPickersCalendarHeader'
  | 'MuiPickerDay'
  | 'MuiPickerPopper'
  | 'MuiPickersLayout'
  | 'MuiMonthCalendar'
  | 'MuiYearCalendar'
  | 'MuiTimeClock'
  | 'MuiDigitalClock';

/**
 * Harmony picker chrome for MUI X Date and Time Pickers.
 *
 * The picker fields inherit their outlined input styling from
 * `mapTextFieldToTheme`; this map owns the popup, calendar, and time views.
 */
export function mapDatePickersToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, DatePickerComponentName> {
  const compact = product === 'cp';
  const light = getHarmonyPaletteTokens(product, 'light');
  const dark = getHarmonyPaletteTokens(product, 'dark');
  const fieldHeight = compact ? '20px' : spacing.scale['10'].value;
  const fieldFontSize = compact
    ? typography.fontSizes.xs.value
    : typography.fontSizes.base.value;
  const fieldRadius = compact
    ? spacing.borderRadius['radius-04'].value
    : spacing.borderRadius['radius-08'].value;
  const fieldPadX = compact ? spacing.scale['2'].value : spacing.scale['4'].value;
  const daySize = spacing.scale['9'].value;
  const pickerWidth = 310;

  const pickerDefaultProps = {
    slotProps: {
      textField: {
        variant: 'outlined' as const,
        fullWidth: true,
      },
    },
  };

  return {
    MuiDatePicker: {
      defaultProps: pickerDefaultProps,
    },
    MuiTimePicker: {
      defaultProps: pickerDefaultProps,
    },
    MuiDateTimePicker: {
      defaultProps: pickerDefaultProps,
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          height: fieldHeight,
          minHeight: fieldHeight,
          padding: 0,
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: fieldFontSize,
          color: 'var(--mui-palette-text-primary)',
          backgroundColor: light.inputBackground,
          borderRadius: fieldRadius,
          transition: 'border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
          ...theme.applyStyles('dark', {
            backgroundColor: dark.inputBackground,
          }),
          '& .MuiPickersInputBase-sectionsContainer': {
            height: '100%',
            padding: `0 ${fieldPadX}`,
            alignItems: 'center',
            fontSize: fieldFontSize,
            lineHeight: 1.25,
          },
          '&:has(input[value=""]) [role="spinbutton"]': {
            color: 'var(--mui-palette-text-disabled)',
          },
          '& .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-divider)',
            borderWidth: 1,
          },
          '&:hover .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-divider)',
          },
          '&.Mui-focused': {
            outline: 'none',
            borderColor: 'var(--mui-palette-primary-main)',
            boxShadow:
              '0 0 0 3px color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent), 0 0 0 4px var(--mui-palette-background-paper)',
          },
          '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-primary-main)',
            borderWidth: 1,
          },
          '&.Mui-disabled': {
            color: 'var(--mui-palette-text-disabled)',
            backgroundColor: light.inputDisabled,
            ...theme.applyStyles('dark', {
              backgroundColor: dark.inputDisabled,
            }),
            '& .MuiPickersOutlinedInput-notchedOutline': {
              borderColor: 'var(--mui-palette-divider)',
            },
          },
          '& .MuiIconButton-root': {
            width: fieldHeight,
            height: fieldHeight,
            padding: compact ? spacing.scale['0.5'].value : spacing.scale['1'].value,
            color: 'var(--mui-palette-text-secondary)',
          },
          '& .MuiSvgIcon-root': {
            fontSize: compact ? '14px' : '18px',
          },
        }),
      },
    },
    MuiPickerPopper: {
      styleOverrides: {
        paper: {
          color: 'var(--mui-palette-text-primary)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          border: '1px solid var(--mui-palette-divider)',
          borderRadius: compact
            ? spacing.borderRadius['radius-04'].value
            : spacing.borderRadius['radius-08'].value,
          boxShadow: 'var(--mui-shadows-12)',
        },
      },
    },
    MuiPickersLayout: {
      styleOverrides: {
        root: {
          color: 'var(--mui-palette-text-primary)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          minWidth: pickerWidth,
        },
        actionBar: {
          borderTop: '1px solid var(--mui-palette-divider)',
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          width: pickerWidth,
          color: 'var(--mui-palette-text-primary)',
          backgroundColor: 'var(--mui-palette-background-paper)',
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          paddingInline: spacing.scale['4'].value,
        },
        label: {
          fontFamily: typography.fontFamilies.display.css,
          fontSize: typography.fontSizes.base.value,
          fontWeight: typography.fontWeights.semibold.value,
        },
        switchViewButton: {
          color: 'var(--mui-palette-text-secondary)',
        },
      },
    },
    MuiPickerDay: {
      styleOverrides: {
        root: {
          width: daySize,
          height: daySize,
          margin: spacing.scale['0.5'].value,
          borderRadius: spacing.borderRadius['radius-04'].value,
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: typography.fontSizes.sm.value,
          color: 'var(--mui-palette-text-primary)',
          '&:hover': {
            backgroundColor: 'var(--mui-palette-action-hover)',
          },
          '&.Mui-selected': {
            color: 'var(--mui-palette-primary-contrastText)',
            backgroundColor: 'var(--mui-palette-primary-main)',
            fontWeight: typography.fontWeights.semibold.value,
            '&:hover, &:focus': {
              backgroundColor: 'var(--mui-palette-primary-dark)',
            },
          },
          '&.MuiPickerDay-today': {
            color: 'var(--mui-palette-text-primary)',
            backgroundColor: 'transparent',
            border: '1px solid var(--mui-palette-primary-main)',
            fontWeight: typography.fontWeights.semibold.value,
            '&:focus, &.Mui-focusVisible': {
              color: 'var(--mui-palette-text-primary)',
              backgroundColor: 'transparent',
              border: '1px solid var(--mui-palette-primary-main)',
            },
            '&:hover': {
              color: 'var(--mui-palette-text-primary)',
              backgroundColor: 'var(--mui-palette-action-hover)',
              border: '1px solid var(--mui-palette-primary-main)',
            },
          },
          '&.Mui-selected.MuiPickerDay-today': {
            color: 'var(--mui-palette-primary-contrastText)',
            backgroundColor: 'var(--mui-palette-primary-main)',
            border: '1px solid var(--mui-palette-primary-main)',
            '&:hover, &:focus, &.Mui-focusVisible': {
              color: 'var(--mui-palette-primary-contrastText)',
              backgroundColor: 'var(--mui-palette-primary-dark)',
            },
          },
          '&.Mui-disabled': {
            color: 'var(--mui-palette-text-disabled)',
            opacity: 0.4,
          },
        },
      },
    },
    MuiMonthCalendar: {
      styleOverrides: {
        root: {
          width: pickerWidth,
        },
      },
    },
    MuiYearCalendar: {
      styleOverrides: {
        root: {
          width: pickerWidth,
        },
      },
    },
    MuiTimeClock: {
      styleOverrides: {
        root: {
          color: 'var(--mui-palette-text-primary)',
          backgroundColor: 'var(--mui-palette-background-paper)',
        },
      },
    },
    MuiDigitalClock: {
      styleOverrides: {
        root: {
          color: 'var(--mui-palette-text-primary)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          borderColor: 'var(--mui-palette-divider)',
        },
        item: {
          '&.Mui-selected': {
            color: 'var(--mui-palette-primary-contrastText)',
            backgroundColor: 'var(--mui-palette-primary-main)',
          },
        },
      },
    },
  };
}
