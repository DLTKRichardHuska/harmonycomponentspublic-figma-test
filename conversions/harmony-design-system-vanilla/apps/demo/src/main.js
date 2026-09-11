/**
 * Vanilla demo entry - same stack as the conversion:
 * native ESM + Custom Elements consuming the package.
 *
 * Product tokens come from flattened dist-products CSS (swapped at runtime by demo-app).
 * Do not import multi-product source tokens.css here.
 */
import { registerHarmonyElements } from '@dltkrichardhuska/harmony-design-system-vanilla/elements';
import { registerDemoElements } from './demo/elements/register.js';
import './demo/pages/register.js';
import './demo/demo.css';

registerHarmonyElements();
registerDemoElements();

const root = document.getElementById('app');
root.replaceChildren(document.createElement('demo-app'));
