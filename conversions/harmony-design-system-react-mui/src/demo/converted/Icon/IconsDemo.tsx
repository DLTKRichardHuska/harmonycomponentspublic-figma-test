import { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { HarmonyIcon } from '@/components/HarmonyIcon';
import { DemoPageHeader } from '@/demo/converted/foundation/DemoPageHeader';
import { DemoSection } from '@/demo/converted/foundation/DemoSection';
import { DemoExampleGroup, DemoIconGrid, DemoImportSnippet, PropsTable, type PropRow } from '@/demo/ui';
import {
  customIconCategories,
  iconCategories,
  totalCustomIcons,
  totalHeroIcons,
} from './iconCategories';
import { demoPageTitle } from '@/demo/demoPageTitle';

const iconProps: PropRow[] = [
  {
    name: 'name',
    type: 'string',
    default: '—',
    description: 'Required — Hero Icon or Tabler icon identifier',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    default: '—',
    description: 'Fixed Harmony size scale — when omitted, sizing falls through to fontSize',
  },
  {
    name: 'fontSize',
    type: "'inherit' | 'small' | 'medium' | 'large' | number",
    default: "'medium'",
    description: 'MUI SvgIcon-compatible size — use "inherit" in Button/Alert icon slots',
  },
  {
    name: 'color',
    type: 'SvgIcon color',
    default: "'inherit'",
    description: 'MUI SvgIcon-compatible color (primary, action, inherit, etc.)',
  },
  {
    name: 'variant',
    type: "'outline' | 'solid'",
    default: "'outline'",
    description: 'Icon style variant',
  },
  {
    name: 'product',
    type: 'HarmonyProduct',
    default: '—',
    description: 'Product context for product-specific / manifest icon resolution',
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Optional CSS class on the root',
  },
  {
    name: 'sx',
    type: 'SxProps<Theme>',
    default: '—',
    description: 'MUI system overrides',
  },
  {
    name: 'titleAccess',
    type: 'string',
    default: '—',
    description:
      'SvgIcon-compatible title (tooltip / assistive hint). Icon remains decorative (aria-hidden) by default — label interactive parents.',
  },
];

export function IconsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Icons');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Icons"
        description={
          <>
            The Harmony Design System uses <strong>Hero Icons (Outline)</strong> as the primary icon library.
          </>
        }
      />

      <DemoSection id="props" title="Icon Props">
        <PropsTable props={iconProps} />
      </DemoSection>

      <DemoSection id="examples" title="Usage">
        <DemoImportSnippet namedExport="HarmonyIcon" />

        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            HarmonyIcon Component
          </Typography>
          <Box
            component="pre"
            sx={(theme) => ({
              ...theme.typography.code,
              m: 0,
              overflow: 'auto',
              bgcolor: 'background.default',
              p: 2,
              borderRadius: 1,
              whiteSpace: 'pre',
            })}
          >
            {`<HarmonyIcon name="arrow-down" />\n<HarmonyIcon name="check-circle" size="lg" />`}
          </Box>
        </Paper>

        <DemoExampleGroup title="Icon Sizes" description="Available size variants">
          <Stack direction="row" spacing={4} sx={{ gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <Stack key={size} sx={{ alignItems: 'center', gap: 1 }}>
                <HarmonyIcon name="home" size={size} />
                <Typography variant="caption" color="text.secondary">
                  {size} (
                  {size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 32}px)
                </Typography>
              </Stack>
            ))}
          </Stack>
        </DemoExampleGroup>

        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Using with MUI components
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            In MUI icon slots (Button <code>startIcon</code>, Alert <code>icon</code>, IconButton children), pass{' '}
            <code>fontSize=&quot;inherit&quot;</code> so the icon scales with the parent slot.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
            <Button variant="contained" startIcon={<HarmonyIcon name="plus" fontSize="inherit" />}>
              Add item
            </Button>
            <Alert severity="info" icon={<HarmonyIcon name="information-circle" fontSize="inherit" />}>
              Informational alert
            </Alert>
          </Stack>
          <Box
            component="pre"
            sx={(theme) => ({
              ...theme.typography.code,
              m: 0,
              overflow: 'auto',
              bgcolor: 'background.default',
              p: 2,
              borderRadius: 1,
              whiteSpace: 'pre',
            })}
          >
            {`<Button startIcon={<HarmonyIcon name="plus" fontSize="inherit" />}>Add item</Button>\n<Alert icon={<HarmonyIcon name="information-circle" fontSize="inherit" />} severity="info">…</Alert>`}
          </Box>
        </Paper>
      </DemoSection>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Icon Selection Guide
        </Typography>

        <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Icon Hierarchy for Application Development
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            When building applications with this design system, follow this priority order:
          </Typography>
          <Box component="ol" sx={{ pl: 2.5, m: 0, color: 'text.secondary', typography: 'body2' }}>
            <Box component="li" sx={{ mb: 1.5 }}>
              <strong>Check Heroicons First</strong> — 284 outline icons for common UI needs
              <br />
              <code>&lt;HarmonyIcon name=&quot;home&quot; /&gt;</code>
            </Box>
            <Box component="li" sx={{ mb: 1.5 }}>
              <strong>Use Tabler Icons as Fallback</strong> — 4,600+ icons when Heroicons doesn&apos;t have what you
              need
              <br />
              <code>&lt;i class=&quot;ti ti-brand-github&quot;&gt;&lt;/i&gt;</code>
              <br />
              <Link href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer" variant="caption">
                Browse Tabler Icons →
              </Link>
            </Box>
            <Box component="li">
              <strong>Custom Icons for Domain-Specific Needs</strong> — Project management, risk management, etc.
              <br />
              <code>&lt;HarmonyIcon name=&quot;gantt-chart&quot; /&gt;</code>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            <strong>Note:</strong> This design system documentation uses only Heroicons and Custom icons for
            consistency. Tabler is available as a developer tool when needed.
          </Typography>
        </Paper>

        <DemoExampleGroup title="Heroicons (Primary)" description="Via HarmonyIcon component - 284 icons">
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <HarmonyIcon name="home" size="lg" />
            <HarmonyIcon name="user" size="lg" />
            <HarmonyIcon name="cog" size="lg" />
          </Stack>
          <Box
            component="pre"
            sx={(theme) => ({
              ...theme.typography.code,
              m: 0,
              overflow: 'auto',
              bgcolor: 'background.default',
              p: 2,
              borderRadius: 1,
              whiteSpace: 'pre',
            })}
          >
            {`<HarmonyIcon name="home" />\n<HarmonyIcon name="user" size="md" />`}
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="Tabler Icons (Secondary Fallback)" description="Via CSS classes - 4,600+ icons">
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
            <HarmonyIcon name="code-bracket" size="sm" />
            <Box
              component="i"
              className="ti ti-database"
              sx={(theme) => ({ fontSize: theme.typography.h5.fontSize })}
            />
            <Box
              component="i"
              className="ti ti-terminal"
              sx={(theme) => ({ fontSize: theme.typography.h5.fontSize })}
            />
          </Stack>
          <Box
            component="pre"
            sx={(theme) => ({
              ...theme.typography.code,
              m: 0,
              overflow: 'auto',
              bgcolor: 'background.default',
              p: 2,
              borderRadius: 1,
              whiteSpace: 'pre',
            })}
          >
            {`<i class="ti ti-brand-github"></i>\n<i class="ti ti-database"></i>`}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tabler icons require the Tabler web font. Browse all icons at{' '}
            <Link href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer">
              tabler.io/icons
            </Link>
          </Typography>
        </DemoExampleGroup>

        <DemoExampleGroup title="Custom Icons (Tertiary)" description="Domain-specific project icons">
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <HarmonyIcon name="gantt-chart" size="lg" />
            <HarmonyIcon name="Risk Shield" size="lg" />
            <HarmonyIcon name="dock-center" size="lg" />
          </Stack>
          <Box
            component="pre"
            sx={(theme) => ({
              ...theme.typography.code,
              m: 0,
              overflow: 'auto',
              bgcolor: 'background.default',
              p: 2,
              borderRadius: 1,
              whiteSpace: 'pre',
            })}
          >
            {`<HarmonyIcon name="gantt-chart" />\n<HarmonyIcon name="Risk Shield" />`}
          </Box>
        </DemoExampleGroup>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
          Hero Icons - Outline (24x24)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          All {totalHeroIcons} outline icons from{' '}
          <Link href="https://heroicons.com/" target="_blank" rel="noopener noreferrer">
            heroicons.com
          </Link>
          .
        </Typography>
        {Object.entries(iconCategories).map(([category, icons]) => (
          <DemoExampleGroup key={category} title={category} description={`${icons.length} icons`}>
            <DemoIconGrid icons={icons} />
          </DemoExampleGroup>
        ))}
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
          Custom Icons
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {totalCustomIcons} domain-specific icons for project management, risk management, and specialized UI
          features. These icons extend Heroicons with project-specific needs.
        </Typography>
        {Object.entries(customIconCategories).map(([category, icons]) => (
          <DemoExampleGroup key={category} title={category} description={`${icons.length} icons`}>
            <DemoIconGrid icons={icons} />
          </DemoExampleGroup>
        ))}
      </Box>

      <DemoSection id="accessibility" title="Accessibility">
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
            <HarmonyIcon name="eye" size="md" />
            <Typography variant="subtitle2">Icon Accessibility</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            All icons (Heroicons, Tabler, and Custom) include <code>aria-hidden=&quot;true&quot;</code> by default.
            When using icons without text labels, add an <code>aria-label</code> to the parent button or link for
            screen reader users.
          </Typography>
          <Box
            component="pre"
            sx={(theme) => ({
              ...theme.typography.code,
              m: 0,
              overflow: 'auto',
              bgcolor: 'background.default',
              p: 2,
              borderRadius: 1,
              whiteSpace: 'pre',
            })}
          >
            {`<button aria-label="Edit document">\n  <HarmonyIcon name="pencil" />\n</button>\n\n<button aria-label="Delete item">\n  <HarmonyIcon name="trash" />\n</button>`}
          </Box>
        </Paper>
      </DemoSection>
    </Box>
  );
}
