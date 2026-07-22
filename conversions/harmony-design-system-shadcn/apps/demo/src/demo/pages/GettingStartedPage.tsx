import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DemoCodeBlock } from '../ui';
import { DemoPageHeader } from '../converted/foundation/DemoPageHeader';
import { DemoSection } from '../converted/foundation/DemoSection';
import { demoPageTitle } from '../demoPageTitle';

// Auth method A — personal access token (classic PAT with read:packages).
const npmrcPatExample = `@dltkrichardhuska:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN`;

// Auth method B — reuse an existing GitHub CLI login (no PAT to manage).
const npmrcScopeExample = `# .npmrc — scope only; the token comes from the gh CLI below
@dltkrichardhuska:registry=https://npm.pkg.github.com`;
const ghLoginExample = `gh auth login --scopes read:packages
npm config set //npm.pkg.github.com/:_authToken "$(gh auth token)"`;

// Consumers install ONE product package (example uses -cp / Costpoint).
// Substitute -vp / -ppm / -maconomy for other products. See docs/PRODUCT_BUILDS.md.
const installExample = `npm install @dltkrichardhuska/harmony-design-system-shadcn-cp
# peers: React + Tailwind v4 (utilities/clsx/tailwind-merge ship with the package)
npm install react react-dom
npm install -D tailwindcss`;

const stylesExample = `// main.tsx — import ONCE at the app root.
// This single file loads Tailwind, the bundled fonts, and the product tokens.
import '@dltkrichardhuska/harmony-design-system-shadcn-cp/styles/globals.css';`;

// Wire Tailwind v4 through whichever build tool the consumer already uses.
// Vite is shown as one example; pick the row that matches your stack.
const tailwindSetupExample = `# Vite            npm i -D @tailwindcss/vite    -> add tailwindcss() to vite.config plugins
# PostCSS (Next,  npm i -D @tailwindcss/postcss -> add "@tailwindcss/postcss" to postcss.config
#   Webpack, CRA)
# CLI / other     npm i -D @tailwindcss/cli     -> npx @tailwindcss/cli -i globals.css -o out.css
# Docs: https://tailwindcss.com/docs/installation`;

const viteExample = `// vite.config.ts — example for a Vite app
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});`;

const providerExample = `import { HarmonyThemeProvider } from '@dltkrichardhuska/harmony-design-system-shadcn-cp';

export function App() {
  // Product is fixed by the installed package (-cp here). There is no
  // product switching — only light/dark mode is a runtime concern.
  return (
    <HarmonyThemeProvider defaultMode="light">
      {/* your app */}
    </HarmonyThemeProvider>
  );
}`;

const utilsExample = `import { cn } from '@dltkrichardhuska/harmony-design-system-shadcn-cp';

<div className={cn('rounded-md border border-border bg-background', isActive && 'border-primary')} />`;

const iconExample = `import { Icon } from '@dltkrichardhuska/harmony-design-system-shadcn-cp';

<Icon name="home" size="md" />
<Icon name="check-circle" size="lg" />
<Icon name="x-mark" />

// If you were about to import lucide-react — don't.
// Use Harmony name strings instead (home, check-circle, x-mark, magnifying-glass, chevron-down).`;

const cursorRuleSnippet = `# Harmony shadcn (single product — example: -cp)
- Read node_modules/@dltkrichardhuska/harmony-design-system-shadcn-cp/AGENTS.md (catalog→export map)
- Product is fixed by the installed package — no product switching, no data-product/defaultProduct
- Tailwind v4, zero config: styles/globals.css does @import "tailwindcss" + @theme; no preset/content
- Prefer theme utilities (bg-card, gap-2, rounded-lg, transition-colors); var(--…) only when unmapped
- Icons: package Icon with name strings only — never lucide-react / heroicons / tabler at call sites
- Omit components.json iconLibrary
- Hybrid C: no label on bare Input/Checkbox/Toggle/Select — use *Field or Label
- Catalog Dropdown → import Select (no Dropdown export)
- Do not invent off-stack UI kits or parallel token JSON`;

