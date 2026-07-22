#!/usr/bin/env node
/**
 * Check that MUI MCP server metadata is available in the Cursor MCP config.
 * Agents must call useMuiDocs directly; this script is a local/CI hint only.
 */
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const MCP_MESSAGE =
  'React+MUI sync requires the MUI MCP server (user-mui-mcp). Enable it in Cursor MCP settings and retry.';

const __dirname = dirname(fileURLToPath(import.meta.url));
const targetRoot = resolve(__dirname, '..');
const repoRoot = resolve(targetRoot, '../..');
const repoName = repoRoot.split(/[/\\]/).pop() ?? '';

const candidatePaths = [
  join(repoRoot, 'mcps/user-mui-mcp/SERVER_METADATA.json'),
  join(
    homedir(),
    '.cursor/projects',
    `c-Workspaces-${repoName}`,
    'mcps/user-mui-mcp/SERVER_METADATA.json',
  ),
  join(homedir(), '.cursor/projects', `${repoName}/mcps/user-mui-mcp/SERVER_METADATA.json`),
];

const found = candidatePaths.some((p) => existsSync(p));

if (!found) {
  console.error(MCP_MESSAGE);
  console.error('');
  console.error('Expected MCP descriptor at one of:');
  for (const p of candidatePaths) {
    console.error(`  - ${p}`);
  }
  process.exit(1);
}

const libPath = pathToFileURL(
  join(repoRoot, '.cursor/skills/harmony-conversion/scripts/_lib.mjs'),
).href;
const { getConverterMuiPolicy, resolveLatestMuiVersion, muiDocsUrlForVersion } = await import(libPath);

const policy = getConverterMuiPolicy('harmony-design-system-react-mui');
const major = policy?.major ?? 9;
const latest = resolveLatestMuiVersion(major) ?? `${major}.x`;
const docsUrl = muiDocsUrlForVersion(latest);

console.log('MUI MCP server descriptor found (user-mui-mcp).');
console.log(`MUI policy: major ${major}, track ${policy?.track ?? 'latest'} (resolved ${latest}).`);
console.log(`Agents: call useMuiDocs with ${docsUrl} before sync/conversion.`);
