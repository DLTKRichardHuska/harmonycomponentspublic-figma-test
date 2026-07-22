import { forwardRef, useEffect, useMemo, useState, type ComponentType } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import type { PaletteColor, SxProps, Theme } from '@mui/material/styles';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import * as TablerIcons from '@tabler/icons-react';
import type { HarmonyProduct } from '../../tokens';
import { iconSizeDimensions, type IconSize } from './iconSizes';
import { resolveHeroIcon } from './resolveHeroIcon';
import { resolveManifestIcon } from './resolveManifestIcon';

export interface HarmonyIconProps {
  name: string;
  size?: IconSize;
  variant?: 'outline' | 'solid';
  className?: string;
  sx?: SxProps<Theme>;
  product?: HarmonyProduct;
  fontSize?: SvgIconProps['fontSize'];
  color?: SvgIconProps['color'];
  /** SvgIcon-compatible title attribute (tooltip / assistive hint). Icon remains decorative (`aria-hidden`) by default — label interactive parents. */
  titleAccess?: string;
}

type TablerIconComponent = ComponentType<{ size?: number | string; stroke?: number; color?: string }>;

type DimensionValue = number | string;

interface ResolvedDimensions {
  width: DimensionValue;
  height: DimensionValue;
  scalable: boolean;
}

function resolveDimensions(size?: IconSize, fontSize: SvgIconProps['fontSize'] = 'medium'): ResolvedDimensions {
  if (size) {
    const { width, height } = iconSizeDimensions[size];
    return { width, height, scalable: false };
  }
  if (fontSize === 'inherit') {
    return { width: '1em', height: '1em', scalable: true };
  }
  const px =
    fontSize === 'small'
      ? 20
      : fontSize === 'large'
        ? 35
        : typeof fontSize === 'number'
          ? fontSize
          : 24;
  return { width: px, height: px, scalable: false };
}

function getColorSx(color: SvgIconProps['color'] | undefined, theme: Theme): SxProps<Theme> {
  if (!color || color === 'inherit') {
    return { color: 'inherit' };
  }
  if (color === 'action') {
    return { color: theme.palette.action.active };
  }
  if (color === 'disabled') {
    return { color: theme.palette.action.disabled };
  }
  const paletteColor = theme.palette[color as keyof typeof theme.palette];
  if (paletteColor && typeof paletteColor === 'object' && 'main' in paletteColor) {
    return { color: (paletteColor as PaletteColor).main };
  }
  return {};
}

function resolveTablerIcon(name: string): TablerIconComponent | null {
  const pascal = name
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
  return (TablerIcons as unknown as Record<string, TablerIconComponent | undefined>)[`Icon${pascal}`] ?? null;
}

function FallbackIcon({
  width,
  height,
  title,
}: {
  width: DimensionValue;
  height: DimensionValue;
  title: string;
}) {
  return (
    <Box
      aria-hidden
      title={title}
      sx={{
        width,
        height,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0.5,
        bgcolor: 'action.hover',
        color: 'text.secondary',
        fontSize: typeof width === 'number' && width <= 12 ? 8 : 10,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      ?
    </Box>
  );
}

function PublicSvgIcon({
  name,
  width,
  height,
  scalable,
}: {
  name: string;
  width: DimensionValue;
  height: DimensionValue;
  scalable: boolean;
}) {
  const [markup, setMarkup] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const svgWidth = scalable ? '100%' : width;
  const svgHeight = scalable ? '100%' : height;

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
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" fill="none" aria-hidden="true">${processed}</svg>`,
        );
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [name, svgWidth, svgHeight]);

  if (failed) return <FallbackIcon width={width} height={height} title={`Icon "${name}" not found`} />;
  if (!markup) return <Box aria-hidden sx={{ width, height, display: 'inline-block', flexShrink: 0 }} />;

  return (
    <Box
      aria-hidden
      component="span"
      sx={{
        width: '100%',
        height: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'inherit',
        flexShrink: 0,
        '& svg': { display: 'block', width: '100%', height: '100%' },
      }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

function processSvgColors(inner: string): string {
  return inner
    .replace(/stroke="(#[0-9A-Fa-f]{3,6})"/gi, 'stroke="currentColor"')
    .replace(/fill="(#[0-9A-Fa-f]{3,6})"/gi, 'fill="currentColor"');
}

function rootClassName(className?: string) {
  return ['MuiSvgIcon-root', className].filter(Boolean).join(' ');
}

function rootSx(
  dimensions: ResolvedDimensions,
  color: SvgIconProps['color'] | undefined,
  theme: Theme,
  sx?: SxProps<Theme>,
): SxProps<Theme> {
  return [
    {
      width: dimensions.width,
      height: dimensions.height,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      userSelect: 'none',
    },
    getColorSx(color, theme),
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
  ] as SxProps<Theme>;
}

export const HarmonyIcon = forwardRef<HTMLSpanElement, HarmonyIconProps>(function HarmonyIcon(
  {
    name,
    size,
    className,
    sx,
    variant = 'outline',
    product = 'cp',
    fontSize = size ? undefined : 'medium',
    color = 'inherit',
    titleAccess,
  },
  ref,
) {
  const theme = useTheme();
  const dimensions = resolveDimensions(size, fontSize);
  const { width, height, scalable } = dimensions;
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

  if (resolved.kind === 'public') {
    return (
      <Box
        ref={ref}
        className={rootClassName(className)}
        sx={rootSx(dimensions, color, theme, sx)}
        component="span"
        data-icon={name}
        title={titleAccess}
      >
        <PublicSvgIcon name={name} width={width} height={height} scalable={scalable} />
      </Box>
    );
  }

  if (resolved.kind === 'manifest') {
    const inner = resolved.svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)?.[1]?.trim() ?? '';
    const viewBox = resolved.svg.match(/viewBox="([^"]*)"/i)?.[1] ?? '0 0 24 24';
    const svgWidth = scalable ? '100%' : width;
    const svgHeight = scalable ? '100%' : height;
    const processed = processSvgColors(inner);
    return (
      <Box
        ref={ref}
        aria-hidden
        className={rootClassName(className)}
        sx={rootSx(dimensions, color, theme, sx)}
        component="span"
        data-icon={name}
        title={titleAccess}
        dangerouslySetInnerHTML={{
          __html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" fill="none" aria-hidden="true">${processed}</svg>`,
        }}
      />
    );
  }

  if (resolved.kind === 'tabler') {
    const TablerComponent = resolved.Component;
    return (
      <Box
        ref={ref}
        aria-hidden
        className={rootClassName(className)}
        component="span"
        data-icon={name}
        title={titleAccess}
        sx={rootSx(dimensions, color, theme, sx)}
      >
        <Box
          component="span"
          sx={{
            display: 'block',
            width: scalable ? '100%' : width,
            height: scalable ? '100%' : height,
            lineHeight: 0,
          }}
        >
          <TablerComponent
            size={scalable ? '100%' : (width as number)}
            stroke={1.5}
            color="currentColor"
          />
        </Box>
      </Box>
    );
  }

  const HeroComponent = resolved.Component;
  return (
    <Box
      ref={ref}
      aria-hidden
      className={rootClassName(className)}
      component="span"
      data-icon={name}
      title={titleAccess}
      sx={rootSx(dimensions, color, theme, sx)}
    >
      <HeroComponent
        width={scalable ? '100%' : (width as number)}
        height={scalable ? '100%' : (height as number)}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </Box>
  );
});

export { buttonIconSizeMap } from './iconSizes';
export type { IconSize, HarmonyButtonSize } from './iconSizes';
