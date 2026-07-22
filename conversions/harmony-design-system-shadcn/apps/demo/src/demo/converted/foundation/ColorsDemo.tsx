import { useEffect, useMemo } from 'react';
import { useHarmonyTheme } from '@dltkrichardhuska/harmony-design-system-shadcn/theme';
import { ImportSnippet } from '../../ui';
import { ColorSwatchGrid } from './ColorSwatchGrid';
import { DemoPageHeader } from './DemoPageHeader';
import { DemoSection } from './DemoSection';
import {
  buildAccentSwatches,
  buildHarmonyPaletteSwatches,
  buildSemanticSwatches,
  getModeIndicatorLabel,
  getPaletteSectionInfo,
} from './foundationHelpers';
import { demoPageTitle } from '../../demoPageTitle';

export function ColorsDemo() {
  const { product, mode } = useHarmonyTheme();

  const paletteSwatches = useMemo(() => buildHarmonyPaletteSwatches(), []);
  const semanticSwatches = useMemo(() => buildSemanticSwatches(), []);
  const accentSwatches = useMemo(() => buildAccentSwatches(), []);
  const paletteInfo = getPaletteSectionInfo(product, mode);
  const modeLabel = getModeIndicatorLabel(product, mode);

  useEffect(() => {
    document.title = demoPageTitle('Colors');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Color System"
        description="A comprehensive color palette designed for both dark and light themes, with semantic colors for consistent communication."
      >
        <p className="mt-3 inline-flex rounded-md border border-border bg-card px-2 py-1 text-xs text-secondary">
          {modeLabel}
        </p>
      </DemoPageHeader>

      <ImportSnippet
        code={`/* Prefer theme tokens — Tailwind semantic classes or CSS variables */
<div className="bg-background text-foreground border-border" />
<div className="bg-primary text-primary-foreground" />
<div style={{ backgroundColor: 'var(--theme-primary)' }} />

/* Single source: styles/tokens.css (via globals.css) + Tailwind preset */`}
      />

      <DemoSection
        title={paletteInfo.title}
        description={paletteInfo.description}
        badge={paletteInfo.badge}
      >
        <ColorSwatchGrid swatches={paletteSwatches} />
      </DemoSection>

      <DemoSection
        title="Semantic Colors"
        description="These colors adapt to light and dark modes for optimal contrast and meaning."
      >
        <ColorSwatchGrid swatches={semanticSwatches} />
      </DemoSection>

      <DemoSection title="Accent Colors">
        <ColorSwatchGrid swatches={accentSwatches} />
      </DemoSection>

      <DemoSection title="Accessibility">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold">Contrast Ratios</h3>
            <p className="text-sm text-secondary">
              All color combinations meet WCAG AA standards. Primary text on backgrounds maintains a
              minimum 4.5:1 contrast ratio, while large text maintains 3:1.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold">Color Blindness</h3>
            <p className="text-sm text-secondary">
              Semantic colors are designed to be distinguishable for users with color vision
              deficiencies. Always pair color with icons or text labels for critical information.
            </p>
          </div>
        </div>
      </DemoSection>
    </article>
  );
}
