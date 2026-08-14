import { Theme } from '@mui/material/styles';

var themes = {
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
};
var colorsJson = {
	themes: themes};

/**
 * Harmony Design System — vendored token exports (synced from reference).
 */

type HarmonyProduct = keyof typeof colorsJson.themes;

interface StatusBadgeTone {
    background: string;
    foreground: string;
    border?: string;
}
interface StatusBadgePalette {
    primary: StatusBadgeTone;
    success: StatusBadgeTone;
    warning: StatusBadgeTone;
    error: StatusBadgeTone;
    info: StatusBadgeTone;
    orange: StatusBadgeTone;
    pink: StatusBadgeTone;
    disabled: StatusBadgeTone;
}
interface DelaTheme {
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

interface CreateHarmonyThemeOptions {
    product?: HarmonyProduct;
}
/** Shared Dela surface — also used to populate `theme.dela`. */
declare const HARMONY_DELA: {
    readonly gradient: "linear-gradient(119deg, #8A33C2 17.59%, #423FE2 77.78%)";
    readonly gradientHover: "rgba(255, 255, 255, 0.1)";
    readonly contrastText: "#FFFFFF";
};
/**
 * Creates a Harmony MUI theme with light + dark colorSchemes and CSS variables.
 * Product selects CP / VP / PPM / Maconomy palette tokens.
 */
declare function createHarmonyTheme(options?: CreateHarmonyThemeOptions): Theme;
type HarmonyTheme = ReturnType<typeof createHarmonyTheme>;

export { type CreateHarmonyThemeOptions, HARMONY_DELA, type HarmonyProduct, type HarmonyTheme, createHarmonyTheme };
