import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { useHarmonyTheme } from '@dltkrichardhuska/harmony-design-system-shadcn/theme';
import { DemoSearch } from './DemoSearch';
import { DEMO_PRODUCTS, demoThemeConfig, productLogoMap } from './demoThemeConfig';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

export interface DemoHeaderProps {
  onOpenNav: () => void;
}

export function DemoHeader({ onOpenNav }: DemoHeaderProps) {
  const { product, mode, setProduct, toggleMode } = useHarmonyTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const productName = demoThemeConfig[product].name;
  const logoSrc = productLogoMap[product];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <header className="relative z-50 flex h-14 w-full shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenNav}
          aria-label="Open navigation"
          aria-controls="docs-sidebar"
          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Icon name="bars-3" size="sm" />
        </button>
        <Link to="/" className="flex items-center gap-2 no-underline hover:no-underline">
          <img src={logoSrc} alt="Logo" className="size-5 rounded-full" />
          <h1 className="text-sm font-bold tracking-tight text-foreground">
            Harmony{' '}
            <span className="text-primary">{productName}</span>{' '}
            <span className="font-normal text-muted-foreground">Design System</span>
          </h1>
        </Link>
      </div>

      <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex">
        <DemoSearch />
      </div>

      <div className="flex items-center gap-3">
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-muted-foreground hover:bg-muted"
          >
            <Icon name="swatch" size="sm" className="shrink-0" />
            <span className="text-xs font-medium text-foreground">{product.toUpperCase()}</span>
            <Icon name="chevron-down" size="xs" className="shrink-0" />
          </button>
          {menuOpen ? (
            <div
              className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-border bg-card py-1 shadow-lg"
              role="listbox"
            >
              {DEMO_PRODUCTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  role="option"
                  aria-selected={p === product}
                  onClick={() => {
                    setProduct(p);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted"
                >
                  <span className="font-medium">{demoThemeConfig[p].name}</span>
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: demoThemeConfig[p].primaryColor }}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={toggleMode}
          aria-label="Toggle color mode"
          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {mode === 'dark' ? <Icon name="sun" size="sm" /> : <Icon name="moon" size="sm" />}
        </button>

        <div className="h-5 w-px bg-border" aria-hidden />

        <a
          href="https://github.com/DLTKRichardHuska/harmonycomponentspublic-figma-test"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <GitHubIcon className="size-4" />
        </a>
      </div>
    </header>
  );
}
