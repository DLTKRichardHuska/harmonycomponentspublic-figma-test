import type { ThemeConfig } from '../data/theme-config';

declare global {
  interface Window {
    themeComponentConfig: Record<string, ThemeConfig>;
    renderThemeSpecificNav: (themeName: string) => void;
    currentPagePath?: string;
    filterChangesFunction?: () => void;
  }
}

export {};
