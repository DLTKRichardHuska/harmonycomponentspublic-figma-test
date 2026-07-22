import { spacing } from '../tokens';

/** Harmony 4px grid — MUI spacing multiplier. */
const HARMONY_SPACING_UNIT = 4;

function parsePx(value: string): number {
  return Number.parseFloat(value);
}

export function mapSpacingToTheme() {
  const borderRadius: Record<string, string> = {};
  for (const [key, entry] of Object.entries(spacing.borderRadius)) {
    borderRadius[key] = entry.value;
  }

  return {
    spacing: HARMONY_SPACING_UNIT,
    shape: {
      borderRadius: parsePx(spacing.borderRadius['radius-08'].value),
      harmony: borderRadius,
    },
    harmonySpacing: Object.fromEntries(
      Object.entries(spacing.scale).map(([key, entry]) => [key, entry.value]),
    ),
  };
}
