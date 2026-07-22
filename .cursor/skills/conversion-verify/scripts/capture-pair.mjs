#!/usr/bin/env node
/**
 * Capture reference + converted artifacts for a converter scope (automated pair).
 *
 * Usage (agents via Shell):
 *   node capture-pair.mjs --converter harmony-design-system-react-mui --scope foundation
 */
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  ensureDevServer,
  parseArgs,
  repoRoot,
  stopDevServer,
  conversionDirForConverter,
  convertedCapturePath,
  DEFAULT_CONVERTED_DEV,
} from './_lib.mjs';

const args = parseArgs(process.argv.slice(2));
const converterId = args.converter;
const scope = args.scope;
const theme = process.env.CAPTURE_THEME ?? args.theme ?? 'cp';
const mode = process.env.CAPTURE_MODE ?? args.mode ?? 'light';

if (!converterId || !scope) {
  console.error('Usage: capture-pair.mjs --converter <id> --scope <scope>');
  process.exit(1);
}

const conversionRoot = conversionDirForConverter(converterId);
const artifactsDir = join(conversionRoot, 'verification', 'artifacts');
const referenceOut = join(artifactsDir, `reference-${scope}.html`);
const convertedOut = join(artifactsDir, `${scope}.html`);

const scriptDir = dirname(fileURLToPath(import.meta.url));
const captureReference = join(scriptDir, 'capture-reference.mjs');
const captureHtml = join(scriptDir, 'capture-html.mjs');

const refResult = spawnSync(
  process.execPath,
  [captureReference, '--scope', scope, '--out', referenceOut, '--theme', theme, '--mode', mode],
  { stdio: 'inherit', env: { ...process.env, CAPTURE_THEME: theme, CAPTURE_MODE: mode } },
);
if (refResult.status !== 0) process.exit(refResult.status ?? 1);

const dev = DEFAULT_CONVERTED_DEV;
const baseUrl = dev.baseUrl;
const command = dev.command;
const cwd = conversionRoot;
const capturePath = convertedCapturePath(scope, theme, mode);
const selector = dev.selector;

let server = null;
try {
  server = await ensureDevServer({ command, cwd, baseUrl });
  const url = `${baseUrl}${capturePath}`;

  const convResult = spawnSync(
    process.execPath,
    [
      captureHtml,
      '--url',
      url,
      '--out',
      convertedOut,
      '--selector',
      selector,
      '--theme',
      theme,
      '--mode',
      mode,
    ],
    { stdio: 'inherit', env: { ...process.env, CAPTURE_THEME: theme, CAPTURE_MODE: mode } },
  );
  if (convResult.status !== 0) process.exit(convResult.status ?? 1);

  console.log(`\nCapture pair complete for ${converterId}/${scope}:`);
  console.log(`  reference → ${referenceOut}`);
  console.log(`  converted → ${convertedOut}`);
} finally {
  if (server?.started) stopDevServer(server.proc);
}
