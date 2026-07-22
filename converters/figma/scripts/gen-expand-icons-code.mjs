#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const j = JSON.parse(readFileSync(join(dir, '.icon-svgs.json'), 'utf8'));
const svgs = JSON.stringify(j.svgs);

const code = `const svgs = ${svgs};
const page = figma.root.children.find(p => p.name === '_internal');
await figma.setCurrentPageAsync(page);
const set = await figma.getNodeByIdAsync('4:26');
const plus = set.children.find(c => c.name === 'name=plus');
const created = [];
const errors = [];
const gap = 8;
const cell = 24;
let i = set.children.length;
for (const [name, svg] of Object.entries(svgs)) {
  if (set.children.some(c => c.name === 'name=' + name)) continue;
  try {
    const clone = plus.clone();
    clone.name = 'name=' + name;
    for (const ch of [...clone.children]) ch.remove();
    const frame = figma.createNodeFromSvg(svg);
    frame.name = 'Frame';
    frame.resize(24, 24);
    clone.appendChild(frame);
    clone.resize(24, 24);
    const col = i % 8;
    const row = Math.floor(i / 8);
    clone.x = col * (cell + gap);
    clone.y = row * (cell + gap);
    created.push({ name, id: clone.id });
    i++;
  } catch (e) {
    errors.push({ name, message: String(e) });
  }
}
set.layoutMode = 'NONE';
set.children.forEach((c, idx) => {
  const col = idx % 8;
  const row = Math.floor(idx / 8);
  c.x = col * (cell + gap);
  c.y = row * (cell + gap);
});
const cols = Math.min(8, set.children.length);
const rows = Math.ceil(set.children.length / 8);
set.resizeWithoutConstraints(cols * (cell + gap) - gap + 16, rows * (cell + gap) - gap + 16);
set.strokes = [{ type: 'SOLID', color: { r: 0.59, g: 0.278, b: 1 } }];
set.dashPattern = [10, 5];
set.strokeWeight = 1;
set.strokeAlign = 'INSIDE';
return {
  createdNodeIds: created.map(c => c.id),
  mutatedNodeIds: [set.id],
  created,
  errors,
  totalVariants: set.children.length,
  options: set.componentPropertyDefinitions.name && set.componentPropertyDefinitions.name.variantOptions,
};
`;

writeFileSync(join(dir, '.expand-icons-code.js'), code);
console.log('wrote', code.length, 'bytes');
