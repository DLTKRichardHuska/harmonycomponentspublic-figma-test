import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import { useTheme } from '@mui/material/styles';
import { DemoPageHeader } from './DemoPageHeader';
import { DemoSection } from './DemoSection';
import { demoPageTitle } from '@/demo/demoPageTitle';

const SPACING_STEPS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16] as const;

const USAGE_PATTERNS = [
  {
    key: 'tight',
    title: 'Tight',
    example: 'theme.spacing(1) · Stack spacing={1}',
    usage: 'Compact icon + label groups and dense control clusters.',
  },
  {
    key: 'default',
    title: 'Default',
    example: 'theme.spacing(2) · Stack spacing={2}',
    usage: 'Standard gaps between related controls and content blocks.',
  },
  {
    key: 'relaxed',
    title: 'Relaxed',
    example: 'theme.spacing(3) · Stack spacing={3}',
    usage: 'Section padding and form field vertical rhythm.',
  },
  {
    key: 'loose',
    title: 'Loose',
    example: 'theme.spacing(4) · Stack spacing={4}',
    usage: 'Page-level section separation and card content spacing.',
  },
] as const;

export function SpacingDemo() {
  const theme = useTheme();

  const spacingScale = useMemo(
    () =>
      SPACING_STEPS.map((step) => ({
        step,
        name: `spacing(${step})`,
        value: theme.spacing(step),
      })),
    [theme],
  );

  const borderRadiusScale = useMemo(() => {
    const harmony = theme.shape.harmony ?? {};
    return Object.entries(harmony).map(([name, value]) => ({
      name,
      value,
      access: `theme.shape.harmony['${name}']`,
    }));
  }, [theme]);

  useEffect(() => {
    document.title = demoPageTitle('Spacing');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Spacing"
        description="Spacing and radius from the Harmony MUI theme. Use theme.spacing() and theme.shape — the same API an app using this package would use."
      />

      <DemoSection
        title="Spacing scale"
        description={`theme.spacing uses a ${theme.spacing(1)} unit (Harmony 4px grid). theme.spacing(n) returns n × that unit.`}
      >
        <Stack spacing={1.5}>
          {spacingScale.map((space) => (
            <Box key={space.step} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.disabled" sx={{ width: 96, flexShrink: 0 }}>
                {space.name}
              </Typography>
              <Box sx={{ width: space.value, height: 24, bgcolor: 'primary.main', flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary">
                {space.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </DemoSection>

      <DemoSection title="Usage patterns">
        <Grid container spacing={3}>
          {USAGE_PATTERNS.map((pattern) => (
            <Grid key={pattern.key} size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {pattern.title}
                  </Typography>
                  <Typography variant="code" color="text.disabled" sx={{ display: 'block', mb: 1 }}>
                    {pattern.example}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {pattern.usage}
                  </Typography>
                  {pattern.key === 'tight' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                      <StarBorderOutlinedIcon fontSize="small" />
                      <Typography variant="body2">Example with gap: theme.spacing(1)</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DemoSection>

      <DemoSection
        title="Border radius"
        description="Named radii on theme.shape.harmony. Default shape.borderRadius is also available for MUI components."
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          theme.shape.borderRadius = {theme.shape.borderRadius}
        </Typography>
        <Grid container spacing={3}>
          {borderRadiusScale.map((radius) => (
            <Grid key={radius.name} size={{ xs: 6, md: 4, lg: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 1.5,
                    bgcolor: 'primary.main',
                    border: 1,
                    borderColor: 'primary.dark',
                    borderRadius: radius.value,
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {radius.name}
                </Typography>
                <Typography variant="code" color="text.disabled" sx={{ display: 'block' }}>
                  {radius.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DemoSection>

      <DemoSection title="Theme access">
        <Paper variant="outlined" sx={{ overflow: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Path</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <code>theme.shape.borderRadius</code>
                </TableCell>
                <TableCell>{theme.shape.borderRadius}</TableCell>
              </TableRow>
              {borderRadiusScale.map((radius) => (
                <TableRow key={radius.name}>
                  <TableCell>
                    <code>{radius.access}</code>
                  </TableCell>
                  <TableCell>{radius.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </DemoSection>
    </Box>
  );
}
