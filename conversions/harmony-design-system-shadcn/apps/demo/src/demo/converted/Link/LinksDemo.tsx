import { useEffect } from 'react';
import { Link } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import {
  A11yCard,
  DemoArticleNav,
  DemoExampleGroup,
  ImportSnippet,
  PropsTable,
  type PropRow,
} from '../../ui';
import { UnsupportedEquivalentCallout } from '../../UnsupportedEquivalentCallout';
import { DemoPageHeader } from '../foundation/DemoPageHeader';
import { DemoSection } from '../foundation/DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

const propRows: PropRow[] = [
  { name: 'href', type: 'string', default: '—', description: 'Required destination URL' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Text size' },
  { name: 'muted', type: 'boolean', default: 'false', description: 'Muted color; hover to primary' },
  { name: 'external', type: 'boolean', default: 'false', description: 'New tab + external Icon' },
  { name: 'asChild', type: 'boolean', default: 'false', description: 'Radix Slot polymorphism' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'Link text' },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function LinksDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Links');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Links"
        description="Text links for navigation within and outside the application."
      />

      <ImportSnippet
        code={`import { Link } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Link href="/docs">Documentation</Link>
<Link href="https://example.com" external>External site</Link>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup title="Basic Link" description="Default medium size with theme link color.">
          <p className="text-sm text-[var(--text-primary)]">
            See the <Link href="#examples">examples</Link> for more patterns.
          </p>
        </DemoExampleGroup>

        <DemoExampleGroup title="Sizes" description="Small, medium, and large.">
          <div className="flex flex-col gap-3">
            <Link href="#sizes" size="sm">
              Small link
            </Link>
            <Link href="#sizes" size="md">
              Medium link
            </Link>
            <Link href="#sizes" size="lg">
              Large link
            </Link>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Muted" description="Secondary emphasis; hover restores primary.">
          <Link href="#muted" muted>
            Muted link
          </Link>
        </DemoExampleGroup>

        <DemoExampleGroup title="External" description="Opens in a new tab with an external icon.">
          <Link href="https://www.deltek.com" external>
            Deltek website
          </Link>
        </DemoExampleGroup>

        <UnsupportedEquivalentCallout
          feature="responsive default size (&lt;768px)"
          reason="Astro applies --text-sm on base .link without an explicit size class below 768px. This conversion always uses an explicit size (default md)."
        />
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <A11yCard title="Link text" icon="link">
          Use meaningful link text; avoid &quot;click here&quot;.{' '}
          <code>external</code> sets <code>target=&quot;_blank&quot;</code> and{' '}
          <code>rel=&quot;noopener noreferrer&quot;</code>.
        </A11yCard>
        <A11yCard title="asChild" icon="squares-2x2">
          <code>asChild</code> merges props onto a child element (e.g. router Link).
        </A11yCard>
      </DemoSection>
    </article>
  );
}
