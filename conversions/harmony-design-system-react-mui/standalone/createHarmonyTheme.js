// src/theme/createHarmonyTheme.ts
import { createTheme } from "@mui/material/styles";

// src/tokens/colors.json
var colors_default = {
  $schema: "https://harmony-ds.com/tokens/colors.schema.json",
  name: "Harmony Design System Colors",
  version: "0.9.0",
  themes: {
    cp: {
      name: "Costpoint",
      primary: {
        light: "#2A78C6",
        dark: "#59ACFF"
      },
      primaryHover: {
        light: "#2268B0",
        dark: "#7BB8FF"
      },
      palette: {
        light: {
          pageBackground: "#E2E4E9",
          cardBackground: "#F7F8FA",
          navBackground: "#FCFDFF",
          inputBackground: "#FFFFFF",
          inputDisabled: "#EAEAEA",
          cellBackground: "#FFFFFF",
          hover: "#E5E7EB",
          tableTotal: "rgba(0, 115, 230, 0.15)",
          titleText: "#373F4E",
          secondaryText: "#525969",
          mutedText: "#6B7280",
          border: "#BFC6D4",
          link: "#005BB3"
        },
        dark: {
          pageBackground: "#1F252E",
          cardBackground: "#37424D",
          navBackground: "#333D47",
          inputBackground: "#1F252E",
          inputDisabled: "#333D47",
          cellBackground: "#212935",
          hover: "#3D4A5C",
          tableTotal: "rgba(89, 172, 255, 0.15)",
          titleText: "#E9ECEF",
          secondaryText: "#B6B6C4",
          mutedText: "#BBBBC6",
          border: "#5F6871",
          link: "#ADD0FF"
        }
      }
    },
    vp: {
      name: "Vantagepoint",
      primary: {
        light: "#2A78C6",
        dark: "#59ACFF"
      },
      primaryHover: {
        light: "#2268B0",
        dark: "#7BB8FF"
      },
      palette: {
        light: {
          pageBackground: "#E2E4E9",
          cardBackground: "#F7F8FA",
          navBackground: "#FCFDFF",
          inputBackground: "#FFFFFF",
          inputDisabled: "#EAEAEA",
          cellBackground: "#FFFFFF",
          hover: "#E5E7EB",
          tableTotal: "rgba(0, 115, 230, 0.15)",
          titleText: "#373F4E",
          secondaryText: "#525969",
          mutedText: "#6B7280",
          border: "#BFC6D4",
          link: "#005BB3"
        },
        dark: {
          pageBackground: "#15171A",
          cardBackground: "#1F2124",
          navBackground: "#1A1C1F",
          inputBackground: "#1F2124",
          inputDisabled: "#2A2D32",
          cellBackground: "#1A1C1F",
          hover: "#2A2D32",
          tableTotal: "rgba(89, 172, 255, 0.15)",
          titleText: "#FAFAFA",
          secondaryText: "#B5B5BC",
          mutedText: "#B5B5BC",
          border: "#2A2D32",
          link: "#ADD0FF"
        }
      }
    },
    ppm: {
      name: "PPM",
      primary: {
        light: "#4C92D9",
        dark: "#59ACFF"
      },
      primaryHover: {
        light: "#3D7BC4",
        dark: "#7BB8FF"
      },
      palette: {
        light: {
          pageBackground: "#E2E4E9",
          cardBackground: "#F7F8FA",
          navBackground: "#FCFDFF",
          inputBackground: "#FFFFFF",
          inputDisabled: "#EAEAEA",
          cellBackground: "#FFFFFF",
          hover: "#E5E7EB",
          tableTotal: "rgba(0, 115, 230, 0.15)",
          titleText: "#373F4E",
          secondaryText: "#525969",
          mutedText: "#6B7280",
          border: "#BFC6D4",
          link: "#005BB3"
        },
        dark: {
          pageBackground: "#15171A",
          cardBackground: "#1F2124",
          navBackground: "#1A1C1F",
          inputBackground: "#1F2124",
          inputDisabled: "#2A2D32",
          cellBackground: "#1A1C1F",
          hover: "#2A2D32",
          tableTotal: "rgba(89, 172, 255, 0.15)",
          titleText: "#FAFAFA",
          secondaryText: "#B5B5BC",
          mutedText: "#B5B5BC",
          border: "#2A2D32",
          link: "#ADD0FF"
        }
      }
    },
    maconomy: {
      name: "Maconomy",
      primary: {
        light: "#4C92D9",
        dark: "#59ACFF"
      },
      primaryHover: {
        light: "#3D7BC4",
        dark: "#7BB8FF"
      },
      palette: {
        light: {
          pageBackground: "#E2E4E9",
          cardBackground: "#F7F8FA",
          navBackground: "#FCFDFF",
          inputBackground: "#FFFFFF",
          inputDisabled: "#EAEAEA",
          cellBackground: "#FFFFFF",
          hover: "#E5E7EB",
          tableTotal: "rgba(0, 115, 230, 0.15)",
          titleText: "#373F4E",
          secondaryText: "#525969",
          mutedText: "#6B7280",
          border: "#BFC6D4",
          link: "#005BB3"
        },
        dark: {
          pageBackground: "#15171A",
          cardBackground: "#1F2124",
          navBackground: "#1A1C1F",
          inputBackground: "#1F2124",
          inputDisabled: "#2A2D32",
          cellBackground: "#1A1C1F",
          hover: "#2A2D32",
          tableTotal: "rgba(89, 172, 255, 0.15)",
          titleText: "#FAFAFA",
          secondaryText: "#B5B5BC",
          mutedText: "#B5B5BC",
          border: "#2A2D32",
          link: "#ADD0FF"
        }
      }
    }
  },
  semantic: {
    success: {
      light: "#17A871",
      dark: "#00E78E",
      description: "Success states, confirmations, positive actions. Values mirror rendered --color-success (light/dark) in tokens.css."
    },
    warning: {
      light: "#FFB020",
      dark: "#F9AF00",
      description: "Warning states, cautions, attention needed. Values mirror rendered --color-warning (light/dark) in tokens.css."
    },
    error: {
      light: "#D83148",
      dark: "#F46286",
      description: "Error states, destructive actions, critical alerts. Values mirror rendered --color-error (light/dark) in tokens.css."
    },
    info: {
      light: "#3366FF",
      dark: "#00ADFD",
      description: "Informational states, neutral highlights. Values mirror rendered --color-info (light/dark) in tokens.css."
    }
  },
  notificationBadge: {
    error: {
      value: "#D83148",
      description: "Notification badge error color (red)"
    },
    primary: {
      description: "Notification badge primary color uses theme primary color"
    }
  },
  alertChip: {
    blue: {
      background: "#C7F2FF",
      foreground: "#205A9E",
      description: "Alert Chip Blue colors"
    },
    error: {
      background: "#FFECEF",
      foreground: "#C1253A",
      description: "Alert Chip Error colors"
    },
    warning: {
      background: "#FFF1BE",
      foreground: "#AD5400",
      description: "Alert Chip Warning colors"
    },
    success: {
      background: "#DBF9A8",
      foreground: "#316D15",
      description: "Alert Chip Success colors"
    },
    info: {
      background: "#D0DFFF",
      foreground: "#454BD4",
      description: "Alert Chip Info colors"
    },
    orange: {
      background: "#FFE2C0",
      foreground: "#6C1F07",
      description: "Alert Chip Orange colors"
    },
    pink: {
      background: "#FFDDF3",
      foreground: "#B82890",
      description: "Alert Chip Pink colors"
    },
    disabled: {
      background: "#E0E4EB",
      foreground: "#94A3B8",
      border: "#BFC6D4",
      description: "Alert Chip Disabled colors"
    }
  },
  accent: {
    acid: {
      value: "#ccff00",
      description: "Highlight, special emphasis"
    },
    accent: {
      value: "#043852",
      description: "Secondary accent color"
    }
  },
  kanban: {
    inProgress: {
      value: "#F5A616",
      description: "Kanban 'In progress' column top border color"
    },
    done: {
      value: "#37B8B5",
      description: "Kanban 'Done' column top border color"
    }
  },
  dark: {
    obsidian: {
      value: "#09090b",
      description: "Primary background"
    },
    charcoal: {
      value: "#18181b",
      description: "Elevated surfaces"
    },
    void: {
      value: "#000000",
      description: "Deepest background level"
    },
    surface: {
      value: "#0a0a0a",
      description: "Primary surface background"
    },
    panel: {
      value: "#111111",
      description: "Elevated panels, cards"
    },
    border: {
      value: "#222222",
      description: "Border color"
    },
    dim: {
      value: "#444444",
      description: "Subtle dividers, disabled states"
    },
    muted: {
      value: "#525252",
      description: "Secondary text, icons"
    },
    text: {
      value: "#e5e5e5",
      description: "Primary text"
    }
  },
  light: {
    white: {
      value: "#ffffff",
      description: "Primary surfaces, cards"
    },
    pageBackground: {
      value: "#EDF0F6",
      description: "Main page background"
    },
    concrete: {
      value: "#f4f4f5",
      description: "Subtle backgrounds"
    },
    slate: {
      "50": "#f8fafc",
      "100": "#f1f5f9",
      "200": "#e2e8f0",
      "300": "#cbd5e1",
      "400": "#94a3b8",
      "500": "#64748b",
      "600": "#475569",
      "700": "#334155",
      "800": "#1e293b",
      "900": "#0f172a",
      "950": "#020617"
    }
  },
  buttonRoleTokens: {
    description: "Component role constants for standard theme buttons. Primary, secondary, and tertiary colors derive from themes.<product>.primary at runtime \u2014 not duplicated here. Maps to --theme-btn-* CSS variables in tokens.css.",
    theme: {
      primary: {
        disabled: {
          background: "#e0e4eb",
          foreground: "#bfc6d4",
          description: "Maps to --theme-btn-primary-disabled-bg / --theme-btn-primary-disabled-fg"
        }
      },
      secondary: {
        hover: {
          background: "#eaeff5",
          description: "Maps to --theme-btn-secondary-hover-bg; foreground/stroke use var(--theme-primary)"
        },
        disabled: {
          foreground: "#e0e4eb",
          description: "Maps to --theme-btn-secondary-disabled-fg"
        }
      },
      tertiary: {
        hover: {
          background: "#eaeff5",
          description: "Maps to --theme-btn-tertiary-hover-bg; foreground uses var(--theme-primary)"
        },
        disabled: {
          foreground: "#bfc6d4",
          description: "Maps to --theme-btn-tertiary-disabled-fg"
        }
      },
      derivedFrom: {
        primaryBackground: "themes.<product>.primary",
        primaryHover: "themes.<product>.primaryHover",
        primaryForeground: "palette.textInverse (--text-inverse)",
        secondaryStroke: "themes.<product>.primary",
        secondaryForeground: "themes.<product>.primary",
        tertiaryForeground: "themes.<product>.primary"
      }
    }
  },
  pageHeaderButton: {
    description: "Fixed page-header button palette \u2014 separate from themes.<product>.primary. Maps to --page-header-btn-* CSS variables.",
    primary: {
      default: {
        light: "#043852",
        dark: "#495057",
        foreground: {
          light: "#FFFFFF",
          dark: "#FFFFFF",
          description: "Page header button primary text color - white for contrast on dark blue"
        },
        description: "Page header button primary default - exact from Figma"
      },
      hover: {
        light: "#03273a",
        dark: "#03273a",
        description: "Page header button primary hover - exact from Figma"
      },
      disabled: {
        background: "#e0e4eb",
        foreground: "#ffffff",
        description: "Page header button primary disabled colors"
      }
    },
    secondary: {
      default: {
        stroke: {
          light: "#043852",
          dark: "#495057",
          description: "Page header button secondary default stroke"
        },
        foreground: {
          light: "#043852",
          dark: "#B6B6C4",
          description: "Page header button secondary default foreground - dark blue for light mode, light gray for dark mode"
        }
      },
      hover: {
        background: {
          light: "#eaeff5",
          dark: "#3D4A5C",
          description: "Page header button secondary hover background"
        },
        foreground: {
          light: "#043852",
          dark: "#E9ECEF",
          description: "Page header button secondary hover foreground - lighter for better contrast on hover"
        },
        stroke: {
          light: "#043852",
          dark: "#E9ECEF",
          description: "Page header button secondary hover stroke - lighter for better contrast"
        },
        description: "Page header button secondary hover colors"
      },
      disabled: {
        foreground: "#e0e4eb",
        description: "Page header button secondary disabled foreground"
      }
    },
    tertiary: {
      default: {
        foreground: {
          light: "#043852",
          dark: "#E9ECEF",
          description: "Page header button tertiary default foreground - dark blue for light mode, light text for dark mode (needs to work on hover background)"
        }
      },
      hover: {
        background: {
          light: "#eaeff5",
          dark: "#3D4A5C",
          description: "Page header button tertiary hover background"
        },
        description: "Page header button tertiary hover background"
      },
      disabled: {
        foreground: "#e0e4eb",
        description: "Page header button tertiary disabled foreground"
      }
    }
  },
  cssUtilities: {
    success: {
      background: "bg-success",
      text: "text-success",
      border: "border-success"
    },
    warning: {
      background: "bg-warning",
      text: "text-warning",
      border: "border-warning"
    },
    error: {
      background: "bg-error",
      text: "text-error",
      border: "border-error"
    },
    info: {
      background: "bg-info",
      text: "text-info",
      border: "border-info"
    },
    theme: {
      background: "bg-theme",
      text: "text-theme",
      border: "border-theme"
    },
    surface: {
      page: "bg-page",
      card: "bg-card",
      surface: "bg-surface",
      elevated: "bg-elevated"
    }
  }
};

