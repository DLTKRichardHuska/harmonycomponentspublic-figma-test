import type { HarmonyProduct } from '@dltkrichardhuska/harmony-design-system-shadcn/theme';

export type ColorMode = 'light' | 'dark';

export interface ColorSwatch {
  key: string;
  name: string;
  usage: string;
  /** Paint with var(--…) from tokens.css */
  cssVar: string;
}

export interface PaletteSectionInfo {
  title: string;
  description: string;
  badge?: string;
}

const PALETTE_KEYS = [
  ['pageBackground', '--page-bg', 'Main page background'],
  ['cellBackground', '--surface-bg', 'Table cells, content areas'],
  ['cardBackground', '--card-bg', 'Cards, containers'],
  ['navBackground', '--nav-bg', 'Sidebar, header, navigation'],
  ['inputBackground', '--input-bg', 'Input fields'],
  ['inputDisabled', '--input-disabled-bg', 'Disabled inputs, dimmed cells'],
  ['tableTotal', '--table-total-bg', 'Table totals, summary rows'],
  ['border', '--border-color', 'Borders, dividers'],
  ['hover', '--hover-bg', 'Hover states'],
  ['titleText', '--text-primary', 'Primary text, titles'],
  ['secondaryText', '--text-secondary', 'Secondary text, labels'],
  ['mutedText', '--text-muted', 'Muted text, placeholders'],
  ['link', '--link-color', 'Text links'],
] as const;

function formatColorName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export function getPaletteSectionInfo(product: HarmonyProduct, mode: ColorMode): PaletteSectionInfo {
  if (mode === 'light') {
    return {
      title: 'Semi-Light Palette',
      description: 'Used by all themes (CP, VP, PPM, Maconomy) in light mode.',
    };
  }
  if (product === 'cp') {
    return {
      title: 'CP Semi-Dark Palette',
      description: 'Used by CP theme in dark mode.',
      badge: 'CP Dark Mode Only',
    };
  }
  return {
    title: 'Dark Mode Palette',
    description: 'Used by VP, PPM, and Maconomy themes in dark mode.',
    badge: 'VP, PPM, Maconomy Dark Mode',
  };
}

export function getModeIndicatorLabel(product: HarmonyProduct, mode: ColorMode): string {
  if (mode === 'light') return 'Showing Semi-Light Colors';
  if (product === 'cp') return 'Showing CP Semi-Dark Colors';
  return 'Showing Dark Mode Colors';
}

export function buildHarmonyPaletteSwatches(): ColorSwatch[] {
  return PALETTE_KEYS.map(([key, cssVar, usage]) => ({
    key,
    name: formatColorName(key),
    usage,
    cssVar,
  }));
}

export function buildSemanticSwatches(): ColorSwatch[] {
  return [
    {
      key: 'success',
      name: 'Success',
      usage: 'Success states, confirmations, positive actions',
      cssVar: '--color-success',
    },
    {
      key: 'warning',
      name: 'Warning',
      usage: 'Warning states, cautions, attention needed',
      cssVar: '--color-warning',
    },
    {
      key: 'error',
      name: 'Error',
      usage: 'Error states, destructive actions',
      cssVar: '--color-error',
    },
    {
      key: 'info',
      name: 'Info',
      usage: 'Informational states, neutral highlights',
      cssVar: '--color-info',
    },
  ];
}

export function buildAccentSwatches(): ColorSwatch[] {
  return [
    {
      key: 'themePrimary',
      name: 'Theme Primary',
      usage: 'Primary brand color, buttons, CTA',
      cssVar: '--theme-primary',
    },
    {
      key: 'accent',
      name: 'Accent',
      usage: 'Secondary accent color',
      cssVar: '--accent-color',
    },
  ];
}

/** Spacing scale keys → CSS variables (values live in tokens.css). */
export const SPACING_SCALE = [
  ['0', '--space-0'],
  ['0.5', '--space-0-5'],
  ['1', '--space-1'],
  ['1.5', '--space-1-5'],
  ['2', '--space-2'],
  ['2.5', '--space-2-5'],
  ['3', '--space-3'],
  ['3.5', '--space-3-5'],
  ['4', '--space-4'],
  ['5', '--space-5'],
  ['6', '--space-6'],
  ['7', '--space-7'],
  ['8', '--space-8'],
  ['9', '--space-9'],
  ['10', '--space-10'],
  ['11', '--space-11'],
  ['12', '--space-12'],
  ['14', '--space-14'],
  ['16', '--space-16'],
  ['20', '--space-20'],
  ['24', '--space-24'],
] as const;

export const BORDER_RADIUS_SCALE = [
  ['radius-04', '--radius-04'],
  ['radius-08', '--radius-08'],
  ['radius-12', '--radius-12'],
  ['radius-16', '--radius-16'],
  ['radius-24', '--radius-24'],
  ['radius-100', '--radius-100'],
] as const;

export const SPACING_PATTERNS = [
  {
    key: 'tight',
    title: 'Tight',
    values: '4px-8px',
    usage: 'Icon + text, compact lists, inline elements',
  },
  {
    key: 'default',
    title: 'Default',
    values: '12px-16px',
    usage: 'Form elements, card content, button groups',
  },
  {
    key: 'relaxed',
    title: 'Relaxed',
    values: '24px-32px',
    usage: 'Section spacing, page sections',
  },
  {
    key: 'loose',
    title: 'Loose',
    values: '48px-64px',
    usage: 'Major sections, hero areas',
  },
] as const;

