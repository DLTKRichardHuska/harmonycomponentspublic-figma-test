export interface ThemeComponent {
  title: string;
  href: string;
  icon: string;
}

export interface ThemeCompany {
  id: string;
  name: string;
  gradientColor: string;
}

export interface ThemeConfig {
  name: string;
  fullName: string;
  primaryColor: string;
  components: ThemeComponent[];
  companies?: ThemeCompany[];
}

export type DemoProduct = 'cp' | 'vp' | 'ppm' | 'maconomy';

/**
 * Product scope for product-exclusive components, mirrored from the reference
 * catalog (`src/data/component-catalog.ts` -> `componentProducts`). Consumption
 * is a local mirror (not an import) because this package is standalone, matching
 * the shadcn conversion convention. A component absent here is available in all
 * products; the `products` list narrows a component to a subset.
 */
interface ProductScopedComponent extends ThemeComponent {
  products: DemoProduct[];
}

const productScopedComponents: ProductScopedComponent[] = [
  { title: 'Floating Nav', href: '/cp/floating-nav', icon: 'navigation', products: ['cp'] },
  { title: 'Kanban', href: '/cp/kanban', icon: 'view-columns', products: ['cp'] },
];

/** Nav entries for a product, derived from the product-scope map above. */
function componentsForProduct(product: DemoProduct): ThemeComponent[] {
  return productScopedComponents
    .filter((c) => c.products.includes(product))
    .map(({ products: _products, ...component }) => component);
}

export const demoThemeConfig: Record<DemoProduct, ThemeConfig> = {
  cp: {
    name: 'CP',
    fullName: 'Harmony CP Design System',
    primaryColor: '#2A78C6',
    components: componentsForProduct('cp'),
  },
  vp: {
    name: 'VP',
    fullName: 'Harmony VP Design System',
    primaryColor: '#2A78C6',
    components: componentsForProduct('vp'),
  },
  ppm: {
    name: 'PPM',
    fullName: 'Harmony PPM Design System',
    primaryColor: '#0073E6',
    components: componentsForProduct('ppm'),
  },
  maconomy: {
    name: 'Maconomy',
    fullName: 'Harmony Maconomy Design System',
    primaryColor: '#0073E6',
    components: componentsForProduct('maconomy'),
  },
};

export const productLogoMap: Record<DemoProduct, string> = {
  cp: '/logos/CPVPLogo.svg',
  vp: '/logos/CPVPLogo.svg',
  ppm: '/logos/PPMLogo.svg',
  maconomy: '/logos/MacLogo.svg',
};

export const DEMO_PRODUCTS: DemoProduct[] = ['cp', 'vp', 'ppm', 'maconomy'];

export const THEME_STORAGE_KEY = 'colorTheme';
export const MODE_STORAGE_KEY = 'theme';
