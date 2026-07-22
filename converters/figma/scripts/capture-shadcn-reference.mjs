#!/usr/bin/env node
/**
 * Capture shadcn demo PNG for Figma verifier reference (not Astro).
 *
 * Usage:
 *   node converters/figma/scripts/capture-shadcn-reference.mjs --scope Button --product vp
 *   node converters/figma/scripts/capture-shadcn-reference.mjs --scope Button --product vp --out path.png
 *
 * Product/mode are applied via the demo's HarmonyThemeProvider localStorage keys
 * (`harmony-shadcn-product` / `harmony-shadcn-mode`) + data-product on <html>.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '../../..');

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

async function isUrlReady(url, timeoutMs = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res.ok || res.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function waitForUrl(url, { timeoutMs = 120_000, intervalMs = 500 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isUrlReady(url)) return true;
    await delay(intervalMs);
  }
  return false;
}

async function ensureDevServer({ command, cwd, baseUrl }) {
  if (await isUrlReady(baseUrl)) {
    return { proc: null, started: false, baseUrl };
  }
  const [bin, ...rest] = command.split(/\s+/);
  const proc = spawn(bin, rest, {
    cwd,
    shell: process.platform === 'win32',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '0' },
  });
  const ready = await waitForUrl(baseUrl);
  if (!ready) {
    proc.kill();
    throw new Error(`Dev server did not become ready at ${baseUrl} (command: ${command})`);
  }
  return { proc, started: true, baseUrl };
}

function stopDevServer(proc) {
  if (proc && !proc.killed) proc.kill();
}

const args = parseArgs(process.argv.slice(2));
const scope = args.scope;
const product = args.product ?? args.theme ?? 'vp';
const mode = args.mode ?? 'light';
const waitMs = Number(args.wait ?? 800);

if (!scope || scope === true) {
  console.error(
    'Usage: capture-shadcn-reference.mjs --scope <ElementKey> [--product vp|ppm|maconomy|cp] [--mode light|dark] [--out path]',
  );
  process.exit(1);
}

const routesPath = join(__dirname, 'shadcn-demo-routes.json');
const routes = JSON.parse(readFileSync(routesPath, 'utf8'));
const scopeConfig = routes.scopes?.[scope];
if (!scopeConfig) {
  console.error(`Scope "${scope}" not found in ${routesPath}`);
  console.error(`Known scopes: ${Object.keys(routes.scopes || {}).join(', ')}`);
  process.exit(1);
}

const allowed = new Set(['vp', 'ppm', 'maconomy', 'cp']);
if (!allowed.has(product)) {
  console.error(`Invalid product "${product}". Use: vp | ppm | maconomy | cp`);
  process.exit(1);
}

const out =
  args.out ??
  join(repoRoot, 'converters/figma/verification/artifacts', `reference-${scope}.png`);

const dev = routes.dev ?? {};
const baseUrl = dev.baseUrl ?? 'http://localhost:5177';
const command = dev.command ?? 'npm run dev';
const cwd = join(repoRoot, dev.cwd ?? 'conversions/harmony-design-system-shadcn');

let playwright;
try {
  playwright = await import('playwright');
} catch {
  console.error('Playwright is required. Run `npm install` at the repo root.');
  process.exit(1);
}

let server = null;
try {
  server = await ensureDevServer({ command, cwd, baseUrl });
  const url = `${baseUrl}${scopeConfig.path}`;
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Seed product/mode before first paint so HarmonyThemeProvider picks them up.
    await page.addInitScript(
      ({ product, mode }) => {
        localStorage.setItem('harmony-shadcn-product', product);
        localStorage.setItem('harmony-shadcn-mode', mode);
      },
      { product, mode },
    );

    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });

    await page.evaluate(
      ({ product, mode }) => {
        localStorage.setItem('harmony-shadcn-product', product);
        localStorage.setItem('harmony-shadcn-mode', mode);
        const root = document.documentElement;
        root.dataset.product = product;
        root.dataset.mode = mode;
        root.classList.toggle('dark', mode === 'dark');
      },
      { product, mode },
    );

    // Reload so React provider re-reads storage if init ran too late on first nav.
    await page.reload({ waitUntil: 'networkidle', timeout: 60_000 });
    await delay(waitMs);

    mkdirSync(dirname(out), { recursive: true });

    const selectors = String(scopeConfig.selector || 'body')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let el = null;
    for (const sel of selectors) {
      el = await page.$(sel);
      if (el) break;
    }
    if (!el) throw new Error(`No selector matched: ${scopeConfig.selector}`);

    const buffer = await el.screenshot({ type: 'png' });
    writeFileSync(out, buffer);
    console.log(`Captured shadcn reference (${product}/${mode}) → ${out}`);
  } finally {
    await browser.close();
  }
} finally {
  if (server?.started) stopDevServer(server.proc);
}

if (!existsSync(out)) {
  console.error(`Capture failed — missing ${out}`);
  process.exit(1);
}
