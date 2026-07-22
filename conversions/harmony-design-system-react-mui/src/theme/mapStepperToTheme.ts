import type { Components, Theme } from '@mui/material/styles';
import { spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

const displayFont = typography.fontFamilies.display.css;
const textSm = typography.fontSizes.sm.value;
const weightMedium = typography.fontWeights.medium.value;
const weightSemibold = typography.fontWeights.semibold.value;
const connectorWidth = spacing.scale['0.5'].value; // 2px

/**
 * Theme map for the `@mui/material` Stepper family — Harmony Stepper / Step.
 * Enlarged StepIcon (Harmony 40px indicator), primary active/completed fills,
 * error state via StepLabel/StepIcon error. Distinct warning/success statuses
 * are skipped per manifest gaps (demo uses UnsupportedEquivalentCallout).
 */
export function mapStepperToTheme(
  product: HarmonyProduct,
): Pick<
  Components<Theme>,
  'MuiStepper' | 'MuiStepLabel' | 'MuiStepConnector' | 'MuiStepIcon'
> {
  void product;

  return {
    MuiStepper: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          // Harmony 40px indicator (default MUI is 1.5rem / 24px). Idle = hollow ring:
          // transparent SVG fill + border on the icon element, number in text.secondary.
          fontSize: '2.5rem',
          color: 'transparent',
          borderRadius: '50%',
          border: `${connectorWidth} solid var(--mui-palette-divider)`,
          boxSizing: 'border-box',
          '& .MuiStepIcon-text': {
            fill: 'var(--mui-palette-text-secondary)',
            fontFamily: displayFont,
            fontWeight: weightSemibold,
            fontSize: '0.75rem',
          },
          '&.Mui-active': {
            color: 'var(--mui-palette-primary-main)',
            borderColor: 'transparent',
            '& .MuiStepIcon-text': {
              fill: 'var(--mui-palette-primary-contrastText)',
            },
          },
          '&.Mui-completed': {
            color: 'var(--mui-palette-primary-main)',
            borderColor: 'transparent',
          },
          '&.Mui-error': {
            color: 'var(--mui-palette-error-main)',
            borderColor: 'transparent',
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontFamily: displayFont,
          fontSize: textSm,
          fontWeight: weightMedium,
          color: 'var(--mui-palette-text-primary)',
          '&.Mui-active': {
            color: 'var(--mui-palette-text-primary)',
            fontWeight: weightSemibold,
          },
          '&.Mui-completed': {
            color: 'var(--mui-palette-text-secondary)',
          },
          '&.Mui-error': {
            color: 'var(--mui-palette-error-main)',
          },
          '&.Mui-disabled': {
            color: 'var(--mui-palette-text-disabled)',
          },
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: 'var(--mui-palette-divider)',
          borderTopWidth: connectorWidth,
        },
        root: {
          '&.Mui-active .MuiStepConnector-line': {
            borderColor: 'var(--mui-palette-primary-main)',
          },
          '&.Mui-completed .MuiStepConnector-line': {
            borderColor: 'var(--mui-palette-primary-main)',
          },
        },
      },
    },
  };
}
