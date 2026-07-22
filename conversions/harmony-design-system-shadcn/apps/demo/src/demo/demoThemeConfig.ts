import type { HarmonyProduct } from '@dltkrichardhuska/harmony-design-system-shadcn/theme';

/** Product-specific component surfaced in the sidebar when that product is active. */
export interface ThemeComponent {
  title: string;
  href: string;
  icon: string;
}

export interface ThemeConfig {
  name: string;
  fullName: string;
  primaryColor: string;
  /** Extra components this product's package delivers (mirrors reference theme-config.ts). */
  components: ThemeComponent[];
}

export type DemoProduct = HarmonyProduct;

export const demoThemeConfig: Record<DemoProduct, ThemeConfig> = {
  cp: {
    name: 'CP',
    fullName: 'Harmony CP Design System',
    primaryColor: '#2A78C6',
    components: [
      { title: 'Floating Nav', href: '/cp/floating-nav', icon: 'bars-3' },
      { title: 'Kanban', href: '/cp/kanban', icon: 'columns' },
    ],
  },
  vp: {
    name: 'VP',
    fullName: 'Harmony VP Design System',
    primaryColor: '#2A78C6',
    components: [],
  },
  ppm: {
    name: 'PPM',
    fullName: 'Harmony PPM Design System',
    primaryColor: '#0073E6',
    components: [],
  },
  maconomy: {
    name: 'Maconomy',
    fullName: 'Harmony Maconomy Design System',
    primaryColor: '#0073E6',
    components: [],
  },
};

/** All product-specific component hrefs across products (single source for extra routes). */
export const themeComponentHrefs: string[] = Array.from(
  new Set(
    Object.values(demoThemeConfig).flatMap((config) =>
      config.components.map((component) => component.href),
    ),
  ),
);

export const productLogoMap: Record<DemoProduct, string> = {
  cp: '/logos/CPVPLogo.svg',
  vp: '/logos/CPVPLogo.svg',
  ppm: '/logos/PPMLogo.svg',
  maconomy: '/logos/MacLogo.svg',
};

export const DEMO_PRODUCTS: DemoProduct[] = ['cp', 'vp', 'ppm', 'maconomy'];
