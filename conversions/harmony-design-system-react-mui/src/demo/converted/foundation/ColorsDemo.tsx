import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PanToolAltOutlinedIcon from '@mui/icons-material/PanToolAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { ColorSwatchGrid, type ColorSwatch } from './ColorSwatchGrid';
import { DemoCallout } from './DemoCallout';
import { DemoPageHeader } from './DemoPageHeader';
import { DemoSection } from './DemoSection';
import { demoPageTitle } from '@/demo/demoPageTitle';

function formatDisplayColor(value: string): string {
  if (!value) return value;
  if (value.startsWith('#')) return value.toUpperCase();
  if (value.startsWith('rgba')) {
    const parts = value.match(/[\d.]+/g);
    if (parts && parts.length >= 4 && Number.parseFloat(parts[3]) < 1) {
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${Number.parseFloat(parts[3])})`;
    }
  }
  return value;
}

function swatch(key: string, value: string, usage: string): ColorSwatch {
  return {
    key,
    name: key,
    value: formatDisplayColor(value),
    usage,
  };
}

function buildThemePaletteSwatches(theme: Theme): ColorSwatch[] {
  const { palette } = theme;
  return [
    swatch('background.default', palette.background.default, 'Page / app background'),
    swatch('background.paper', palette.background.paper, 'Surfaces, cards, panels'),
    swatch('primary.main', palette.primary.main, 'Primary actions, brand'),
    swatch('primary.dark', palette.primary.dark, 'Primary hover / pressed'),
    swatch('primary.contrastText', palette.primary.contrastText, 'Text on primary fills'),
    swatch('secondary.main', palette.secondary.main, 'Secondary accent'),
    swatch('pageHeader.main', palette.pageHeader.main, 'Page header actions'),
    swatch('pageHeader.dark', palette.pageHeader.dark, 'Page header hover'),
    swatch('pageHeader.contrastText', palette.pageHeader.contrastText, 'Text on page header fills'),
    swatch('text.primary', palette.text.primary, 'Primary text'),
    swatch('text.secondary', palette.text.secondary, 'Secondary text, labels'),
    swatch('text.disabled', palette.text.disabled, 'Disabled / muted text'),
    swatch('divider', palette.divider, 'Borders, dividers'),
    swatch('action.hover', palette.action.hover, 'Hover backgrounds'),
  ];
}

function buildSemanticSwatches(theme: Theme): ColorSwatch[] {
  const { palette } = theme;
  return [
    swatch('success.main', palette.success.main, 'Success states'),
    swatch('warning.main', palette.warning.main, 'Warning states'),
    swatch('error.main', palette.error.main, 'Error states'),
    swatch('info.main', palette.info.main, 'Informational states'),
  ];
}

function buildStatusBadgeSwatches(theme: Theme): ColorSwatch[] {
  const badges = theme.palette.statusBadge;
  const variants = [
    'primary',
    'success',
    'warning',
    'error',
    'info',
    'orange',
    'pink',
    'disabled',
  ] as const;

  return variants.flatMap((variant) => {
    const tone = badges[variant];
    const rows: ColorSwatch[] = [
      {
        key: `statusBadge.${variant}.background`,
        name: `statusBadge.${variant}.background`,
        value: formatDisplayColor(tone.background),
        usage: `${variant} badge background`,
        fill: tone.background,
      },
      {
        key: `statusBadge.${variant}.foreground`,
        name: `statusBadge.${variant}.foreground`,
        value: formatDisplayColor(tone.foreground),
        usage: `${variant} badge text / border`,
        fill: tone.foreground,
      },
    ];
    if (tone.border) {
      rows.push({
        key: `statusBadge.${variant}.border`,
        name: `statusBadge.${variant}.border`,
        value: formatDisplayColor(tone.border),
        usage: `${variant} badge border`,
        fill: tone.border,
      });
    }
    return rows;
  });
}

export function ColorsDemo() {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const paletteSwatches = useMemo(() => buildThemePaletteSwatches(theme), [theme]);
  const semanticSwatches = useMemo(() => buildSemanticSwatches(theme), [theme]);
  const statusBadgeSwatches = useMemo(() => buildStatusBadgeSwatches(theme), [theme]);

  useEffect(() => {
    document.title = demoPageTitle('Colors');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Color System"
        description="Colors available on the Harmony MUI theme. Read them with useTheme() — the same API an app using this package would use."
      >
        <Chip
          icon={mode === 'dark' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          label={`theme.palette.mode = ${mode}`}
          size="small"
          variant="outlined"
          sx={{ mt: 2 }}
        />
      </DemoPageHeader>

      <DemoSection
        title="Theme palette"
        description="Values from theme.palette for the active product and color scheme. Use these paths in sx, styled, or component color props."
        titleVariant="label"
      >
        <ColorSwatchGrid swatches={paletteSwatches} />
      </DemoSection>

      <DemoSection
        title="Semantic colors"
        description="Status colors from theme.palette. They update with light and dark color schemes."
        titleVariant="label"
      >
        <ColorSwatchGrid swatches={semanticSwatches} columns={{ xs: 6, md: 3, lg: 3 }} />
      </DemoSection>

      <DemoSection
        title="Status badge"
        description="Chip tone pairs on theme.palette.statusBadge — used by the StatusBadge package component."
        titleVariant="label"
      >
        <ColorSwatchGrid swatches={statusBadgeSwatches} columns={{ xs: 6, md: 4, lg: 3 }} />
      </DemoSection>

      <DemoSection title="Consumer usage" titleVariant="label">
        <Box
          component="pre"
          sx={(t) => ({
            ...t.typography.code,
            m: 0,
            p: 2,
            borderRadius: 1,
            bgcolor: 'action.hover',
            border: 1,
            borderColor: 'divider',
            overflow: 'auto',
            whiteSpace: 'pre',
          })}
        >
          <Box component="code" sx={{ fontFamily: 'inherit' }}>
            {`import { useTheme } from '@mui/material/styles';

const theme = useTheme();
const pageBg = theme.palette.background.default;
const brand = theme.palette.primary.main;

// Or in sx:
<Box sx={{ bgcolor: 'background.paper', color: 'text.primary' }} />`}
          </Box>
        </Box>
      </DemoSection>

      <DemoSection title="Accessibility">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <DemoCallout title="Contrast Ratios" icon={<PanToolAltOutlinedIcon fontSize="small" />}>
              All color combinations meet WCAG AA standards. Primary text on backgrounds maintains a
              minimum 4.5:1 contrast ratio, while large text maintains 3:1. Interactive elements have
              clear focus states.
            </DemoCallout>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DemoCallout title="Color Blindness" icon={<VisibilityOutlinedIcon fontSize="small" />}>
              Semantic colors are designed to be distinguishable for users with color vision
              deficiencies. Always pair color with icons or text labels for critical information.
            </DemoCallout>
          </Grid>
        </Grid>
      </DemoSection>
    </Box>
  );
}
