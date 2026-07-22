import type { ComponentType, SVGProps } from 'react';
import * as HeroOutline from '@heroicons/react/24/outline';
import * as HeroSolid from '@heroicons/react/24/solid';

export type HeroIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const outlineIcons = HeroOutline as Record<string, HeroIconComponent | undefined>;
const solidIcons = HeroSolid as Record<string, HeroIconComponent | undefined>;

export function heroIconExportName(name: string): string {
  // Heroicons capitalizes letters that follow digits (squares-2x2 → Squares2X2Icon).
  const pascal = name
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
    .replace(/(\d)([a-z])/g, (_, digit: string, letter: string) => digit + letter.toUpperCase());
  return `${pascal}Icon`;
}

export function resolveHeroIcon(
  name: string,
  variant: 'outline' | 'solid' = 'outline',
): HeroIconComponent | null {
  const key = heroIconExportName(name);
  const library = variant === 'solid' ? solidIcons : outlineIcons;
  return library[key] ?? null;
}
