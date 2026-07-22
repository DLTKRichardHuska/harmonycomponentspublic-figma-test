import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import HighlightOutlinedIcon from '@mui/icons-material/HighlightOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { DelaButton } from '@/components/DelaButton';
import { HarmonyIcon } from '@/components/HarmonyIcon';
import { DemoPageHeader } from '@/demo/converted/foundation/DemoPageHeader';
import { DemoSection } from '@/demo/converted/foundation/DemoSection';
import {
  DemoArticleNav,
  DemoExampleGroup,
  DemoImportSnippet,
  DemoMappingSection,
  PropsTable,
  type PropRow,
} from '@/demo/ui';
import { UnsupportedEquivalentCallout } from '@/demo/UnsupportedEquivalentCallout';
import { demoPageTitle } from '@/demo/demoPageTitle';

const exampleRowSx = { gap: 2, flexWrap: 'wrap', alignItems: 'center' } as const;

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#props', label: 'Props' },
  { href: '#dela-props', label: 'DelaButton props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#usage', label: 'Usage' },
  { href: '#accessibility', label: 'Accessibility' },
];

const buttonProps: PropRow[] = [
  {
    name: 'variant',
    type: "'text' | 'outlined' | 'contained'",
    default: "'contained'",
    description: 'MUI button style — maps from Harmony primary/secondary/tertiary/outline/ghost/destructive',
  },
  {
    name: 'color',
    type: "'primary' | 'inherit' | 'error' | 'pageHeader'",
    default: "'primary'",
    description: 'MUI palette color — pageHeader replaces Harmony buttonType="pageHeader"',
  },
  {
    name: 'size',
    type: "'small' | 'medium' | 'large'",
    default: "'medium'",
    description: 'MUI size — maps Harmony sm/md/lg; xs is not supported (see Sizes)',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the button',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'MUI v9 native loading spinner',
  },
  {
    name: 'loadingPosition',
    type: "'start' | 'end' | 'center'",
    default: "'start'",
    description: 'MUI v9 spinner position relative to children',
  },
  {
    name: 'startIcon / endIcon',
    type: 'ReactNode',
    default: '—',
    description: 'Leading or trailing icon — use HarmonyIcon with fontSize="inherit"',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    description: 'Span full container width',
  },
  {
    name: 'href',
    type: 'string',
    default: '—',
    description: 'When set, MUI Button renders as a link with button styling',
  },
];

const delaButtonProps: PropRow[] = [
  {
    name: 'pill',
    type: 'boolean',
    default: 'false',
    description: 'Harmony-only — fully rounded corners (theme shape radius-100)',
  },
  {
    name: '…ButtonProps',
    type: "Omit<ButtonProps, 'variant'>",
    default: '—',
    description:
      'Inherits MUI Button props and events except variant (forced contained / dela gradient). See MUI Button API for the full surface.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the button',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'MUI v9 loading spinner — suppresses the default stars icon while loading',
  },
  {
    name: 'loadingPosition',
    type: "'start' | 'end' | 'center'",
    default: "'start'",
    description: 'Spinner position relative to children',
  },
  {
    name: 'startIcon / endIcon',
    type: 'ReactNode',
    default: '—',
    description:
      'Leading or trailing icon — default startIcon is stars from /Stars.svg unless loading or you pass startIcon',
  },
  {
    name: 'size',
    type: "'small' | 'medium' | 'large'",
    default: "'medium'",
    description: 'MUI Button size',
  },
  {
    name: 'href',
    type: 'string',
    default: '—',
    description: 'When set, renders as a link with button styling',
  },
  {
    name: 'sx',
    type: 'SxProps<Theme>',
    default: '—',
    description: 'MUI system overrides',
  },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'primary', type: '—', description: 'variant="contained" color="primary"' },
  { name: 'secondary', type: '—', description: 'variant="outlined" color="primary"' },
  { name: 'tertiary', type: '—', description: 'variant="text" color="primary"' },
  { name: 'outline', type: '—', description: 'variant="outlined" color="inherit"' },
  { name: 'ghost', type: '—', description: 'variant="text" color="inherit"' },
  { name: 'destructive', type: '—', description: 'variant="contained" color="error"' },
  { name: 'pageHeader primary', type: '—', description: 'variant="contained" color="pageHeader"' },
  { name: 'pageHeader secondary', type: '—', description: 'variant="outlined" color="pageHeader"' },
  { name: 'pageHeader tertiary', type: '—', description: 'variant="text" color="pageHeader"' },
  { name: 'dela / dela-pill', type: '—', description: 'Custom DelaButton export (no MUI equivalent)' },
];

