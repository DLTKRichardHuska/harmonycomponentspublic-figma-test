import type { Components, Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { elevations, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

const severityBorderAlpha: Record<AlertSeverity, number> = {
  info: 0.3,
  success: 0.3,
  warning: 0.2,
  error: 0.2,
};

function standardSeverityStyle(theme: Theme, severity: AlertSeverity) {
  const main = theme.palette[severity].main;
  return {
    backgroundColor: alpha(main, 0.1),
    border: `1px solid ${alpha(main, severityBorderAlpha[severity])}`,
    color: theme.palette.text.primary,
    '& .MuiAlert-icon': {
      color: main,
    },
  };
}

function enhancedSeverityStyle(theme: Theme, severity: AlertSeverity) {
  const main = theme.palette[severity].main;
  const shadow =
    theme.palette.mode === 'dark'
      ? elevations.shadows.md.valueDark
      : elevations.shadows.md.value;

  return {
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderLeft: `8px solid ${main}`,
    borderRadius: '8px',
    boxShadow: shadow,
    color: theme.palette.text.primary,
    padding: '12px',
    '& .MuiAlert-icon': {
      color: main,
      fontSize: '20px',
      marginRight: '8px',
      padding: 0,
      opacity: 1,
    },
    '& .MuiAlert-message': {
      padding: 0,
      overflow: 'visible',
    },
    '& .MuiAlert-action': {
      paddingTop: 0,
      marginRight: 0,
      alignItems: 'flex-start',
    },
  };
}

const displayFont = typography.fontFamilies.display.css;
const semibold = typography.fontWeights.semibold.value;
const medium = typography.fontWeights.medium.value;

export function mapAlertToTheme(
  product: HarmonyProduct,
): Pick<Components<Theme>, 'MuiAlert' | 'MuiAlertTitle'> {
  void product;

  const severities: AlertSeverity[] = ['info', 'success', 'warning', 'error'];

  const standardVariants = severities.map((severity) => ({
    props: { variant: 'standard' as const, severity },
    style: ({ theme }: { theme: Theme }) => standardSeverityStyle(theme, severity),
  }));

  const outlinedVariants = severities.map((severity) => ({
    props: { variant: 'outlined' as const, severity },
    style: ({ theme }: { theme: Theme }) => enhancedSeverityStyle(theme, severity),
  }));

  return {
    MuiAlert: {
      defaultProps: {
        variant: 'standard',
      },
      styleOverrides: {
        root: {
          alignItems: 'flex-start',
          borderRadius: '8px',
          gap: '12px',
          padding: '16px',
          fontSize: typography.textStyles.bodyDefault.fontSize,
          '& .MuiLink-root': {
            fontSize: typography.textStyles.caption.fontSize,
            fontWeight: typography.fontWeights.normal.value,
            lineHeight: '16px',
          },
          variants: [
            ...standardVariants,
            ...outlinedVariants,
            {
              props: { variant: 'standard' },
              style: {
                '& .MuiAlert-message': {
                  fontSize: typography.textStyles.bodyDefault.fontSize,
                  color: 'var(--mui-palette-text-secondary)',
                },
              },
            },
            {
              props: { variant: 'outlined' },
              style: {
                '& .MuiAlert-message': {
                  fontSize: '13px',
                  lineHeight: '18px',
                  color: 'var(--mui-palette-text-primary)',
                },
                '& .MuiAlert-message > .MuiStack-root': {
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  width: '100%',
                },
                '& .MuiAlert-message .MuiButton-root': {
                  minHeight: 24,
                  fontSize: 12,
                  lineHeight: 1.5,
                  paddingTop: 2,
                  paddingBottom: 2,
                  paddingLeft: 8,
                  paddingRight: 8,
                },
              },
            },
          ],
        },
        icon: {
          fontSize: typography.textStyles.headingS.fontSize,
          marginRight: 0,
          padding: 0,
          opacity: 1,
        },
        message: {
          padding: 0,
          flex: '1 1 auto',
        },
        action: {
          marginRight: 0,
          paddingTop: 0,
          alignItems: 'flex-start',
        },
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontFamily: displayFont,
          fontWeight: semibold,
          marginBottom: '4px',
          marginTop: 0,
          '.MuiAlert-outlined &': {
            fontSize: typography.textStyles.bodyDefault.fontSize,
            fontWeight: medium,
            lineHeight: '20px',
          },
          '.MuiAlert-standard &': {
            fontSize: typography.textStyles.bodyDefault.fontSize,
            fontWeight: semibold,
            color: 'var(--mui-palette-text-primary)',
          },
        },
      },
    },
  };
}
