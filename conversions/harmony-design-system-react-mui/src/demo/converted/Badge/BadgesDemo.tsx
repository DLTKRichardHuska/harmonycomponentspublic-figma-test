import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { StatusBadge } from '@/components/StatusBadge';
import { DemoPageHeader } from '@/demo/converted/foundation/DemoPageHeader';
import { DemoSection } from '@/demo/converted/foundation/DemoSection';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  DemoImportSnippet,
  DemoMappingSection,
  PropsTable,
  type PropRow,
} from '@/demo/ui';
import { demoPageTitle } from '@/demo/demoPageTitle';

const badgeProps: PropRow[] = [
  {
    name: 'variant',
    type: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'orange' | 'pink' | 'disabled'",
    default: "'default'",
    description: 'Badge style variant using statusBadge palette tones',
  },
  {
    name: 'size',
    type: "'small' | 'medium' | 'large'",
    default: "'large'",
    description: 'Badge size — small 16px, medium 20px, large 24px heights',
  },
  {
    name: 'icon',
    type: 'string',
    default: '—',
    description: 'Harmony icon name (e.g. check, x-mark) — scales with size',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: '—',
    description: 'Badge label content',
  },
  {
    name: 'sx',
    type: 'SxProps<Theme>',
    default: '—',
    description: 'MUI system overrides (same pattern as Chip / Box)',
  },
  {
    name: '…HTMLAttributes',
    type: 'HTMLAttributes<HTMLSpanElement>',
    default: '—',
    description:
      'Native span attributes and events (className, onClick, aria-*, …). Non-interactive by default — attach handlers if needed.',
  },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'variant', type: 'StatusBadgeVariant', description: 'variant (same values)' },
  { name: 'size', type: "'small' | 'medium' | 'large'", description: 'size (same values)' },
  { name: 'icon', type: 'string', description: 'icon (Harmony icon name)' },
  { name: 'slot / children', type: 'ReactNode', description: 'children' },
];

const exampleRowSx = { gap: 1.5, flexWrap: 'wrap', alignItems: 'center' } as const;

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

export function BadgesDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Badges');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Badges"
        description="Badges are small status indicators used to highlight information or categorize content."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoImportSnippet namedExport="StatusBadge" />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Variants" description="Different badge styles using Alert Chip colors.">
          <Stack direction="row" spacing={1.5} sx={exampleRowSx}>
            <StatusBadge variant="default">Default</StatusBadge>
            <StatusBadge variant="primary">Primary</StatusBadge>
            <StatusBadge variant="success">Success</StatusBadge>
            <StatusBadge variant="warning">Warning</StatusBadge>
            <StatusBadge variant="error">Error</StatusBadge>
            <StatusBadge variant="info">Info</StatusBadge>
            <StatusBadge variant="orange">Orange</StatusBadge>
            <StatusBadge variant="pink">Pink</StatusBadge>
            <StatusBadge variant="disabled">Disabled</StatusBadge>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Sizes"
          description="Small (16px), medium (20px), and large (24px) heights."
        >
          <Stack direction="row" spacing={1.5} sx={exampleRowSx}>
            <StatusBadge variant="default" size="small">
              Small
            </StatusBadge>
            <StatusBadge variant="default" size="medium">
              Medium
            </StatusBadge>
            <StatusBadge variant="default" size="large">
              Large
            </StatusBadge>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="With Icons"
          description="Badges with leading icons. The icon scales with the badge size."
        >
          <Stack direction="row" spacing={1.5} sx={exampleRowSx}>
            <StatusBadge variant="success" icon="check">
              Approved
            </StatusBadge>
            <StatusBadge variant="warning" icon="clock">
              Pending
            </StatusBadge>
            <StatusBadge variant="error" icon="x-mark">
              Rejected
            </StatusBadge>
            <StatusBadge variant="info" icon="information-circle">
              Info
            </StatusBadge>
          </Stack>
          <Stack direction="row" spacing={1.5} sx={{ ...exampleRowSx, mt: 2 }}>
            <StatusBadge variant="success" size="small" icon="check">
              Small
            </StatusBadge>
            <StatusBadge variant="success" size="medium" icon="check">
              Medium
            </StatusBadge>
            <StatusBadge variant="success" size="large" icon="check">
              Large
            </StatusBadge>
          </Stack>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={badgeProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard icon="eye" title="Semantic HTML">
            Badges use semantic <code>&lt;span&gt;</code> elements and are typically decorative. When badges convey
            important information, ensure they are associated with their related content using appropriate ARIA
            attributes or proximity.
          </A11yCard>
          <A11yCard icon="cursor-arrow-rays" title="Color Contrast">
            All badge variants meet WCAG 2.1 AA contrast requirements. Text and background colors provide sufficient
            contrast for readability.
          </A11yCard>
          <A11yCard icon="tag" title="Icon Badges">
            When badges contain only icons, ensure the parent element or badge itself includes{' '}
            <code>aria-label</code> or <code>aria-labelledby</code> to provide context for screen readers.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