export function GettingStartedPage() {
  useEffect(() => {
    document.title = demoPageTitle('Getting Started');
  }, []);

  return (
    <div>
      <DemoPageHeader
        title="Getting Started"
        description="Add the Harmony Design System shadcn/ui package to another project: install one product package, run Tailwind v4 (zero config), wire the theme provider, then build UI with package components and Tailwind utilities. Fonts are bundled."
      />

      <DemoSection id="for-developers" title="For developers">
        <div className="mb-4 max-w-2xl rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">
          <strong className="text-foreground">Choose a product first.</strong> Harmony ships one
          package per product. Pick the one for your app up front; after that it is a plain shadcn +
          Tailwind + Radix library with no product switching. Available packages:
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <code>@dltkrichardhuska/harmony-design-system-shadcn-cp</code> — Costpoint
            </li>
            <li>
              <code>@dltkrichardhuska/harmony-design-system-shadcn-vp</code> — Vantagepoint
            </li>
            <li>
              <code>@dltkrichardhuska/harmony-design-system-shadcn-ppm</code> — PPM
            </li>
            <li>
              <code>@dltkrichardhuska/harmony-design-system-shadcn-maconomy</code> — Maconomy
            </li>
          </ul>
          <p className="mt-2">
            Examples below use the Costpoint (<code>-cp</code>) package — substitute your product.
            See <code>docs/PRODUCT_BUILDS.md</code> in the package.
          </p>
        </div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          1. Install
        </h3>
        <p className="mb-2 max-w-2xl text-sm text-muted-foreground">
          The packages are published to GitHub Packages, so npm needs auth for the{' '}
          <code>@dltkrichardhuska</code> scope. Use <strong className="text-foreground">either</strong>{' '}
          method below, then install.
        </p>
        <p className="mb-1 text-xs font-semibold text-muted-foreground">
          .npmrc — Method A: personal access token (read:packages)
        </p>
        <DemoCodeBlock className="mb-3 bg-card p-4">{npmrcPatExample}</DemoCodeBlock>
        <p className="mb-1 text-xs font-semibold text-muted-foreground">
          Method B: reuse an existing GitHub CLI login (no PAT to manage)
        </p>
        <DemoCodeBlock className="mb-2 bg-card p-4">{npmrcScopeExample}</DemoCodeBlock>
        <DemoCodeBlock className="mb-3 bg-card p-4">{ghLoginExample}</DemoCodeBlock>
        <p className="mb-1 text-xs font-semibold text-muted-foreground">Install</p>
        <DemoCodeBlock className="mb-3 bg-card p-4">{installExample}</DemoCodeBlock>
        <p className="mb-6 max-w-2xl text-xs text-muted-foreground">
          Fonts (variable Figtree / Lexend / JetBrains Mono) are bundled in the package — there is no
          Fontsource setup. <code>clsx</code>, <code>tailwind-merge</code>, and{' '}
          <code>class-variance-authority</code> ship as dependencies.
        </p>

        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          2. Run Tailwind v4 (zero config)
        </h3>
        <p className="mb-2 max-w-2xl text-sm text-muted-foreground">
          There is <strong className="text-foreground">no</strong> <code>tailwind.config</code>, no
          preset, and no <code>content</code> globs. The package&apos;s <code>globals.css</code> does{' '}
          <code>@import &quot;tailwindcss&quot;</code>, maps the Harmony tokens to utilities with{' '}
          <code>@theme</code>, enables <code>.dark</code> mode, and registers its own component
          classes with <code>@source</code>. Add the Tailwind v4 plugin for{' '}
          <strong className="text-foreground">whichever build tool you already use</strong> — this
          package does not require Vite:
        </p>
        <DemoCodeBlock className="mb-3 bg-card p-4">{tailwindSetupExample}</DemoCodeBlock>
        <p className="mb-2 max-w-2xl text-sm text-muted-foreground">
          Example for a Vite app:
        </p>
        <DemoCodeBlock className="mb-3 bg-card p-4">{viteExample}</DemoCodeBlock>

        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          3. Import styles (once)
        </h3>
        <p className="mb-2 max-w-2xl text-sm text-muted-foreground">
          Import <code>globals.css</code> once at the app root. It brings Tailwind, the bundled
          fonts, and the product-baked tokens. Your own <code>bg-primary</code>,{' '}
          <code>text-heading-xl</code>, <code>shadow-md</code>, and <code>dark:*</code> utilities work
          too, following the same light/dark switch.
        </p>
        <DemoCodeBlock className="mb-3 bg-card p-4">{stylesExample}</DemoCodeBlock>

        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          4. Wrap with HarmonyThemeProvider
        </h3>
        <p className="mb-2 max-w-2xl text-sm text-muted-foreground">
          The provider is <strong className="text-foreground">mode only</strong> — product is fixed
          by the installed package. Set <code>defaultMode</code> (<code>light</code> /{' '}
          <code>dark</code>); toggle at runtime via <code>useHarmonyTheme</code>. There is no{' '}
          <code>defaultProduct</code>. The provider toggles the <code>dark</code> class on{' '}
          <code>&lt;html&gt;</code>.
        </p>
        <DemoCodeBlock className="mb-3 bg-card p-4">{providerExample}</DemoCodeBlock>

        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          5. Using the library
        </h3>
        <p className="mb-2 max-w-2xl text-sm text-muted-foreground">
          Use <code>cn()</code> and semantic Tailwind classes (<code>bg-background</code>,{' '}
          <code>text-primary</code>, …). Import everything from the bare package specifier{' '}
          <code>@dltkrichardhuska/harmony-design-system-shadcn-cp</code> (subpaths{' '}
          <code>/components</code>, <code>/theme</code>, <code>/utils</code> still work). Foundation
          tokens: see{' '}
          <Link to="/foundation/colors" className="text-primary underline">
            Colors
          </Link>
          .
        </p>
        <DemoCodeBlock className="mb-3 bg-card p-4">{utilsExample}</DemoCodeBlock>

        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          6. Icons
        </h3>
        <p className="mb-2 max-w-2xl text-sm text-muted-foreground">
          Use package <code>Icon</code> with Harmony name strings. Do not import{' '}
          <code>lucide-react</code> for app UI. See{' '}
          <Link to="/components/icons" className="text-primary underline">
            Icons
          </Link>
          .
        </p>
        <DemoCodeBlock className="mb-3 bg-card p-4">{iconExample}</DemoCodeBlock>
      </DemoSection>

      <DemoSection id="for-ai-systems" title="For AI systems">
        <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
          Point coding agents at the package&apos;s own AI-facing docs before generating code:
        </p>
        <ul className="mb-6 max-w-2xl list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            <code>node_modules/@dltkrichardhuska/harmony-design-system-shadcn-cp/AGENTS.md</code>
          </li>
          <li>
            <code>node_modules/@dltkrichardhuska/harmony-design-system-shadcn-cp/llms.txt</code>
          </li>
          <li>
            <code>node_modules/@dltkrichardhuska/harmony-design-system-shadcn-cp/docs/components/Icon.md</code>
          </li>
        </ul>
        <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
          These artifacts are scoped to the installed product (single-product banner at the top).
          The agent should treat the design system as fixed — one palette, one geometry, one
          component set — and never emit <code>data-product</code> or <code>defaultProduct</code>.
        </p>

        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Do
        </h3>
        <ul className="mb-4 max-w-2xl list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>
            Bootstrap once: import <code>globals.css</code> (Tailwind v4, zero config) +
            HarmonyThemeProvider with <code>defaultMode</code> (mode only; product is fixed by the
            installed package).
          </li>
          <li>
            Use public exports only (bare specifier, or <code>/theme</code>, <code>/utils</code>,{' '}
            <code>/components</code>, <code>/styles</code>). Tokens are CSS variables surfaced as
            Tailwind utilities — not a JSON export.
          </li>
          <li>
            Icons: <code>&lt;Icon name=&quot;…&quot; /&gt;</code> only (e.g.{' '}
            <code>home</code>, <code>check-circle</code>, <code>x-mark</code>).
          </li>
        </ul>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Don&apos;t
        </h3>
        <ul className="mb-6 max-w-2xl list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Invent a second token system (JSON themes, per-product Tailwind hex configs).</li>
          <li>
            Reintroduce product switching (<code>data-product</code> / <code>defaultProduct</code>) —
            product is fixed by the installed package.
          </li>
          <li>Use MUI, Chakra, Lucide, or other off-stack UI kits for Harmony UI / icons.</li>
          <li>
            Set stock shadcn <code>components.json</code> <code>iconLibrary</code> to{' '}
            <code>lucide</code> / <code>tabler</code> — omit it; CLI cannot emit Harmony{' '}
            <code>Icon</code>. Prefer npm package imports or the package{' '}
            <code>registry.json</code> (complete — one shim per component, <code>npx shadcn add</code>{' '}
            re-exports the installed package) — not the official shadcn registry.
          </li>
        </ul>

        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Optional Cursor rule snippet
        </h3>
        <p className="mb-2 max-w-2xl text-sm text-muted-foreground">
          Drop into a consumer <code>.cursor/rules</code> file so agents load package guidance first.
          AGENTS.md remains the source of truth.
        </p>
        <DemoCodeBlock className="mb-3 bg-card p-4">{cursorRuleSnippet}</DemoCodeBlock>
      </DemoSection>
    </div>
  );
}