// src/tokens/spacing.json
var spacing_default = {
  $schema: "https://harmony-ds.com/tokens/spacing.schema.json",
  name: "Harmony Design System Spacing",
  version: "0.9.0",
  description: "A consistent spacing scale based on a 4px grid system",
  scale: {
    "0": { value: "0px", cssVar: "--space-0" },
    "0.5": { value: "2px", cssVar: "--space-0-5" },
    "1": { value: "4px", cssVar: "--space-1" },
    "1.5": { value: "6px", cssVar: "--space-1-5" },
    "2": { value: "8px", cssVar: "--space-2" },
    "2.5": { value: "10px", cssVar: "--space-2-5" },
    "3": { value: "12px", cssVar: "--space-3" },
    "3.5": { value: "14px", cssVar: "--space-3-5" },
    "4": { value: "16px", cssVar: "--space-4" },
    "5": { value: "20px", cssVar: "--space-5" },
    "6": { value: "24px", cssVar: "--space-6" },
    "7": { value: "28px", cssVar: "--space-7" },
    "8": { value: "32px", cssVar: "--space-8" },
    "9": { value: "36px", cssVar: "--space-9" },
    "10": { value: "40px", cssVar: "--space-10" },
    "11": { value: "44px", cssVar: "--space-11" },
    "12": { value: "48px", cssVar: "--space-12" },
    "14": { value: "56px", cssVar: "--space-14" },
    "16": { value: "64px", cssVar: "--space-16" },
    "20": { value: "80px", cssVar: "--space-20" },
    "24": { value: "96px", cssVar: "--space-24" }
  },
  borderRadius: {
    "radius-04": { value: "4px", cssVar: "--radius-04" },
    "radius-08": { value: "8px", cssVar: "--radius-08" },
    "radius-12": { value: "12px", cssVar: "--radius-12" },
    "radius-16": { value: "16px", cssVar: "--radius-16" },
    "radius-24": { value: "24px", cssVar: "--radius-24" },
    "radius-100": { value: "9999px", cssVar: "--radius-100" }
  },
  patterns: {
    tight: {
      values: ["4px", "8px"],
      cssClasses: ["gap-1", "gap-2"],
      usage: "Icon + text, compact lists, inline elements"
    },
    default: {
      values: ["12px", "16px"],
      cssClasses: ["gap-3", "gap-4"],
      usage: "Form elements, card content, button groups"
    },
    relaxed: {
      values: ["24px", "32px"],
      cssClasses: ["gap-6", "gap-8"],
      usage: "Section spacing, page sections"
    },
    loose: {
      values: ["48px", "64px"],
      cssClasses: ["gap-12", "gap-16"],
      usage: "Major sections, hero areas"
    }
  },
  componentDefaults: {
    button: {
      sm: { px: "12px", py: "6px" },
      md: { px: "16px", py: "8px" },
      lg: { px: "24px", py: "12px" }
    },
    card: {
      sm: { p: "16px" },
      md: { p: "24px" },
      lg: { p: "32px" }
    },
    input: {
      default: { px: "16px", py: "8px" }
    },
    badge: {
      sm: { px: "8px", py: "2px" },
      md: { px: "10px", py: "4px" }
    }
  },
  cssUtilities: {
    padding: {
      prefix: "p-",
      variants: ["p", "px", "py", "pt", "pr", "pb", "pl"]
    },
    margin: {
      prefix: "m-",
      variants: ["m", "mx", "my", "mt", "mr", "mb", "ml"]
    },
    gap: {
      prefix: "gap-",
      variants: ["gap", "gap-x", "gap-y"]
    },
    space: {
      prefix: "space-",
      variants: ["space-x", "space-y"]
    }
  }
};

// src/tokens/elevations.json
var elevations_default = {
  $schema: "https://harmony-ds.com/tokens/elevations.schema.json",
  name: "Harmony Design System Elevations",
  version: "0.9.0",
  description: "A layered shadow system that creates depth and visual hierarchy",
  shadows: {
    none: {
      value: "none",
      css: "none",
      cssVar: "--shadow-none",
      cssClass: "shadow-none",
      level: 0,
      description: "No shadow, ground level"
    },
    sm: {
      value: "0 1px 2px 0 rgb(15 23 42 / 0.05)",
      valueDark: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
      css: "0 1px 2px 0 rgb(15 23 42 / 0.05)",
      cssVar: "--shadow-sm",
      cssClass: "shadow-sm",
      level: 1,
      description: "Subtle elevation for buttons and small elements",
      usage: ["Buttons", "Inputs", "Small cards"]
    },
    md: {
      value: "0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.1)",
      valueDark: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)",
      css: "0 4px 6px -1px rgb(15 23 42 / 0.1), 0 2px 4px -2px rgb(15 23 42 / 0.1)",
      cssVar: "--shadow-md",
      cssClass: "shadow-md",
      level: 2,
      description: "Medium elevation for floating elements, cards, and enhanced alerts",
      usage: ["Floating menus", "Popovers", "Cards", "Enhanced alerts"]
    },
    lg: {
      value: "0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.1)",
      valueDark: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
      css: "0 10px 15px -3px rgb(15 23 42 / 0.1), 0 4px 6px -4px rgb(15 23 42 / 0.1)",
      cssVar: "--shadow-lg",
      cssClass: "shadow-lg",
      level: 3,
      description: "High elevation for prominent elements",
      usage: ["Modals", "Dialogs", "Notifications"]
    },
    xl: {
      value: "0 20px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.1)",
      valueDark: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
      css: "0 20px 25px -5px rgb(15 23 42 / 0.1), 0 8px 10px -6px rgb(15 23 42 / 0.1)",
      cssVar: "--shadow-xl",
      cssClass: "shadow-xl",
      level: 4,
      description: "Extra high elevation for overlays",
      usage: ["Full-screen modals", "Image lightboxes"]
    },
    "2xl": {
      value: "0 30px 35px -8px rgb(15 23 42 / 0.15), 0 12px 15px -7px rgb(15 23 42 / 0.12)",
      valueDark: "0 30px 35px -8px rgba(0, 0, 0, 0.5), 0 12px 15px -7px rgba(0, 0, 0, 0.4)",
      css: "0 30px 35px -8px rgb(15 23 42 / 0.15), 0 12px 15px -7px rgb(15 23 42 / 0.12)",
      cssVar: "--shadow-2xl",
      cssClass: "shadow-2xl",
      level: 5,
      description: "Maximum elevation for dramatic effect",
      usage: ["Hero images", "Featured content"]
    }
  },
  hierarchy: [
    {
      level: 0,
      name: "Ground Level",
      shadow: "none",
      description: "Page background, no shadow"
    },
    {
      level: 1,
      name: "Raised",
      shadow: "shadow-sm",
      description: "Cards, containers, buttons"
    },
    {
      level: 2,
      name: "Floating",
      shadow: "shadow-md",
      description: "Dropdowns, menus, popovers"
    },
    {
      level: 3,
      name: "Overlay",
      shadow: "shadow-lg",
      description: "Modals, dialogs"
    },
    {
      level: 4,
      name: "Prominent",
      shadow: "shadow-xl",
      description: "Focus elements, highlighted content"
    }
  ],
  borders: {
    default: {
      cssClass: "border",
      description: "Standard border for cards and containers"
    },
    strong: {
      cssClass: "border-2",
      description: "Thicker border for emphasis"
    },
    focusRing: {
      css: "0 0 0 3px var(--theme-primary-light)",
      description: "Focus state indicator"
    }
  },
  componentDefaults: {
    button: "shadow-sm",
    card: "shadow-sm",
    cardElevated: "shadow-lg",
    dropdown: "shadow-lg",
    modal: "shadow-xl",
    tooltip: "shadow-md"
  }
};

// src/tokens/typography.json
var typography_default = {
  $schema: "https://harmony-ds.com/tokens/typography.schema.json",
  name: "Harmony Design System Typography",
  version: "0.9.0",
  description: "Typography system with font families, sizes, weights, and line heights",
  fontFamilies: {
    sans: {
      value: ["Figtree", "sans-serif"],
      css: "'Figtree', sans-serif",
      cssVar: "--font-sans",
      description: "Primary body text font",
      googleFonts: "https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap"
    },
    display: {
      value: ["Lexend", "sans-serif"],
      css: "'Lexend', sans-serif",
      cssVar: "--font-display",
      description: "Headings and display text",
      googleFonts: "https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800;900&display=swap"
    },
    mono: {
      value: ["JetBrains Mono", "monospace"],
      css: "'JetBrains Mono', monospace",
      cssVar: "--font-mono",
      description: "Code and technical content",
      googleFonts: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
    }
  },
  fontSizes: {
    xs: {
      value: "0.75rem",
      pixels: "12px",
      cssVar: "--text-xs",
      usage: "Helper text, labels, badges"
    },
    sm: {
      value: "0.875rem",
      pixels: "14px",
      cssVar: "--text-sm",
      usage: "Secondary text, descriptions"
    },
    base: {
      value: "1rem",
      pixels: "16px",
      cssVar: "--text-base",
      usage: "Body text, paragraphs"
    },
    lg: {
      value: "1.125rem",
      pixels: "18px",
      cssVar: "--text-lg",
      usage: "Lead paragraphs, emphasis"
    },
    xl: {
      value: "1.25rem",
      pixels: "20px",
      cssVar: "--text-xl",
      usage: "Section headings"
    },
    "2xl": {
      value: "1.5rem",
      pixels: "24px",
      cssVar: "--text-2xl",
      usage: "Page section titles"
    },
    "3xl": {
      value: "1.875rem",
      pixels: "30px",
      cssVar: "--text-3xl",
      usage: "Major headings"
    },
    "4xl": {
      value: "2.25rem",
      pixels: "36px",
      cssVar: "--text-4xl",
      usage: "Page titles"
    },
    "5xl": {
      value: "3rem",
      pixels: "48px",
      cssVar: "--text-5xl",
      usage: "Hero headings"
    }
  },
  fontWeights: {
    light: {
      value: 300,
      cssVar: "--font-light"
    },
    normal: {
      value: 400,
      cssVar: "--font-normal"
    },
    medium: {
      value: 500,
      cssVar: "--font-medium"
    },
    semibold: {
      value: 600,
      cssVar: "--font-semibold"
    },
    bold: {
      value: 700,
      cssVar: "--font-bold"
    },
    extrabold: {
      value: 800,
      cssVar: "--font-extrabold"
    }
  },
  lineHeights: {
    none: {
      value: 1,
      cssVar: "--leading-none"
    },
    tight: {
      value: 1.25,
      cssVar: "--leading-tight"
    },
    snug: {
      value: 1.375,
      cssVar: "--leading-snug"
    },
    normal: {
      value: 1.5,
      cssVar: "--leading-normal"
    },
    relaxed: {
      value: 1.625,
      cssVar: "--leading-relaxed"
    },
    loose: {
      value: 2,
      cssVar: "--leading-loose"
    }
  },
  letterSpacing: {
    tighter: {
      value: "-0.05em"
    },
    tight: {
      value: "-0.025em"
    },
    normal: {
      value: "0em"
    },
    wide: {
      value: "0.025em"
    },
    wider: {
      value: "0.05em"
    },
    widest: {
      value: "0.1em"
    }
  },
  textStyles: {
    displayXL: {
      fontFamily: "display",
      fontSize: "3.75rem",
      fontWeight: "bold",
      lineHeight: "tight",
      cssClass: "text-display-xl"
    },
    displayL: {
      fontFamily: "display",
      fontSize: "3rem",
      fontWeight: "bold",
      lineHeight: "tight",
      cssClass: "text-display-l"
    },
    displayM: {
      fontFamily: "display",
      fontSize: "2.25rem",
      fontWeight: "bold",
      lineHeight: "tight",
      cssClass: "text-display-m"
    },
    headingXL: {
      fontFamily: "display",
      fontSize: "1.875rem",
      fontWeight: "semibold",
      lineHeight: "snug",
      cssClass: "text-heading-xl"
    },
    headingL: {
      fontFamily: "display",
      fontSize: "1.5rem",
      fontWeight: "semibold",
      lineHeight: "snug",
      cssClass: "text-heading-l"
    },
    headingM: {
      fontFamily: "display",
      fontSize: "1.25rem",
      fontWeight: "semibold",
      lineHeight: "snug",
      cssClass: "text-heading-m"
    },
    headingS: {
      fontFamily: "display",
      fontSize: "1.125rem",
      fontWeight: "medium",
      lineHeight: "snug",
      cssClass: "text-heading-s"
    },
    bodyDefault: {
      fontFamily: "sans",
      fontSize: "1rem",
      fontWeight: "normal",
      lineHeight: "normal",
      cssClass: "text-body-default"
    },
    bodyEmphasized: {
      fontFamily: "sans",
      fontSize: "1rem",
      fontWeight: "semibold",
      lineHeight: "normal",
      cssClass: "text-body-emphasized"
    },
    label: {
      fontFamily: "display",
      fontSize: "0.875rem",
      fontWeight: "normal",
      lineHeight: "normal",
      cssClass: "text-label"
    },
    caption: {
      fontFamily: "sans",
      fontSize: "0.75rem",
      fontWeight: "normal",
      lineHeight: "normal",
      cssClass: "text-caption"
    },
    overline: {
      fontFamily: "sans",
      fontSize: "0.625rem",
      fontWeight: "semibold",
      lineHeight: "normal",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      cssClass: "text-overline"
    }
  },
  componentDefaults: {
    button: {
      fontFamily: "sans",
      fontWeight: "medium"
    },
    input: {
      fontFamily: "sans",
      fontSize: "base"
    },
    label: {
      fontFamily: "sans",
      fontSize: "sm",
      fontWeight: "medium"
    },
    badge: {
      fontFamily: "display",
      fontWeight: "normal"
    }
  }
};

// src/tokens/index.ts
var colors = colors_default;
var spacing = spacing_default;
var elevations = elevations_default;
var typography = typography_default;
var semanticColors = colors.semantic;
var themeColors = colors.themes;
var buttonRoleTokens = colors.buttonRoleTokens;
var pageHeaderButtonTokens = colors.pageHeaderButton;
var spacingScale = spacing.scale;
var spacingPatterns = spacing.patterns;
var borderRadiusScale = spacing.borderRadius;
var shadowScale = elevations.shadows;
var elevationHierarchy = elevations.hierarchy;
var fontFamilies = typography.fontFamilies;
var fontSizes = typography.fontSizes;
var fontWeights = typography.fontWeights;
var textStyles = typography.textStyles;

