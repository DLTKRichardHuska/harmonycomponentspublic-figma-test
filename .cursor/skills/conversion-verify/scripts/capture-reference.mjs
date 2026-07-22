#!/usr/bin/env node
/**
 * Capture Astro reference HTML (or PNG) for a conversion scope.
 *
 * Usage:
 *   node capture-reference.mjs --scope Button [--out path] [--theme cp] [--mode light]
 */
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  ensureDevServer,
  loadPreviewRoutes,
  parseArgs,
  repoRoot,
  stopDevServer,
} from './_lib.mjs';

const args = parseArgs(process.argv.slice(2));
const scope = args.scope;
const theme = process.env.CAPTURE_THEME ?? args.theme ?? 'cp';
const mode = process.env.CAPTURE_MODE ?? args.mode ?? 'light';
const format = args.format ?? 'html';

if (!scope) {
  console.error('Usage: capture-reference.mjs --scope <foundation|ComponentName|shell> [--out path]');
  process.exit(1);
}

const routes = loadPreviewRoutes();
const scopeConfig = routes.scopes?.[scope];
if (!scopeConfig) {
  console.error(`Scope "${scope}" not found in converters/reference/preview-routes.json`);
  process.exit(1);
}

const dev = routes.dev ?? { port: 4321, baseUrl: 'http://localhost:4321', command: 'npm run dev' };
const baseUrl = dev.baseUrl ?? `http://localhost:${dev.port ?? 4321}`;
const command = dev.command ?? 'npm run dev';
const cwd = dev.cwd ? join(repoRoot(), dev.cwd) : repoRoot();

let server = null;
try {
  server = await ensureDevServer({ command, cwd, baseUrl });
  const url = `${baseUrl}${scopeConfig.path}`;
  const out =
    args.out ??
    join(repoRoot(), 'converters', '_capture-temp', `reference-${scope}.${format === 'png' ? 'png' : 'html'}`);

  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const captureScript = join(scriptDir, 'capture-html.mjs');
  const selector = scopeConfig.selector ?? 'body';

  const result = spawnSync(
    process.execPath,
    [
      captureScript,
      '--url',
      url,
      '--out',
      out,
      '--format',
      format,
      '--selector',
      selector,
      '--theme',
      theme,
      '--mode',
      mode,
    ],
    { stdio: 'inherit', env: { ...process.env, CAPTURE_THEME: theme, CAPTURE_MODE: mode } },
  );

  if (result.status !== 0) process.exit(result.status ?? 1);
} finally {
  if (server?.started) stopDevServer(server.proc);
}
