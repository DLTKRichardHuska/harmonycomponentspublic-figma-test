import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DEMO_PRODUCTS,
  MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  demoThemeConfig,
  productLogoMap,
  type DemoProduct,
} from './demoThemeConfig';
import { normalizePath, resolveKanbanHref } from './demoNavigation';

export type ColorMode = 'light' | 'dark';

interface DemoPreferencesContextValue {
  product: DemoProduct;
  mode: ColorMode;
  setProduct: (product: DemoProduct) => void;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
  productName: string;
  logoSrc: string;
}

const DemoPreferencesContext = createContext<DemoPreferencesContextValue | null>(null);

function readStoredProduct(): DemoProduct {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as DemoProduct | null;
  return stored && DEMO_PRODUCTS.includes(stored) ? stored : 'cp';
}

function readStoredMode(): ColorMode {
  const stored = localStorage.getItem(MODE_STORAGE_KEY);
  return stored === 'light' ? 'light' : 'dark';
}

export function DemoPreferencesProvider({ children }: { children: ReactNode }) {
  const [product, setProductState] = useState<DemoProduct>(readStoredProduct);
  const [mode, setModeState] = useState<ColorMode>(readStoredMode);
  const navigate = useNavigate();
  const location = useLocation();

  const setProduct = useCallback(
    (next: DemoProduct) => {
      setProductState(next);
      localStorage.setItem(THEME_STORAGE_KEY, next);
      document.documentElement.dataset.colorTheme = next;

      const path = normalizePath(location.pathname);
      if (next === 'cp' && path === '/components/kanban') {
        navigate('/cp/kanban');
        return;
      }
      if (next !== 'cp' && path === '/cp/kanban') {
        navigate('/components/kanban');
        return;
      }

      const themeMatch = path.match(/^\/(cp|vp|ppm|maconomy)\//);
      if (themeMatch && themeMatch[1] !== next) {
        navigate('/');
      }
    },
    [location.pathname, navigate],
  );

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
    localStorage.setItem(MODE_STORAGE_KEY, next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  useEffect(() => {
    document.documentElement.dataset.colorTheme = product;
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [product, mode]);

  const value = useMemo(
    () => ({
      product,
      mode,
      setProduct,
      setMode,
      toggleMode,
      productName: demoThemeConfig[product].name,
      logoSrc: productLogoMap[product],
    }),
    [product, mode, setProduct, setMode, toggleMode],
  );

  return <DemoPreferencesContext.Provider value={value}>{children}</DemoPreferencesContext.Provider>;
}

export function useDemoPreferences() {
  const ctx = useContext(DemoPreferencesContext);
  if (!ctx) throw new Error('useDemoPreferences must be used within DemoPreferencesProvider');
  return ctx;
}

export function useKanbanHref(): string {
  const { product } = useDemoPreferences();
  return resolveKanbanHref(product);
}