// src/theme/buttonTokens.ts
var DELA_GRADIENT = "linear-gradient(119deg, #8A33C2 17.59%, #423FE2 77.78%)";
var DELA_GRADIENT_HOVER = "rgba(255, 255, 255, 0.1)";
var buttonRoleTokens2 = colors.buttonRoleTokens.theme;
var harmonyButtonSizes = {
  xs: {
    minHeight: 24,
    paddingX: spacing.componentDefaults.button.sm.px,
    paddingY: spacing.componentDefaults.button.sm.py,
    fontSize: typography.fontSizes.xs.value
  },
  sm: {
    minHeight: 32,
    paddingX: spacing.componentDefaults.button.sm.px,
    paddingY: spacing.componentDefaults.button.sm.py,
    fontSize: typography.fontSizes.sm.value
  },
  md: {
    minHeight: 40,
    paddingX: spacing.componentDefaults.button.md.px,
    paddingY: spacing.componentDefaults.button.md.py,
    fontSize: typography.fontSizes.base.value
  },
  lg: {
    minHeight: 48,
    paddingX: spacing.componentDefaults.button.lg.px,
    paddingY: spacing.componentDefaults.button.lg.py,
    fontSize: typography.fontSizes.lg.value
  }
};
var harmonyIconButtonSizes = {
  sm: { iconSize: 16, padding: 8 },
  md: { iconSize: 20, padding: 10 },
  lg: { iconSize: 24, padding: 12 }
};
function getButtonDisabledColors() {
  return {
    primaryBackground: buttonRoleTokens2.primary.disabled.background,
    primaryForeground: buttonRoleTokens2.primary.disabled.foreground,
    secondaryForeground: buttonRoleTokens2.secondary.disabled.foreground,
    tertiaryForeground: buttonRoleTokens2.tertiary.disabled.foreground,
    secondaryHoverBackground: buttonRoleTokens2.secondary.hover.background,
    tertiaryHoverBackground: buttonRoleTokens2.tertiary.hover.background
  };
}

// src/theme/mapColorsToPalette.ts
function tone(background, foreground, border) {
  return border !== void 0 ? { background, foreground, border } : { background, foreground };
}
function mapAlertChipToStatusBadge() {
  const chip = colors.alertChip;
  return {
    primary: tone(chip.blue.background, chip.blue.foreground),
    success: tone(chip.success.background, chip.success.foreground),
    warning: tone(chip.warning.background, chip.warning.foreground),
    error: tone(chip.error.background, chip.error.foreground),
    info: tone(chip.info.background, chip.info.foreground),
    orange: tone(chip.orange.background, chip.orange.foreground),
    pink: tone(chip.pink.background, chip.pink.foreground),
    disabled: tone(chip.disabled.background, chip.disabled.foreground, chip.disabled.border)
  };
}
var TEXT_INVERSE = {
  cp: { light: "#FFFFFF", dark: "#1F252E" },
  vp: { light: "#FFFFFF", dark: "#15171A" },
  ppm: { light: "#FFFFFF", dark: "#15171A" },
  maconomy: { light: "#FFFFFF", dark: "#15171A" }
};
function getTextInverse(product, mode) {
  return TEXT_INVERSE[product][mode];
}
function getThemePrimary(product, mode) {
  return colors.themes[product].primary[mode];
}
function getThemePrimaryHover(product, mode) {
  return colors.themes[product].primaryHover[mode];
}
function getHarmonyPaletteTokens(product, mode) {
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
    accent: colors.accent.accent.value
  };
}
function getPageHeaderPalette(mode) {
  const phb = colors.pageHeaderButton;
  return {
    main: phb.primary.default[mode],
    dark: phb.primary.hover[mode],
    contrastText: phb.primary.default.foreground[mode]
  };
}
function mapColorsToPalette(product, mode) {
  const tokens = getHarmonyPaletteTokens(product, mode);
  const semantic = colors.semantic;
  return {
    palette: {
      mode,
      primary: {
        main: tokens.themePrimary,
        dark: tokens.themePrimaryHover,
        contrastText: tokens.textInverse
      },
      secondary: {
        main: tokens.themePrimary,
        contrastText: tokens.themePrimary
      },
      pageHeader: getPageHeaderPalette(mode),
      statusBadge: mapAlertChipToStatusBadge(),
      success: { main: semantic.success[mode] },
      warning: { main: semantic.warning[mode] },
      error: { main: semantic.error[mode], contrastText: tokens.textInverse },
      info: { main: semantic.info[mode] },
      background: {
        default: tokens.pageBackground,
        paper: tokens.cardBackground
      },
      text: {
        primary: tokens.titleText,
        secondary: tokens.secondaryText,
        disabled: tokens.mutedText
      },
      divider: tokens.border,
      action: {
        hover: tokens.hover
      }
    }
  };
}

// src/theme/mapTypographyToTheme.ts
function resolveFontFamily(key) {
  return typography.fontFamilies[key].css;
}
function resolveFontWeight(key) {
  return typography.fontWeights[key].value;
}
function resolveLineHeight(key) {
  return typography.lineHeights[key].value;
}
function pxToNumber(value) {
  if (typeof value === "number") return value;
  const numeric = Number.parseFloat(value);
  if (value.endsWith("rem")) return numeric * 16;
  return numeric;
}
function buildVariant(style) {
  const fontFamily = resolveFontFamily(style.fontFamily);
  const fontWeight = resolveFontWeight(style.fontWeight);
  const lineHeight = resolveLineHeight(style.lineHeight);
  return {
    fontFamily,
    fontSize: pxToNumber(style.fontSize),
    fontWeight,
    lineHeight,
    ..."textTransform" in style && style.textTransform ? { textTransform: style.textTransform } : {},
    ..."letterSpacing" in style && style.letterSpacing ? { letterSpacing: style.letterSpacing } : {}
  };
}
var bodyDefault = buildVariant(typography.textStyles.bodyDefault);
function mapTypographyToTheme() {
  return {
    typography: {
      ...bodyDefault,
      fontFamily: typography.fontFamilies.sans.css,
      h1: buildVariant(typography.textStyles.displayXL),
      h2: buildVariant(typography.textStyles.displayL),
      h3: buildVariant(typography.textStyles.displayM),
      h4: buildVariant(typography.textStyles.headingXL),
      h5: buildVariant(typography.textStyles.headingL),
      h6: buildVariant(typography.textStyles.headingM),
      subtitle1: buildVariant(typography.textStyles.headingS),
      subtitle2: buildVariant(typography.textStyles.label),
      body1: bodyDefault,
      body2: buildVariant(typography.textStyles.bodyEmphasized),
      caption: buildVariant(typography.textStyles.caption),
      overline: buildVariant(typography.textStyles.overline),
      button: {
        fontFamily: typography.fontFamilies.sans.css,
        fontWeight: typography.fontWeights.medium.value,
        textTransform: "none"
      },
      code: {
        fontFamily: typography.fontFamilies.mono.css,
        fontSize: pxToNumber(typography.fontSizes.sm.value),
        fontWeight: typography.fontWeights.normal.value,
        lineHeight: resolveLineHeight("normal")
      }
    }
  };
}

// src/theme/mapSpacingToTheme.ts
var HARMONY_SPACING_UNIT = 4;
function parsePx(value) {
  return Number.parseFloat(value);
}
function mapSpacingToTheme() {
  const borderRadius = {};
  for (const [key, entry] of Object.entries(spacing.borderRadius)) {
    borderRadius[key] = entry.value;
  }
  return {
    spacing: HARMONY_SPACING_UNIT,
    shape: {
      borderRadius: parsePx(spacing.borderRadius["radius-08"].value),
      harmony: borderRadius
    },
    harmonySpacing: Object.fromEntries(
      Object.entries(spacing.scale).map(([key, entry]) => [key, entry.value])
    )
  };
}

// src/theme/mapElevationsToTheme.ts
var SHADOW_ORDER = ["none", "sm", "md", "lg", "xl", "2xl"];
function buildShadowArray(mode) {
  const arr = SHADOW_ORDER.map((key) => {
    const shadow = elevations.shadows[key];
    if (key === "none") return "none";
    const value = mode === "dark" && "valueDark" in shadow ? shadow.valueDark : shadow.value;
    return value;
  });
  while (arr.length < 25) {
    arr.push(arr[arr.length - 1] ?? "none");
  }
  return arr;
}
function mapElevationsToTheme() {
  return {
    light: { shadows: buildShadowArray("light") },
    dark: { shadows: buildShadowArray("dark") },
    harmonyShadows: elevations.shadows,
    elevationHierarchy: elevations.hierarchy
  };
}

// src/theme/mapButtonToTheme.ts
function buttonSizeStyles(size) {
  const token = harmonyButtonSizes[size];
  return {
    minHeight: token.minHeight,
    padding: `${token.paddingY} ${token.paddingX}`,
    fontSize: token.fontSize,
    lineHeight: 1.5
  };
}
function iconButtonSizeStyles(size) {
  const token = harmonyIconButtonSizes[size];
  return {
    fontSize: token.iconSize,
    padding: token.padding
  };
}
function mapButtonToTheme(product) {
  void product;
  const disabled = getButtonDisabledColors();
  const phb = colors.pageHeaderButton;
  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: "contained",
        color: "primary",
        size: "medium"
      },
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontWeight: typography.fontWeights.medium.value,
          textTransform: "none",
          boxShadow: "none",
          gap: 8,
          "&:hover": { boxShadow: "none" },
          // Prefer component focus treatment over global MuiButtonBase soft ring.
          "&.Mui-focusVisible": {
            outline: "none",
            outlineOffset: 0,
            boxShadow: "none"
          },
          variants: [
            { props: { size: "small" }, style: buttonSizeStyles("sm") },
            { props: { size: "medium" }, style: buttonSizeStyles("md") },
            { props: { size: "large" }, style: buttonSizeStyles("lg") },
            {
              props: { variant: "outlined", color: "primary" },
              style: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: disabled.secondaryHoverBackground
                },
                "&.Mui-disabled": {
                  backgroundColor: theme.palette.background.paper,
                  color: disabled.secondaryForeground,
                  borderColor: disabled.secondaryForeground,
                  opacity: 0.5
                }
              })
            },
            {
              props: { variant: "contained", color: "primary" },
              style: {
                "&.Mui-disabled": {
                  backgroundColor: disabled.primaryBackground,
                  color: disabled.primaryForeground,
                  opacity: 1
                }
              }
            },
            {
              props: { variant: "text", color: "primary" },
              style: {
                "&:hover": {
                  backgroundColor: disabled.tertiaryHoverBackground
                },
                "&.Mui-disabled": {
                  color: disabled.tertiaryForeground,
                  opacity: 1
                }
              }
            },
            {
              props: { variant: "contained", color: "error" },
              style: {
                "&:hover": {
                  filter: "brightness(0.9)"
                }
              }
            },
            {
              props: { variant: "outlined", color: "pageHeader" },
              style: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.mode === "dark" ? phb.secondary.default.foreground.dark : phb.secondary.default.foreground.light,
                borderColor: theme.palette.mode === "dark" ? phb.secondary.default.stroke.dark : phb.secondary.default.stroke.light,
                "&:hover": {
                  backgroundColor: theme.palette.mode === "dark" ? phb.secondary.hover.background.dark : phb.secondary.hover.background.light,
                  color: theme.palette.mode === "dark" ? phb.secondary.hover.foreground.dark : phb.secondary.hover.foreground.light,
                  borderColor: theme.palette.mode === "dark" ? phb.secondary.hover.stroke.dark : phb.secondary.hover.stroke.light
                },
                "&.Mui-disabled": {
                  backgroundColor: theme.palette.background.paper,
                  color: phb.secondary.disabled.foreground,
                  borderColor: phb.secondary.disabled.foreground,
                  opacity: 1
                }
              })
            },
            {
              props: { variant: "text", color: "pageHeader" },
              style: ({ theme }) => ({
                color: theme.palette.mode === "dark" ? phb.tertiary.default.foreground.dark : phb.tertiary.default.foreground.light,
                "&:hover": {
                  backgroundColor: theme.palette.mode === "dark" ? phb.tertiary.hover.background.dark : phb.tertiary.hover.background.light
                },
                "&.Mui-disabled": {
                  color: phb.tertiary.disabled.foreground,
                  opacity: 1
                }
              })
            },
            {
              props: { variant: "contained", color: "pageHeader" },
              style: {
                "&.Mui-disabled": {
                  backgroundColor: phb.primary.disabled.background,
                  color: phb.primary.disabled.foreground,
                  opacity: 1
                }
              }
            }
          ]
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          "&.Mui-focusVisible": {
            outline: "none",
            outlineOffset: 0,
            boxShadow: "none"
          },
          variants: [
            { props: { size: "small" }, style: iconButtonSizeStyles("sm") },
            { props: { size: "medium" }, style: iconButtonSizeStyles("md") },
            { props: { size: "large" }, style: iconButtonSizeStyles("lg") },
            // `edge` aligns the icon's edge (not the padded box) with the
            // container edge by negating the known per-size padding. This
            // overrides MUI's fixed -12px / -3px edge defaults.
            { props: { size: "small", edge: "start" }, style: { marginLeft: -harmonyIconButtonSizes.sm.padding } },
            { props: { size: "small", edge: "end" }, style: { marginRight: -harmonyIconButtonSizes.sm.padding } },
            { props: { size: "medium", edge: "start" }, style: { marginLeft: -harmonyIconButtonSizes.md.padding } },
            { props: { size: "medium", edge: "end" }, style: { marginRight: -harmonyIconButtonSizes.md.padding } },
            { props: { size: "large", edge: "start" }, style: { marginLeft: -harmonyIconButtonSizes.lg.padding } },
            { props: { size: "large", edge: "end" }, style: { marginRight: -harmonyIconButtonSizes.lg.padding } }
          ]
        }
      }
    }
  };
}

// src/theme/mapButtonBaseToTheme.ts
function softFocusRing() {
  return {
    outline: "none",
    outlineOffset: 0,
    boxShadow: "0 0 0 3px color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent), 0 0 0 4px var(--mui-palette-background-paper)"
  };
}
function mapButtonBaseToTheme(product) {
  void product;
  return {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&.Mui-focusVisible": softFocusRing()
        }
      }
    }
  };
}

