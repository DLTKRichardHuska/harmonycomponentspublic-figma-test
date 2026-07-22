import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import { Link as RouterLink } from 'react-router-dom';
import { StatusBadge } from '@/components/StatusBadge';
import { DemoIcon } from '../demoIconMap';
import {
  demoNavigation,
  componentDocPageCount,
  EXPORTED_UI_COMPONENT_COUNT,
} from '../demoNavigation';
import { getReferenceVersion } from '../manifestStatus';
import { demoPageTitle } from '@/demo/demoPageTitle';

export function DemoHomePage() {
  const version = getReferenceVersion();

  useEffect(() => {
    document.title = demoPageTitle('Overview');
  }, []);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 4, mb: 6 }}>
        <Box sx={{ mb: 2 }}>
          <StatusBadge variant="primary" size="large">
            v{version}
          </StatusBadge>
        </Box>
        <Typography variant="h2" component="h1" sx={{ letterSpacing: '-0.025em', mb: 2 }}>
          Design
          <br />
          System
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '42rem', lineHeight: 1.7 }}>
          A complete design system with foundation elements, shell layout components, and{' '}
          {EXPORTED_UI_COMPONENT_COUNT} production-ready UI components. Built with accessibility,
          performance, and flexibility in mind.
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 4 }}>
          {[
            'Dark & Light Themes',
            'Foundation System',
            'Shell Layout',
            `${EXPORTED_UI_COMPONENT_COUNT} Components`,
          ].map((label) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: 'primary.main', display: 'flex' }}>
                <DemoIcon name="check" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Quick Start
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              href: '/getting-started',
              icon: 'clipboard-document-check',
              title: 'Installation',
              desc: 'Install the npm package and wire the Harmony MUI theme into your app.',
            },
            { href: '/foundation/colors', icon: 'paint-brush', title: 'Foundation', desc: 'Colors, typography, spacing, and elevation tokens.' },
            { href: '/shell/layout', icon: 'squares-2x2', title: 'Shell Layout', desc: 'Headers, sidebars, footers, and page content areas.' },
            {
              href: '/components/buttons',
              icon: 'cube',
              title: 'Components',
              desc: `${EXPORTED_UI_COMPONENT_COUNT} production-ready UI components across ${componentDocPageCount} doc pages.`,
            },
          ].map((card) => (
            <Grid key={card.href} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardActionArea component={RouterLink} to={card.href} sx={{ height: '100%' }}>
                  <CardContent>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: 'action.selected',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        color: 'primary.main',
                      }}
                    >
                      <DemoIcon name={card.icon} />
                    </Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.desc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {demoNavigation.map((section) => (
        <Box key={section.title} sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Box
              sx={{
                width: 6,
                height: 24,
                bgcolor: 'primary.main',
                borderRadius: 1,
              }}
            />
            {section.title}
          </Typography>
          <Grid container spacing={2}>
            {section.items.map((item) => (
              <Grid key={item.href} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card variant="outlined">
                  <CardActionArea component={RouterLink} to={item.href}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          bgcolor: 'action.hover',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        <DemoIcon name={item.icon} />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
}
