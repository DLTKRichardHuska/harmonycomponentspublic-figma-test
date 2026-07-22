import { colors } from '../tokens';
import type { HarmonyProduct } from '../tokens';
import type { StatusBadgePalette, StatusBadgeTone } from './themeAugmentation';

export type ColorMode = 'light' | 'dark';

function tone(background: string, foreground: string, border?: string): StatusBadgeTone {
  return border !== undefined ? { background, foreground, border } : { background, foreground };
}

export function mapAlertChipToStatusBadge(): StatusBadgePalette {
  const chip = colors.alertChip;
  return {
    primary: tone(chip.blue.background, chip.blue.foreground),
    success: tone(chip.success.background, chip.success.foreground),
    warning: tone(chip.warning.background, chip.warning.foreground),
    error: tone(chip.error.background, chip.error.foreground),
    info: tone(chip.info.background, chip.info.foreground),
    orange: tone(chip.orange.background, chip.orange.foreground),
    pink: tone(chip.pink.background, chip.pink.foreground),
    disabled: tone(chip.disabled.background, chip.disabled.foreground, chip.disabled.border),
  };
}

/** Maps reference CSS variable names to palette token keys. */
export const HARMONY_COLOR_CSS_VARS: Record<string, string> = {
  link: '--link-color',
  pageBackground: '--page-bg',
  cellBackground: '--surface-bg',
  cardBackground: '--card-bg',
  navBackground: '--nav-bg',
  inputBackground: '--input-bg',
  inputDisabled: '--input-disabled-bg',
  tableTotal: '--table-total-bg',
  border: '--border-color',
  hover: '--hover-bg',
  titleText: '--text-primary',
  secondaryText: '--text-secondary',
  mutedText: '--text-muted',
};

export const COLOR_USAGE: Record<string, string> = {
  link: 'Text links',
  pageBackground: 'Main page background',
  cardBackground: 'Cards, containers',
  navBackground: 'Sidebar, header, navigation',
  inputBackground: 'Input fields',
  inputDisabled: 'Disabled inputs, dimmed cells',
  cellBackground: 'Table cells, content areas',
  tableTotal: 'Table totals, summary rows',
  border: 'Borders, dividers',
  hover: 'Hover states',
  titleText: 'Primary text, titles',
  secondaryText: 'Secondary text, labels',
  mutedText: 'Muted text, placeholders',
};

/** Button inverse text on primary fills — mirrors tokens.css per product × mode. */
const TEXT_INVERSE: Record<HarmonyProduct, Record<ColorMode, string>> = {
  cp: { light: '#FFFFFF', dark: '#1F252E' },
  vp: { light: '#FFFFFF', dark: '#15171A' },
  ppm: { light: '#FFFFFF', dark: '#15171A' },
  maconomy: { light: '#FFFFFF', dark: '#15171A' },
};

export function getTextInverse(product: HarmonyProduct, mode: ColorMode): string {
  return TEXT_INVERSE[product][mode];
}

export function getThemePrimary(product: HarmonyProduct, mode: ColorMode): string {
  return colors.themes[product].primary[mode];
}

export function getThemePrimaryHover(product: HarmonyProduct, mode: ColorMode): string {
  return colors.themes[product].primaryHover[mode];
}

export interface HarmonyPaletteTokens {
  pageBackground: string;
  cardBackground: string;
  navBackground: string;
  inputBackground: string;
  inputDisabled: string;
  cellBackground: string;
  hover: string;
  tableTotal: string;
  titleText: string;
  secondaryText: string;
  mutedText: string;
  border: string;
  link: string;
  themePrimary: string;
  themePrimaryHover: string;
  textInverse: string;
  accent: string;
}

export function getHarmonyPaletteTokens(
  product: HarmonyProduct,
  mode: ColorMode,
): HarmonyPaletteTokens {
  const palette = colors.themes[product].palette[mode];
  return {
    pageBackground: palette.pageBackground,
    cardBackground: palette.cardBackground,
    navBackground: palette.navBackground,
    inputBackground: palette.inputBackground,
    inputDisabled: palette.inputDisabled,
    cellBackground: palette.cellBackground,
    hover: palette.hover,
    tableTotal: palette.tableTotal,
    titleText: palette.titleText,
    secondaryText: palette.secondaryText,
    mutedText: palette.mutedText,
    border: palette.border,
    link: palette.link,
    themePrimary: getThemePrimary(product, mode),
    themePrimaryHover: getThemePrimaryHover(product, mode),
    textInverse: getTextInverse(product, mode),
    accent: colors.accent.accent.value,
  };
}

export interface MuiPaletteScheme {
  palette: {
    mode: ColorMode;
    primary: { main: string; dark: string; contrastText: string };
    secondary: { main: string; contrastText: string };
    pageHeader: { main: string; dark: string; contrastText: string };
    statusBadge: StatusBadgePalette;
    success: { main: string };
    warning: { main: string };
    error: { main: string; contrastText: string };
    info: { main: string };
    background: { default: string; paper: string };
    text: { primary: string; secondary: string; disabled: string };
    divider: string;
    action: { hover: string };
  };
}

function getPageHeaderPalette(mode: ColorMode) {
  const phb = colors.pageHeaderButton;
  return {
    main: phb.primary.default[mode],
    dark: phb.primary.hover[mode],
    contrastText: phb.primary.default.foreground[mode],
  };
}

export function mapColorsToPalette(product: HarmonyProduct, mode: ColorMode): MuiPaletteScheme {
  const tokens = getHarmonyPaletteTokens(product, mode);
  const semantic = colors.semantic;

  return {
    palette: {
      mode,
      primary: {
        main: tokens.themePrimary,
        dark: tokens.themePrimaryHover,
        contrastText: tokens.textInverse,
      },
      secondary: {
        main: tokens.themePrimary,
        contrastText: tokens.themePrimary,
      },
      pageHeader: getPageHeaderPalette(mode),
      statusBadge: mapAlertChipToStatusBadge(),
      success: { main: semantic.success[mode] },
      warning: { main: semantic.warning[mode] },
      error: { main: semantic.error[mode], contrastText: tokens.textInverse },
      info: { main: semantic.info[mode] },
      background: {
        default: tokens.pageBackground,
        paper: tokens.cardBackground,
      },
      text: {
        primary: tokens.titleText,
        secondary: tokens.secondaryText,
        disabled: tokens.mutedText,
      },
      divider: tokens.border,
      action: {
        hover: tokens.hover,
      },
    },
  };
}