// src/theme/mapButtonGroupToTheme.ts
import { buttonGroupClasses } from "@mui/material/ButtonGroup";
var radius08 = spacing.borderRadius["radius-08"].value;
var radius06 = spacing.scale["1.5"].value;
var radiusLg = spacing.borderRadius["radius-08"].value;
var space1 = spacing.scale["1"].value;
var space2 = spacing.scale["2"].value;
var grouped = buttonGroupClasses.grouped;
var first = buttonGroupClasses.firstButton;
var middle = buttonGroupClasses.middleButton;
var last = buttonGroupClasses.lastButton;
var css = {
  primary: "var(--mui-palette-primary-main)",
  primaryHover: "var(--mui-palette-primary-dark)",
  primaryContrast: "var(--mui-palette-primary-contrastText)",
  textPrimary: "var(--mui-palette-text-primary)",
  divider: "var(--mui-palette-divider)",
  paper: "var(--mui-palette-background-paper)",
  actionHover: "var(--mui-palette-action-hover)"
};
function focusRing() {
  return {
    outline: `1px solid ${css.paper}`,
    outlineOffset: 0,
    boxShadow: `0 0 0 3px color-mix(in srgb, ${css.primary} 35%, transparent), 0 0 0 4px ${css.paper}`
  };
}
function iconOnlySquare(size) {
  const dim = harmonyButtonSizes[size].minHeight;
  return {
    padding: 0,
    minWidth: dim,
    width: dim,
    height: dim
  };
}
function mapButtonGroupToTheme(product) {
  const light = getHarmonyPaletteTokens(product, "light");
  const dark = getHarmonyPaletteTokens(product, "dark");
  return {
    MuiButtonGroup: {
      defaultProps: {
        variant: "contained",
        size: "medium",
        orientation: "horizontal",
        disableElevation: true
      },
      styleOverrides: {
        root: ({ theme }) => ({
          display: "inline-flex",
          variants: [
            {
              props: { variant: "contained" },
              style: {
                border: `1px solid ${light.border}`,
                borderRadius: radius08,
                padding: space1,
                backgroundColor: light.inputBackground,
                gap: space2,
                alignItems: "center",
                boxShadow: "none",
                ...theme.applyStyles("dark", {
                  border: `1px solid ${dark.border}`,
                  backgroundColor: dark.inputBackground
                }),
                [`& .${grouped}`]: {
                  minWidth: 0,
                  margin: 0,
                  border: "none",
                  boxShadow: "none",
                  "&:hover": { boxShadow: "none" },
                  "&.Mui-disabled": {
                    opacity: 0.5,
                    pointerEvents: "none"
                  }
                },
                // Selected segment — keep primary colors when disabled (opacity only)
                [`& .${grouped}.MuiButton-contained`]: {
                  backgroundColor: css.primary,
                  color: css.primaryContrast,
                  border: "none",
                  "&:hover": {
                    backgroundColor: css.primaryHover
                  },
                  "&:focus-visible": focusRing(),
                  "&.Mui-disabled": {
                    backgroundColor: css.primary,
                    color: css.primaryContrast,
                    opacity: 0.5
                  }
                },
                // Unselected segment inside segmented shell
                [`& .${grouped}.MuiButton-outlined, & .${grouped}.MuiButton-text`]: {
                  backgroundColor: light.inputBackground,
                  color: css.primary,
                  border: "none",
                  ...theme.applyStyles("dark", {
                    backgroundColor: dark.inputBackground
                  }),
                  "&:hover": {
                    backgroundColor: `color-mix(in srgb, ${css.primary} 8%, transparent)`,
                    border: "none"
                  },
                  "&:focus-visible": focusRing(),
                  "&.Mui-disabled": {
                    backgroundColor: light.inputBackground,
                    color: css.primary,
                    opacity: 0.5,
                    ...theme.applyStyles("dark", {
                      backgroundColor: dark.inputBackground
                    })
                  }
                },
                // Icon-only: direct HarmonyIcon / SvgIcon child (not startIcon)
                [`& .${grouped}.MuiButton-root:has(> .MuiSvgIcon-root:only-child)`]: {
                  ...iconOnlySquare("md")
                },
                [`& .${grouped}.MuiIconButton-root`]: {
                  padding: 0
                }
              }
            },
            {
              props: { variant: "contained", size: "small" },
              style: {
                [`& .${grouped}.MuiButton-root:has(> .MuiSvgIcon-root:only-child)`]: iconOnlySquare("sm")
              }
            },
            {
              props: { variant: "contained", size: "medium" },
              style: {
                [`& .${grouped}.MuiButton-root:has(> .MuiSvgIcon-root:only-child)`]: iconOnlySquare("md")
              }
            },
            {
              props: { variant: "contained", size: "large" },
              style: {
                [`& .${grouped}.MuiButton-root:has(> .MuiSvgIcon-root:only-child)`]: iconOnlySquare("lg")
              }
            },
            {
              props: { variant: "contained", orientation: "horizontal" },
              style: {
                flexDirection: "row",
                [`& .${first}, & .${middle}`]: {
                  borderRight: "none"
                },
                [`& .${last}, & .${middle}`]: {
                  marginLeft: 0
                },
                [`& .${first}.MuiButton-contained`]: {
                  borderRadius: `${radius08} ${radius06} ${radius06} ${radius08}`
                },
                [`& .${middle}.MuiButton-contained`]: {
                  borderRadius: radius06
                },
                [`& .${last}.MuiButton-contained`]: {
                  borderRadius: `${radius06} ${radius08} ${radius08} ${radius06}`
                },
                [`& .${first}:not(.MuiButton-contained)`]: {
                  borderRadius: `${radius08} 0 0 ${radius08}`
                },
                [`& .${middle}:not(.MuiButton-contained)`]: {
                  borderRadius: 0
                },
                [`& .${last}:not(.MuiButton-contained)`]: {
                  borderRadius: `0 ${radius08} ${radius08} 0`
                }
              }
            },
            {
              props: { variant: "contained", orientation: "vertical" },
              style: {
                flexDirection: "column",
                gap: 0,
                [`& .${grouped}`]: {
                  width: "100%"
                },
                [`& .${first}, & .${middle}`]: {
                  borderBottom: "none"
                },
                [`& .${last}, & .${middle}`]: {
                  marginTop: 0
                },
                [`& .${first}.MuiButton-contained`]: {
                  borderRadius: `${radius08} ${radius08} ${radius06} ${radius06}`
                },
                [`& .${middle}.MuiButton-contained`]: {
                  borderRadius: radius06
                },
                [`& .${last}.MuiButton-contained`]: {
                  borderRadius: `${radius06} ${radius06} ${radius08} ${radius08}`
                },
                [`& .${first}:not(.MuiButton-contained)`]: {
                  borderRadius: `${radius08} ${radius08} 0 0`
                },
                [`& .${middle}:not(.MuiButton-contained)`]: {
                  borderRadius: 0
                },
                [`& .${last}:not(.MuiButton-contained)`]: {
                  borderRadius: `0 0 ${radius08} ${radius08}`
                }
              }
            },
            {
              props: { variant: "outlined" },
              style: {
                border: "none",
                padding: 0,
                backgroundColor: "transparent",
                boxShadow: "none",
                gap: 0,
                [`& .${grouped}`]: {
                  borderRadius: 0
                },
                // Harmony outline strip: transparent fill + text-primary labels
                [`& .${grouped}.MuiButton-outlined, & .${grouped}.MuiButton-text, & .${grouped}.MuiButton-contained`]: {
                  backgroundColor: "transparent",
                  color: css.textPrimary,
                  borderColor: css.divider,
                  "&:hover": {
                    backgroundColor: css.actionHover,
                    borderColor: css.divider
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "transparent",
                    color: css.textPrimary,
                    borderColor: css.divider,
                    opacity: 0.5
                  }
                },
                [`& .${first}`]: {
                  borderTopLeftRadius: radiusLg,
                  borderBottomLeftRadius: radiusLg
                },
                [`& .${last}`]: {
                  borderTopRightRadius: radiusLg,
                  borderBottomRightRadius: radiusLg
                },
                [`&.${buttonGroupClasses.vertical} .${first}`]: {
                  borderTopLeftRadius: radiusLg,
                  borderTopRightRadius: radiusLg,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0
                },
                [`&.${buttonGroupClasses.vertical} .${last}`]: {
                  borderBottomLeftRadius: radiusLg,
                  borderBottomRightRadius: radiusLg,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0
                }
              }
            },
            {
              props: { variant: "outlined", orientation: "horizontal" },
              style: {
                [`& .${first}, & .${middle}`]: {
                  borderRightColor: "transparent",
                  "&:hover": {
                    borderRightColor: "transparent"
                  }
                },
                [`& .${last}, & .${middle}`]: {
                  marginLeft: -1
                }
              }
            },
            {
              props: { variant: "outlined", orientation: "vertical" },
              style: {
                [`& .${first}, & .${middle}`]: {
                  borderBottomColor: "transparent",
                  "&:hover": {
                    borderBottomColor: "transparent"
                  }
                },
                [`& .${last}, & .${middle}`]: {
                  marginTop: -1
                }
              }
            }
          ],
          "@media (max-width: 768px)": {
            [`&.${buttonGroupClasses.horizontal}`]: {
              flexDirection: "column",
              width: "100%"
            },
            [`&.${buttonGroupClasses.horizontal}.${buttonGroupClasses.contained}`]: {
              gap: space2,
              [`& .${grouped}`]: {
                width: "100%",
                marginLeft: 0,
                borderRadius: radiusLg
              }
            },
            [`&.${buttonGroupClasses.horizontal}.${buttonGroupClasses.outlined}`]: {
              gap: space2,
              [`& .${grouped}`]: {
                width: "100%",
                marginLeft: 0,
                borderRadius: radiusLg,
                borderRightColor: css.divider
              },
              [`& .${first}, & .${last}, & .${middle}`]: {
                borderRadius: radiusLg
              }
            }
          }
        })
      }
    }
  };
}

// src/theme/mapAlertToTheme.ts
import { alpha } from "@mui/material/styles";
var severityBorderAlpha = {
  info: 0.3,
  success: 0.3,
  warning: 0.2,
  error: 0.2
};
function standardSeverityStyle(theme, severity) {
  const main = theme.palette[severity].main;
  return {
    backgroundColor: alpha(main, 0.1),
    border: `1px solid ${alpha(main, severityBorderAlpha[severity])}`,
    color: theme.palette.text.primary,
    "& .MuiAlert-icon": {
      color: main
    }
  };
}
function enhancedSeverityStyle(theme, severity) {
  const main = theme.palette[severity].main;
  const shadow = theme.palette.mode === "dark" ? elevations.shadows.md.valueDark : elevations.shadows.md.value;
  return {
    backgroundColor: theme.palette.background.paper,
    border: "none",
    borderLeft: `8px solid ${main}`,
    borderRadius: "8px",
    boxShadow: shadow,
    color: theme.palette.text.primary,
    padding: "12px",
    "& .MuiAlert-icon": {
      color: main,
      fontSize: "20px",
      marginRight: "8px",
      padding: 0,
      opacity: 1
    },
    "& .MuiAlert-message": {
      padding: 0,
      overflow: "visible"
    },
    "& .MuiAlert-action": {
      paddingTop: 0,
      marginRight: 0,
      alignItems: "flex-start"
    }
  };
}
var displayFont = typography.fontFamilies.display.css;
var semibold = typography.fontWeights.semibold.value;
var medium = typography.fontWeights.medium.value;
function mapAlertToTheme(product) {
  void product;
  const severities = ["info", "success", "warning", "error"];
  const standardVariants = severities.map((severity) => ({
    props: { variant: "standard", severity },
    style: ({ theme }) => standardSeverityStyle(theme, severity)
  }));
  const outlinedVariants = severities.map((severity) => ({
    props: { variant: "outlined", severity },
    style: ({ theme }) => enhancedSeverityStyle(theme, severity)
  }));
  return {
    MuiAlert: {
      defaultProps: {
        variant: "standard"
      },
      styleOverrides: {
        root: {
          alignItems: "flex-start",
          borderRadius: "8px",
          gap: "12px",
          padding: "16px",
          fontSize: typography.textStyles.bodyDefault.fontSize,
          "& .MuiLink-root": {
            fontSize: typography.textStyles.caption.fontSize,
            fontWeight: typography.fontWeights.normal.value,
            lineHeight: "16px"
          },
          variants: [
            ...standardVariants,
            ...outlinedVariants,
            {
              props: { variant: "standard" },
              style: {
                "& .MuiAlert-message": {
                  fontSize: typography.textStyles.bodyDefault.fontSize,
                  color: "var(--mui-palette-text-secondary)"
                }
              }
            },
            {
              props: { variant: "outlined" },
              style: {
                "& .MuiAlert-message": {
                  fontSize: "13px",
                  lineHeight: "18px",
                  color: "var(--mui-palette-text-primary)"
                },
                "& .MuiAlert-message > .MuiStack-root": {
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "16px",
                  width: "100%"
                },
                "& .MuiAlert-message .MuiButton-root": {
                  minHeight: 24,
                  fontSize: 12,
                  lineHeight: 1.5,
                  paddingTop: 2,
                  paddingBottom: 2,
                  paddingLeft: 8,
                  paddingRight: 8
                }
              }
            }
          ]
        },
        icon: {
          fontSize: typography.textStyles.headingS.fontSize,
          marginRight: 0,
          padding: 0,
          opacity: 1
        },
        message: {
          padding: 0,
          flex: "1 1 auto"
        },
        action: {
          marginRight: 0,
          paddingTop: 0,
          alignItems: "flex-start"
        }
      }
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontFamily: displayFont,
          fontWeight: semibold,
          marginBottom: "4px",
          marginTop: 0,
          ".MuiAlert-outlined &": {
            fontSize: typography.textStyles.bodyDefault.fontSize,
            fontWeight: medium,
            lineHeight: "20px"
          },
          ".MuiAlert-standard &": {
            fontSize: typography.textStyles.bodyDefault.fontSize,
            fontWeight: semibold,
            color: "var(--mui-palette-text-primary)"
          }
        }
      }
    }
  };
}

