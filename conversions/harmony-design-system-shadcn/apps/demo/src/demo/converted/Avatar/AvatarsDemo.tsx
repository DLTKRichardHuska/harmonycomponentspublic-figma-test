import { useEffect } from 'react';
import { Avatar } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
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

const avatarPhotoSrc = 'https://github.com/shadcn.png';

const propRows: PropRow[] = [
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Avatar dimensions',
  },
  {
    name: 'variant',
    type: "'icon' | 'initials' | 'image'",
    default: "'icon'",
    description: 'Content mode',
  },
  {
    name: 'initials',
    type: 'string',
    default: '—',
    description: 'Source string normalized to 1–2 letters',
  },
  {
    name: 'src',
    type: 'string',
    default: '—',
    description: 'Image URL when variant is image',
  },
  {
    name: 'alt',
    type: 'string',
    default: "''",
    description: 'Accessible name for image content',
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'false',
    description: 'Render as button for menu triggers',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disabled when interactive',
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Extra Tailwind / CSS classes on the root',
  },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function AvatarsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Avatar');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Avatar"
        description="User avatar for shell header, tables, and cards: icon, initials, or photo."
      />

      <ImportSnippet
        code={`import { Avatar } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Avatar />
<Avatar variant="initials" initials="Jane Doe" />
<Avatar variant="image" src="https://github.com/shadcn.png" alt="User" />
<Avatar interactive onClick={() => {}} />`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="Content variants"
          description="Icon (default), initials, and image."
        >
          <div className="flex flex-wrap items-end gap-4">
            <Avatar variant="icon" />
            <Avatar variant="initials" initials="Jane Doe" />
            <Avatar variant="image" src={avatarPhotoSrc} alt="User photo" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="sm, md, and lg across content modes.">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end gap-3">
              <Avatar size="sm" />
              <Avatar size="md" />
              <Avatar size="lg" />
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <Avatar size="sm" variant="initials" initials="AB" />
              <Avatar size="md" variant="initials" initials="AB" />
              <Avatar size="lg" variant="initials" initials="AB" />
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <Avatar size="sm" variant="image" src={avatarPhotoSrc} alt="User" />
              <Avatar size="md" variant="image" src={avatarPhotoSrc} alt="User" />
              <Avatar size="lg" variant="image" src={avatarPhotoSrc} alt="User" />
            </div>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Interactive"
          description="Renders as a button for menu or profile triggers."
        >
          <div className="flex flex-wrap items-center gap-4">
            <Avatar
              interactive
              variant="initials"
              initials="JD"
              onClick={() => {
                console.log('Avatar clicked');
              }}
            />
            <Avatar
              interactive
              variant="image"
              src={avatarPhotoSrc}
              alt="User photo"
              onClick={() => {
                console.log('Photo avatar clicked');
              }}
            />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Disabled interactive"
          description="Interactive avatars can be disabled."
        >
          <Avatar interactive disabled variant="initials" initials="JD" />
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
        <p className="mt-4 text-sm text-secondary">
          Non-interactive root is a <code>div</code> with <code>role=&quot;img&quot;</code>.
          Interactive root is a <code>button</code>. Image mode uses Radix Avatar with fallback
          icon.
        </p>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <A11yCard icon="tag" title="Accessible name">
            Icon and initials modes set an <code>aria-label</code>. For images, pass a meaningful{' '}
            <code>alt</code> (or overall label via interactive button).
          </A11yCard>
          <A11yCard icon="keyboard" title="Interactive">
            When <code>interactive</code>, the avatar is a focusable button. Provide{' '}
            <code>onClick</code> (or menu wiring) and keep <code>disabled</code> in sync with
            availability.
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
