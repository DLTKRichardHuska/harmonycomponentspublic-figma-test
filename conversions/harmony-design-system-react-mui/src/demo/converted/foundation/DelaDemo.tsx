import { useEffect } from 'react';
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
import { useTheme } from '@mui/material/styles';
import { DelaButton } from '@/components/DelaButton';
import { DemoPageHeader } from './DemoPageHeader';
import { DemoSection } from './DemoSection';
import { demoPageTitle } from '@/demo/demoPageTitle';

const PACKAGE_COMPONENTS = '@dltkrichardhuska/harmony-design-system-react-mui/components';

const ARTICLE_NAV = [
  { href: '#dela-brand-guide', label: 'Dela brand guide' },
  { href: '#star-symbol', label: 'Star Symbol' },
  { href: '#ask-dela-launch-icon', label: 'Ask Dela Launch Icon' },
  { href: '#ask-dela-panel', label: 'Ask Dela Panel' },
  { href: '#theme-dela', label: 'theme.dela' },
];

export function DelaDemo() {
  const theme = useTheme();
  const { dela } = theme;

  useEffect(() => {
    document.title = demoPageTitle('Dela');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Dela"
        description="Dela AI assistance surfaces. Use DelaButton and theme.dela — the same APIs an app using this package would use."
      />

      <Box component="nav" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 6 }}>
        {ARTICLE_NAV.map((item) => (
          <Link key={item.href} href={item.href} underline="hover" variant="body2" color="primary">
            {item.label}
          </Link>
        ))}
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DemoSection id="dela-brand-guide" title="Dela brand guide">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This guide is designed to provide a starting point for your work with Dela. The strategies
              behind Dela will continue to evolve as the AI landscape breaks new ground.
            </Typography>
            <DelaButton
              component="a"
              href="https://www.figma.com/proto/miqNBfEbHItRWIsPwAaaEr/2025_Dela_Product_Branding_Guidelines?node-id=3876-1740&p=f&m=dev&scaling=min-zoom&content-scaling=fixed&page-id=3876%3A861&t=EXcT5wMTx92t2hGx-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dela product brand guide
            </DelaButton>
          </DemoSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DemoSection id="star-symbol" title="Star Symbol">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Incorporate the star symbol as an optional complementary graphical element wherever the Dela
              brand is used within the product you&apos;re working on. Use sparingly.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Box component="img" src="/Stars.svg" alt="Star symbol" sx={{ height: 20 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Suggested minimum height: 20px
              </Typography>
            </Box>
          </DemoSection>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DemoSection id="ask-dela-launch-icon" title="Ask Dela Launch Icon">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The Ask Dela launch icon should exclusively serve the Digital Assistant in any product that
              does not have the Harmony sidebar applied. Its purpose is solely for initiating the chat
              window and may be strategically placed within various contexts, including within tables or
              as part of the primary navigation.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ensuring that the launch icon is exclusively reserved for the Digital Assistant fosters a
              consistent user experience. By limiting its application to launching the application, users
              can readily identify and access this AI-driven feature.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Box component="img" src="/AskDelaLaunch.svg" alt="Ask Dela launch icon" sx={{ height: 27 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Suggested minimum height: 27px
              </Typography>
            </Box>
          </DemoSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DemoSection id="ask-dela-panel" title="Ask Dela Panel">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Here&apos;s a visual representation of a baseline layout for the drawer version of the
              Digital Assistant. Use this as a starting point and adapt it according to your product
              requirements as needed.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              It&apos;s important to note that the work on the Digital Assistant experience is ongoing and
              will evolve over time. The long-term goal is to develop a product agnostic experience that
              seamlessly integrates across our entire product lineup. This means ensuring that the Digital
              Assistant functions smoothly regardless of the platform or product it&apos;s used in.
            </Typography>
          </DemoSection>
        </Grid>
      </Grid>

      <DemoSection id="theme-dela" title="theme.dela">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Dela surface tokens live on the theme. Prefer <code>useTheme().dela</code> and{' '}
          <code>DelaButton</code>. Package constants <code>DELA_GRADIENT</code> /{' '}
          <code>DELA_GRADIENT_HOVER</code> remain available as aliases of the same values.
        </Typography>
        <Paper variant="outlined" sx={{ overflow: 'auto', mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Path</TableCell>
                <TableCell>Value / usage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <code>theme.dela.gradient</code>
                </TableCell>
                <TableCell>
                  <code>{dela.gradient}</code>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <code>theme.dela.gradientHover</code>
                </TableCell>
                <TableCell>
                  <code>{dela.gradientHover}</code>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <code>theme.dela.contrastText</code>
                </TableCell>
                <TableCell>
                  <code>{dela.contrastText}</code>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <code>DelaButton</code>
                </TableCell>
                <TableCell>Custom component for Dela CTA actions</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>

        <Box
          component="pre"
          sx={(t) => ({
            ...t.typography.code,
            m: 0,
            mb: 3,
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
import { DelaButton } from '${PACKAGE_COMPONENTS}';

const theme = useTheme();
const gradient = theme.dela.gradient;`}
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sidebar active gradient swatch (<code>theme.dela.gradient</code>)
        </Typography>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 1.5,
            background: dela.gradient,
          }}
          aria-label="Dela sidebar active gradient"
        />
      </DemoSection>
    </Box>
  );
}