// src/theme/mapLinkToTheme.ts
function linkColorForMode(product, mode) {
  return colors.themes[product].palette[mode].link;
}
function mutedColorForMode(product, mode) {
  return colors.themes[product].palette[mode].mutedText;
}
function mapLinkToTheme(product) {
  const normal = typography.fontWeights.normal.value;
  const externalIconGap = spacing.scale["1"].value;
  return {
    MuiLink: {
      defaultProps: {
        underline: "hover",
        variant: "subtitle2"
      },
      styleOverrides: {
        root: {
          fontWeight: normal,
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline"
          },
          "& [data-icon]": {
            display: "inline-flex",
            verticalAlign: "middle",
            marginLeft: externalIconGap
          },
          variants: [
            {
              props: { color: "primary" },
              style: ({ theme }) => ({
                color: linkColorForMode(product, theme.palette.mode)
              })
            },
            {
              props: { color: "textSecondary" },
              style: ({ theme }) => ({
                color: mutedColorForMode(product, theme.palette.mode),
                "&:hover": {
                  color: theme.palette.text.primary
                }
              })
            }
          ]
        }
      }
    }
  };
}

// src/theme/mapProgressBarToTheme.ts
var defaultHeight = spacing.scale["2"].value;
function barColorStyle(theme, color) {
  return {
    "& .MuiLinearProgress-bar": {
      backgroundColor: theme.palette[color].main
    }
  };
}
function mapProgressBarToTheme(product) {
  void product;
  const colorVariants = ["primary", "success", "warning", "error"];
  return {
    MuiLinearProgress: {
      defaultProps: {
        variant: "determinate",
        color: "primary"
      },
      styleOverrides: {
        root: {
          width: "100%",
          height: defaultHeight,
          borderRadius: 9999,
          overflow: "hidden",
          backgroundColor: "var(--mui-palette-divider)",
          variants: colorVariants.map((color) => ({
            props: { color },
            style: ({ theme }) => barColorStyle(theme, color)
          }))
        },
        bar: {
          borderRadius: 9999,
          transition: "width 300ms ease"
        }
      }
    }
  };
}

// src/theme/mapSpinnerToTheme.ts
var defaultSize = Number.parseInt(spacing.scale["6"].value, 10);
function mapSpinnerToTheme(product) {
  void product;
  return {
    MuiCircularProgress: {
      defaultProps: {
        variant: "indeterminate",
        color: "primary",
        size: defaultSize,
        enableTrackSlot: true,
        thickness: 3.5
      },
      styleOverrides: {
        root: {
          display: "inline-flex"
        },
        track: {
          color: "var(--mui-palette-divider)",
          opacity: 1
        }
      }
    }
  };
}

// src/theme/mapAvatarToTheme.ts
var sizeMd = spacing.scale["8"].value;
var radiusMd = spacing.borderRadius["radius-08"].value;
var fontSemibold = typography.fontWeights.semibold.value;
function mapAvatarToTheme(product) {
  void product;
  return {
    MuiAvatar: {
      defaultProps: {
        variant: "rounded"
      },
      styleOverrides: {
        root: {
          width: sizeMd,
          height: sizeMd,
          fontFamily: typography.fontFamilies.sans.css,
          fontWeight: fontSemibold,
          fontSize: typography.fontSizes.xs.value,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          backgroundColor: "var(--mui-palette-primary-main)",
          // Reference `.avatar` uses white glyphs in light and dark (not primary.contrastText).
          color: "#FFFFFF",
          transition: "background-color 150ms ease",
          "& .MuiSvgIcon-root, & svg": {
            color: "inherit"
          },
          // Interactive composite: ButtonBase wraps Avatar (MUI Avatar-upload pattern).
          ".MuiButtonBase-root:hover:not(.Mui-disabled) > &": {
            backgroundColor: "var(--mui-palette-primary-dark)"
          },
          // Disabled interactive Avatar ~50% opacity (reference button.avatar:disabled)
          ".MuiButtonBase-root.Mui-disabled > &": {
            opacity: 0.5
          }
        },
        rounded: {
          borderRadius: radiusMd
        },
        img: {
          objectFit: "cover"
        }
      }
    }
  };
}

// src/theme/mapChipToTheme.ts
var alertChipDisabled = colors.alertChip.disabled;
var radius04 = spacing.borderRadius["radius-04"].value;
function chipSizeStyles(size) {
  if (size === "sm") {
    return {
      height: spacing.scale["4"].value,
      fontSize: "0.625rem",
      lineHeight: spacing.scale["4"].value,
      padding: `${spacing.scale["1"].value} ${spacing.scale["2"].value}`,
      "& .MuiChip-icon": {
        width: spacing.scale["3"].value,
        height: spacing.scale["3"].value,
        marginLeft: spacing.scale["1"].value,
        marginRight: `-${spacing.scale["0.5"].value}`
      },
      "& .MuiChip-deleteIcon": {
        width: spacing.scale["3"].value,
        height: spacing.scale["3"].value,
        marginRight: spacing.scale["1"].value,
        marginLeft: `-${spacing.scale["0.5"].value}`
      }
    };
  }
  return {
    height: spacing.scale["6"].value,
    fontSize: typography.fontSizes.sm.value,
    lineHeight: spacing.scale["5"].value,
    padding: `${spacing.scale["1"].value} ${spacing.scale["2"].value}`,
    "& .MuiChip-icon": {
      width: spacing.scale["4"].value,
      height: spacing.scale["4"].value,
      marginLeft: spacing.scale["1"].value,
      marginRight: `-${spacing.scale["0.5"].value}`
    },
    "& .MuiChip-deleteIcon": {
      width: spacing.scale["4"].value,
      height: spacing.scale["4"].value,
      marginRight: spacing.scale["1"].value,
      marginLeft: `-${spacing.scale["0.5"].value}`
    }
  };
}
function mapChipToTheme(product) {
  void product;
  return {
    MuiChip: {
      defaultProps: {
        variant: "filled",
        color: "primary",
        size: "medium"
      },
      styleOverrides: {
        root: {
          fontFamily: typography.fontFamilies.sans.css,
          fontWeight: typography.fontWeights.normal.value,
          borderRadius: radius04,
          gap: spacing.scale["1"].value,
          transition: "all 150ms ease",
          "&.MuiChip-filledPrimary": {
            backgroundColor: "var(--mui-palette-primary-main)",
            borderColor: "var(--mui-palette-primary-main)",
            color: "#FFFFFF"
          },
          "&.MuiChip-outlinedPrimary": {
            backgroundColor: "transparent",
            borderColor: "var(--mui-palette-primary-main)",
            color: "var(--mui-palette-primary-main)"
          },
          "&.MuiChip-clickable": {
            cursor: "pointer",
            "&.MuiChip-filledPrimary": {
              "&:hover": {
                backgroundColor: "var(--mui-palette-primary-dark)",
                borderColor: "var(--mui-palette-primary-dark)"
              },
              "&:focus-visible": {
                outline: "1px solid var(--mui-palette-background-paper)",
                outlineOffset: 0,
                boxShadow: "0 0 0 2px var(--mui-palette-primary-main)"
              },
              "&:active": {
                backgroundColor: "var(--mui-palette-primary-main)",
                borderColor: "var(--mui-palette-primary-main)"
              }
            },
            "&.MuiChip-outlinedPrimary": {
              "&:hover": {
                backgroundColor: "var(--mui-palette-action-hover)"
              },
              "&:focus-visible": {
                backgroundColor: "var(--mui-palette-action-hover)",
                outline: "1px solid var(--mui-palette-background-paper)",
                outlineOffset: 0,
                boxShadow: "0 0 0 2px var(--mui-palette-primary-main)"
              },
              "&:active": {
                backgroundColor: "var(--mui-palette-primary-main)",
                borderColor: "var(--mui-palette-primary-main)",
                color: "#FFFFFF"
              }
            }
          },
          "&.Mui-disabled": {
            opacity: 1,
            "&.MuiChip-filled": {
              backgroundColor: alertChipDisabled.background,
              borderColor: alertChipDisabled.background,
              color: alertChipDisabled.foreground
            },
            "&.MuiChip-outlined": {
              backgroundColor: "transparent",
              borderColor: alertChipDisabled.border,
              color: alertChipDisabled.foreground
            }
          },
          variants: [
            {
              props: { size: "small" },
              style: chipSizeStyles("sm")
            },
            {
              props: { size: "medium" },
              style: chipSizeStyles("md")
            }
          ]
        },
        label: {
          padding: 0
        },
        icon: {
          color: "inherit"
        },
        deleteIcon: {
          color: "inherit",
          "&:hover": {
            color: "inherit",
            opacity: 0.8
          }
        }
      }
    }
  };
}

// src/theme/mapNotificationBadgeToTheme.ts
var dotSizes = {
  sm: "6px",
  md: "10px",
  lg: "15px"
};
var notificationError = colors.notificationBadge.error.value;
function mapNotificationBadgeToTheme(product) {
  void product;
  return {
    MuiBadge: {
      styleOverrides: {
        badge: ({ theme }) => ({
          fontFamily: typography.fontFamilies.sans.css,
          fontWeight: typography.fontWeights.medium.value,
          fontSize: "10px",
          color: "#FFFFFF",
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          "&.MuiBadge-colorPrimary": {
            backgroundColor: theme.palette.primary.main
          },
          "&.MuiBadge-colorError": {
            backgroundColor: notificationError
          },
          "&.MuiBadge-dot": {
            minWidth: dotSizes.sm,
            width: dotSizes.sm,
            height: dotSizes.sm,
            padding: 0,
            borderRadius: "50%",
            aspectRatio: "1 / 1",
            lineHeight: 0
          },
          "&:not(.MuiBadge-dot)": {
            lineHeight: 0,
            minHeight: "15px",
            minWidth: dotSizes.lg,
            padding: "0 4px",
            borderRadius: spacing.borderRadius["radius-100"].value
          }
        })
      }
    }
  };
}

// src/theme/mapTooltipToTheme.ts
var gap = spacing.scale["2"].value;
var padY = spacing.scale["2"].value;
var padX = spacing.scale["3"].value;
var radiusMd2 = spacing.scale["1.5"].value;
function mapTooltipToTheme(product) {
  void product;
  return {
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        placement: "top",
        enterDelay: 0,
        leaveDelay: 0,
        enterTouchDelay: 0
      },
      styleOverrides: {
        tooltip: {
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: typography.fontSizes.xs.value,
          fontWeight: typography.fontWeights.normal.value,
          lineHeight: 1.4,
          padding: `${padY} ${padX}`,
          borderRadius: radiusMd2,
          whiteSpace: "nowrap",
          maxWidth: "none",
          boxShadow: "none",
          // CSS vars so light/dark colorSchemes invert correctly
          backgroundColor: "var(--mui-palette-text-primary)",
          color: "var(--mui-palette-primary-contrastText)"
        },
        arrow: {
          color: "var(--mui-palette-text-primary)"
        },
        tooltipPlacementTop: {
          marginBottom: `${gap} !important`
        },
        tooltipPlacementBottom: {
          marginTop: `${gap} !important`
        },
        tooltipPlacementLeft: {
          marginRight: `${gap} !important`
        },
        tooltipPlacementRight: {
          marginLeft: `${gap} !important`
        }
      }
    }
  };
}

// src/theme/mapCardToTheme.ts
var radiusXl = spacing.borderRadius["radius-12"].value;
var space12 = spacing.scale["1"].value;
var space22 = spacing.scale["2"].value;
var space4 = spacing.scale["4"].value;
var space5 = spacing.scale["5"].value;
var space6 = spacing.scale["6"].value;
var shadowSmLight = elevations.shadows.sm.value;
var shadowSmDark = elevations.shadows.sm.valueDark;
var shadowLgLight = elevations.shadows.lg.value;
var shadowLgDark = elevations.shadows.lg.valueDark;
function mapCardToTheme(product) {
  void product;
  return {
    MuiCard: {
      defaultProps: {
        variant: "outlined"
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: "var(--mui-palette-background-paper)",
          borderColor: "var(--mui-palette-divider)",
          borderRadius: radiusXl,
          overflow: "hidden",
          boxShadow: shadowSmLight,
          transition: "border-color 150ms ease, box-shadow 150ms ease",
          ...theme.applyStyles("dark", {
            boxShadow: shadowSmDark
          }),
          variants: [
            {
              props: { raised: true },
              style: {
                boxShadow: shadowLgLight,
                ...theme.applyStyles("dark", {
                  boxShadow: shadowLgDark
                })
              }
            }
          ],
          // Interactive: CardActionArea inside Card — match .card--interactive:hover
          "&:has(.MuiCardActionArea-root:hover), &:has(.MuiCardActionArea-root.Mui-focusVisible)": {
            borderColor: "var(--mui-palette-primary-main)",
            boxShadow: shadowLgLight,
            ...theme.applyStyles("dark", {
              boxShadow: shadowLgDark
            })
          }
        })
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: `${space4} ${space4} 0 ${space4}`,
          alignItems: "flex-start"
        },
        content: {
          display: "flex",
          flexDirection: "column",
          gap: space12
        },
        title: {
          fontFamily: typography.fontFamilies.display.css,
          fontSize: typography.textStyles.headingS.fontSize,
          fontWeight: typography.fontWeights.normal.value,
          lineHeight: space6,
          color: "var(--mui-palette-text-primary)"
        },
        subheader: {
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: typography.fontSizes.sm.value,
          fontWeight: typography.fontWeights.normal.value,
          lineHeight: space5,
          color: "var(--mui-palette-text-secondary)"
        },
        action: {
          margin: 0,
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: space22
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: space4,
          "&:last-child": {
            paddingBottom: space4
          },
          // Harmony card body uses text-sm (14px); body1 alone is 16px
          "& > .MuiTypography-body1": {
            fontSize: typography.fontSizes.sm.value,
            fontWeight: typography.fontWeights.normal.value,
            lineHeight: space5
          }
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: space4,
          borderTop: "1px solid var(--mui-palette-divider)",
          backgroundColor: "var(--mui-palette-background-paper)"
        }
      }
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          transition: "inherit",
          "&:hover .MuiCardActionArea-focusHighlight": {
            opacity: 0
          }
        },
        focusHighlight: {
          // Suppress default MUI grey wash — Harmony uses border/shadow only
          backgroundColor: "transparent"
        }
      }
    }
  };
}

