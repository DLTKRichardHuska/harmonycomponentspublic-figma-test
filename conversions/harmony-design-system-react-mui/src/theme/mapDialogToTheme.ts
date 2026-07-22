import type { Components, Theme } from '@mui/material/styles';
import { elevations, spacing, typography } from '../tokens';
import type { HarmonyProduct } from '../tokens';

/** Harmony `--radius-xl` (0.75rem / 12px) → radius-12 token. */
const radiusXl = spacing.borderRadius['radius-12'].value;
const space1 = spacing.scale['1'].value;
const space2 = spacing.scale['2'].value;
const space3 = spacing.scale['3'].value;
const space4 = spacing.scale['4'].value;
const space6 = spacing.scale['6'].value;
const space8 = spacing.scale['8'].value;
const space10 = spacing.scale['10'].value;
const space20 = spacing.scale['20'].value;

const shadowXlLight = elevations.shadows.xl.value;
const shadowXlDark = elevations.shadows.xl.valueDark;

/** Harmony `--dialog-min-width` / `--dialog-max-width-default` / `--dialog-width-percentage`. */
const dialogMinWidth = '600px';
const dialogMaxWidth = '700px';
const dialogWidth = '90%';
const dialogMaxHeight = '90vh';
const dialogBodyMaxHeight = '600px';
const footerBtnMinWidth = `calc(${space20} + ${space10})`;

export function mapDialogToTheme(
  product: HarmonyProduct,
): Pick<
  Components<Theme>,
  'MuiDialog' | 'MuiDialogTitle' | 'MuiDialogContent' | 'MuiDialogActions'
> {
  void product;

  return {
    MuiDialog: {
      defaultProps: {
        fullWidth: true,
        maxWidth: false,
        scroll: 'paper',
      },
      styleOverrides: {
        paper: ({ theme }) => ({
          display: 'flex',
          flexDirection: 'column',
          minWidth: dialogMinWidth,
          maxWidth: dialogMaxWidth,
          width: dialogWidth,
          maxHeight: dialogMaxHeight,
          overflow: 'hidden',
          borderRadius: radiusXl,
          backgroundColor: 'var(--mui-palette-background-paper)',
          boxShadow: shadowXlLight,
          ...theme.applyStyles('dark', {
            boxShadow: shadowXlDark,
          }),
          [theme.breakpoints.down('md')]: {
            width: `calc(100vw - ${space8})`,
            maxWidth: '100%',
            margin: space4,
            maxHeight: `calc(100vh - ${space8})`,
            minWidth: 0,
          },
        }),
      },
    },
    MuiDialogTitle: {
      defaultProps: {
        component: 'h2',
      },
      styleOverrides: {
        root: ({ theme }) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: space3,
          flexShrink: 0,
          margin: 0,
          padding: `${space4} ${space6}`,
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          fontFamily: typography.fontFamilies.display.css,
          fontSize: typography.fontSizes.lg.value,
          fontWeight: typography.fontWeights.semibold.value,
          lineHeight: 1.4,
          color: 'var(--mui-palette-text-primary)',
          [theme.breakpoints.down('md')]: {
            padding: `${space3} ${space4}`,
          },
          '& .MuiIconButton-root': {
            color: 'var(--mui-palette-text-disabled)',
            marginRight: `calc(-1 * ${space1})`,
            '&:hover': {
              color: 'var(--mui-palette-text-primary)',
              backgroundColor: 'transparent',
            },
          },
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          flex: '1 1 auto',
          minHeight: 0,
          maxHeight: dialogBodyMaxHeight,
          padding: space6,
          overflowY: 'auto',
          color: 'var(--mui-palette-text-secondary)',
          [theme.breakpoints.down('md')]: {
            padding: space4,
          },
          // MUI adds top padding when following DialogTitle; keep Harmony even spacing
          '&:first-of-type': {
            paddingTop: space6,
            [theme.breakpoints.down('md')]: {
              paddingTop: space4,
            },
          },
        }),
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          flexShrink: 0,
          justifyContent: 'flex-start',
          gap: space3,
          margin: 0,
          padding: `${space4} ${space6}`,
          borderTop: '1px solid var(--mui-palette-divider)',
          // Harmony `--elevated-bg` matches card/paper in current tokens
          backgroundColor: 'var(--mui-palette-background-paper)',
          [theme.breakpoints.down('md')]: {
            padding: `${space3} ${space4}`,
            flexWrap: 'wrap',
            gap: space2,
            '& .MuiButton-root': {
              flex: 1,
              minWidth: footerBtnMinWidth,
            },
          },
          '& > :not(style) ~ :not(style)': {
            marginLeft: 0,
          },
        }),
      },
    },
  };
}
