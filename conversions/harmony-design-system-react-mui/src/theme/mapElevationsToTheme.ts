import { elevations } from '../tokens';
import type { Shadows } from '@mui/material/styles';

const SHADOW_ORDER = ['none', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

function buildShadowArray(mode: 'light' | 'dark'): Shadows {
  const arr = SHADOW_ORDER.map((key) => {
    const shadow = elevations.shadows[key];
    if (key === 'none') return 'none';
    const value = mode === 'dark' && 'valueDark' in shadow ? shadow.valueDark : shadow.value;
    return value;
  }) as unknown as Shadows;

  // Pad to MUI's 25 shadow slots
  while (arr.length < 25) {
    arr.push(arr[arr.length - 1] ?? 'none');
  }
  return arr;
}

export function mapElevationsToTheme() {
  return {
    light: { shadows: buildShadowArray('light') },
    dark: { shadows: buildShadowArray('dark') },
    harmonyShadows: elevations.shadows,
    elevationHierarchy: elevations.hierarchy,
  };
}
