import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { DESKTOP_BREAKPOINT } from './demoLayoutSx';

interface DemoLayoutContextValue {
  mobileOpen: boolean;
  isMobile: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const DemoLayoutContext = createContext<DemoLayoutContextValue | null>(null);

function useDemoLayoutState(): DemoLayoutContextValue {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < DESKTOP_BREAKPOINT : false,
  );

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < DESKTOP_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const openSidebar = useCallback(() => setMobileOpen(true), []);
  const closeSidebar = useCallback(() => setMobileOpen(false), []);
  const toggleSidebar = useCallback(() => setMobileOpen((v) => !v), []);

  return { mobileOpen, isMobile, openSidebar, closeSidebar, toggleSidebar };
}

export function DemoLayoutProvider({ children }: { children: ReactNode }) {
  const value = useDemoLayoutState();
  return <DemoLayoutContext.Provider value={value}>{children}</DemoLayoutContext.Provider>;
}

export function useDemoLayout() {
  const ctx = useContext(DemoLayoutContext);
  if (!ctx) throw new Error('useDemoLayout must be used within DemoLayoutProvider');
  return ctx;
}
