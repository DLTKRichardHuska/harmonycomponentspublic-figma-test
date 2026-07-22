import { useEffect } from 'react';
import {
  Icon,
  NotificationBadge,
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

const propRows: PropRow[] = [
  {
    name: 'type',
    type: "'dot' | 'number' | 'overflow'",
    default: "'number'",
    description: 'Badge content type',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Badge size',
  },
  {
    name: 'variant',
    type: "'error' | 'primary'",
    default: "'primary'",
    description: 'Color — error (red) or primary (theme)',
  },
  {
    name: 'value',
    type: 'string | number',
    default: '1',
    description: 'Displayed count for number / overflow (not used for dot)',
  },
  {
    name: 'border',
    type: 'boolean',
    default: 'false',
    description: 'White border for contrast on dark anchors',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: '—',
    description:
      'Optional anchor (Icon, Button, …). When set, badge auto-positions top-right — no absolute wrapper needed',
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Extra classes on the root (wrapper when children, else the pill)',
  },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function NotificationBadgesDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Notification Badges');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Notification Badges"
        description='Notification badges display counts as dots, numbers, or overflow text (e.g. "99+").'
      />

      <ImportSnippet
        code={`import { Icon, NotificationBadge } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

{/* Preferred: wrap the anchor — badge positions itself */}
<NotificationBadge type="number" value={3} variant="error">
  <Icon name="bell" />
</NotificationBadge>

{/* Standalone (no anchor) */}
<NotificationBadge type="dot" variant="primary" />`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="On an anchor (recommended)"
          description="Pass Icon / Button / Avatar as children — no relative/absolute wrapper."
        >
          <div className="flex flex-wrap items-center gap-8">
            <NotificationBadge type="dot" variant="error">
              <Icon name="bell" size="md" />
            </NotificationBadge>
            <NotificationBadge type="number" value={5} variant="primary">
              <Icon name="bell" size="md" />
            </NotificationBadge>
            <NotificationBadge type="overflow" value="99+" variant="error">
              <Icon name="bell" size="md" />
            </NotificationBadge>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Standalone"
          description="Omit children to render the indicator alone (inventory / docs)."
        >
          <div className="flex flex-wrap items-center gap-4">
            <NotificationBadge type="dot" variant="primary" size="sm" />
            <NotificationBadge type="dot" variant="error" size="md" />
            <NotificationBadge type="number" value={1} variant="primary" size="sm" />
            <NotificationBadge type="number" value={5} variant="error" size="md" />
            <NotificationBadge type="overflow" value="99+" variant="primary" size="lg" />
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="sm, md, and lg on an Icon anchor.">
          <div className="flex flex-wrap items-center gap-6">
            <NotificationBadge type="number" size="sm" value={1}>
              <Icon name="bell" size="md" />
            </NotificationBadge>
            <NotificationBadge type="number" size="md" value={5}>
              <Icon name="bell" size="md" />
            </NotificationBadge>
            <NotificationBadge type="number" size="lg" value={12}>
              <Icon name="bell" size="md" />
            </NotificationBadge>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Variants" description="Error (red) and primary (theme) colors.">
          <div className="flex flex-wrap items-center gap-6">
            <NotificationBadge type="number" value={3} variant="error">
              <Icon name="bell" size="md" />
            </NotificationBadge>
            <NotificationBadge type="number" value={3} variant="primary">
              <Icon name="bell" size="md" />
            </NotificationBadge>
            <NotificationBadge type="dot" variant="error">
              <Icon name="bell" size="md" />
            </NotificationBadge>
            <NotificationBadge type="dot" variant="primary">
              <Icon name="bell" size="md" />
            </NotificationBadge>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Border"
          description="White border for contrast on dark or busy anchors."
        >
          <div className="flex flex-wrap items-center gap-6 rounded-lg bg-[var(--theme-primary)] px-4 py-3">
            <NotificationBadge type="number" value={2} border variant="error">
              <Icon name="bell" size="md" className="text-white" />
            </NotificationBadge>
            <NotificationBadge type="dot" border variant="primary">
              <Icon name="bell" size="md" className="text-white" />
            </NotificationBadge>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
        <p className="mt-4 text-sm text-secondary">
          Prefer <code>children</code> for on-anchor usage. Dot type does not accept{' '}
          <code>value</code>.
        </p>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <A11yCard icon="tag" title="ARIA Labels">
            Dot badges use <code>aria-label=&quot;Notification indicator&quot;</code>. Number and
            overflow badges announce <code>&quot;{'{value}'} notifications&quot;</code>. Name the
            interactive control (e.g. button) separately when wrapping.
          </A11yCard>
          <A11yCard icon="eye" title="Composition">
            Wrap interactive anchors (Button with <code>icon</code>, or a labeled button around
            Icon) so the badge sits on a clear action.
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