// src/theme/mapDialogToTheme.ts
var radiusXl2 = spacing.borderRadius["radius-12"].value;
var space13 = spacing.scale["1"].value;
var space23 = spacing.scale["2"].value;
var space3 = spacing.scale["3"].value;
var space42 = spacing.scale["4"].value;
var space62 = spacing.scale["6"].value;
var space8 = spacing.scale["8"].value;
var space10 = spacing.scale["10"].value;
var space20 = spacing.scale["20"].value;
var shadowXlLight = elevations.shadows.xl.value;
var shadowXlDark = elevations.shadows.xl.valueDark;
var dialogMinWidth = "600px";
var dialogMaxWidth = "700px";
var dialogWidth = "90%";
var dialogMaxHeight = "90vh";
var dialogBodyMaxHeight = "600px";
var footerBtnMinWidth = `calc(${space20} + ${space10})`;
function mapDialogToTheme(product) {
  void product;
  return {
    MuiDialog: {
      defaultProps: {
        fullWidth: true,
        maxWidth: false,
        scroll: "paper"
      },
      styleOverrides: {
        paper: ({ theme }) => ({
          display: "flex",
          flexDirection: "column",
          minWidth: dialogMinWidth,
          maxWidth: dialogMaxWidth,
          width: dialogWidth,
          maxHeight: dialogMaxHeight,
          overflow: "hidden",
          borderRadius: radiusXl2,
          backgroundColor: "var(--mui-palette-background-paper)",
          boxShadow: shadowXlLight,
          ...theme.applyStyles("dark", {
            boxShadow: shadowXlDark
          }),
          [theme.breakpoints.down("md")]: {
            width: `calc(100vw - ${space8})`,
            maxWidth: "100%",
            margin: space42,
            maxHeight: `calc(100vh - ${space8})`,
            minWidth: 0
          }
        })
      }
    },
    MuiDialogTitle: {
      defaultProps: {
        component: "h2"
      },
      styleOverrides: {
        root: ({ theme }) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: space3,
          flexShrink: 0,
          margin: 0,
          padding: `${space42} ${space62}`,
          borderBottom: "1px solid var(--mui-palette-divider)",
          backgroundColor: "var(--mui-palette-background-paper)",
          fontFamily: typography.fontFamilies.display.css,
          fontSize: typography.fontSizes.lg.value,
          fontWeight: typography.fontWeights.semibold.value,
          lineHeight: 1.4,
          color: "var(--mui-palette-text-primary)",
          [theme.breakpoints.down("md")]: {
            padding: `${space3} ${space42}`
          },
          "& .MuiIconButton-root": {
            color: "var(--mui-palette-text-disabled)",
            marginRight: `calc(-1 * ${space13})`,
            "&:hover": {
              color: "var(--mui-palette-text-primary)",
              backgroundColor: "transparent"
            }
          }
        })
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          flex: "1 1 auto",
          minHeight: 0,
          maxHeight: dialogBodyMaxHeight,
          padding: space62,
          overflowY: "auto",
          color: "var(--mui-palette-text-secondary)",
          [theme.breakpoints.down("md")]: {
            padding: space42
          },
          // MUI adds top padding when following DialogTitle; keep Harmony even spacing
          "&:first-of-type": {
            paddingTop: space62,
            [theme.breakpoints.down("md")]: {
              paddingTop: space42
            }
          }
        })
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          flexShrink: 0,
          justifyContent: "flex-start",
          gap: space3,
          margin: 0,
          padding: `${space42} ${space62}`,
          borderTop: "1px solid var(--mui-palette-divider)",
          // Harmony `--elevated-bg` matches card/paper in current tokens
          backgroundColor: "var(--mui-palette-background-paper)",
          [theme.breakpoints.down("md")]: {
            padding: `${space3} ${space42}`,
            flexWrap: "wrap",
            gap: space23,
            "& .MuiButton-root": {
              flex: 1,
              minWidth: footerBtnMinWidth
            }
          },
          "& > :not(style) ~ :not(style)": {
            marginLeft: 0
          }
        })
      }
    }
  };
}

// src/theme/mapCheckboxToTheme.ts
var selectionIconPx = {
  small: 16,
  medium: 22,
  large: 26
};
var selectionControlPadding = 4;
function mapCheckboxToTheme(product) {
  void product;
  return {
    MuiCheckbox: {
      defaultProps: {
        color: "primary",
        size: "medium"
      },
      styleOverrides: {
        root: {
          padding: selectionControlPadding,
          // Harmony unchecked face uses border color (not MUI action gray)
          color: "var(--mui-palette-divider)",
          "&.Mui-checked": {
            color: "var(--mui-palette-primary-main)"
          },
          // Keep MUI default :hover / ripple — do not override hover opacity
          // Disabled: border face + 50% opacity (Harmony) — beat MUI color* + action.disabled
          "&.Mui-disabled, &.MuiCheckbox-colorPrimary.Mui-disabled, &.MuiCheckbox-colorSecondary.Mui-disabled": {
            opacity: 0.5,
            color: "var(--mui-palette-divider)"
          },
          "&.Mui-disabled.Mui-checked, &.MuiCheckbox-colorPrimary.Mui-disabled.Mui-checked": {
            color: "var(--mui-palette-primary-main)"
          },
          variants: [
            {
              props: { size: "small" },
              style: {
                "& .MuiSvgIcon-root": {
                  fontSize: selectionIconPx.small
                }
              }
            },
            {
              props: { size: "medium" },
              style: {
                "& .MuiSvgIcon-root": {
                  fontSize: selectionIconPx.medium
                }
              }
            },
            {
              props: { size: "large" },
              style: {
                "& .MuiSvgIcon-root": {
                  fontSize: selectionIconPx.large
                }
              }
            }
          ]
        }
      }
    }
  };
}

// src/theme/mapRadioToTheme.ts
var selectionIconPx2 = {
  small: 16,
  medium: 22,
  large: 26
};
var selectionControlPadding2 = 4;
function mapRadioToTheme(product) {
  void product;
  return {
    MuiRadio: {
      defaultProps: {
        color: "primary",
        size: "medium"
      },
      styleOverrides: {
        root: {
          padding: selectionControlPadding2,
          // Harmony unchecked face uses border color (not MUI action gray)
          color: "var(--mui-palette-divider)",
          "&.Mui-checked": {
            color: "var(--mui-palette-primary-main)"
          },
          // Keep MUI default :hover / ripple — do not override hover opacity
          // Disabled: border face + 50% opacity (Harmony) — beat MUI color* + action.disabled
          "&.Mui-disabled, &.MuiRadio-colorPrimary.Mui-disabled, &.MuiRadio-colorSecondary.Mui-disabled": {
            opacity: 0.5,
            color: "var(--mui-palette-divider)"
          },
          "&.Mui-disabled.Mui-checked, &.MuiRadio-colorPrimary.Mui-disabled.Mui-checked": {
            color: "var(--mui-palette-primary-main)"
          },
          variants: [
            {
              props: { size: "small" },
              style: {
                "& .MuiSvgIcon-root": {
                  fontSize: selectionIconPx2.small
                }
              }
            },
            {
              props: { size: "medium" },
              style: {
                "& .MuiSvgIcon-root": {
                  fontSize: selectionIconPx2.medium
                }
              }
            },
            {
              props: { size: "large" },
              style: {
                "& .MuiSvgIcon-root": {
                  fontSize: selectionIconPx2.large
                }
              }
            }
          ]
        }
      }
    }
  };
}

// src/theme/mapSelectionControlChromeToTheme.ts
var gap2 = spacing.scale["2"].value;
var gap1 = spacing.scale["1"].value;
var textSm = typography.fontSizes.sm.value;
var weightSemibold = typography.fontWeights.semibold.value;
function mapSelectionControlChromeToTheme(product) {
  void product;
  return {
    MuiFormControl: {
      styleOverrides: {
        root: ({ ownerState }) => {
          const errorMain = "var(--mui-palette-error-main)";
          const warningMain = "var(--mui-palette-warning-main)";
          const primaryMain = "var(--mui-palette-primary-main)";
          const controlSelectors = "& .MuiCheckbox-root, & .MuiRadio-root";
          if (ownerState.error) {
            return {
              [controlSelectors]: {
                color: errorMain,
                "&.Mui-checked": {
                  color: primaryMain,
                  // Harmony checked+error: primary face + 2px error outer ring
                  "& .MuiSvgIcon-root": {
                    borderRadius: 2,
                    boxShadow: `0 0 0 2px ${errorMain}`
                  }
                },
                // Keep border/error face + 50% opacity — not MUI action.disabled
                "&.Mui-disabled": {
                  opacity: 0.5,
                  color: errorMain
                },
                "&.Mui-disabled.Mui-checked": {
                  color: primaryMain
                }
              },
              "& .MuiFormHelperText-root .MuiSvgIcon-root": {
                color: errorMain
              }
            };
          }
          if (ownerState.color === "warning") {
            return {
              [controlSelectors]: {
                color: warningMain,
                "&.Mui-checked": {
                  color: primaryMain,
                  // Harmony checked+warning: primary face + 1px warning outer ring
                  "& .MuiSvgIcon-root": {
                    borderRadius: 2,
                    boxShadow: `0 0 0 1px ${warningMain}`
                  }
                },
                "&.Mui-disabled": {
                  opacity: 0.5,
                  color: warningMain
                },
                "&.Mui-disabled.Mui-checked": {
                  color: primaryMain
                }
              },
              "& .MuiFormHelperText-root .MuiSvgIcon-root": {
                color: warningMain
              }
            };
          }
          return {};
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
          gap: gap2,
          alignItems: "center",
          // Radio size → label type scale (Harmony radio--sm / --lg)
          "&:has(.MuiRadio-sizeSmall) .MuiFormControlLabel-label": {
            fontSize: typography.fontSizes.xs.value
          },
          "&:has(.MuiRadio-sizeLarge) .MuiFormControlLabel-label": {
            fontSize: typography.fontSizes.base.value
          }
        },
        label: {
          fontSize: textSm,
          fontWeight: typography.fontWeights.normal.value,
          lineHeight: spacing.scale["5"].value,
          color: "var(--mui-palette-text-primary)"
        }
      }
    },
    MuiFormGroup: {
      styleOverrides: {
        root: {
          gap: gap2,
          alignItems: "flex-start"
        },
        row: {
          gap: spacing.scale["4"].value,
          flexWrap: "wrap"
        }
      }
    },
    MuiRadioGroup: {
      styleOverrides: {
        root: {
          gap: gap2,
          alignItems: "flex-start"
        },
        row: {
          gap: spacing.scale["6"].value,
          flexWrap: "wrap"
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: textSm,
          fontWeight: weightSemibold,
          lineHeight: spacing.scale["5"].value,
          color: "var(--mui-palette-text-primary)",
          marginBottom: gap2,
          [`&.Mui-error`]: {
            color: "var(--mui-palette-error-main)"
          },
          [`&.MuiFormLabel-colorWarning`]: {
            color: "var(--mui-palette-warning-main)"
          }
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          display: "inline-flex",
          alignItems: "center",
          gap: gap1,
          marginTop: gap1,
          marginLeft: 0,
          fontSize: textSm,
          lineHeight: spacing.scale["5"].value,
          color: "var(--mui-palette-text-secondary)",
          // Harmony Input errorMessage uses error red; Checkbox/Radio helpers inherit the same.
          [`&.Mui-error`]: {
            color: "var(--mui-palette-error-main)"
          }
        }
      }
    }
  };
}

// src/theme/mapTextFieldToTheme.ts
var INPUT_HEIGHT_CP = "20px";
function softFocusRing2(colorVar) {
  return {
    outline: "none",
    borderColor: colorVar,
    boxShadow: `0 0 0 3px color-mix(in srgb, ${colorVar} 10%, transparent), 0 0 0 4px var(--mui-palette-background-paper)`
  };
}
function fieldMetricsForProduct(product) {
  if (product === "cp") {
    return {
      height: INPUT_HEIGHT_CP,
      padX: spacing.scale["2"].value,
      padYTextarea: spacing.scale["2"].value,
      fontSize: typography.fontSizes.xs.value,
      radius: spacing.borderRadius["radius-04"].value,
      textareaMinHeight: "60px",
      adornmentPad: spacing.scale["1"].value,
      // 14 + 2*3 = 20 → fits the compact 20px field.
      iconSizePx: 14,
      iconPadPx: 3
    };
  }
  return {
    height: spacing.scale["10"].value,
    padX: spacing.scale["4"].value,
    padYTextarea: spacing.scale["3"].value,
    fontSize: typography.fontSizes.base.value,
    radius: spacing.borderRadius["radius-08"].value,
    textareaMinHeight: "100px",
    adornmentPad: spacing.scale["2"].value,
    // 18 + 2*7 = 32 → sits within the 40px field with breathing room.
    iconSizePx: 18,
    iconPadPx: 7
  };
}
function mapTextFieldToTheme(product) {
  const light = getHarmonyPaletteTokens(product, "light");
  const dark = getHarmonyPaletteTokens(product, "dark");
  const metrics = fieldMetricsForProduct(product);
  const iconFontSize = `${metrics.iconSizePx}px`;
  const iconPad = `${metrics.iconPadPx}px`;
  const edgeInset = iconPad;
  return {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "medium"
      }
    },
    MuiOutlinedInput: {
      defaultProps: {
        notched: false
      },
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: metrics.fontSize,
          color: "var(--mui-palette-text-primary)",
          backgroundColor: light.inputBackground,
          borderRadius: metrics.radius,
          transition: "border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease",
          // Single-line density: CP 20px (`--input-height-cp`); others 40px (`--space-10`).
          "&:not(.MuiInputBase-multiline)": {
            height: metrics.height,
            minHeight: metrics.height
          },
          ...theme.applyStyles("dark", {
            backgroundColor: dark.inputBackground
          }),
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-divider)",
            borderWidth: 1
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-divider)"
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1
          },
          "&.Mui-focused": softFocusRing2("var(--mui-palette-primary-main)"),
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-error-main)"
          },
          "&.Mui-error.Mui-focused": softFocusRing2("var(--mui-palette-error-main)"),
          "&.Mui-disabled": {
            backgroundColor: light.inputDisabled,
            color: "var(--mui-palette-text-disabled)",
            ...theme.applyStyles("dark", {
              backgroundColor: dark.inputDisabled
            }),
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--mui-palette-divider)"
            }
          }
        }),
        input: {
          height: "100%",
          boxSizing: "border-box",
          padding: `0 ${metrics.padX}`,
          fontSize: metrics.fontSize,
          lineHeight: 1.25,
          "&::placeholder": {
            color: "var(--mui-palette-text-disabled)",
            opacity: 1
          },
          "&.MuiInputBase-inputMultiline": {
            height: "auto",
            lineHeight: 1.5,
            minHeight: metrics.textareaMinHeight,
            padding: `${metrics.padYTextarea} ${metrics.padX}`
          },
          "&[type=number]": {
            MozAppearance: "textfield",
            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
              margin: 0
            }
          }
        },
        adornedStart: {
          paddingLeft: metrics.adornmentPad
        },
        adornedEnd: {
          paddingRight: metrics.adornmentPad
        }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: "var(--mui-palette-text-disabled)",
          margin: 0,
          height: "100%",
          maxHeight: "100%",
          alignItems: "center",
          "& .MuiSvgIcon-root": {
            fontSize: iconFontSize
          },
          "& .MuiIconButton-root": {
            color: "var(--mui-palette-text-secondary)",
            fontSize: iconFontSize,
            padding: iconPad,
            margin: 0
          },
          // `edge` aligns the icon edge with the field content edge by negating
          // the (known) padding around the icon.
          "& .MuiIconButton-edgeStart": {
            marginLeft: `-${edgeInset}`
          },
          "& .MuiIconButton-edgeEnd": {
            marginRight: `-${edgeInset}`
          }
        }
      }
    }
  };
}

