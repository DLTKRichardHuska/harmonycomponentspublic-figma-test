import { forwardRef, useEffect, useMemo, useState, type ComponentType } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import * as TablerIcons from '@tabler/icons-react';
import { cn } from '../../lib/utils';
import { useHarmonyTheme, type HarmonyProduct } from '../../theme';
import { iconSizeDimensions, type IconSize } from './iconSizes';
import { resolveHeroIcon } from './resolveHeroIcon';
import { resolveManifestIcon } from './resolveManifestIcon';

const iconVariants = cva(
  'inline-flex shrink-0 select-none items-center justify-center text-current [&_svg]:block [&_svg]:h-full [&_svg]:w-full',
  {
    variants: {
      size: {
        xs: 'h-[var(--icon-xs)] w-[var(--icon-xs)]',
        sm: 'h-[var(--icon-sm)] w-[var(--icon-sm)]',
        md: 'h-[var(--icon-md)] w-[var(--icon-md)]',
        lg: 'h-[var(--icon-lg)] w-[var(--icon-lg)]',
        xl: 'h-[var(--icon-xl)] w-[var(--icon-xl)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface IconProps extends VariantProps<typeof iconVariants> {
  name: string;
  size?: IconSize;
  variant?: 'outline' | 'solid';
  className?: string;
  /** Override product for manifest lookup; defaults to HarmonyThemeProvider product. */
  product?: HarmonyProduct;
}

type TablerIconComponent = ComponentType<{
  size?: number | string;
  stroke?: number;
  color?: string;
  className?: string;
}>;

function resolveTablerIcon(name: string): TablerIconComponent | null {
  const pascal = name
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
  return (TablerIcons as unknown as Record<string, TablerIconComponent | undefined>)[`Icon${pascal}`] ?? null;
}

function processSvgColors(inner: string): string {
  return inner
    .replace(/stroke="(#[0-9A-Fa-f]{3,6})"/gi, 'stroke="currentColor"')
    .replace(/fill="(#[0-9A-Fa-f]{3,6})"/gi, 'fill="currentColor"');
}

function FallbackIcon({ title, className }: { title: string; className?: string }) {
  return (
    <span
      aria-hidden
      title={title}
      className={cn(
        'inline-flex items-center justify-center font-semibold',
        'bg-[var(--icon-fallback-bg)] text-[var(--icon-fallback-text)]',
        'rounded-[var(--icon-fallback-radius)] text-[length:var(--icon-fallback-font-size)]',
        className,
      )}
    >
      ?
    </span>
  );
}

function PublicSvgIcon({ name }: { name: string }) {
  const [markup, setMarkup] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    setMarkup(null);
    fetch(`/${encodeURIComponent(name)}.svg`)
      .then((response) => (response.ok ? response.text() : Promise.reject(new Error('not found'))))
      .then((svg) => {
        if (cancelled) return;
        const inner = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1]?.trim() ?? '';
        const viewBox = svg.match(/viewBox="([^"]*)"/i)?.[1] ?? '0 0 24 24';
        const processed = processSvgColors(inner);
        setMarkup(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%" fill="none" aria-hidden="true">${processed}</svg>`,
        );
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [name]);

  if (failed) return <FallbackIcon title={`Icon "${name}" not found`} className="h-full w-full" />;
  if (!markup) return <span aria-hidden className="inline-block h-full w-full" />;

  return (
    <span
      aria-hidden
      className="inline-flex h-full w-full items-center justify-center text-current"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  { name, size = 'md', variant = 'outline', className, product: productProp },
  ref,
) {
  const { product: themeProduct } = useHarmonyTheme();
  const product = productProp ?? themeProduct;
  const dimensions = iconSizeDimensions[size ?? 'md'];
  const manifestEntry = useMemo(() => resolveManifestIcon(name, product), [name, product]);

  const resolved = useMemo(() => {
    if (manifestEntry?.source === 'hero') {
      const hero = resolveHeroIcon(name, variant);
      if (hero) return { kind: 'hero' as const, Component: hero };
    }
    const hero = resolveHeroIcon(name, variant);
    if (hero) return { kind: 'hero' as const, Component: hero };
    if (manifestEntry?.source === 'tabler') {
      const tabler = resolveTablerIcon(name);
      if (tabler) return { kind: 'tabler' as const, Component: tabler };
    }
    const tabler = resolveTablerIcon(name);
    if (tabler) return { kind: 'tabler' as const, Component: tabler };
    if (manifestEntry?.svg) return { kind: 'manifest' as const, svg: manifestEntry.svg };
    return { kind: 'public' as const };
  }, [manifestEntry, name, variant]);

  const rootClass = cn(iconVariants({ size }), className);

  if (resolved.kind === 'public') {
    return (
      <span ref={ref} className={rootClass} data-icon={name}>
        <PublicSvgIcon name={name} />
      </span>
    );
  }

  if (resolved.kind === 'manifest') {
    const inner = resolved.svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1]?.trim() ?? '';
    const viewBox = resolved.svg.match(/viewBox="([^"]*)"/i)?.[1] ?? '0 0 24 24';
    const processed = processSvgColors(inner);
    return (
      <span
        ref={ref}
        aria-hidden
        className={rootClass}
        data-icon={name}
        dangerouslySetInnerHTML={{
          __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%" fill="none" aria-hidden="true">${processed}</svg>`,
        }}
      />
    );
  }

  if (resolved.kind === 'tabler') {
    const TablerComponent = resolved.Component;
    return (
      <span ref={ref} aria-hidden className={rootClass} data-icon={name}>
        <TablerComponent size={dimensions.width} stroke={1.5} color="currentColor" />
      </span>
    );
  }

  const HeroComponent = resolved.Component;
  return (
    <span ref={ref} aria-hidden className={rootClass} data-icon={name}>
      <HeroComponent width={dimensions.width} height={dimensions.height} />
    </span>
  );
});

export { iconVariants };
