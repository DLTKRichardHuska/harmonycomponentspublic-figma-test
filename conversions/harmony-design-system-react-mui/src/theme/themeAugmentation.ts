export interface StatusBadgeTone {
  background: string;
  foreground: string;
  border?: string;
}

export interface StatusBadgePalette {
  primary: StatusBadgeTone;
  success: StatusBadgeTone;
  warning: StatusBadgeTone;
  error: StatusBadgeTone;
  info: StatusBadgeTone;
  orange: StatusBadgeTone;
  pink: StatusBadgeTone;
  disabled: StatusBadgeTone;
}

export interface DelaTheme {
  gradient: string;
  gradientHover: string;
  contrastText: string;
}

declare module '@mui/material/styles' {
  interface Palette {
    pageHeader: Palette['primary'];
    statusBadge: StatusBadgePalette;
  }

  interface PaletteOptions {
    pageHeader?: PaletteOptions['primary'];
    statusBadge?: Partial<StatusBadgePalette>;
  }

  interface Theme {
    dela: DelaTheme;
  }

  interface ThemeOptions {
    dela?: DelaTheme;
  }

  interface TypographyVariants {
    code: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    code?: React.CSSProperties;
  }

  interface Shape {
    harmony?: Record<string, string>;
  }

  interface ShapeOptions {
    harmony?: Record<string, string>;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    code: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    pageHeader: true;
  }
}

declare module '@mui/material/Radio' {
  interface RadioPropsSizeOverrides {
    large: true;
  }
}

declare module '@mui/material/Checkbox' {
  interface CheckboxPropsSizeOverrides {
    large: true;
  }
}

export {};
