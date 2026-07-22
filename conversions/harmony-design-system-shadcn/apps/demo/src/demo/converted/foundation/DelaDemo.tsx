import { useEffect } from 'react';
import { Button } from '@dltkrichardhuska/harmony-design-system-shadcn/components';
import { DemoArticleNav, ImportSnippet } from '../../ui';
import { DemoPageHeader } from './DemoPageHeader';
import { DemoSection } from './DemoSection';
import { demoPageTitle } from '../../demoPageTitle';

const BRAND_GUIDE_HREF =
  'https://www.figma.com/proto/miqNBfEbHItRWIsPwAaaEr/2025_Dela_Product_Branding_Guidelines?node-id=3876-1740&p=f&m=dev&scaling=min-zoom&content-scaling=fixed&page-id=3876%3A861&t=EXcT5wMTx92t2hGx-1';

const ARTICLE_NAV = [
  { href: '#dela-brand-guide', label: 'Dela brand guide', icon: 'document-text' },
  { href: '#star-symbol', label: 'Star Symbol', icon: 'star' },
  { href: '#ask-dela-launch-icon', label: 'Ask Dela Launch Icon', icon: 'chat-bubble-left' },
  { href: '#ask-dela-panel', label: 'Ask Dela Panel', icon: 'window' },
  { href: '#dela-tokens', label: 'Dela tokens', icon: 'sparkles' },
] as const;

const TOKEN_ROWS = [
  { path: 'bg-dela / --gradient-dela', usage: 'Brand gradient fill (sidebar active, Dela CTAs)' },
  { path: '--gradient-dela-hover-bg', usage: 'Hover wash on Dela buttons / surfaces' },
  { path: 'text-dela-foreground / --dela-header-content-fg', usage: 'On-gradient text (always white)' },
  { path: 'Button variant="dela" | "dela-pill"', usage: 'Ask Dela / AI CTA buttons' },
] as const;

export function DelaDemo() {
  useEffect(() => {
    document.title = demoPageTitle('Dela');
  }, []);

  return (
    <article>
      <DemoPageHeader
        title="Dela"
        description='Dela AI assistance surfaces. Use Button variant="dela" and foundation CSS tokens — the same APIs an app using this package would use.'
      >
        <p className="mt-3 inline-flex rounded-md border border-border bg-card px-2 py-1 text-xs text-secondary">
          Foundation
        </p>
      </DemoPageHeader>

      <DemoArticleNav links={ARTICLE_NAV} />

      <ImportSnippet
        code={`import { Button } from '@dltkrichardhuska/harmony-design-system-shadcn/components';

<Button variant="dela">Ask Dela</Button>
<div className="bg-dela text-dela-foreground" />
<div style={{ backgroundImage: 'var(--gradient-dela)' }} />

/* Tokens: styles/tokens.css + Tailwind preset (bg-dela, text-dela-foreground) */`}
      />

      <div className="mb-10 grid gap-8 md:grid-cols-2">
        <DemoSection
          id="dela-brand-guide"
          title="Dela brand guide"
          description="This guide is designed to provide a starting point for your work with Dela. The strategies behind Dela will continue to evolve as the AI landscape breaks new ground."
        >
          <Button variant="dela" href={BRAND_GUIDE_HREF} target="_blank" rel="noopener noreferrer">
            Dela product brand guide
          </Button>
        </DemoSection>

        <DemoSection
          id="star-symbol"
          title="Star Symbol"
          description="Incorporate the star symbol as an optional complementary graphical element wherever the Dela brand is used within the product you're working on. Use sparingly."
        >
          <div className="mt-2 flex items-center gap-4">
            <img src="/Stars.svg" alt="Star symbol" className="h-5" />
            <span className="text-sm font-medium text-secondary">Suggested minimum height: 20px</span>
          </div>
        </DemoSection>
      </div>

      <div className="mb-10 grid gap-8 md:grid-cols-2">
        <DemoSection
          id="ask-dela-launch-icon"
          title="Ask Dela Launch Icon"
          description="The Ask Dela launch icon should exclusively serve the Digital Assistant in any product that does not have the Harmony sidebar applied. Its purpose is solely for initiating the chat window and may be strategically placed within various contexts, including within tables or as part of the primary navigation."
        >
          <p className="mb-4 text-sm text-secondary">
            Ensuring that the launch icon is exclusively reserved for the Digital Assistant fosters a
            consistent user experience. By limiting its application to launching the application, users
            can readily identify and access this AI-driven feature.
          </p>
          <div className="mt-2 flex items-center gap-4">
            <img src="/AskDelaLaunch.svg" alt="Ask Dela launch icon" className="h-[27px]" />
            <span className="text-sm font-medium text-secondary">Suggested minimum height: 27px</span>
          </div>
        </DemoSection>

        <DemoSection
          id="ask-dela-panel"
          title="Ask Dela Panel"
          description="Here's a visual representation of a baseline layout for the drawer version of the Digital Assistant. Use this as a starting point and adapt it according to your product requirements as needed."
        >
          <p className="text-sm text-secondary">
            It&apos;s important to note that the work on the Digital Assistant experience is ongoing and
            will evolve over time. The long-term goal is to develop a product agnostic experience that
            seamlessly integrates across our entire product lineup.
          </p>
          <p className="mt-4 rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
            Deferred until RightSidebar and ShellPanel convert: live panel demo, Panel Usage, AI
            Guidelines, and Accessibility sections from the reference page.
          </p>
        </DemoSection>
      </div>

      <DemoSection
        id="dela-tokens"
        title="Dela tokens"
        description='Dela surface tokens live in styles/tokens.css. Prefer bg-dela / text-dela-foreground or var(--…) and Button variant="dela".'
      >
        <div className="mb-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Path</th>
                <th className="px-3 py-2 font-medium">Value / usage</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_ROWS.map((row) => (
                <tr key={row.path} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-mono text-xs">{row.path}</td>
                  <td className="px-3 py-2 text-secondary">{row.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mb-2 text-sm text-secondary">
          Sidebar active gradient swatch (<code className="text-xs">bg-dela</code> /{' '}
          <code className="text-xs">--gradient-dela</code>)
        </p>
        <div
          className="h-[52px] w-[52px] rounded-xl bg-dela"
          style={{ backgroundImage: 'var(--gradient-dela)' }}
          aria-label="Dela sidebar active gradient"
        />
      </DemoSection>
    </article>
  );
}
