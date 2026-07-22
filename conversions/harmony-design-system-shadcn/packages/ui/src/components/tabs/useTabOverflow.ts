import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export interface UseTabOverflowOptions {
  /** Horizontal space (px) to reserve for the "More" menu (and any add button). */
  reserve?: number;
  /** Gap (px) between triggers; defaults to 4 (space-1). */
  gap?: number;
}

export interface UseTabOverflowResult {
  /** Attach to the TabsList element. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Index from which triggers overflow (Infinity when all fit). Hide triggers with index >= this. */
  hiddenFrom: number;
  /** True when at least one trigger overflows. */
  hasOverflow: boolean;
}

/**
 * Measures the natural width of each `[data-overflow-item]` inside the container once,
 * then computes how many fit as the container resizes (ResizeObserver). Overflowed
 * triggers should be hidden by the caller and surfaced in a composed `DropdownMenu`.
 */
export function useTabOverflow(
  itemCount: number,
  { reserve = 120, gap = 4 }: UseTabOverflowOptions = {},
): UseTabOverflowResult {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const naturalWidthsRef = useRef<number[]>([]);
  const measuredRef = useRef(false);
  const [hiddenFrom, setHiddenFrom] = useState<number>(Infinity);

  const compute = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-overflow-item]'));
    if (items.length === 0) return;

    // Capture natural widths a single time while every trigger is visible.
    if (!measuredRef.current) {
      naturalWidthsRef.current = items.map((i) => i.getBoundingClientRect().width);
      measuredRef.current = true;
    }

    const available = el.getBoundingClientRect().width - reserve;
    const widths = naturalWidthsRef.current;
    let used = 0;
    let firstHidden = items.length;
    for (let i = 0; i < items.length; i += 1) {
      used += (widths[i] ?? 0) + gap;
      if (used > available) {
        firstHidden = i;
        break;
      }
    }
    setHiddenFrom(firstHidden === items.length ? Infinity : Math.max(1, firstHidden));
  }, [reserve, gap]);

  useLayoutEffect(() => {
    // Re-measure natural widths when the item set changes.
    measuredRef.current = false;
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => compute());
    ro.observe(el);
    compute();
    return () => ro.disconnect();
  }, [compute, itemCount]);

  return {
    containerRef,
    hiddenFrom,
    hasOverflow: hiddenFrom !== Infinity,
  };
}