export const SHADOW_SCALE = [
  {
    key: 'none',
    name: 'None',
    cssClass: 'shadow-none',
    cssVar: '--shadow-none',
    level: 0,
    description: 'No shadow, ground level',
    usage: [] as string[],
  },
  {
    key: 'sm',
    name: 'Sm',
    cssClass: 'shadow-sm',
    cssVar: '--shadow-sm',
    level: 1,
    description: 'Subtle elevation for buttons and small elements',
    usage: ['Buttons', 'Inputs', 'Small cards'],
  },
  {
    key: 'md',
    name: 'Md',
    cssClass: 'shadow-md',
    cssVar: '--shadow-md',
    level: 2,
    description: 'Medium elevation for floating elements, cards, and enhanced alerts',
    usage: ['Floating menus', 'Popovers', 'Cards', 'Enhanced alerts'],
  },
  {
    key: 'lg',
    name: 'Lg',
    cssClass: 'shadow-lg',
    cssVar: '--shadow-lg',
    level: 3,
    description: 'High elevation for prominent elements',
    usage: ['Modals', 'Dialogs', 'Notifications'],
  },
  {
    key: 'xl',
    name: 'Xl',
    cssClass: 'shadow-xl',
    cssVar: '--shadow-xl',
    level: 4,
    description: 'Extra high elevation for overlays',
    usage: ['Full-screen modals', 'Image lightboxes'],
  },
  {
    key: '2xl',
    name: '2xl',
    cssClass: 'shadow-2xl',
    cssVar: '--shadow-2xl',
    level: 5,
    description: 'Maximum elevation for dramatic effect',
    usage: ['Hero images', 'Featured content'],
  },
] as const;

export const ELEVATION_HIERARCHY = [
  { level: 0, name: 'Ground Level', shadowClass: 'shadow-none', cssVar: '--shadow-none', description: 'Page background, no shadow' },
  { level: 1, name: 'Raised', shadowClass: 'shadow-sm', cssVar: '--shadow-sm', description: 'Cards, containers, buttons' },
  { level: 2, name: 'Floating', shadowClass: 'shadow-md', cssVar: '--shadow-md', description: 'Dropdowns, menus, popovers' },
  { level: 3, name: 'Overlay', shadowClass: 'shadow-lg', cssVar: '--shadow-lg', description: 'Modals, dialogs' },
  { level: 4, name: 'Prominent', shadowClass: 'shadow-xl', cssVar: '--shadow-xl', description: 'Focus elements, highlighted content' },
] as const;

/** Type-scale rows for the docs table — samples use Tailwind/CSS vars, not this metadata for paint. */
export const TYPE_STYLE_ROWS = [
  { name: 'Display XL', size: '60px / 3.75rem', weight: 'bold', lineHeight: 'tight', font: 'Lexend', cssClass: 'text-display-xl', tw: 'font-display text-display-xl font-bold leading-tight' },
  { name: 'Display L', size: '48px / 3rem', weight: 'bold', lineHeight: 'tight', font: 'Lexend', cssClass: 'text-display-l', tw: 'font-display text-display-l font-bold leading-tight' },
  { name: 'Display M', size: '36px / 2.25rem', weight: 'bold', lineHeight: 'tight', font: 'Lexend', cssClass: 'text-display-m', tw: 'font-display text-display-m font-bold leading-tight' },
  { name: 'Heading XL', size: '30px / 1.875rem', weight: 'semibold', lineHeight: 'tight', font: 'Lexend', cssClass: 'text-heading-xl', tw: 'font-display text-heading-xl font-semibold leading-tight' },
  { name: 'Heading L', size: '24px / 1.5rem', weight: 'semibold', lineHeight: 'tight', font: 'Lexend', cssClass: 'text-heading-l', tw: 'font-display text-heading-l font-semibold leading-tight' },
  { name: 'Heading M', size: '20px / 1.25rem', weight: 'semibold', lineHeight: 'snug', font: 'Lexend', cssClass: 'text-heading-m', tw: 'font-display text-heading-m font-semibold leading-snug' },
  { name: 'Heading S', size: '18px / 1.125rem', weight: 'medium', lineHeight: 'snug', font: 'Lexend', cssClass: 'text-heading-s', tw: 'font-display text-heading-s font-medium leading-snug' },
  { name: 'Body Default', size: '16px / 1rem', weight: 'normal', lineHeight: 'normal', font: 'Figtree', cssClass: 'text-base', tw: 'font-sans text-base font-normal leading-normal' },
  { name: 'Body Emphasized', size: '16px / 1rem', weight: 'semibold', lineHeight: 'normal', font: 'Figtree', cssClass: 'text-base', tw: 'font-sans text-base font-semibold leading-normal' },
  { name: 'Label', size: '14px / 0.875rem', weight: 'medium', lineHeight: 'normal', font: 'Figtree', cssClass: 'text-label', tw: 'text-label font-medium' },
  { name: 'Caption', size: '12px / 0.75rem', weight: 'normal', lineHeight: 'normal', font: 'Figtree', cssClass: 'text-caption', tw: 'text-caption text-secondary' },
  { name: 'Overline', size: '10px / 0.625rem', weight: 'semibold', lineHeight: 'normal', font: 'Figtree', cssClass: 'text-overline', tw: 'text-overline font-semibold uppercase tracking-wider' },
] as const;
