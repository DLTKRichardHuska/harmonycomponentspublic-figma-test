import { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { DemoPageHeader } from './DemoPageHeader';
import { DemoSection } from './DemoSection';
import { demoPageTitle } from '@/demo/demoPageTitle';

const SHADOW_SLOTS = [
  { index: 0, name: 'None', description: 'Flat surfaces with no elevation', usage: 'Inline text, dense tables' },
  { index: 1, name: 'sm', description: 'Subtle lift for small interactive surfaces', usage: 'Buttons, chips, inputs' },
  { index: 2, name: 'md', description: 'Default card and panel elevation', usage: 'Cards, menus' },
  { index: 3, name: 'lg', description: 'Stronger separation from the page', usage: 'Dropdowns, popovers' },
  { index: 4, name: 'xl', description: 'High emphasis overlays', usage: 'Modals, drawers' },
  { index: 5, name: '2xl', description: 'Maximum elevation for critical overlays', usage: 'Dialogs, toasts' },
] as const;

export function ElevationsDemo() {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const activeShadows = useMemo(
    () =>
      SHADOW_SLOTS.map((slot) => ({
        ...slot,
        value: theme.shadows[slot.index],
        access: `theme.shadows[${slot.index}]`,
      })),
    [theme],
  );

  useEffect(() => {
    document.title = demoPageTitle('Elevations');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Elevations"
        description="Shadow values from theme.shadows for the active color scheme. Use theme.shadows[n] or Paper elevation — the same API an app using this package would use."
      />

      <DemoSection
        title="Shadow scale"
        description={`Active color scheme: ${mode}. Shadows follow the theme color scheme (light/dark).`}
      >
        <Grid container spacing={3}>
          {activeShadows.map((shadow) => (
            <Grid key={shadow.index} size={{ xs: 12, md: 6, lg: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: shadow.value,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  {shadow.name}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 1 }}>
                  {shadow.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {shadow.usage}
                </Typography>
                <Typography variant="code" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
                  {shadow.access}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DemoSection>

      <DemoSection
        title="Shadow values"
        description="Resolved CSS box-shadow strings from the active theme."
      >
        <Stack spacing={2}>
          {activeShadows
            .filter((s) => s.index !== 0)
            .map((shadow) => (
              <Paper key={shadow.index} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {shadow.name}
                  </Typography>
                  <Chip label={shadow.access} size="small" variant="outlined" />
                </Box>
                <Box
                  component="code"
                  sx={(t) => ({
                    ...t.typography.code,
                    display: 'block',
                    color: 'text.disabled',
                    p: 1,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    wordBreak: 'break-all',
                  })}
                >
                  {shadow.value}
                </Box>
              </Paper>
            ))}
        </Stack>
      </DemoSection>

      <DemoSection title="Paper elevation">
        <Stack spacing={2}>
          {activeShadows.map((shadow) => (
            <Paper
              key={shadow.index}
              elevation={shadow.index}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: shadow.index === 0 ? 'action.hover' : 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  elevation={shadow.index} ({shadow.name})
                </Typography>
                <Chip label={`theme.shadows[${shadow.index}]`} size="small" variant="outlined" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {shadow.description}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </DemoSection>
    </Box>
  );
}
