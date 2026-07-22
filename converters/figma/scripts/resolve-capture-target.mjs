#!/usr/bin/env node
/**
 * Resolve Figma capture targets for a product + scope.
 *
 * Does NOT call Figma MCP (agents must use get_screenshot). Prints the
 * fileKey, nodeId, and destination path so capture is scripted + repeatable.
 *
 * Usage:
 *   node converters/figma/scripts/resolve-capture-target.mjs --product vp --scope Button
 *   node converters/figma/scripts/resolve-capture-target.mjs --product vp --scope Button --json
 *
 * After MCP get_screenshot returns a URL, save with:
 *   curl -L "<url>" -o converters/figma/verification/artifacts/<product>-<scope>.png
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1] ?? true]);
    return acc;
  }, []),
);

const product = args.product ?? 'vp';
const scope = args.scope;
const asJson = 'json' in args;

if (!scope || scope === true) {
  console.error('Usage: resolve-capture-target.mjs --product <vp|ppm|maconomy|cp> --scope <ElementKey>');
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const cfgPath = join(root, 'converters/figma/external.config.json');
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const binding = (cfg.bindings || []).find((b) => b.product === product);

if (!binding?.fileKey) {
  console.error(`No fileKey for product "${product}" in external.config.json`);
  process.exit(1);
}

const outRel = `converters/figma/verification/artifacts/${product}-${scope}.png`;
const outAbs = join(root, outRel);

const result = {
  product,
  scope,
  fileKey: binding.fileKey,
  fileName: binding.fileName,
  fileUrl: `https://www.figma.com/design/${binding.fileKey}`,
  /** Agents: read via use_figma → harmony/conversionState.elements.<scope>.nodeId */
  nodeIdHint: `Read figma.root.getSharedPluginData('harmony','conversionState') → elements.${scope}.nodeId`,
  artifactPath: outRel.replace(/\\/g, '/'),
  artifactAbs: outAbs,
  mcp: {
    tool: 'get_screenshot',
    server: cfg.mcpServer || 'user-Figma',
    args: { fileKey: binding.fileKey, nodeId: '<from conversionState>', maxDimension: 2048 },
  },
  saveHint: `curl -L "<screenshot-url>" -o "${outRel.replace(/\\/g, '/')}"`,
};

if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`product:   ${result.product}`);
  console.log(`scope:     ${result.scope}`);
  console.log(`fileKey:   ${result.fileKey}`);
  console.log(`file:      ${result.fileUrl}`);
  console.log(`nodeId:    ${result.nodeIdHint}`);
  console.log(`artifact:  ${result.artifactPath}`);
  console.log(`MCP tool:  ${result.mcp.tool} (${result.mcp.server})`);
  console.log(`save:      ${result.saveHint}`);
}
