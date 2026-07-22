#!/usr/bin/env node
/**
 * Rendered alignment audit — compares relative horizontal offset (control left − anchor left)
 * on reference (:4321) vs converted (:5176) for paired selectors.
 *
 * Produces EVIDENCE for verifier agents; does NOT auto-pass/fail (agent judges per VISUAL_MATCH_GATE.md).
 *
 * Usage:
 *   node .cursor/skills/conversion-verify/scripts/audit-rendered-alignment.mjs \
 *     --conversion harmony-design-system-react-mui \
 *     --route /components/alerts \
 *     --pairs '[{"label":"Alert link","findText":"only a link","ref":{"container":".alert--enhanced","anchor":".alert__message","control":".alert__link"},"conv":{"container":".MuiAlert-outlined","anchor":".MuiAlert-message","control":".MuiLink-root"}}]'
 *
 * Or --pairs-file path/to/pairs.json (array of pair objects).
 *
 * Requires both dev servers running. Playwright required.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs, conversionDir, loadPlaywright, applyThemeAndMode } from './_lib.mjs';

const REF_BASE = process.env.REF_BASE_URL ?? 'http://localhost:4321';
const CONV_BASE = process.env.CONV_BASE_URL ?? 'http://localhost:5176';
const DEFAULT_TOLERANCE = 2;

function parsePairs(args) {
  if (args['pairs-file']) {
    return JSON.parse(readFileSync(args['pairs-file'], 'utf8'));
  }
  if (args.pairs) {
    return JSON.parse(args.pairs);
  }
  throw new Error('Provide --pairs JSON array or --pairs-file');
}

async function measurePair(page, baseUrl, side, pair, theme, mode) {
  const url = `${baseUrl}${pair.route ?? ''}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await applyThemeAndMode(page, { theme, mode });
  await page.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);

  return page.evaluate(
    ({ side, pair, tolerancePx }) => {
      const cfg = pair[side];
      if (!cfg) return { error: `missing side config: ${side}` };

      const containers = [...document.querySelectorAll(cfg.container)];
      const container = pair.findText
        ? containers.find((el) => el.textContent?.includes(pair.findText))
        : containers[0];

      if (!container) {
        return {
          error: `container not found: ${cfg.container}${pair.findText ? ` with text "${pair.findText}"` : ''}`,
        };
      }

      const anchor = container.querySelector(cfg.anchor);
      const control = container.querySelector(cfg.control);
      if (!anchor || !control) {
        return {
          error: 'anchor or control not found',
          anchorFound: !!anchor,
          controlFound: !!control,
        };
      }

      const anchorRect = anchor.getBoundingClientRect();
      const controlRect = control.getBoundingClientRect();
      const deltaPx = Math.round((controlRect.left - anchorRect.left) * 10) / 10;

      return {
        deltaPx,
        anchorLeft: Math.round(anchorRect.left),
        controlLeft: Math.round(controlRect.left),
        tolerancePx,
      };
    },
    { side, pair, tolerancePx: pair.tolerancePx ?? DEFAULT_TOLERANCE },
  );
}

async function auditPair(page, pair, theme, mode) {
  const ref = await measurePair(page, REF_BASE, 'ref', pair, theme, mode);
  const conv = await measurePair(page, CONV_BASE, 'conv', pair, theme, mode);

  const tolerancePx = pair.tolerancePx ?? DEFAULT_TOLERANCE;
  let match = null;
  let deltaDiff = null;

  if (!ref.error && !conv.error) {
    deltaDiff = Math.round((conv.deltaPx - ref.deltaPx) * 10) / 10;
    match = Math.abs(deltaDiff) <= tolerancePx;
  }

  return {
    label: pair.label ?? 'unnamed',
    findText: pair.findText ?? null,
    tolerancePx,
    reference: ref,
    converted: conv,
    deltaDiff,
    match,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const conversionId = args.conversion ?? 'harmony-design-system-react-mui';
  const route = args.route ?? '/';
  const theme = args.theme ?? 'cp';
  const mode = args.mode ?? 'light';

  const pairsRaw = parsePairs(args);
  const pairs = pairsRaw.map((p) => ({ ...p, route: p.route ?? route }));

  const outDir = join(
    conversionDir(conversionId),
    'verification',
    'artifacts',
    `alignment-audit-${Date.now()}`,
  );
  mkdirSync(outDir, { recursive: true });

  const chromium = await loadPlaywright();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });

  const rows = [];
  try {
    for (const pair of pairs) {
      console.log(`audit alignment: ${pair.label ?? pair.findText ?? 'pair'}`);
      rows.push(await auditPair(page, pair, theme, mode));
    }
  } finally {
    await browser.close();
  }

  const report = {
    generatedAt: new Date().toISOString(),
    note: 'Evidence only — verifier agent judges PASS/FAIL per VISUAL_MATCH_GATE.md',
    reference: REF_BASE,
    converted: CONV_BASE,
    route,
    theme,
    mode,
    conversionId,
    rows,
    mismatchCount: rows.filter((r) => r.match === false).length,
    errorCount: rows.filter((r) => r.reference?.error || r.converted?.error).length,
  };

  const jsonPath = join(outDir, 'alignment-audit.json');
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const mdLines = [
    '# Rendered alignment audit',
    '',
    '_Evidence only — agent judges. Do not use as automated PASS/FAIL gate._',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Route: \`${route}\` | Theme: ${theme} / ${mode}`,
    '',
    '| Label | Ref Δ (control−anchor) | Conv Δ | Δ diff | Match |',
    '|-------|----------------------|--------|--------|-------|',
  ];

  for (const row of rows) {
    const refDelta = row.reference?.error ? `error: ${row.reference.error}` : `${row.reference.deltaPx}px`;
    const convDelta = row.converted?.error ? `error: ${row.converted.error}` : `${row.converted.deltaPx}px`;
    const diff = row.deltaDiff != null ? `${row.deltaDiff}px` : '—';
    const match = row.match === null ? '—' : row.match ? 'yes' : '**no**';
    mdLines.push(`| ${row.label} | ${refDelta} | ${convDelta} | ${diff} | ${match} |`);
  }

  if (report.mismatchCount) {
    mdLines.push('', '## Mismatches (agent review required)', '');
    for (const row of rows.filter((r) => r.match === false)) {
      mdLines.push(
        `- **${row.label}**: ref offset ${row.reference.deltaPx}px vs conv ${row.converted.deltaPx}px (diff ${row.deltaDiff}px)`,
      );
    }
  }

  const mdPath = join(outDir, 'alignment-audit.md');
  writeFileSync(mdPath, mdLines.join('\n'));

  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${mdPath}`);
  console.log(`Mismatches: ${report.mismatchCount} (evidence only — agent judges)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
