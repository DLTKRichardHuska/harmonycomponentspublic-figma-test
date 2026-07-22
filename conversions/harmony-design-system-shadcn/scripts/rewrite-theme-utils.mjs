/**
 * One-shot theme-utility rewrite for packages/ui components.
 * Prefer preset utilities; leave allowlisted var(--…) alone.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

const root = new URL('../packages/ui/src/components', import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  '$1',
);

const spaceKeys = [
  '0',
  '0-5',
  '1',
  '1-5',
  '2',
  '2-5',
  '3',
  '3-5',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '14',
  '16',
  '20',
  '24',
];

function twSpace(key) {
  return key.replace('-', '.'); // 0-5 → 0.5, 1-5 → 1.5, etc. Wait: space-0-5 token is --space-0-5 → tw 0.5
}

// Map token suffix to Tailwind spacing key
const spaceTw = {
  '0': '0',
  '0-5': '0.5',
  '1': '1',
  '1-5': '1.5',
  '2': '2',
  '2-5': '2.5',
  '3': '3',
  '3-5': '3.5',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  '11': '11',
  '12': '12',
  '14': '14',
  '16': '16',
  '20': '20',
  '24': '24',
};

const prefixes = [
  'gap',
  'p',
  'px',
  'py',
  'pt',
  'pb',
  'pl',
  'pr',
  'm',
  'mx',
  'my',
  'mt',
  'mb',
  'ml',
  'mr',
  'h',
  'w',
  'min-h',
  'min-w',
  'max-h',
  'max-w',
  'size',
  'inset',
  'top',
  'right',
  'bottom',
  'left',
  'space-x',
  'space-y',
];

function transform(src) {
  let out = src;

  const colorMap = [
    [/bg-\[var\(--card-bg\)\]/g, 'bg-card'],
    [/bg-\[var\(--page-bg\)\]/g, 'bg-background'],
    [/bg-\[var\(--input-bg\)\]/g, 'bg-input'],
    [/bg-\[var\(--theme-primary\)\]/g, 'bg-primary'],
    [/bg-\[var\(--surface-bg\)\]/g, 'bg-muted'],
    [/bg-\[var\(--hover-bg\)\]/g, 'bg-hover'],
    [/hover:bg-\[var\(--hover-bg\)\]/g, 'hover:bg-hover'],
    [/text-\[var\(--text-primary\)\]/g, 'text-foreground'],
    [/text-\[var\(--text-muted\)\]/g, 'text-muted-foreground'],
    [/text-\[var\(--text-secondary\)\]/g, 'text-secondary'],
    [/text-\[var\(--theme-primary\)\]/g, 'text-primary'],
    [/text-\[var\(--link-color\)\]/g, 'text-link'],
    [/text-\[var\(--text-inverse\)\]/g, 'text-primary-foreground'],
    [/border-\[var\(--border-color\)\]/g, 'border-border'],
    [/border-\[var\(--theme-primary\)\]/g, 'border-primary'],
    [/divide-\[var\(--border-color\)\]/g, 'divide-border'],
    [/outline-\[var\(--theme-primary\)\]/g, 'outline-primary'],
    [/ring-\[var\(--theme-primary\)\]/g, 'ring-primary'],
    [/from-\[var\(--theme-primary\)\]/g, 'from-primary'],
    [/to-\[var\(--theme-primary\)\]/g, 'to-primary'],
    [/fill-\[var\(--theme-primary\)\]/g, 'fill-primary'],
    [/stroke-\[var\(--theme-primary\)\]/g, 'stroke-primary'],
    [/bg-\[var\(--color-success\)\]/g, 'bg-success'],
    [/bg-\[var\(--color-warning\)\]/g, 'bg-warning'],
    [/bg-\[var\(--color-error\)\]/g, 'bg-error'],
    [/bg-\[var\(--color-info\)\]/g, 'bg-info'],
    [/text-\[var\(--color-success\)\]/g, 'text-success'],
    [/text-\[var\(--color-warning\)\]/g, 'text-warning'],
    [/text-\[var\(--color-error\)\]/g, 'text-error'],
    [/text-\[var\(--color-info\)\]/g, 'text-info'],
    [/border-\[var\(--color-error\)\]/g, 'border-error'],
    [/border-\[var\(--color-warning\)\]/g, 'border-warning'],
    [/border-\[var\(--color-success\)\]/g, 'border-success'],
  ];

  for (const [re, rep] of colorMap) out = out.replace(re, rep);

  const radiusMap = [
    [/rounded-\[var\(--radius-sm\)\]/g, 'rounded-sm'],
    [/rounded-\[var\(--radius-md\)\]/g, 'rounded-md'],
    [/rounded-\[var\(--radius-lg\)\]/g, 'rounded-lg'],
    [/rounded-\[var\(--radius-xl\)\]/g, 'rounded-xl'],
    [/rounded-\[var\(--radius-2xl\)\]/g, 'rounded-2xl'],
    [/rounded-\[var\(--radius-full\)\]/g, 'rounded-full'],
    [/rounded-t-\[var\(--radius-lg\)\]/g, 'rounded-t-lg'],
    [/rounded-b-\[var\(--radius-lg\)\]/g, 'rounded-b-lg'],
    [/rounded-l-\[var\(--radius-lg\)\]/g, 'rounded-l-lg'],
    [/rounded-r-\[var\(--radius-lg\)\]/g, 'rounded-r-lg'],
    [/rounded-t-\[var\(--radius-sm\)\]/g, 'rounded-t-sm'],
    [/rounded-b-\[var\(--radius-sm\)\]/g, 'rounded-b-sm'],
  ];
  for (const [re, rep] of radiusMap) out = out.replace(re, rep);

  const shadowMap = [
    [/shadow-\[var\(--shadow-none\)\]/g, 'shadow-none'],
    [/shadow-\[var\(--shadow-sm\)\]/g, 'shadow-sm'],
    [/shadow-\[var\(--shadow-md\)\]/g, 'shadow-md'],
    [/shadow-\[var\(--shadow-lg\)\]/g, 'shadow-lg'],
    [/shadow-\[var\(--shadow-xl\)\]/g, 'shadow-xl'],
    [/shadow-\[var\(--shadow-2xl\)\]/g, 'shadow-2xl'],
  ];
  for (const [re, rep] of shadowMap) out = out.replace(re, rep);

  const typeMap = [
    [/text-\[length:var\(--text-xs\)\]/g, 'text-xs'],
    [/text-\[length:var\(--text-sm\)\]/g, 'text-sm'],
    [/text-\[length:var\(--text-base\)\]/g, 'text-base'],
    [/text-\[length:var\(--text-lg\)\]/g, 'text-lg'],
    [/text-\[length:var\(--text-xl\)\]/g, 'text-xl'],
    [/font-\[family-name:var\(--font-sans\)\]/g, 'font-sans'],
    [/font-\[family-name:var\(--font-display\)\]/g, 'font-display'],
    [/font-\[family-name:var\(--font-mono\)\]/g, 'font-mono'],
  ];
  for (const [re, rep] of typeMap) out = out.replace(re, rep);

  for (const prefix of prefixes) {
    for (const [token, tw] of Object.entries(spaceTw)) {
      const re = new RegExp(
        `${prefix.replace(/-/g, '\\-')}-\\[var\\(--space-${token}\\)\\]`,
        'g',
      );
      out = out.replace(re, `${prefix}-${tw}`);
    }
  }

  // Arbitrary length with space tokens: h-[var(--space-5)] already handled.
  // border-t-[length:var(--space-1)] → border-t (thickness) — leave or map carefully
  out = out.replace(/border-t-\[length:var\(--space-1\)\]/g, 'border-t-4'); // 1 = 4px in spacing? --space-1 is typically 4px. border-t-4 in tw is 4px. OK-ish.
  // Actually space-1 might be 0.25rem = 4px, border-t-4 is 4px. Good.
  // Better leave complex border width as var if unsure — revert border-t-4 if wrong
  // Check tokens: --space-1. Skip aggressive border-t rewrite — undo:
  out = out.replace(/border-t-4/g, 'border-t-[length:var(--space-1)]'); // restore if we just broke things - only if we replaced. Actually we only replace that one pattern. Keep border-t-[length:var(--space-1)] as allowlisted for now.

  return out;
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(name)) {
      const before = readFileSync(p, 'utf8');
      const after = transform(before);
      if (after !== before) {
        writeFileSync(p, after);
        console.log('updated', p);
      }
    }
  }
}

walk(root);
console.log('done');