// src/theme/mapFormLabelToTheme.ts
var textSm2 = typography.fontSizes.sm.value;
var gap15 = spacing.scale["1.5"].value;
function mapFormLabelToTheme(product) {
  void product;
  const labelRoot = {
    fontFamily: typography.fontFamilies.display.css,
    fontSize: textSm2,
    fontWeight: typography.fontWeights.normal.value,
    lineHeight: spacing.scale["5"].value,
    color: "var(--mui-palette-text-primary)",
    marginBottom: gap15,
    "&.Mui-focused": {
      color: "var(--mui-palette-text-primary)"
    },
    "&.Mui-error": {
      color: "var(--mui-palette-text-primary)"
    },
    "&.Mui-disabled": {
      color: "var(--mui-palette-text-disabled)"
    },
    "&.Mui-required:not(.MuiFormLabel-asterisk) .MuiFormLabel-asterisk, & .MuiFormLabel-asterisk": {
      color: "var(--mui-palette-error-main)"
    }
  };
  return {
    MuiFormLabel: {
      styleOverrides: {
        root: labelRoot,
        asterisk: {
          color: "var(--mui-palette-error-main)"
        }
      }
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true
      },
      styleOverrides: {
        root: {
          ...labelRoot,
          position: "relative",
          transform: "none",
          transition: "none"
        },
        shrink: {
          transform: "none"
        },
        outlined: {
          transform: "none",
          "&.MuiInputLabel-shrink": {
            transform: "none"
          }
        },
        asterisk: {
          color: "var(--mui-palette-error-main)"
        }
      }
    }
  };
}

// src/theme/mapSliderToTheme.ts
var thumbSize = spacing.scale["5"].value;
var trackHeight = "6px";
function mapSliderToTheme(product) {
  void product;
  return {
    MuiSlider: {
      defaultProps: {
        color: "primary",
        size: "medium"
      },
      styleOverrides: {
        root: {
          height: thumbSize,
          padding: `${spacing.scale["1.5"].value} 0`,
          "&.Mui-disabled": {
            opacity: 0.5
          }
        },
        rail: {
          height: trackHeight,
          borderRadius: 9999,
          backgroundColor: "var(--mui-palette-divider)",
          opacity: 1
        },
        // Reference fill (min → thumb) uses theme primary; remainder stays border/divider.
        track: {
          height: trackHeight,
          borderRadius: 9999,
          border: "none",
          backgroundColor: "var(--mui-palette-primary-main)"
        },
        thumb: {
          width: thumbSize,
          height: thumbSize,
          backgroundColor: "var(--mui-palette-primary-main)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
          "&:hover, &.Mui-focusVisible": {
            boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
            outline: "none"
          },
          "&.Mui-active": {
            boxShadow: "0 1px 2px rgba(0,0,0,0.12)"
          }
        }
      }
    }
  };
}

// src/theme/mapDatePickersToTheme.ts
function mapDatePickersToTheme(product) {
  const compact = product === "cp";
  const light = getHarmonyPaletteTokens(product, "light");
  const dark = getHarmonyPaletteTokens(product, "dark");
  const fieldHeight = compact ? "20px" : spacing.scale["10"].value;
  const fieldFontSize = compact ? typography.fontSizes.xs.value : typography.fontSizes.base.value;
  const fieldRadius = compact ? spacing.borderRadius["radius-04"].value : spacing.borderRadius["radius-08"].value;
  const fieldPadX = compact ? spacing.scale["2"].value : spacing.scale["4"].value;
  const daySize = spacing.scale["9"].value;
  const pickerWidth = 310;
  const pickerDefaultProps = {
    slotProps: {
      textField: {
        variant: "outlined",
        fullWidth: true
      }
    }
  };
  return {
    MuiDatePicker: {
      defaultProps: pickerDefaultProps
    },
    MuiTimePicker: {
      defaultProps: pickerDefaultProps
    },
    MuiDateTimePicker: {
      defaultProps: pickerDefaultProps
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          height: fieldHeight,
          minHeight: fieldHeight,
          padding: 0,
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: fieldFontSize,
          color: "var(--mui-palette-text-primary)",
          backgroundColor: light.inputBackground,
          borderRadius: fieldRadius,
          transition: "border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease",
          ...theme.applyStyles("dark", {
            backgroundColor: dark.inputBackground
          }),
          "& .MuiPickersInputBase-sectionsContainer": {
            height: "100%",
            padding: `0 ${fieldPadX}`,
            alignItems: "center",
            fontSize: fieldFontSize,
            lineHeight: 1.25
          },
          '&:has(input[value=""]) [role="spinbutton"]': {
            color: "var(--mui-palette-text-disabled)"
          },
          "& .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-divider)",
            borderWidth: 1
          },
          "&:hover .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-divider)"
          },
          "&.Mui-focused": {
            outline: "none",
            borderColor: "var(--mui-palette-primary-main)",
            boxShadow: "0 0 0 3px color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent), 0 0 0 4px var(--mui-palette-background-paper)"
          },
          "&.Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-primary-main)",
            borderWidth: 1
          },
          "&.Mui-disabled": {
            color: "var(--mui-palette-text-disabled)",
            backgroundColor: light.inputDisabled,
            ...theme.applyStyles("dark", {
              backgroundColor: dark.inputDisabled
            }),
            "& .MuiPickersOutlinedInput-notchedOutline": {
              borderColor: "var(--mui-palette-divider)"
            }
          },
          "& .MuiIconButton-root": {
            width: fieldHeight,
            height: fieldHeight,
            padding: compact ? spacing.scale["0.5"].value : spacing.scale["1"].value,
            color: "var(--mui-palette-text-secondary)"
          },
          "& .MuiSvgIcon-root": {
            fontSize: compact ? "14px" : "18px"
          }
        })
      }
    },
    MuiPickerPopper: {
      styleOverrides: {
        paper: {
          color: "var(--mui-palette-text-primary)",
          backgroundColor: "var(--mui-palette-background-paper)",
          border: "1px solid var(--mui-palette-divider)",
          borderRadius: compact ? spacing.borderRadius["radius-04"].value : spacing.borderRadius["radius-08"].value,
          boxShadow: "var(--mui-shadows-12)"
        }
      }
    },
    MuiPickersLayout: {
      styleOverrides: {
        root: {
          color: "var(--mui-palette-text-primary)",
          backgroundColor: "var(--mui-palette-background-paper)",
          minWidth: pickerWidth
        },
        actionBar: {
          borderTop: "1px solid var(--mui-palette-divider)"
        }
      }
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          width: pickerWidth,
          color: "var(--mui-palette-text-primary)",
          backgroundColor: "var(--mui-palette-background-paper)"
        }
      }
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          paddingInline: spacing.scale["4"].value
        },
        label: {
          fontFamily: typography.fontFamilies.display.css,
          fontSize: typography.fontSizes.base.value,
          fontWeight: typography.fontWeights.semibold.value
        },
        switchViewButton: {
          color: "var(--mui-palette-text-secondary)"
        }
      }
    },
    MuiPickerDay: {
      styleOverrides: {
        root: {
          width: daySize,
          height: daySize,
          margin: spacing.scale["0.5"].value,
          borderRadius: spacing.borderRadius["radius-04"].value,
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: typography.fontSizes.sm.value,
          color: "var(--mui-palette-text-primary)",
          "&:hover": {
            backgroundColor: "var(--mui-palette-action-hover)"
          },
          "&.Mui-selected": {
            color: "var(--mui-palette-primary-contrastText)",
            backgroundColor: "var(--mui-palette-primary-main)",
            fontWeight: typography.fontWeights.semibold.value,
            "&:hover, &:focus": {
              backgroundColor: "var(--mui-palette-primary-dark)"
            }
          },
          "&.MuiPickerDay-today": {
            color: "var(--mui-palette-text-primary)",
            backgroundColor: "transparent",
            border: "1px solid var(--mui-palette-primary-main)",
            fontWeight: typography.fontWeights.semibold.value,
            "&:focus, &.Mui-focusVisible": {
              color: "var(--mui-palette-text-primary)",
              backgroundColor: "transparent",
              border: "1px solid var(--mui-palette-primary-main)"
            },
            "&:hover": {
              color: "var(--mui-palette-text-primary)",
              backgroundColor: "var(--mui-palette-action-hover)",
              border: "1px solid var(--mui-palette-primary-main)"
            }
          },
          "&.Mui-selected.MuiPickerDay-today": {
            color: "var(--mui-palette-primary-contrastText)",
            backgroundColor: "var(--mui-palette-primary-main)",
            border: "1px solid var(--mui-palette-primary-main)",
            "&:hover, &:focus, &.Mui-focusVisible": {
              color: "var(--mui-palette-primary-contrastText)",
              backgroundColor: "var(--mui-palette-primary-dark)"
            }
          },
          "&.Mui-disabled": {
            color: "var(--mui-palette-text-disabled)",
            opacity: 0.4
          }
        }
      }
    },
    MuiMonthCalendar: {
      styleOverrides: {
        root: {
          width: pickerWidth
        }
      }
    },
    MuiYearCalendar: {
      styleOverrides: {
        root: {
          width: pickerWidth
        }
      }
    },
    MuiTimeClock: {
      styleOverrides: {
        root: {
          color: "var(--mui-palette-text-primary)",
          backgroundColor: "var(--mui-palette-background-paper)"
        }
      }
    },
    MuiDigitalClock: {
      styleOverrides: {
        root: {
          color: "var(--mui-palette-text-primary)",
          backgroundColor: "var(--mui-palette-background-paper)",
          borderColor: "var(--mui-palette-divider)"
        },
        item: {
          "&.Mui-selected": {
            color: "var(--mui-palette-primary-contrastText)",
            backgroundColor: "var(--mui-palette-primary-main)"
          }
        }
      }
    }
  };
}

// src/theme/mapSwitchToTheme.ts
var trackMdW = spacing.scale["11"].value;
var trackMdH = spacing.scale["6"].value;
var thumbMd = spacing.scale["5"].value;
var trackSmW = spacing.scale["9"].value;
var trackSmH = spacing.scale["5"].value;
var thumbSm = spacing.scale["4"].value;
var pad = spacing.scale["0.5"].value;
var shadowSm = elevations.shadows.sm.value;
function softFocusRing3() {
  return {
    outline: "none",
    boxShadow: `0 0 0 3px color-mix(in srgb, var(--mui-palette-primary-main) 10%, transparent), 0 0 0 4px var(--mui-palette-background-paper)`
  };
}
function mapSwitchToTheme(product) {
  void product;
  return {
    MuiSwitch: {
      defaultProps: {
        color: "primary",
        size: "medium"
      },
      styleOverrides: {
        root: {
          width: trackMdW,
          height: trackMdH,
          padding: 0,
          overflow: "visible",
          variants: [
            {
              props: { size: "small" },
              style: {
                width: trackSmW,
                height: trackSmH,
                "& .MuiSwitch-switchBase": {
                  padding: pad,
                  "&.Mui-checked": {
                    transform: `translateX(calc(${trackSmW} - ${thumbSm} - ${pad} * 2))`
                  }
                },
                "& .MuiSwitch-thumb": {
                  width: thumbSm,
                  height: thumbSm
                }
              }
            }
          ]
        },
        switchBase: {
          padding: pad,
          color: "#fff",
          "&.Mui-checked": {
            transform: `translateX(calc(${trackMdW} - ${thumbMd} - ${pad} * 2))`,
            color: "#fff",
            "& + .MuiSwitch-track": {
              backgroundColor: "var(--mui-palette-primary-main)",
              opacity: 1
            }
          },
          "&.Mui-focusVisible + .MuiSwitch-track, &:focus-visible + .MuiSwitch-track": softFocusRing3(),
          "&.Mui-disabled": {
            color: "#fff",
            "& + .MuiSwitch-track": {
              opacity: 0.5
            }
          },
          "&.Mui-disabled.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "var(--mui-palette-primary-main)",
            opacity: 0.5
          }
        },
        thumb: {
          width: thumbMd,
          height: thumbMd,
          boxShadow: shadowSm,
          backgroundColor: "#fff"
        },
        track: {
          borderRadius: spacing.borderRadius["radius-100"].value,
          backgroundColor: "var(--mui-palette-divider)",
          opacity: 1,
          transition: "background-color 150ms ease"
        }
      }
    }
  };
}

