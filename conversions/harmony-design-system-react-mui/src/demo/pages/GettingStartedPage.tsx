import { useEffect, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link as RouterLink } from 'react-router-dom';
import { demoPageTitle } from '@/demo/demoPageTitle';

function CodeBlock({ children }: { children: string }) {
  return (
    <Box
      component="pre"
      sx={(theme) => ({
        ...theme.typography.code,
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
        {children}
      </Box>
    </Box>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Box id={id} sx={{ mb: 6 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

const npmrcExample = `@dltkrichardhuska:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN`;

const installExample = `npm install @dltkrichardhuska/harmony-design-system-react-mui
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/x-date-pickers dayjs`;

const themeExample = `import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createHarmonyTheme } from '@dltkrichardhuska/harmony-design-system-react-mui/theme';

const theme = createHarmonyTheme({ product: 'cp' });

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        {/* your app */}
      </LocalizationProvider>
    </ThemeProvider>
  );
}`;

export function GettingStartedPage() {
  useEffect(() => {
    document.title = demoPageTitle('Getting Started');
  }, []);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', pb: 4, mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Getting Started
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '42rem' }}>
          Add the Harmony Design System React + MUI package to another project: install dependencies,
          wire the theme, then use MUI components as usual.
        </Typography>
      </Box>

      <Section id="install" title="1. Install">
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: '42rem' }}>
          The package is published to GitHub Packages. Configure npm for the{' '}
          <code>@dltkrichardhuska</code> scope with a GitHub token that has{' '}
          <code>read:packages</code>, then install the package and its peers.
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          .npmrc
        </Typography>
        <Box sx={{ mb: 3 }}>
          <CodeBlock>{npmrcExample}</CodeBlock>
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Install
        </Typography>
        <Box sx={{ mb: 2 }}>
          <CodeBlock>{installExample}</CodeBlock>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '42rem' }}>
          React and React DOM are peer dependencies and should already be present in your app.{' '}
          <code>@mui/x-date-pickers</code> and <code>dayjs</code> are required if you use date or time
          pickers.
        </Typography>
      </Section>

      <Section id="theme" title="2. Theme">
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: '42rem' }}>
          Create a Harmony theme with <code>createHarmonyTheme</code> and wrap your app in MUI&apos;s{' '}
          <code>ThemeProvider</code>. Fonts (Figtree, Lexend, JetBrains Mono) load automatically when
          you import the theme entry; you can also import{' '}
          <code>@dltkrichardhuska/harmony-design-system-react-mui/fonts</code> explicitly if needed.
          Pass <code>product</code> as <code>cp</code>, <code>vp</code>, <code>ppm</code>, or{' '}
          <code>maconomy</code> to select density and palette. For date pickers, wrap with{' '}
          <code>LocalizationProvider</code> and <code>AdapterDayjs</code> inside the theme provider.
        </Typography>
        <CodeBlock>{themeExample}</CodeBlock>
      </Section>

      <Section id="usage" title="3. Using the library">
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: '42rem' }}>
          Use stock MUI components from <code>@mui/material</code> (and MUI X date pickers) as you
          normally would. The Harmony theme styles them for you — no wrappers required for most UI.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1, maxWidth: '42rem' }}>
          Custom components that expand capabilities beyond themed MUI live in{' '}
          <code>@dltkrichardhuska/harmony-design-system-react-mui/components</code>:
        </Typography>
        <List dense sx={{ mb: 2, maxWidth: '42rem' }}>
          <ListItem disableGutters>
            <ListItemText
              primary={
                <Link component={RouterLink} to="/components/icons" underline="hover" sx={{ fontWeight: 600 }}>
                  HarmonyIcon
                </Link>
              }
              secondary="Icon set spanning Heroicons, Tabler, and Harmony manifest icons."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={
                <Link component={RouterLink} to="/components/badges" underline="hover" sx={{ fontWeight: 600 }}>
                  StatusBadge
                </Link>
              }
              secondary="Status and label badges beyond MUI Chip or Badge."
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={
                <Link component={RouterLink} to="/components/buttons" underline="hover" sx={{ fontWeight: 600 }}>
                  DelaButton
                </Link>
              }
              secondary="Dela-styled button variants for product-specific accents."
            />
          </ListItem>
        </List>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '42rem' }}>
          Browse Foundation and Components in this demo for live examples. Deeper notes on text fields
          and date pickers are in the package consumer guide.
        </Typography>
      </Section>
    </Box>
  );
}
