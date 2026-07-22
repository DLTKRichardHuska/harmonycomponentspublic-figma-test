import { useEffect } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
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
    name: 'elevated',
    type: 'boolean',
    default: 'false',
    description: 'Shadow elevation',
  },
  {
    name: 'interactive',
    type: 'boolean',
    default: 'false',
    description: 'Hover / pointer styles for clickable cards',
  },
  {
    name: 'primary',
    type: 'boolean',
    default: 'false',
    description: '6px top border in theme primary',
  },
  {
    name: 'title',
    type: 'string',
    default: '—',
    description: 'Convenience title (auto-header when not composing CardHeader)',
  },
  {
    name: 'description',
    type: 'string',
    default: '—',
    description: 'Convenience description',
  },
  {
    name: 'asChild',
    type: 'boolean',
    default: 'false',
    description: 'Radix Slot — merge classes onto a single child',
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Extra classes',
  },
];

const articleNav = [
  { href: '#examples', label: 'Examples', icon: 'eye' },
  { href: '#props', label: 'Props', icon: 'queue-list' },
  { href: '#accessibility', label: 'Accessibility', icon: 'check-badge' },
] as const;

export function CardsDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Cards');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Cards"
        description="Flexible containers for grouping related content — shadcn compound pieces plus optional title/description convenience."
      />

      <ImportSnippet
        code={`import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Card title="Card Title" description="Subtitle">
  Body content
</Card>`}
      />

      <DemoArticleNav links={[...articleNav]} />

      <DemoSection id="examples" title="Examples">
        <DemoExampleGroup
          title="Convenience API (AI one-shot)"
          description="title + description props — no CardHeader composition required."
        >
          <div className="max-w-md">
            <Card title="Card Title" description="Subtitle or description">
              Card body content goes here. You can add any content you need.
            </Card>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Basic Card" description="Simple card with content.">
          <div className="max-w-md">
            <Card>
              <CardContent>
                This is a basic card with some content. Cards are great for grouping related
                information together.
              </CardContent>
            </Card>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Compound header"
          description="Full shadcn composition — CardHeader / CardTitle / CardDescription."
        >
          <div className="max-w-md">
            <Card>
              <CardHeader>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Subtitle or description</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                Card body content goes here. You can add any content you need.
              </CardContent>
            </Card>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Header actions"
          description="Compose CardAction with package Button / Icon — no Astro icon1/2/3."
        >
          <div className="max-w-md space-y-4">
            <Card>
              <CardHeader>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <CardTitle>All Three Icons</CardTitle>
                </div>
                <CardAction>
                  <Button type="button" variant="ghost" size="sm" icon="cog-6-tooth" aria-label="Settings" />
                  <Button type="button" variant="ghost" size="sm" icon="ellipsis-vertical" aria-label="More" />
                  <Button type="button" variant="ghost" size="sm" icon="x-mark" aria-label="Close" />
                </CardAction>
              </CardHeader>
              <CardContent>Card with close, menu, and settings icons.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <CardTitle>Close Only</CardTitle>
                </div>
                <CardAction>
                  <Button type="button" variant="ghost" size="sm" icon="x-mark" aria-label="Close" />
                </CardAction>
              </CardHeader>
              <CardContent>A single icon always appears at the far right.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <CardTitle>With Subtitle</CardTitle>
                  <CardDescription>Optional description</CardDescription>
                </div>
                <CardAction>
                  <Button type="button" variant="ghost" size="sm" icon="cog-6-tooth" aria-label="Settings" />
                  <Button type="button" variant="ghost" size="sm" icon="ellipsis-vertical" aria-label="More" />
                  <Button type="button" variant="ghost" size="sm" icon="x-mark" aria-label="Close" />
                </CardAction>
              </CardHeader>
              <CardContent>Icons also work alongside a header subtitle.</CardContent>
            </Card>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Elevated Card" description="Card with shadow for more emphasis.">
          <div className="max-w-md">
            <Card elevated title="Elevated Card">
              This card has a shadow to make it stand out from the page background.
            </Card>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="Interactive Card" description="Clickable card with hover effects.">
          <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <Card interactive title="Click Me">
              This card has hover effects and is clickable.
            </Card>
            <Card interactive title="Click Me Too">
              Another interactive card example.
            </Card>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Primary Border Card"
          description="Theme primary top border for emphasis."
        >
          <div className="max-w-md">
            <Card primary title="Featured Card">
              This card has a prominent 6px top border in the theme primary color to draw attention.
            </Card>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup
          title="Primary Border + Other Variants"
          description="Primary border works with other card variants."
        >
          <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <Card primary elevated title="Primary + Elevated">
              Combines the primary border with elevation shadow.
            </Card>
            <Card primary interactive title="Primary + Interactive">
              Combines the primary border with hover effects.
            </Card>
          </div>
        </DemoExampleGroup>

        <DemoExampleGroup title="With Footer" description="CardFooter for actions.">
          <div className="max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Confirm</CardTitle>
                <CardDescription>Optional footer actions</CardDescription>
              </CardHeader>
              <CardContent>Review the details before continuing.</CardContent>
              <CardFooter className="flex gap-2">
                <Button type="button" size="sm">
                  Continue
                </Button>
                <Button type="button" variant="secondary" size="sm">
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </div>
        </DemoExampleGroup>
      </DemoSection>

      <DemoSection id="props" title="Props">
        <PropsTable props={propRows} />
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          Compound exports: <code>CardHeader</code>, <code>CardTitle</code>,{' '}
          <code>CardDescription</code>, <code>CardAction</code>, <code>CardContent</code>,{' '}
          <code>CardFooter</code>, <code>cardVariants</code>. HTML attributes and{' '}
          <code>ref</code> are forwarded on each piece.
        </p>
      </DemoSection>

      <DemoSection id="accessibility" title="Accessibility">
        <div className="space-y-4">
          <A11yCard title="Semantic Structure" icon="tag">
            Prefer heading hierarchy via <code>CardTitle</code>. Organize with header, content, and
            footer pieces.
          </A11yCard>
          <A11yCard title="Interactive Cards" icon="keyboard">
            With <code>interactive</code>, ensure keyboard access — the root gets{' '}
            <code>role=&quot;button&quot;</code> and <code>tabIndex=0</code> by default. Prefer wrapping
            in a real <code>&lt;button&gt;</code> / <code>&lt;a&gt;</code> via <code>asChild</code>{' '}
            when navigating.
          </A11yCard>
          <A11yCard title="Focus Indicators" icon="cursor-arrow-rays">
            Interactive cards include a visible focus ring. Keep focus clear for keyboard users.
          </A11yCard>
          <A11yCard title="Screen Reader Support" icon="eye">
            Use proper heading levels within cards so screen reader users understand hierarchy. Prefer
            descriptive <code>CardTitle</code> text that provides context for the card&apos;s content.
          </A11yCard>
        </div>
      </DemoSection>
    </article>
  );
}