// src/theme/mapSelectToTheme.ts
var INPUT_HEIGHT_CP2 = "20px";
function softFocusRing4(colorVar) {
  return {
    outline: "none",
    borderColor: colorVar,
    boxShadow: `0 0 0 3px color-mix(in srgb, ${colorVar} 10%, transparent), 0 0 0 4px var(--mui-palette-background-paper)`
  };
}
function selectMetricsForProduct(product) {
  if (product === "cp") {
    return {
      height: INPUT_HEIGHT_CP2,
      padX: spacing.scale["2"].value,
      fontSize: typography.fontSizes.xs.value,
      radius: spacing.borderRadius["radius-04"].value,
      menuMaxHeight: "300px",
      minWidth: "180px"
    };
  }
  return {
    height: spacing.scale["10"].value,
    padX: spacing.scale["4"].value,
    fontSize: typography.fontSizes.base.value,
    radius: spacing.borderRadius["radius-08"].value,
    menuMaxHeight: "300px",
    minWidth: "200px"
  };
}
function mapSelectToTheme(product) {
  const light = getHarmonyPaletteTokens(product, "light");
  const metrics = selectMetricsForProduct(product);
  const shadowLg = elevations.shadows.lg.value;
  return {
    MuiSelect: {
      defaultProps: {
        variant: "outlined",
        displayEmpty: true,
        // Harmony Dropdown is an anchored list — no modal screen dim.
        MenuProps: {
          slotProps: {
            backdrop: {
              invisible: true
            }
          }
        }
      },
      styleOverrides: {
        root: {
          minWidth: metrics.minWidth,
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: metrics.fontSize,
          color: "var(--mui-palette-text-primary)",
          backgroundColor: light.inputBackground,
          borderRadius: metrics.radius,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-divider)"
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-divider)"
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
            ...softFocusRing4("var(--mui-palette-primary-main)")
          },
          "&.Mui-disabled": {
            opacity: 0.5
          }
        },
        select: {
          minHeight: metrics.height,
          height: metrics.height,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: metrics.padX,
          paddingRight: `calc(${metrics.padX} + 1.5rem)`,
          lineHeight: 1.2
        },
        icon: {
          color: "var(--mui-palette-text-secondary)",
          right: metrics.padX
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          maxHeight: metrics.menuMaxHeight,
          border: "1px solid var(--mui-palette-divider)",
          borderRadius: metrics.radius,
          boxShadow: shadowLg,
          marginTop: spacing.scale["1"].value
        },
        list: {
          paddingTop: spacing.scale["1"].value,
          paddingBottom: spacing.scale["1"].value
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: typography.fontSizes.sm.value,
          color: "var(--mui-palette-text-primary)",
          paddingTop: spacing.scale["2"].value,
          paddingBottom: spacing.scale["2"].value,
          paddingLeft: spacing.scale["4"].value,
          paddingRight: spacing.scale["4"].value,
          "&.Mui-selected": {
            backgroundColor: "color-mix(in srgb, var(--mui-palette-primary-main) 12%, transparent)",
            fontWeight: typography.fontWeights.medium.value,
            "&:hover": {
              backgroundColor: "color-mix(in srgb, var(--mui-palette-primary-main) 16%, transparent)"
            }
          },
          "&.Mui-disabled": {
            opacity: 0.5
          }
        }
      }
    }
  };
}

// src/theme/mapAccordionToTheme.ts
var radiusLg2 = spacing.borderRadius["radius-08"].value;
var space43 = spacing.scale["4"].value;
var space32 = spacing.scale["3"].value;
function mapAccordionToTheme(product) {
  void product;
  return {
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        elevation: 0
      },
      styleOverrides: {
        root: {
          backgroundColor: "var(--mui-palette-background-paper)",
          border: "1px solid var(--mui-palette-divider)",
          borderBottom: "none",
          boxShadow: "none",
          "&:before": {
            display: "none"
          },
          "&:first-of-type": {
            borderTopLeftRadius: radiusLg2,
            borderTopRightRadius: radiusLg2
          },
          "&:last-of-type": {
            borderBottomLeftRadius: radiusLg2,
            borderBottomRightRadius: radiusLg2,
            borderBottom: "1px solid var(--mui-palette-divider)"
          },
          "&.Mui-disabled": {
            backgroundColor: "var(--mui-palette-background-paper)"
          }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: "unset",
          padding: space43,
          fontFamily: typography.fontFamilies.sans.css,
          fontSize: typography.fontSizes.sm.value,
          fontWeight: typography.fontWeights.medium.value,
          color: "var(--mui-palette-text-primary)",
          transition: "background-color 150ms ease",
          "&:hover": {
            backgroundColor: "var(--mui-palette-action-hover)"
          },
          "&.Mui-focusVisible": {
            backgroundColor: "var(--mui-palette-action-hover)"
          },
          "&.Mui-disabled": {
            opacity: 0.65,
            color: "var(--mui-palette-text-disabled)",
            "&:hover": {
              backgroundColor: "transparent"
            }
          },
          "@media (max-width: 768px)": {
            padding: `${space32} ${space32}`
          }
        },
        content: {
          margin: 0,
          "&.Mui-expanded": {
            margin: 0
          }
        },
        expandIconWrapper: {
          color: "var(--mui-palette-text-secondary)",
          "&.Mui-expanded": {
            transform: "rotate(180deg)"
          },
          ".Mui-disabled &": {
            color: "var(--mui-palette-text-disabled)",
            opacity: 0.8
          }
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: space43,
          fontSize: typography.fontSizes.sm.value,
          color: "var(--mui-palette-text-secondary)",
          "@media (max-width: 768px)": {
            padding: space32
          }
        }
      }
    }
  };
}

// src/theme/mapListToTheme.ts
var radiusLg3 = spacing.borderRadius["radius-08"].value;
var space33 = spacing.scale["3"].value;
var space44 = spacing.scale["4"].value;
var space52 = spacing.scale["5"].value;
var textSm3 = typography.fontSizes.sm.value;
function mapListToTheme(product) {
  void product;
  return {
    MuiList: {
      defaultProps: {
        disablePadding: true
      },
      styleOverrides: {
        root: {
          backgroundColor: "var(--mui-palette-background-paper)",
          border: "1px solid var(--mui-palette-divider)",
          borderRadius: radiusLg3,
          overflow: "hidden",
          paddingTop: 0,
          paddingBottom: 0
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          gap: space33,
          paddingTop: space33,
          paddingBottom: space33,
          paddingLeft: space44,
          paddingRight: space44,
          fontSize: textSm3,
          color: "var(--mui-palette-text-primary)",
          transition: "background-color 150ms ease",
          "@media (max-width: 768px)": {
            minHeight: "44px"
          },
          "&:hover": {
            backgroundColor: "var(--mui-palette-action-hover)"
          },
          "&:hover:not(.Mui-selected) .MuiListItemIcon-root": {
            color: "var(--mui-palette-primary-main)"
          },
          "&.Mui-selected": {
            backgroundColor: "var(--mui-palette-primary-main)",
            color: "#fff",
            "&:hover": {
              backgroundColor: "var(--mui-palette-primary-dark)"
            },
            "& .MuiListItemIcon-root": {
              color: "#fff"
            },
            "& .MuiListItemText-primary": {
              color: "#fff"
            }
          },
          "&.MuiListItemButton-divider": {
            borderBottomColor: "var(--mui-palette-divider)"
          },
          // Link composition (component="a") — match button item chrome
          textDecoration: "none"
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "auto",
          marginRight: 0,
          // Harmony `--text-muted` maps to palette text.disabled in createHarmonyTheme
          color: "var(--mui-palette-text-disabled)",
          fontSize: space52,
          "& img": {
            width: space52,
            height: space52,
            objectFit: "contain",
            display: "block"
          }
        }
      }
    },
    MuiListItemText: {
      defaultProps: {
        primaryTypographyProps: {
          variant: "body2",
          fontSize: textSm3
        }
      },
      styleOverrides: {
        root: {
          marginTop: 0,
          marginBottom: 0
        },
        primary: {
          fontSize: textSm3,
          color: "inherit"
        }
      }
    }
  };
}

// src/theme/mapStepperToTheme.ts
var displayFont2 = typography.fontFamilies.display.css;
var textSm4 = typography.fontSizes.sm.value;
var weightMedium = typography.fontWeights.medium.value;
var weightSemibold2 = typography.fontWeights.semibold.value;
var connectorWidth = spacing.scale["0.5"].value;
function mapStepperToTheme(product) {
  void product;
  return {
    MuiStepper: {
      styleOverrides: {
        root: {
          width: "100%"
        }
      }
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          // Harmony 40px indicator (default MUI is 1.5rem / 24px). Idle = hollow ring:
          // transparent SVG fill + border on the icon element, number in text.secondary.
          fontSize: "2.5rem",
          color: "transparent",
          borderRadius: "50%",
          border: `${connectorWidth} solid var(--mui-palette-divider)`,
          boxSizing: "border-box",
          "& .MuiStepIcon-text": {
            fill: "var(--mui-palette-text-secondary)",
            fontFamily: displayFont2,
            fontWeight: weightSemibold2,
            fontSize: "0.75rem"
          },
          "&.Mui-active": {
            color: "var(--mui-palette-primary-main)",
            borderColor: "transparent",
            "& .MuiStepIcon-text": {
              fill: "var(--mui-palette-primary-contrastText)"
            }
          },
          "&.Mui-completed": {
            color: "var(--mui-palette-primary-main)",
            borderColor: "transparent"
          },
          "&.Mui-error": {
            color: "var(--mui-palette-error-main)",
            borderColor: "transparent"
          }
        }
      }
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontFamily: displayFont2,
          fontSize: textSm4,
          fontWeight: weightMedium,
          color: "var(--mui-palette-text-primary)",
          "&.Mui-active": {
            color: "var(--mui-palette-text-primary)",
            fontWeight: weightSemibold2
          },
          "&.Mui-completed": {
            color: "var(--mui-palette-text-secondary)"
          },
          "&.Mui-error": {
            color: "var(--mui-palette-error-main)"
          },
          "&.Mui-disabled": {
            color: "var(--mui-palette-text-disabled)"
          }
        }
      }
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: "var(--mui-palette-divider)",
          borderTopWidth: connectorWidth
        },
        root: {
          "&.Mui-active .MuiStepConnector-line": {
            borderColor: "var(--mui-palette-primary-main)"
          },
          "&.Mui-completed .MuiStepConnector-line": {
            borderColor: "var(--mui-palette-primary-main)"
          }
        }
      }
    }
  };
}

// src/theme/mapTabsToTheme.ts
var sansFont = typography.fontFamilies.sans.css;
var textSm5 = typography.fontSizes.sm.value;
var weightMedium2 = typography.fontWeights.medium.value;
var space34 = spacing.scale["3"].value;
var space45 = spacing.scale["4"].value;
var indicatorHeight = spacing.scale["0.5"].value;
function mapTabsToTheme(product) {
  void product;
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: "unset",
          borderBottom: "1px solid var(--mui-palette-divider)"
        },
        indicator: {
          height: indicatorHeight,
          backgroundColor: "var(--mui-palette-primary-main)"
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontFamily: sansFont,
          fontSize: textSm5,
          fontWeight: weightMedium2,
          color: "var(--mui-palette-text-secondary)",
          minHeight: "unset",
          minWidth: "unset",
          padding: `${space34} ${space45}`,
          transition: "color 150ms ease",
          "&:hover": {
            color: "var(--mui-palette-text-primary)"
          },
          "&.Mui-selected": {
            color: "var(--mui-palette-primary-main)"
          },
          "&.Mui-disabled": {
            color: "var(--mui-palette-text-disabled)",
            opacity: 0.6
          }
        }
      }
    }
  };
}

// src/theme/mapFoundationTokens.ts
function mapFoundationTokens(product) {
  const typography2 = mapTypographyToTheme();
  const spacing2 = mapSpacingToTheme();
  const elevations2 = mapElevationsToTheme();
  const lightPalette = mapColorsToPalette(product, "light");
  const darkPalette = mapColorsToPalette(product, "dark");
  return {
    ...typography2,
    ...spacing2,
    shadows: elevations2.light.shadows,
    colorSchemes: {
      light: {
        ...lightPalette,
        shadows: elevations2.light.shadows
      },
      dark: {
        ...darkPalette,
        shadows: elevations2.dark.shadows
      }
    },
    components: {
      ...mapButtonBaseToTheme(product),
      ...mapButtonToTheme(product),
      ...mapButtonGroupToTheme(product),
      ...mapLinkToTheme(product),
      ...mapAlertToTheme(product),
      ...mapProgressBarToTheme(product),
      ...mapSpinnerToTheme(product),
      ...mapAvatarToTheme(product),
      ...mapChipToTheme(product),
      ...mapNotificationBadgeToTheme(product),
      ...mapTooltipToTheme(product),
      ...mapCardToTheme(product),
      ...mapDialogToTheme(product),
      ...mapCheckboxToTheme(product),
      ...mapRadioToTheme(product),
      ...mapSelectionControlChromeToTheme(product),
      ...mapTextFieldToTheme(product),
      ...mapDatePickersToTheme(product),
      ...mapFormLabelToTheme(product),
      ...mapSliderToTheme(product),
      ...mapSwitchToTheme(product),
      ...mapSelectToTheme(product),
      ...mapAccordionToTheme(product),
      ...mapListToTheme(product),
      ...mapStepperToTheme(product),
      ...mapTabsToTheme(product)
    }
  };
}

// src/theme/createHarmonyTheme.ts
var HARMONY_DELA = {
  gradient: DELA_GRADIENT,
  gradientHover: DELA_GRADIENT_HOVER,
  contrastText: "#FFFFFF"
};
function createHarmonyTheme(options = {}) {
  const product = options.product ?? "cp";
  const foundation = mapFoundationTokens(product);
  return createTheme({
    cssVariables: {
      colorSchemeSelector: "class"
    },
    typography: foundation.typography,
    spacing: foundation.spacing,
    shape: foundation.shape,
    shadows: foundation.shadows,
    colorSchemes: foundation.colorSchemes,
    components: foundation.components,
    dela: { ...HARMONY_DELA }
  });
}
export {
  HARMONY_DELA,
  createHarmonyTheme
};
