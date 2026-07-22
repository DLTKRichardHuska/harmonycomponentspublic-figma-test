import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export interface ColorSwatch {
  /** Palette path consumers use, e.g. `primary.main` or `statusBadge.primary.background`. */
  key: string;
  name: string;
  /** Resolved color string for the label (from `theme.palette`). */
  value: string;
  usage?: string;
  /**
   * Fill color when `key` is not a path MUI `bgcolor` can resolve
   * (e.g. nested `statusBadge.*`). Defaults to `key`.
   */
  fill?: string;
}

interface ColorSwatchGridProps {
  swatches: ColorSwatch[];
  columns?: { xs?: number; md?: number; lg?: number };
}

export function ColorSwatchGrid({ swatches, columns = { xs: 6, md: 4, lg: 3 } }: ColorSwatchGridProps) {
  const xs = 12 / (columns.xs ?? 6);
  const md = 12 / (columns.md ?? 4);
  const lg = 12 / (columns.lg ?? 3);

  return (
    <Grid container spacing={2}>
      {swatches.map((swatch) => (
        <Grid key={swatch.key} size={{ xs, md, lg }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box
              data-color-key={swatch.key}
              sx={{
                height: 80,
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                bgcolor: swatch.fill ?? swatch.key,
              }}
            />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {swatch.name}
              </Typography>
              <Typography variant="code" color="text.disabled" sx={{ display: 'block' }}>
                {swatch.value}
              </Typography>
            </Box>
            {swatch.usage && (
              <Typography variant="caption" color="text.secondary">
                {swatch.usage}
              </Typography>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
