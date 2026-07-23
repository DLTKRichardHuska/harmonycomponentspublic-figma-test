/**
 * Shared utilities for conversion-verify scripts.
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function repoRoot() {
  return join(__dirname, '..', '..', '..', '..');
}

export function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function ensureDirForFile(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

export function parseArgs(argv) {
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

export async function isUrlReady(url, timeoutMs = 3000) {
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

export async function waitForUrl(url, { timeoutMs = 120_000, intervalMs = 500 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isUrlReady(url)) return true;
    await delay(intervalMs);
  }
  return false;
}

export async function ensureDevServer({
  command,
  cwd,
  baseUrl,
  reuse = process.env.CAPTURE_REUSE_SERVER === '1',
}) {
  if (reuse && (await isUrlReady(baseUrl))) {
    return { proc: null, started: false, baseUrl };
  }
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

export function stopDevServer(proc) {
  if (proc && !proc.killed) {
    proc.kill();
  }
}

export async function loadPlaywright() {
  try {
    const mod = await import('playwright');
    return mod.chromium;
  } catch {
    console.error(
      'Playwright is required for automated capture. Run `npm install` at the repo root.',
    );
    process.exit(1);
  }
}

export async function applyThemeAndMode(page, { theme = 'cp', mode = 'light' } = {}) {
  await page.evaluate(
    ({ theme, mode }) => {
      localStorage.setItem('theme', mode);
      localStorage.setItem('colorTheme', theme);
      document.documentElement.classList.remove(
        'dark',
        'theme-cp',
        'theme-vp',
        'theme-ppm',
        'theme-maconomy',
      );
      document.documentElement.classList.add(`theme-${theme}`);
      if (mode === 'dark') document.documentElement.classList.add('dark');
    },
    { theme, mode },
  );
}

export function converterDir(converterId) {
  return join(repoRoot(), 'converters', converterId);
}

export function conversionDir(conversionId) {
  return join(repoRoot(), 'conversions', conversionId);
}

export function conversionDirForConverter(converterId) {
  const cdir = converterDir(converterId);
  const manifestPath = join(cdir, 'converter.manifest.json');
  if (!existsSync(manifestPath)) {
    throw new Error(`Converter manifest not found: ${manifestPath}`);
  }
  const manifest = loadJson(manifestPath);
  const outputId = manifest.conversion?.outputId ?? converterId;
  const outputPath = manifest.conversion?.outputPath ?? `conversions/${outputId}`;
  return join(repoRoot(), outputPath);
}

export const DEFAULT_CONVERTED_DEV = {
  port: 5176,
  baseUrl: 'http://localhost:5176',
  command: 'npm run dev',
  selector: '#capture-root',
};
