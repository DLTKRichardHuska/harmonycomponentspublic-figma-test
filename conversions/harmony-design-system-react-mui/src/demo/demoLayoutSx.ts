import { alpha, type SxProps, type Theme } from '@mui/material/styles';

export const SIDEBAR_WIDTH = 256;
export const HEADER_HEIGHT = 56;
export const DESKTOP_BREAKPOINT = 1024;

export const demoLayoutSx = {
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
  } satisfies SxProps<Theme>,

  header: {
    width: '100%',
    height: HEADER_HEIGHT,
    bgcolor: 'background.paper',
    borderBottom: 1,
    borderColor: 'divider',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: { xs: 2, sm: 3 },
    flexShrink: 0,
    zIndex: (theme) => theme.zIndex.appBar,
    position: 'relative',
  } satisfies SxProps<Theme>,

  headerBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  } satisfies SxProps<Theme>,

  headerBrandLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': { textDecoration: 'none' },
  } satisfies SxProps<Theme>,

  headerLogo: {
    width: 20,
    height: 20,
    borderRadius: '50%',
  } satisfies SxProps<Theme>,

  headerTitle: {
    typography: 'subtitle2',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    color: 'text.primary',
  } satisfies SxProps<Theme>,

  headerTitleProduct: {
    color: 'primary.main',
  } satisfies SxProps<Theme>,

  headerTitleSuffix: {
    color: 'text.secondary',
    fontWeight: 400,
  } satisfies SxProps<Theme>,

  headerCenter: {
    display: { xs: 'none', md: 'flex' },
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  } satisfies SxProps<Theme>,

  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  } satisfies SxProps<Theme>,

  contentWrapper: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  } satisfies SxProps<Theme>,

  sidebar: (mobileOpen: boolean) =>
    ({
      width: SIDEBAR_WIDTH,
      maxWidth: '85vw',
      bgcolor: 'background.paper',
      borderRight: 1,
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: { xs: 'auto', lg: '100%' },
      minHeight: { lg: 0 },
      overflow: 'hidden',
      flexShrink: 0,
      position: { xs: 'fixed', lg: 'static' },
      top: { xs: HEADER_HEIGHT, lg: 'auto' },
      left: 0,
      bottom: 0,
      zIndex: (theme) => theme.zIndex.drawer,
      transform: {
        xs: mobileOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_WIDTH}px)`,
        lg: 'none',
      },
      transition: (theme) =>
        theme.transitions.create('transform', {
          duration: theme.transitions.duration.standard,
        }),
    }) satisfies SxProps<Theme>,

  sidebarBackdrop: (mobileOpen: boolean) =>
    ({
      display: { xs: mobileOpen ? 'block' : 'none', lg: 'none' },
      position: 'fixed',
      top: HEADER_HEIGHT,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: (theme) => theme.zIndex.drawer - 1,
      bgcolor: (theme) => alpha(theme.palette.common.black, 0.5),
    }) satisfies SxProps<Theme>,

  sidebarHeader: {
    p: 2,
    borderBottom: 1,
    borderColor: 'divider',
    flexShrink: 0,
  } satisfies SxProps<Theme>,

  sidebarLabel: {
    typography: 'overline',
    color: 'text.secondary',
    mb: 1,
  } satisfies SxProps<Theme>,

  sidebarStats: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    typography: 'body2',
    fontWeight: 500,
    color: 'text.primary',
  } satisfies SxProps<Theme>,

  nav: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    p: 2,
  } satisfies SxProps<Theme>,

  navSectionTitle: {
    px: 1.5,
    py: 1,
    typography: 'overline',
    color: 'text.secondary',
    mt: 2,
    '&:first-of-type': { mt: 0 },
  } satisfies SxProps<Theme>,

  navItem: (active: boolean) =>
    ({
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      px: 1.5,
      py: 1,
      typography: 'body2',
      color: active ? 'text.primary' : 'text.secondary',
      borderRadius: 1,
      textDecoration: 'none',
      borderLeft: active ? 3 : 3,
      borderLeftColor: active ? 'primary.main' : 'transparent',
      bgcolor: active ? 'action.selected' : 'transparent',
      transition: (theme) =>
        theme.transitions.create(['background-color', 'color'], {
          duration: theme.transitions.duration.shortest,
        }),
      '&:hover': {
        color: 'text.primary',
        bgcolor: 'action.hover',
        textDecoration: 'none',
      },
      '& .nav-item-icon': {
        color: active ? 'primary.main' : 'text.secondary',
        fontSize: (theme) => theme.typography.body1.fontSize,
      },
      '&:hover .nav-item-icon': {
        color: 'primary.main',
      },
    }) satisfies SxProps<Theme>,

  sidebarFooter: {
    p: 2,
    borderTop: 1,
    borderColor: 'divider',
    flexShrink: 0,
  } satisfies SxProps<Theme>,

  sidebarVersion: {
    typography: 'code',
    color: 'text.secondary',
    mb: 1.5,
  } satisfies SxProps<Theme>,

  sidebarProgress: {
    bgcolor: 'action.hover',
    border: 1,
    borderColor: 'divider',
    borderRadius: 1,
    p: 1.5,
  } satisfies SxProps<Theme>,

  main: {
    flex: 1,
    overflowY: 'auto',
    minWidth: 0,
    bgcolor: 'background.default',
    height: '100%',
  } satisfies SxProps<Theme>,

  mainInner: {
    width: '100%',
    px: { xs: 3, md: 6 },
    py: 6,
  } satisfies SxProps<Theme>,

  searchInput: {
    width: 256,
    '& .MuiOutlinedInput-root': {
      typography: 'body2',
      bgcolor: 'action.hover',
      pl: 4.5,
      pr: 6,
      '& fieldset': { borderColor: 'divider' },
      '&:hover fieldset': { borderColor: 'divider' },
      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
    },
  } satisfies SxProps<Theme>,

  searchResults: {
    position: 'absolute',
    top: '100%',
    left: 0,
    mt: 1,
    width: '100%',
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
    boxShadow: 4,
    py: 1,
    maxHeight: 320,
    overflowY: 'auto',
    zIndex: (theme) => theme.zIndex.modal,
  } satisfies SxProps<Theme>,

  themePickerMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    mt: 1,
    width: 176,
    bgcolor: 'background.paper',
    border: 1,
    borderColor: 'divider',
    borderRadius: 2,
    boxShadow: 4,
    py: 1,
    zIndex: (theme) => theme.zIndex.modal,
  } satisfies SxProps<Theme>,

  themePickerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    py: 0.75,
    px: 1.5,
    borderRadius: 1,
    bgcolor: 'transparent',
    color: 'text.secondary',
    transition: (theme) =>
      theme.transitions.create('background-color', {
        duration: theme.transitions.duration.shortest,
      }),
    '&:hover': { bgcolor: 'action.hover' },
  } satisfies SxProps<Theme>,

  themePickerBtnIcon: {
    display: 'flex',
    alignItems: 'center',
    fontSize: (theme) => theme.typography.body1.fontSize,
    lineHeight: 1,
  } satisfies SxProps<Theme>,

  themePickerBtnText: {
    typography: 'caption',
    fontWeight: 500,
    color: 'text.primary',
    lineHeight: 1,
  } satisfies SxProps<Theme>,

  themePickerBtnChevron: {
    display: 'flex',
    alignItems: 'center',
    typography: 'caption',
    color: 'text.secondary',
    lineHeight: 1,
  } satisfies SxProps<Theme>,

  themePickerOption: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    py: 1.25,
    px: 2,
    bgcolor: 'transparent',
    color: 'text.primary',
    typography: 'body2',
    textAlign: 'left',
    transition: (theme) =>
      theme.transitions.create('background-color', {
        duration: theme.transitions.duration.shortest,
      }),
    '&:hover': { bgcolor: 'action.hover' },
  } satisfies SxProps<Theme>,

  themePickerOptionName: {
    fontWeight: 500,
  } satisfies SxProps<Theme>,

  themePickerOptionSwatch: (color: string) =>
    ({
      width: 12,
      height: 12,
      borderRadius: '50%',
      bgcolor: color,
      flexShrink: 0,
    }) satisfies SxProps<Theme>,

  iconBtn: {
    width: 32,
    height: 32,
    color: 'text.secondary',
    '&:hover': {
      bgcolor: 'action.hover',
      color: 'text.primary',
    },
  } satisfies SxProps<Theme>,

  /** Shared code/pre block styling for demo pages. */
  codeBlock: {
    typography: 'code',
    m: 0,
    p: 2,
    borderRadius: 1,
    bgcolor: 'background.default',
    overflow: 'auto',
    whiteSpace: 'pre',
  } satisfies SxProps<Theme>,
};
