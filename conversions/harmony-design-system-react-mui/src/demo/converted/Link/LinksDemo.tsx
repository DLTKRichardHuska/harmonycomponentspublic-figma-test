import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { HarmonyIcon } from '@/components/HarmonyIcon';
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

const linkProps: PropRow[] = [
  { name: 'href', type: 'string', default: '—', description: 'Link URL' },
  {
    name: 'underline',
    type: "'none' | 'hover' | 'always'",
    default: "'hover'",
    description: 'Underline behavior — Harmony default is underline on hover only',
  },
  {
    name: 'color',
    type: "'primary' | 'textSecondary' | 'inherit'",
    default: "'primary'",
    description: 'Link color — primary uses Harmony link token; textSecondary maps Harmony muted',
  },
  {
    name: 'variant',
    type: "'caption' | 'subtitle2' | 'body1'",
    default: "'subtitle2'",
    description: 'Typography size — maps Harmony size small / medium / large',
  },
  {
    name: 'target',
    type: 'string',
    default: '—',
    description: 'Set to "_blank" for external links',
  },
  {
    name: 'rel',
    type: 'string',
    default: '—',
    description: 'Use "noopener noreferrer" with target="_blank"',
  },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'href', type: 'string', description: 'href' },
  {
    name: 'external',
    type: 'boolean',
    description:
      'target="_blank" rel="noopener noreferrer" + <HarmonyIcon name="arrow-top-right-on-square" fontSize="inherit" /> child',
  },
  {
    name: 'muted',
    type: 'boolean',
    description: 'color="textSecondary" — theme hover restores text.primary',
  },
  {
    name: 'size="small"',
    type: '—',
    description: 'variant="caption" (12px)',
  },
  {
    name: 'size="medium"',
    type: '—',
    description: 'variant="subtitle2" (14px, default)',
  },
  {
    name: 'size="large"',
    type: '—',
    description: 'variant="body1" (16px)',
  },
  {
    name: 'responsive default sizing',
    type: '—',
    description: 'Not supported — see Responsive sizing callout',
  },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function LinksDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Links');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Links"
        description="Links allow users to navigate to other pages or external resources."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Link" description="Standard link styling.">
          <Typography color="text.secondary">
            Visit our <Link href="#">documentation</Link> for more information.
          </Typography>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Size variants"
          description="Small (12px), medium (14px), and large (16px). All use regular weight."
        >
          <Typography color="text.secondary" component="p">
            <Link href="#" variant="caption">
              Small link
            </Link>
            {' · '}
            <Link href="#" variant="subtitle2">
              Medium link
            </Link>
            {' · '}
            <Link href="#" variant="body1">
              Large link
            </Link>
          </Typography>
        </DemoExampleGroup>

        <DemoExampleGroup title="External Link" description="Link that opens in a new tab.">
          <Typography color="text.secondary">
            Check out{' '}
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
              <HarmonyIcon name="arrow-top-right-on-square" fontSize="inherit" />
            </Link>{' '}
            for the source code.
          </Typography>
        </DemoExampleGroup>

        <DemoExampleGroup title="Muted Link" description="Less prominent link style.">
          <Typography color="text.secondary" component="p">
            <Link href="#" color="textSecondary">
              Privacy Policy
            </Link>
            {' · '}
            <Link href="#" color="textSecondary">
              Terms of Service
            </Link>
          </Typography>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Responsive default sizing"
          description="Reference shrinks implicit-size links below 768px viewport width."
        >
          <UnsupportedEquivalentCallout
            feature="responsive default link sizing"
            reason="MUI Link has no responsive size prop. Use explicit variant on each link instead."
          />
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={linkProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="tag" title="Semantic HTML">
            Links use semantic <code>&lt;a&gt;</code> elements, ensuring proper navigation behavior and screen reader
            support. External links automatically include an icon and <code>aria-label</code> indicating they open in a
            new tab.
          </A11yCard>
          <A11yCard icon="keyboard" title="Keyboard Navigation">
            All links are keyboard accessible. Use <kbd>Tab</kbd> to navigate to links and <kbd>Enter</kbd> to activate
            them. Links have visible focus indicators.
          </A11yCard>
          <A11yCard icon="eye" title="External Links">
            When opening in a new tab, use <code>target=&quot;_blank&quot;</code> with{' '}
            <code>rel=&quot;noopener noreferrer&quot;</code> and compose a trailing{' '}
            <code>HarmonyIcon</code> so users understand the navigation behavior.
          </A11yCard>
          <A11yCard icon="cursor-arrow-rays" title="Focus Indicators">
            Links include visible focus indicators that meet WCAG 2.1 requirements. Focus is clearly visible when
            navigating with keyboard.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
