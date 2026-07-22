#!/usr/bin/env node
/**
 * Palette swatch audit — checks foundation color swatches on the converted demo
 * against theme.palette paths (data-color-key / sx bgcolor).
 *
 * For harmony-design-system-react-mui, demos must expose consumer-accessible
 * MUI palette paths only — not Harmony token names.
 *
 * Usage:
 *   node .cursor/skills/conversion-verify/scripts/audit-palette-swatches.mjs \
 *     --conversion harmony-design-system-react-mui
 *
 * Requires the converted demo server running. Playwright optional but recommended.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, conversionDir, loadPlaywright, applyThemeAndMode } from './_lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** MUI theme.palette paths shown on the converted colors demo. */
const PALETTE_KEYS = [
  'background.default',
  'background.paper',
  'primary.main',
  'primary.dark',
  'primary.contrastText',
  'secondary.main',
  'pageHeader.main',
  'pageHeader.dark',
  'pageHeader.contrastText',
  'text.primary',
  'text.secondary',
  'text.disabled',
  'divider',
  'action.hover',
  'success.main',
  'warning.main',
  'error.main',
  'info.main',
  'statusBadge.primary.background',
  'statusBadge.primary.foreground',
  'statusBadge.success.background',
  'statusBadge.success.foreground',
  'statusBadge.warning.background',
  'statusBadge.warning.foreground',
  'statusBadge.error.background',
  'statusBadge.error.foreground',
  'statusBadge.info.background',
  'statusBadge.info.foreground',
  'statusBadge.orange.background',
  'statusBadge.orange.foreground',
  'statusBadge.pink.background',
  'statusBadge.pink.foreground',
  'statusBadge.disabled.background',
  'statusBadge.disabled.foreground',
  'statusBadge.disabled.border',
];

const PRODUCTS = ['cp', 'vp', 'ppm', 'maconomy'];
const MODES = ['light', 'dark'];

const CONV_BASE = process.env.CONV_BASE_URL ?? 'http://localhost:5176';
const ROUTE = '/foundation/colors';

function parseColor(css) {
  if (!css) return null;
  const t = css.trim();
  const m = t.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (!m) return { raw: t };
  return {
    r: Math.round(Number(m[1])),
    g: Math.round(Number(m[2])),
    b: Math.round(Number(m[3])),
    a: m[4] !== undefined ? Number(m[4]) : 1,
  };
}

function toDisplayHex(parsed) {
  if (!parsed || parsed.raw) return parsed?.raw ?? null;
  if ((parsed.a ?? 1) < 1) return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${parsed.a})`;
  return `#${[parsed.r, parsed.g, parsed.b].map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

async function readConvertedSwatches(page, keys) {
  return page.evaluate((keyNames) => {
    const out = {};
    for (const key of keyNames) {
      const el = document.querySelector(`[data-color-key="${key}"]`);
      if (!el) {
        out[key] = null;
        continue;
      }
      const parent = el.parentElement;
      const label = parent?.querySelector('.MuiTypography-caption');
      out[key] = {
        backgroundColor: getComputedStyle(el).backgroundColor,
        label: label?.textContent?.trim() ?? null,
      };
    }
    return out;
  }, keys);
}

async function auditCombo(page, product, mode) {
  await page.goto(`${CONV_BASE}${ROUTE}`, { waitUntil: 'networkidle', timeout: 60_000 });
  await applyThemeAndMode(page, { theme: product, mode });
  await page.reload({ waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(1200);

  const conv = await readConvertedSwatches(page, PALETTE_KEYS);
  const rows = [];
  for (const key of PALETTE_KEYS) {
    const entry = conv[key];
    const parsed = parseColor(entry?.backgroundColor ?? null);
    const present = entry != null && entry.backgroundColor != null;
    rows.push({
      key,
      present,
      backgroundColor: entry?.backgroundColor ?? null,
      label: entry?.label ?? null,
      display: toDisplayHex(parsed),
      match: present,
      ...(present ? {} : { note: 'missing-swatch' }),
    });
  }
  return { product, mode, rows, mismatches: rows.filter((r) => !r.match) };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const conversionId = args.conversion ?? 'harmony-design-system-react-mui';
  const outDir = join(conversionDir(conversionId), 'verification', 'artifacts', `swatch-audit-${Date.now()}`);
  mkdirSync(outDir, { recursive: true });

  const chromium = await loadPlaywright();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];
  try {
    for (const product of PRODUCTS) {
      for (const mode of MODES) {
        console.log(`audit ${product} / ${mode}`);
        results.push(await auditCombo(page, product, mode));
      }
    }
  } finally {
    await browser.close();
  }

  const allMismatches = results.flatMap((r) =>
    r.mismatches.map((m) => ({ product: r.product, mode: r.mode, ...m })),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    converted: `${CONV_BASE}${ROUTE}`,
    conversionId,
    paletteKeys: PALETTE_KEYS,
    combos: results.length,
    mismatchCount: allMismatches.length,
    results,
    mismatches: allMismatches,
  };

  const jsonPath = join(outDir, 'swatch-audit.json');
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const mdLines = [
    '# Palette swatch audit (MUI theme.palette)',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    'Converted foundation colors must expose `theme.palette` paths via `data-color-key`.',
    '',
    `| Product | Mode | Key | Computed | Label | Present |`,
    `|---------|------|-----|----------|-------|---------|`,
  ];
  for (const r of results) {
    for (const row of r.rows) {
      mdLines.push(
        `| ${r.product} | ${r.mode} | ${row.key} | ${row.display ?? row.backgroundColor ?? '—'} | ${row.label ?? '—'} | ${row.match ? 'yes' : '**no**'} |`,
      );
    }
  }
  if (allMismatches.length) {
    mdLines.push('', '## Missing swatches (agent review required)', '');
    for (const m of allMismatches) {
      mdLines.push(`- **${m.product} / ${m.mode} / ${m.key}**: swatch not found`);
    }
  }
  const mdPath = join(outDir, 'swatch-audit.md');
  writeFileSync(mdPath, mdLines.join('\n'));

  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${mdPath}`);
  console.log(`Mismatches: ${allMismatches.length}`);
  if (allMismatches.length) {
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
