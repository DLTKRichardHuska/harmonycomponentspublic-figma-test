import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { searchComponents } from './demoSearchIndex';

export function DemoSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchComponents(query).slice(0, 12);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      inputRef.current?.focus();
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Icon
          name="magnifying-glass"
          size="sm"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search components..."
          value={query}
          aria-label="Search components"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="h-9 w-64 rounded-md border border-border bg-muted/60 py-2 pl-10 pr-14 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      {open && query.trim() && results.length > 0 ? (
        <ul
          className="absolute left-0 top-full z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg"
          role="listbox"
        >
          {results.map((item) => (
            <li key={item.href} role="option">
              <Link
                to={item.href}
                onClick={() => {
                  setOpen(false);
                  setQuery('');
                }}
                className="flex flex-col px-3 py-2 text-sm hover:bg-muted"
              >
                <span className="font-medium text-foreground">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.section}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {open && query.trim() && results.length === 0 ? (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-lg">
          No results for &ldquo;{query}&rdquo;
        </div>
      ) : null}
    </div>
  );
}
