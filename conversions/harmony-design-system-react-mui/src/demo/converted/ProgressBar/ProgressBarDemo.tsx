import { useEffect } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
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
import { UnsupportedEquivalentCallout } from '@/demo/UnsupportedEquivalentCallout';
import { demoPageTitle } from '@/demo/demoPageTitle';

const progressProps: PropRow[] = [
  { name: 'value', type: 'number', default: '0', description: 'Current progress value' },
  { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Progress bar height',
  },
  {
    name: 'variant',
    type: "'default' | 'success' | 'warning' | 'error'",
    default: "'default'",
    description: 'Color variant',
  },
  { name: 'showLabel', type: 'boolean', default: 'false', description: 'Show percentage label' },
];

const harmonyMappingRows: PropRow[] = [
  {
    name: 'value',
    type: 'number',
    description: 'variant="determinate" value={percentage} where percentage = (value / max) * 100',
  },
  {
    name: 'max',
    type: 'number',
    description: 'Compute percentage from value/max; or use LinearProgress value + max props directly',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    description: 'Not supported — MUI LinearProgress has no size prop; see Sizes example callout',
  },
  {
    name: 'variant',
    type: "'default' | 'success' | 'warning' | 'error'",
    description: 'color="primary" | "success" | "warning" | "error"',
  },
  {
    name: 'showLabel',
    type: 'boolean',
    description: 'Compose Typography variant="subtitle2" color="textSecondary" below LinearProgress',
  },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function ProgressBarDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Progress Bar');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Progress Bar"
        description="Progress bars indicate the completion status of a task or process."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Progress" description="Standard progress bars.">
          <Stack spacing={2} sx={{ maxWidth: 448 }}>
            <LinearProgress variant="determinate" value={25} />
            <LinearProgress variant="determinate" value={50} />
            <LinearProgress variant="determinate" value={75} />
            <LinearProgress variant="determinate" value={100} />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="Different progress bar sizes.">
          <UnsupportedEquivalentCallout
            feature='size="sm" | "md" | "lg"'
            reason="MUI LinearProgress has no size prop. Theme applies a single default height (md / 8px)."
          />
        </DemoExampleGroup>

        <DemoExampleGroup title="Variants" description="Different color variants.">
          <Stack spacing={2} sx={{ maxWidth: 448 }}>
            <LinearProgress variant="determinate" value={75} color="primary" />
            <LinearProgress variant="determinate" value={75} color="success" />
            <LinearProgress variant="determinate" value={75} color="warning" />
            <LinearProgress variant="determinate" value={75} color="error" />
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Label" description="Progress bar with percentage label.">
          <Stack spacing={0.5} sx={{ maxWidth: 448 }}>
            <LinearProgress variant="determinate" value={42} />
            <Typography variant="subtitle2" color="textSecondary">
              42%
            </Typography>
          </Stack>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={progressProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="tag" title="ARIA Attributes">
            MUI <code>LinearProgress</code> renders with <code>role=&quot;progressbar&quot;</code> and{' '}
            <code>aria-valuenow</code>, <code>aria-valuemin</code>, and <code>aria-valuemax</code> for determinate
            variants.
          </A11yCard>
          <A11yCard icon="eye" title="Screen Reader Support">
            Screen readers announce the current progress value and percentage. When a percentage label is shown below
            the bar, it is also visually displayed for all users.
          </A11yCard>
          <A11yCard icon="cursor-arrow-rays" title="Color Contrast">
            All progress bar variants meet WCAG 2.1 AA contrast requirements. The progress indicator has sufficient
            contrast against the background for visibility.
          </A11yCard>
          <A11yCard icon="tag" title="Labels">
            Provide an <code>aria-label</code> or associated label text to describe what the progress bar represents
            (e.g., &quot;Upload progress&quot; or &quot;Form completion&quot;).
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
