import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { PRODUCT_META, type ProductId } from '../data/product-meta';

export type HarmonyProduct = ProductId;
export type HarmonyMode = 'light' | 'dark';

export interface HarmonyThemeContextValue {
  product: HarmonyProduct;
  mode: HarmonyMode;
  /** Display name of the active product (from product-meta). */
  productName: string;
  /** Logo of the active product as a data URI (from product-meta). */
  logoSrc: string;
  setProduct: (product: HarmonyProduct) => void;
  setMode: (mode: HarmonyMode) => void;
  toggleMode: () => void;
}

const HarmonyThemeContext = createContext<HarmonyThemeContextValue | null>(null);

const STORAGE_PRODUCT = 'harmony-shadcn-product';
const STORAGE_MODE = 'harmony-shadcn-mode';

function readStoredProduct(): HarmonyProduct {
  if (typeof window === 'undefined') return 'cp';
  const v = window.localStorage.getItem(STORAGE_PRODUCT);
  if (v === 'cp' || v === 'ppm' || v === 'vp' || v === 'maconomy') return v;
  return 'cp';
}

function readStoredMode(): HarmonyMode {
  if (typeof window === 'undefined') return 'light';
  const v = window.localStorage.getItem(STORAGE_MODE);
  if (v === 'light' || v === 'dark') return v;
  return 'light';
}

function applyDomTheme(product: HarmonyProduct, mode: HarmonyMode) {
  const root = document.documentElement;
  root.dataset.product = product;
  root.dataset.mode = mode;
  root.classList.toggle('dark', mode === 'dark');
}

export interface HarmonyThemeProviderProps {
  children: ReactNode;
  defaultProduct?: HarmonyProduct;
  defaultMode?: HarmonyMode;
}

export function HarmonyThemeProvider({
  children,
  defaultProduct,
  defaultMode,
}: HarmonyThemeProviderProps) {
  const [product, setProductState] = useState<HarmonyProduct>(
    () => defaultProduct ?? readStoredProduct(),
  );
  const [mode, setModeState] = useState<HarmonyMode>(() => defaultMode ?? readStoredMode());

  useLayoutEffect(() => {
    applyDomTheme(product, mode);
    window.localStorage.setItem(STORAGE_PRODUCT, product);
    window.localStorage.setItem(STORAGE_MODE, mode);
  }, [product, mode]);

  const setProduct = useCallback((p: HarmonyProduct) => setProductState(p), []);
  const setMode = useCallback((m: HarmonyMode) => setModeState(m), []);
  const toggleMode = useCallback(
    () => setModeState((m) => (m === 'light' ? 'dark' : 'light')),
    [],
  );

  const value = useMemo(
    () => ({
      product,
      mode,
      productName: PRODUCT_META[product].name,
      logoSrc: PRODUCT_META[product].logo,
      setProduct,
      setMode,
      toggleMode,
    }),
    [product, mode, setProduct, setMode, toggleMode],
  );

  return (
    <HarmonyThemeContext.Provider value={value}>{children}</HarmonyThemeContext.Provider>
  );
}

export function useHarmonyTheme(): HarmonyThemeContextValue {
  const ctx = useContext(HarmonyThemeContext);
  if (!ctx) {
    throw new Error('useHarmonyTheme must be used within HarmonyThemeProvider');
  }
  return ctx;
}

/**
 * Like {@link useHarmonyTheme} but returns `null` instead of throwing when there
 * is no provider. Lets shell pieces (ShellHeader, sidebars) pick up product
 * identity when a provider exists, while still rendering standalone.
 */
export function useHarmonyThemeOptional(): HarmonyThemeContextValue | null {
  return useContext(HarmonyThemeContext);
}
