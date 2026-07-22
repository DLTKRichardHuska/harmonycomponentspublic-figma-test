import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
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

type DialogId = 'basic' | 'confirm' | 'three' | 'long' | null;

const dialogProps: PropRow[] = [
  {
    name: 'open',
    type: 'boolean',
    default: '—',
    description: 'Controls visibility (Harmony openDialog / closeDialog + id)',
  },
  {
    name: 'onClose',
    type: '(event, reason) => void',
    default: '—',
    description: 'Called on backdrop click, Escape, or close control',
  },
  {
    name: 'fullWidth / maxWidth',
    type: 'boolean / false | breakpoint',
    default: 'true / false (theme)',
    description: 'Theme sets fullWidth + maxWidth={false}; paper uses Harmony 600–700px / 90% width',
  },
  {
    name: 'scroll',
    type: "'paper' | 'body'",
    default: "'paper' (theme)",
    description: 'Paper scroll keeps title/actions sticky while content scrolls',
  },
  {
    name: 'children',
    type: 'node',
    default: '—',
    description: 'Compose DialogTitle, DialogContent, DialogActions',
  },
];

const harmonyMappingRows: PropRow[] = [
  { name: 'overlay + .dialog', type: '—', description: 'Dialog (open / onClose)' },
  { name: 'title + close', type: '—', description: 'DialogTitle + IconButton + HarmonyIcon x-mark' },
  { name: 'body slot', type: '—', description: 'DialogContent' },
  { name: 'footer / Confirm·Cancel·tertiary', type: '—', description: 'DialogActions + Button composition' },
  { name: 'buttonAlignment left (default)', type: '—', description: 'Theme DialogActions justifyContent flex-start' },
  {
    name: 'buttonAlignment right',
    type: '—',
    description: 'Not supported — see callout (no MUI DialogActions align prop; do not use example sx)',
  },
  { name: 'headerVariant primary', type: '—', description: 'Not supported — see callout' },
  { name: 'resizable', type: '—', description: 'Not supported — see callout' },
];

const articleNavLinks = [
  { href: '#examples', label: 'Examples' },
  { href: '#layout', label: 'Layout' },
  { href: '#props', label: 'Props' },
  { href: '#mapping', label: 'Harmony mapping' },
  { href: '#accessibility', label: 'Accessibility' },
];

const longBodyParagraphs = [
  'When content is long, only the body scrolls. The header (title and close) and footer (buttons) stay fixed at the top and bottom.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla facilisi.',
  'Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Maecenas sed diam eget risus varius blandit sit amet non magna. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
  'Cras mattis consectetur purus sit amet fermentum. Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
  'Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Etiam porta sem malesuada magna mollis euismod.',
  'Sed posuere consectetur est at lobortis. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec sed odio dui. Scroll to see that the header and footer remain fixed.',
  'Additional paragraph to ensure the body overflows the 600px max height so sticky header and footer stay visible while this region scrolls.',
  'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.',
];