export function ButtonsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Buttons');
  }, []);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Buttons"
        description={
          <>
            Buttons trigger actions and events. Use native MUI <code>variant</code> and <code>color</code> with the
            Harmony theme — see Harmony → MUI mapping below.
          </>
        }
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="Button Types"
          description="Theme buttons use color primary. Page header buttons use color pageHeader (custom palette)."
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Theme Buttons (Default)
              </Typography>
              <Stack direction="row" spacing={2} sx={exampleRowSx}>
                <Button variant="contained" color="primary">
                  Primary
                </Button>
                <Button variant="outlined" color="primary">
                  Secondary
                </Button>
                <Button variant="text" color="primary">
                  Tertiary
                </Button>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Page Header Buttons
              </Typography>
              <Stack direction="row" spacing={2} sx={exampleRowSx}>
                <Button variant="contained" color="pageHeader">
                  Primary
                </Button>
                <Button variant="outlined" color="pageHeader">
                  Secondary
                </Button>
                <Button variant="text" color="pageHeader">
                  Tertiary
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Variants" description="Harmony variant names map to MUI variant + color pairs.">
          <Stack direction="row" spacing={2} sx={exampleRowSx}>
            <Button variant="contained" color="primary">
              Primary
            </Button>
            <Button variant="outlined" color="primary">
              Secondary
            </Button>
            <Button variant="text" color="primary">
              Tertiary
            </Button>
            <Button variant="outlined" color="inherit">
              Outline
            </Button>
            <Button variant="text" color="inherit">
              Ghost
            </Button>
            <Button variant="contained" color="error">
              Destructive
            </Button>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Dela Buttons"
          description="Custom DelaButton — no MUI equivalent. User chose custom component over skip."
        >
          <DemoImportSnippet namedExport="DelaButton" />
          <Stack direction="row" spacing={2} sx={exampleRowSx}>
            <DelaButton>Ask Dela</DelaButton>
            <DelaButton pill>Try AI</DelaButton>
            <DelaButton loading loadingPosition="start">
              Loading
            </DelaButton>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Sizes"
          description="Harmony sm/md/lg map to MUI small/medium/large. xs is not supported in this conversion."
        >
          <UnsupportedEquivalentCallout
            feature='size="xs"'
            reason="MUI Button only provides small, medium, and large."
          />
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2} sx={exampleRowSx}>
              <Button variant="contained" color="primary" size="small">
                Small
              </Button>
              <Button variant="contained" color="primary" size="medium">
                Medium
              </Button>
              <Button variant="contained" color="primary" size="large">
                Large
              </Button>
            </Stack>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Icons" description="Buttons can include icons for visual reinforcement.">
          <Stack direction="row" spacing={2} sx={exampleRowSx}>
            <Button variant="contained" color="primary" startIcon={<HarmonyIcon name="plus" fontSize="inherit" />}>
              Add Item
            </Button>
            <Button variant="contained" color="primary" endIcon={<HarmonyIcon name="arrow-right" fontSize="inherit" />}>
              Continue
            </Button>
            <Button variant="contained" color="primary" startIcon={<HarmonyIcon name="arrow-down-tray" fontSize="inherit" />}>
              Download
            </Button>
            <Button variant="outlined" color="primary" startIcon={<HarmonyIcon name="pencil" fontSize="inherit" />}>
              Edit
            </Button>
            <Button variant="outlined" color="inherit" startIcon={<HarmonyIcon name="share" fontSize="inherit" />}>
              Share
            </Button>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Icon Only" description="Use MUI IconButton for icon-only actions.">
          <Stack direction="row" spacing={2} sx={exampleRowSx}>
            <IconButton color="primary" size="small" aria-label="Add item">
              <HarmonyIcon name="plus" fontSize="inherit" />
            </IconButton>
            <IconButton color="primary" size="medium" aria-label="Add item">
              <HarmonyIcon name="plus" fontSize="inherit" />
            </IconButton>
            <IconButton color="primary" size="large" aria-label="Add item">
              <HarmonyIcon name="plus" fontSize="inherit" />
            </IconButton>
          </Stack>
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2} sx={exampleRowSx}>
              <IconButton color="primary" size="medium" aria-label="Edit">
                <HarmonyIcon name="pencil" fontSize="inherit" />
              </IconButton>
              <IconButton color="primary" size="medium" aria-label="Settings">
                <HarmonyIcon name="cog-6-tooth" fontSize="inherit" />
              </IconButton>
              <IconButton color="inherit" size="medium" aria-label="Share">
                <HarmonyIcon name="share" fontSize="inherit" />
              </IconButton>
              <IconButton color="inherit" size="medium" aria-label="More options">
                <HarmonyIcon name="ellipsis-vertical" fontSize="inherit" />
              </IconButton>
              <IconButton color="error" size="medium" aria-label="Delete">
                <HarmonyIcon name="trash" fontSize="inherit" />
              </IconButton>
            </Stack>
          </Box>
        </DemoExampleGroup>

        <DemoExampleGroup title="States" description="All button variants support multiple states.">
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Theme Buttons - States
              </Typography>
              <Stack direction="row" spacing={2} sx={exampleRowSx}>
                <Button variant="contained" color="primary">
                  Default
                </Button>
                <Button variant="contained" color="primary" disabled>
                  Disabled
                </Button>
                <Button variant="outlined" color="primary">
                  Default
                </Button>
                <Button variant="outlined" color="primary" disabled>
                  Disabled
                </Button>
                <Button variant="text" color="primary">
                  Default
                </Button>
                <Button variant="text" color="primary" disabled>
                  Disabled
                </Button>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Page Header Buttons - States
              </Typography>
              <Stack direction="row" spacing={2} sx={exampleRowSx}>
                <Button variant="contained" color="pageHeader">
                  Default
                </Button>
                <Button variant="contained" color="pageHeader" disabled>
                  Disabled
                </Button>
                <Button variant="outlined" color="pageHeader">
                  Default
                </Button>
                <Button variant="outlined" color="pageHeader" disabled>
                  Disabled
                </Button>
                <Button variant="text" color="pageHeader">
                  Default
                </Button>
                <Button variant="text" color="pageHeader" disabled>
                  Disabled
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Loading State" description="MUI v9 native loading spinner via loading and loadingPosition.">
          <Stack direction="row" spacing={2} sx={exampleRowSx}>
            <Button variant="contained" color="primary" loading loadingPosition="start">
              Loading...
            </Button>
            <Button variant="outlined" color="primary" loading loadingPosition="start">
              Processing
            </Button>
            <Button variant="outlined" color="inherit" loading loadingPosition="end">
              Saving...
            </Button>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup title="Full Width" description="Buttons that span the full container width.">
          <Stack spacing={1.5} sx={{ maxWidth: 384 }}>
            <Button variant="contained" color="primary" fullWidth>
              Full Width Primary
            </Button>
            <Button variant="outlined" color="inherit" fullWidth>
              Full Width Outline
            </Button>
          </Stack>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Vertical Orientation"
          description="Harmony orientation vertical is not supported — MUI Button has no orientation prop."
        >
          <UnsupportedEquivalentCallout
            feature='orientation="vertical"'
            reason="MUI Button does not support vertical icon-above-label layout."
          />
        </DemoExampleGroup>

        <DemoExampleGroup title="Button Combinations" description="Common button patterns.">
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} sx={exampleRowSx}>
              <Button variant="contained" color="primary">
                Save Changes
              </Button>
              <Button variant="text" color="inherit">
                Cancel
              </Button>
            </Stack>
            <Stack direction="row" spacing={2} sx={exampleRowSx}>
              <Button variant="contained" color="error" startIcon={<HarmonyIcon name="trash" fontSize="inherit" />}>
                Delete
              </Button>
              <Button variant="outlined" color="inherit">
                Cancel
              </Button>
            </Stack>
            <Stack direction="row" spacing={2} sx={exampleRowSx}>
              <Button variant="contained" color="primary" startIcon={<HarmonyIcon name="check" fontSize="inherit" />}>
                Confirm
              </Button>
              <Button variant="outlined" color="primary" startIcon={<HarmonyIcon name="x-mark" fontSize="inherit" />}>
                Reject
              </Button>
            </Stack>
          </Stack>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={buttonProps} />
      </DemoSection>

      <DemoSection id="dela-props" title="DelaButton props">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Custom package export — not covered by MUI Button docs. Import from{' '}
          <code>@dltkrichardhuska/harmony-design-system-react-mui/components</code>.
        </Typography>
        <PropsTable props={delaButtonProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="usage" title="Usage Guidelines">
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              When to Use Each Button Type
            </Typography>
            <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2, m: 0 }}>
              <li>
                <strong>Theme Buttons:</strong> Use for general UI actions throughout the application. These use darker
                shades of the theme primary color to maintain visual hierarchy.
              </li>
              <li>
                <strong>Page Header Buttons:</strong> Use specifically in page headers and navigation areas. These use a
                dark blue color scheme (#043852) for consistency in header contexts.
              </li>
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              When to Use Each Variant
            </Typography>
            <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2, m: 0 }}>
              <li>
                <strong>Primary:</strong> Main call-to-action, one per section
              </li>
              <li>
                <strong>Secondary:</strong> Alternative actions, less prominent
              </li>
              <li>
                <strong>Tertiary:</strong> Subtle actions with theme-primary text color
              </li>
              <li>
                <strong>Outline:</strong> Secondary actions that need visibility
              </li>
              <li>
                <strong>Ghost:</strong> Minimal actions, toolbar buttons
              </li>
              <li>
                <strong>Destructive:</strong> Delete, remove, or irreversible actions
              </li>
            </Typography>
          </Box>
        </Stack>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
          }}
        >
          <Paper variant="outlined" sx={{ p: 2, borderColor: 'success.light' }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, color: 'success.main', alignItems: 'center' }}>
              <CheckOutlinedIcon fontSize="small" />
              <Typography variant="subtitle2">Do</Typography>
            </Stack>
            <Typography variant="body2" component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Use clear, action-oriented labels</li>
              <li>Limit primary buttons per view</li>
              <li>Provide visual feedback on interaction</li>
              <li>Use icons to reinforce meaning</li>
              <li>Maintain consistent sizing in groups</li>
            </Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2, borderColor: 'error.light' }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, color: 'error.main', alignItems: 'center' }}>
              <CloseOutlinedIcon fontSize="small" />
              <Typography variant="subtitle2">Don&apos;t</Typography>
            </Stack>
            <Typography variant="body2" component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Use vague labels like &quot;Click Here&quot;</li>
              <li>Disable buttons without explanation</li>
              <li>Mix too many variants in one area</li>
              <li>Use destructive style for safe actions</li>
              <li>Rely solely on color for meaning</li>
            </Typography>
          </Paper>
        </Box>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
              <KeyboardOutlinedIcon fontSize="small" color="action" />
              <Typography variant="subtitle2">Keyboard Navigation</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              All buttons are focusable and can be activated with Enter or Space.
            </Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
              <VerifiedOutlinedIcon fontSize="small" color="action" />
              <Typography variant="subtitle2">Icon-Only Buttons</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Always include <code>aria-label</code> for icon-only buttons to provide context for screen readers.
            </Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
              <HighlightOutlinedIcon fontSize="small" color="action" />
              <Typography variant="subtitle2">Focus States</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Buttons include visible focus indicators that meet WCAG 2.1 requirements for contrast.
            </Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
              <BlockOutlinedIcon fontSize="small" color="action" />
              <Typography variant="subtitle2">Disabled State</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Disabled buttons are marked with <code>disabled</code> attribute. Explain why buttons are disabled via
              tooltip or adjacent text.
            </Typography>
          </Paper>
        </Stack>
      </DemoSection>
    </Box>
  );
}
