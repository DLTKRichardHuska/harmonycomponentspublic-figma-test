#!/usr/bin/env node
/**
 * Low-level Playwright capture — URL to HTML or PNG file.
 *
 * Usage:
 *   node capture-html.mjs --url http://localhost:4321/components/buttons --out artifacts/reference-Button.html
 *   node capture-html.mjs --url ... --out ... --format png --selector body
 *
 * Use docs (:4321) or conversion demo URLs from the target playbook VERIFIER.md.
 */
import { writeFileSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import {
  applyThemeAndMode,
  ensureDirForFile,
  loadPlaywright,
  parseArgs,
} from './_lib.mjs';

const args = parseArgs(process.argv.slice(2));
const url = args.url;
const out = args.out;
const format = args.format ?? 'html';
const selector = args.selector ?? 'body';
const theme = process.env.CAPTURE_THEME ?? args.theme ?? 'cp';
const mode = process.env.CAPTURE_MODE ?? args.mode ?? 'light';
const waitMs = Number(args.wait ?? 500);

if (!url || !out) {
  console.error('Usage: capture-html.mjs --url <url> --out <path> [--format html|png] [--selector body]');
  process.exit(1);
}

const chromium = await loadPlaywright();
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
  await applyThemeAndMode(page, { theme, mode });
  await delay(waitMs);

  ensureDirForFile(out);

  if (format === 'png') {
    const el = await page.$(selector);
    if (!el) throw new Error(`Selector not found: ${selector}`);
    const buffer = await el.screenshot({ type: 'png' });
    writeFileSync(out, buffer);
  } else {
    const html = await page.evaluate((sel) => {
      const node = document.querySelector(sel);
      return node ? node.outerHTML : document.documentElement.outerHTML;
    }, selector);
    const doc = `<!DOCTYPE html>\n<html><head><meta charset="utf-8"><title>capture</title></head><body>${html}</body></html>`;
    writeFileSync(out, doc, 'utf8');
  }

  console.log(`Captured ${format} → ${out}`);
} finally {
  await browser.close();
}