export function DialogsDemo() {
  const [open, setOpen] = useState<DialogId>(null);

  useEffect(() => {
    document.title = demoPageTitle('Dialogs');
  }, []);

  const close = () => setOpen(null);

  return (
    <Box component="article">
      <DemoPageHeader
        title="Dialogs"
        description="Dialogs (modals) focus user attention on important information or actions that require immediate response. The header and footer stay fixed while the body scrolls; width uses design tokens (min 600px, default 700px)."
      />

      <DemoArticleNav links={articleNavLinks} />

      <DemoSection id="examples" title="Examples">
        <UnsupportedEquivalentCallout
          feature='headerVariant="primary"'
          reason="MUI DialogTitle has no primary-header background prop. Skipped per userDecision (includes Combined Variants)."
        />
        <UnsupportedEquivalentCallout
          feature="resizable"
          reason="Stock MUI Dialog has no resize grip. Skipped per userDecision."
        />
        <UnsupportedEquivalentCallout
          feature='buttonAlignment="right"'
          reason="MUI DialogActions has no align/justify prop. Emulating right alignment via example sx is forbidden fidelity styling; skipped per userDecision. Theme keeps Harmony default left alignment."
        />

        <DemoExampleGroup title="Basic Dialog" description="Click to open a dialog.">
          <Button variant="contained" color="primary" onClick={() => setOpen('basic')}>
            Open Dialog
          </Button>
          <Dialog open={open === 'basic'} onClose={close} aria-labelledby="basic-dialog-title">
            <DialogTitle id="basic-dialog-title">
              Dialog Title
              <IconButton aria-label="Close" onClick={close} size="medium">
                <HarmonyIcon name="x-mark" fontSize="inherit" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" color="textSecondary">
                This is a basic dialog with some content. You can add any content here including forms, images, or
                other components.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={close}>
                Confirm
              </Button>
              <Button variant="outlined" color="primary" onClick={close}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </DemoExampleGroup>

        <DemoExampleGroup title="Confirmation Dialog" description="Dialog for confirming actions.">
          <Button variant="contained" color="error" onClick={() => setOpen('confirm')}>
            Delete Item
          </Button>
          <Dialog open={open === 'confirm'} onClose={close} aria-labelledby="confirm-dialog-title">
            <DialogTitle id="confirm-dialog-title">
              Delete Item?
              <IconButton aria-label="Close" onClick={close} size="medium">
                <HarmonyIcon name="x-mark" fontSize="inherit" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" color="textSecondary">
                Are you sure you want to delete this item? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="error" onClick={close}>
                Delete
              </Button>
              <Button variant="outlined" color="primary" onClick={close}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Three buttons (Yes, No, Cancel)"
          description="Footer with Confirm, Cancel, and a tertiary text button."
        >
          <Button variant="contained" color="primary" onClick={() => setOpen('three')}>
            Open Save Changes Dialog
          </Button>
          <Dialog open={open === 'three'} onClose={close} aria-labelledby="three-dialog-title">
            <DialogTitle id="three-dialog-title">
              Save changes?
              <IconButton aria-label="Close" onClick={close} size="medium">
                <HarmonyIcon name="x-mark" fontSize="inherit" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" color="textSecondary">
                Do you want to save your changes before closing? Yes saves and closes, No closes without saving, Cancel
                keeps the dialog open.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={close}>
                Yes
              </Button>
              <Button variant="outlined" color="primary" onClick={close}>
                No
              </Button>
              <Button variant="text" color="primary" onClick={close}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Long Content (Scrollable Body)"
          description="Header and footer stay visible while the body scrolls."
        >
          <Button variant="contained" color="primary" onClick={() => setOpen('long')}>
            Open Scrollable Body Dialog
          </Button>
          <Dialog open={open === 'long'} onClose={close} aria-labelledby="long-dialog-title">
            <DialogTitle id="long-dialog-title">
              Scrollable Body
              <IconButton aria-label="Close" onClick={close} size="medium">
                <HarmonyIcon name="x-mark" fontSize="inherit" />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                {longBodyParagraphs.map((text) => (
                  <Typography key={text.slice(0, 24)} variant="body1" color="textSecondary">
                    {text}
                  </Typography>
                ))}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={close}>
                Confirm
              </Button>
              <Button variant="outlined" color="primary" onClick={close}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="layout" title="Layout">
        <Typography variant="body1" color="textSecondary">
          The dialog uses a column flex layout: the header and footer are sticky (always visible), and only the body
          scrolls when content overflows. Sizing and spacing use design tokens (min 600px, max 700px, 90% width,
          radius-xl, shadow-xl).
        </Typography>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={dialogProps} />
      </DemoSection>

      <DemoMappingSection rows={harmonyMappingRows} />

      <DemoSection id="accessibility" title="Accessibility">
        <Stack spacing={2}>
          <A11yCard title="ARIA Roles" icon="tag">
            Dialogs use <code>role=&quot;dialog&quot;</code> and <code>aria-modal=&quot;true&quot;</code>. Associate the
            title with <code>aria-labelledby</code>.
          </A11yCard>
          <A11yCard title="Keyboard Navigation" icon="keyboard">
            Escape closes the dialog (via <code>onClose</code>). Tab cycles focusable controls inside the modal; MUI
            traps focus while open.
          </A11yCard>
          <A11yCard title="Focus Management" icon="cursor-arrow-rays">
            When a dialog opens, focus moves to the first focusable element (typically the close button or first input).
            When closed, focus returns to the element that triggered the dialog. Focus is trapped within the dialog to
            prevent users from interacting with background content.
          </A11yCard>
          <A11yCard title="Screen Reader Support" icon="eye">
            Screen readers announce the dialog title and content when opened. The dialog&apos;s modal nature is
            communicated, and users are informed that background content is not available while the dialog is open.
          </A11yCard>
        </Stack>
      </DemoSection>
    </Box>
  );
}
