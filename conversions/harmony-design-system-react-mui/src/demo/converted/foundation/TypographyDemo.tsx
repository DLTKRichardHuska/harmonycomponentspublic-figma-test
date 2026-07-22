import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import PanToolAltOutlinedIcon from '@mui/icons-material/PanToolAltOutlined';
import { useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { DemoCallout } from './DemoCallout';
import { DemoPageHeader } from './DemoPageHeader';
import { DemoSection } from './DemoSection';
import { DemoExampleGroup } from '@/demo/ui';
import { demoPageTitle } from '@/demo/demoPageTitle';

const ARTICLE_NAV = [
  { href: '#display', label: 'Display' },
  { href: '#headings', label: 'Headings' },
  { href: '#body', label: 'Body' },
  { href: '#supporting', label: 'Supporting' },
  { href: '#fonts', label: 'Fonts' },
];

/** Includes custom `code` variant from theme augmentation. */
const TYPE_SCALE_VARIANTS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'caption',
  'overline',
  'code',
] as const;

function formatPx(value: string | number | undefined): string {
  if (value == null) return '—';
  if (typeof value === 'number') return `${value}px`;
  return String(value);
}

function buildTypeScaleRows(theme: Theme) {
  return TYPE_SCALE_VARIANTS.map((variant) => {
    const style = theme.typography[variant];
    if (typeof style !== 'object' || style == null) {
      return {
        variant,
        size: '—',
        weight: '—',
        lineHeight: '—',
        fontFamily: '—',
      };
    }
    return {
      variant,
      size: formatPx(style.fontSize as string | number | undefined),
      weight: String(style.fontWeight ?? '—'),
      lineHeight: String(style.lineHeight ?? '—'),
      fontFamily: String(style.fontFamily ?? theme.typography.fontFamily ?? '—'),
    };
  });
}

export function TypographyDemo() {
  const theme = useTheme();
  const typeScaleRows = useMemo(() => buildTypeScaleRows(theme), [theme]);

  useEffect(() => {
    document.title = demoPageTitle('Typography');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Typography"
        description="Typography variants from the Harmony MUI theme. Prefer Typography variant props and theme.typography — the same API an app using this package would use."
      />

      <Box component="nav" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 6 }}>
        {ARTICLE_NAV.map((item) => (
          <Link key={item.href} href={item.href} underline="hover" variant="body2" color="primary">
            {item.label}
          </Link>
        ))}
      </Box>

      <DemoSection
        id="display"
        title="Display"
        description="Large, bold text for hero sections, marketing headlines, and high-impact moments."
      >
        <DemoExampleGroup title="h1" description="theme.typography.h1">
          <Typography variant="h1">The quick brown fox</Typography>
        </DemoExampleGroup>
        <DemoExampleGroup title="h2" description="theme.typography.h2">
          <Typography variant="h2">The quick brown fox jumps</Typography>
        </DemoExampleGroup>
        <DemoExampleGroup title="h3" description="theme.typography.h3">
          <Typography variant="h3">The quick brown fox jumps over</Typography>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection
        id="headings"
        title="Headings"
        description="Semantic hierarchy for page structure. Use based on content importance, not visual size."
      >
        <DemoExampleGroup title="h4" description="theme.typography.h4">
          <Typography variant="h4">Heading Extra Large</Typography>
        </DemoExampleGroup>
        <DemoExampleGroup title="h5" description="theme.typography.h5">
          <Typography variant="h5">Heading Large</Typography>
        </DemoExampleGroup>
        <DemoExampleGroup title="h6" description="theme.typography.h6">
          <Typography variant="h6">Heading Medium</Typography>
        </DemoExampleGroup>
        <DemoExampleGroup title="subtitle1" description="theme.typography.subtitle1">
          <Typography variant="subtitle1">Heading Small</Typography>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection
        id="body"
        title="Body"
        description="Primary content text for readability and comprehension."
      >
        <DemoExampleGroup title="body1" description="theme.typography.body1">
          <Typography variant="body1" color="textSecondary">
            The quick brown fox jumps over the lazy dog. This is standard body text used for paragraphs,
            descriptions, and general content throughout the interface. It&apos;s optimized for readability
            at various screen sizes.
          </Typography>
        </DemoExampleGroup>
        <DemoExampleGroup title="body2" description="theme.typography.body2">
          <Typography variant="body2">
            The quick brown fox jumps over the lazy dog. This emphasized body text draws attention to key
            information while maintaining readability for longer passages.
          </Typography>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection
        id="supporting"
        title="Supporting Styles"
        description="Smaller text for labels, captions, and supplementary information."
      >
        <DemoExampleGroup title="subtitle2" description="theme.typography.subtitle2">
          <Typography variant="subtitle2">Form Field Label</Typography>
        </DemoExampleGroup>
        <DemoExampleGroup title="caption" description="theme.typography.caption">
          <Typography variant="caption" color="textDisabled">
            Last updated 2 hours ago • 5 min read
          </Typography>
        </DemoExampleGroup>
        <DemoExampleGroup title="overline" description="theme.typography.overline">
          <Typography variant="overline" color="textDisabled">
            FEATURED ARTICLE
          </Typography>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="fonts" title="Font Families">
        <DemoExampleGroup title="Display (h3)" description="theme.typography.h3 — display font family">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '0123456789'].map((sample) => (
              <Typography key={sample} variant="h3">
                {sample}
              </Typography>
            ))}
          </Box>
        </DemoExampleGroup>
        <DemoExampleGroup title="Body (subtitle1)" description="theme.typography.subtitle1 — body font family">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '0123456789'].map((sample) => (
              <Typography key={sample} variant="subtitle1">
                {sample}
              </Typography>
            ))}
          </Box>
        </DemoExampleGroup>
        <DemoExampleGroup title="Code" description="theme.typography.code / variant=&quot;code&quot;">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography component="code" variant="code">
              const greeting = &quot;Hello, World!&quot;;
            </Typography>
            <Paper
              component="pre"
              variant="outlined"
              sx={(t) => ({
                ...t.typography.code,
                p: 2,
                borderRadius: 2,
                overflow: 'auto',
                m: 0,
              })}
            >
              {`function example() {\n  return true;\n}`}
            </Paper>
          </Box>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection title="Type scale reference">
        <Paper variant="outlined" sx={{ overflow: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>MUI variant</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Line height</TableCell>
                <TableCell>Font family</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {typeScaleRows.map((row) => (
                <TableRow key={row.variant}>
                  <TableCell>
                    <code>{row.variant}</code>
                  </TableCell>
                  <TableCell>{row.size}</TableCell>
                  <TableCell>{row.weight}</TableCell>
                  <TableCell>{row.lineHeight}</TableCell>
                  <TableCell>
                    <Typography variant="code" component="span">
                      {row.fontFamily}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </DemoSection>

      <DemoSection title="Usage Guidelines">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <DemoCallout title="Use theme variants" icon={<LightbulbOutlinedIcon fontSize="small" />}>
              Prefer <code>Typography variant=&quot;…&quot;</code> and values from <code>theme.typography</code>.
              That is the public surface shipped by this package.
            </DemoCallout>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DemoCallout title="Accessibility" icon={<PanToolAltOutlinedIcon fontSize="small" />}>
              Ensure proper heading hierarchy in HTML (H1 → H2 → H3) regardless of visual styling. Screen
              readers navigate by heading structure, not visual appearance.
            </DemoCallout>
          </Grid>
        </Grid>
      </DemoSection>
    </Box>
  );
}
