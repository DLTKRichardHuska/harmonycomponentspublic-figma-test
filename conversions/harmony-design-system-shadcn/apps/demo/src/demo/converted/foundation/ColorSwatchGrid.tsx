import { useLayoutEffect, useRef, useState } from 'react';
import { useHarmonyTheme } from '@dltkrichardhuska/harmony-design-system-shadcn/theme';
import type { ColorSwatch } from './foundationHelpers';

function SwatchTile({ swatch }: { swatch: ColorSwatch }) {
  const tileRef = useRef<HTMLDivElement>(null);
  const { product, mode } = useHarmonyTheme();
  const [resolved, setResolved] = useState('');

  useLayoutEffect(() => {
    const el = tileRef.current;
    if (!el) return;
    setResolved(getComputedStyle(el).backgroundColor);
  }, [product, mode, swatch.cssVar]);

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={tileRef}
        className="h-16 rounded-lg border border-border"
        style={{ backgroundColor: `var(${swatch.cssVar})` }}
        title={swatch.cssVar}
      />
      <div>
        <p className="text-sm font-medium text-foreground">{swatch.name}</p>
        <p className="font-mono text-xs text-muted-foreground">{resolved || '…'}</p>
        <p className="font-mono text-[10px] text-muted-foreground">{swatch.cssVar}</p>
        {swatch.usage ? <p className="mt-1 text-xs text-secondary">{swatch.usage}</p> : null}
      </div>
    </div>
  );
}

export function ColorSwatchGrid({ swatches }: { swatches: ColorSwatch[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {swatches.map((swatch) => (
        <SwatchTile key={swatch.key} swatch={swatch} />
      ))}
    </div>
  );
}
