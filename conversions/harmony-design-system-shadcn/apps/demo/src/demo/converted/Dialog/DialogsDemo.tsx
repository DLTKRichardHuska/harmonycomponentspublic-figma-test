import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  ImportSnippet,
  PropsTable,
  type PropRow,
} from '../../ui';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';
import { UnsupportedEquivalentCallout } from '../../UnsupportedEquivalentCallout';

const contentPropRows: PropRow[] = [
  {
    name: 'showCloseButton',
    type: 'boolean',
    default: 'true',
    description: 'Top-right close control (package Icon x-mark)',
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Extra classes on the panel',
  },
];

const headerPropRows: PropRow[] = [
  {
    name: 'variant',
    type: "'default' | 'primary'",
    default: "'default'",
    description: 'Header background — primary uses theme primary + inverse title/close',
  },
];

const footerPropRows: PropRow[] = [
  {
    name: 'buttonAlignment',
    type: "'left' | 'right'",
    default: "'left'",
    description: 'Footer action alignment',
  },
  {
    name: 'confirmLabel',
    type: 'string',
    default: '—',
    description: 'Convenience primary label (when no footer children)',
  },
  {
    name: 'onConfirm',
    type: '() => void',
    default: '—',
    description: 'Convenience confirm handler',
  },
  {
    name: 'cancelLabel',
    type: 'string',
    default: "'Cancel'",
    description: 'Convenience cancel label',
  },
  {
    name: 'onCancel',
    type: '() => void',
    default: '—',
    description: 'Convenience cancel handler',
  },
  {
    name: 'tertiaryLabel',
    type: 'string',
    default: '—',
    description: 'Optional tertiary / link-style button',
  },
  {
    name: 'onTertiary',
    type: '() => void',
    default: '—',
    description: 'Tertiary handler',
  },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function DialogsDemo() {
  const [controlledOpen, setControlledOpen] = useState(false);

  useEffect(() => {
    document.title = demoPageTitle('Dialogs');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Dialogs"
        description="Modal dialog with sticky header/footer and scrollable body — Radix Dialog + Harmony tokens."
      />

      <ImportSnippet
        code={`import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Button,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Dialog>
  <DialogTrigger asChild>
    <Button type="button">Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm</DialogTitle>
    </DialogHeader>
    <DialogBody>Are you sure?</DialogBody>
    <DialogFooter confirmLabel="Confirm" cancelLabel="Cancel" />
  </DialogContent>
</Dialog>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="Confirm / Cancel (convenience footer)"
          description="AI one-shot — DialogFooter confirmLabel / onConfirm without composing Buttons."
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm action</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p className="m-0">
                  Are you sure you want to continue? This uses the convenience footer API.
                </p>
              </DialogBody>
              <DialogFooter
                confirmLabel="Confirm"
                onConfirm={() => {}}
                cancelLabel="Cancel"
              />
            </DialogContent>
          </Dialog>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Basic Dialog (composed footer)"
          description="Full shadcn composition with DialogTrigger asChild + Button."
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p className="m-0">
                  This is a basic dialog. Use DialogBody for scrollable content and compose footer
                  Buttons when you need full control.
                </p>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button buttonType="theme" type="button">
                    Confirm
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button buttonType="theme" variant="secondary" type="button">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Destructive confirm"
          description="Compose a destructive primary action in the footer."
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="destructive">
                Delete Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete item?</DialogTitle>
                <DialogDescription className="sr-only">
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p className="m-0">This action cannot be undone. The item will be permanently removed.</p>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button buttonType="theme" variant="destructive" type="button">
                    Delete
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button buttonType="theme" variant="secondary" type="button">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Three buttons (Yes, No, Cancel)"
          description="Convenience tertiaryLabel for a link-style third action."
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button">Open Save Changes Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save changes?</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p className="m-0">You have unsaved changes. What would you like to do?</p>
              </DialogBody>
              <DialogFooter
                confirmLabel="Yes"
                cancelLabel="No"
                tertiaryLabel="Cancel"
                onConfirm={() => {}}
                onCancel={() => {}}
                onTertiary={() => {}}
              />
            </DialogContent>
          </Dialog>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Right-aligned buttons"
          description='buttonAlignment="right" — secondary actions first, primary last.'
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button">Open Right-Aligned Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Right-Aligned Buttons</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p className="m-0">
                  This dialog has buttons aligned to the right. Use buttonAlignment=&quot;right&quot; to
                  override the default left alignment.
                </p>
              </DialogBody>
              <DialogFooter buttonAlignment="right" confirmLabel="Confirm" cancelLabel="Cancel" />
            </DialogContent>
          </Dialog>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Primary header"
          description='DialogHeader variant="primary".'
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button">Open Primary Header Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader variant="primary">
                <DialogTitle>Primary Header</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p className="m-0">Header uses the theme primary color with inverse title text.</p>
              </DialogBody>
              <DialogFooter confirmLabel="Confirm" cancelLabel="Cancel" />
            </DialogContent>
          </Dialog>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Combined variants"
          description="Primary header + left-aligned footer."
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button">Open Combined Variants Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader variant="primary">
                <DialogTitle>Combined Variants</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p className="m-0">Primary header with default left footer alignment.</p>
              </DialogBody>
              <DialogFooter confirmLabel="Confirm" cancelLabel="Cancel" />
            </DialogContent>
          </Dialog>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Controlled open"
          description="Radix open / onOpenChange — not Astro openDialog globals."
        >
          <Dialog open={controlledOpen} onOpenChange={setControlledOpen}>
            <DialogTrigger asChild>
              <Button type="button">Open Controlled Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Controlled</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p className="m-0">
                  open={String(controlledOpen)}. Close via the X, Escape, overlay, or footer.
                </p>
              </DialogBody>
              <DialogFooter confirmLabel="Done" onConfirm={() => setControlledOpen(false)} />
            </DialogContent>
          </Dialog>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Long content (scrollable body)"
          description="Header and footer stay fixed while the body scrolls."
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button">Open Scrollable Body Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Scrollable body</DialogTitle>
              </DialogHeader>
              <DialogBody>
                {Array.from({ length: 12 }).map((_, i) => (
                  <p key={i} className="mb-4 leading-normal">
                    When content is long, only the body scrolls. The header (title and close) and
                    footer (buttons) stay fixed. Paragraph {i + 1}.
                  </p>
                ))}
              </DialogBody>
              <DialogFooter confirmLabel="Close" />
            </DialogContent>
          </Dialog>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Resizable dialog"
          description="Reference Astro supports a resize grip — skipped in this conversion."
        >
          <UnsupportedEquivalentCallout
            feature="Dialog.resizable"
            reason="No Radix Dialog resize analog; drag-to-resize is omitted. Use CSS max-height / width tokens instead."
          />
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <h3 className="mb-2 text-base font-semibold">DialogContent</h3>
        <PropsTable props={contentPropRows} />
        <h3 className="mb-2 mt-6 text-base font-semibold">DialogHeader</h3>
        <PropsTable props={headerPropRows} />
        <h3 className="mb-2 mt-6 text-base font-semibold">DialogFooter</h3>
        <PropsTable props={footerPropRows} />
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          Root <code>Dialog</code> inherits Radix <code>open</code> / <code>onOpenChange</code> /{' '}
          <code>defaultOpen</code>. Prefer <code>DialogTrigger asChild</code> with package{' '}
          <code>Button</code>. Do not use Lucide or <code>openDialog</code> / <code>closeDialog</code>{' '}
          globals.
        </p>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <A11yCard title="Focus trap" icon="keyboard">
            Radix Dialog traps focus while open and restores it on close. Escape and overlay click
            dismiss by default.
          </A11yCard>
          <A11yCard title="Labelling" icon="tag">
            Always provide <code>DialogTitle</code>. Use <code>DialogDescription</code> (or{' '}
            <code>sr-only</code>) for additional context announced to assistive tech.
          </A11yCard>
          <A11yCard title="Sticky chrome" icon="eye">
            Header and footer stay visible; only <code>DialogBody</code> scrolls for long content.
          </A11yCard>
          <A11yCard title="Layout" icon="queue-list">
            Column flex layout: header and footer are sticky; body scrolls when content overflows.
            Sizing uses design tokens (<code>--dialog-min-width</code>,{' '}
            <code>--dialog-max-width-default</code>, <code>--dialog-margin</code>).
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
