import { useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DemoPageHeader } from '@/demo/converted/foundation/DemoPageHeader';
import { DemoSection } from '@/demo/converted/foundation/DemoSection';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  DemoMappingSection,
  PropsTable,
  type PropRow,
} from '@/demo/ui';
import { demoPageTitle } from '@/demo/demoPageTitle';

/** Harmony size → MUI CircularProgress `size` (px). Thickness comes from theme. */
const spinnerSize = { sm: 16, md: 24, lg: 40 } as const;

const spinnerProps: PropRow[] = [
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Spinner size',
  },
];

const harmonyMappingRows: PropRow[] = [
  {
    name: 'size sm',
    type: '—',
    description: 'size={16}; thickness from theme',
  },
  {
    name: 'size md',
    type: '—',
    description: 'size={24} (theme default); thickness from theme',
  },
  {
    name: 'size lg',
    type: '—',
    description: 'size={40}; thickness from theme',
  },
  {
    name: '(loading semantics)',
    type: '—',
    description: 'aria-label="Loading"; theme enableTrackSlot for track ring',
  },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function SpinnersDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Spinner');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Spinner"
        description="Spinners indicate that content is loading or an action is being processed."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Sizes" description="Different spinner sizes.">
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            <CircularProgress size={spinnerSize.sm} aria-label="Loading" />
            <CircularProgress size={spinnerSize.md} aria-label="Loading" />
            <CircularProgress size={spinnerSize.lg} aria-label="Loading" />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="In Context" description="Spinners in common use cases.">
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <CircularProgress size={spinnerSize.sm} aria-label="Loading" />
              <Typography variant="body2" color="text.secondary">
                Loading...
              </Typography>
            </Stack>
            <Paper variant="outlined" sx={{ maxWidth: 384, p: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 4,
                }}
              >
                <Stack spacing={2} sx={{ alignItems: 'center' }}>
                  <CircularProgress size={spinnerSize.lg} aria-label="Loading" />
                  <Typography variant="body2" color="text.secondary">
                    Loading content...
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Stack>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={spinnerProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="tag" title="ARIA Attributes">
            Provide <code>aria-label=&quot;Loading&quot;</code> (or a more specific label) on{' '}
            <code>CircularProgress</code>. When describing a region, use{' '}
            <code>aria-describedby</code> / <code>aria-busy</code> on that region until loading
            finishes.
          </A11yCard>
          <A11yCard icon="eye" title="Screen Reader Support">
            Screen readers announce loading states. Provide descriptive <code>aria-label</code> text
            (e.g., &quot;Loading content&quot; or &quot;Processing request&quot;) to give context about what is
            loading.
          </A11yCard>
          <A11yCard icon="exclamation-circle" title="Animation Preferences">
            Respect user preferences for reduced motion. When <code>prefers-reduced-motion</code> is
            enabled, minimize or remove <code>CircularProgress</code> animation to accommodate users with
            motion sensitivity.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
