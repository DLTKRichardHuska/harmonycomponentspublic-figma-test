import fs from 'node:fs';

const ref = fs.readFileSync(
  new URL('./ref-icons.html', import.meta.url),
  'utf8',
);
const conv = fs.readFileSync(
  new URL('./conv-icons.html', import.meta.url),
  'utf8',
);

function headings(html) {
  return [...html.matchAll(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
  );
}

function cats(html) {
  return [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>(\d+) icons/gi)].map(
    (m) => [m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim(), m[2]],
  );
}

const key = (h) =>
  /Icons|Props|Usage|Selection|Hero|Custom|Access|npm|Hierarchy|Sizes|Heroicons|Tabler|Navigation|Actions|Project|Risk|Dock|File|Media|Other|Currency|Devices|Users|Objects|Status|Communication|Interface|Multiview|Interactions/.test(
    h,
  );

console.log('REF key headings:\n', headings(ref).filter(key).join('\n'));
console.log('\nCONV key headings:\n', headings(conv).filter(key).join('\n'));
console.log('\nREF data-icon', (ref.match(/data-icon=/g) || []).length);
console.log('CONV data-icon', (conv.match(/data-icon=/g) || []).length);
console.log('CONV not found', (conv.match(/not found/g) || []).length);
console.log('lucide in conv page', /lucide/i.test(conv));
console.log(
  'package import',
  conv.includes('@dltkrichardhuska/harmony-design-system-shadcn/components'),
);
console.log(
  'GS dump',
  /npm install @dltk|HarmonyThemeProvider|tailwind-preset/.test(conv),
);
for (const s of ['xs (12px)', 'sm (16px)', 'md (20px)', 'lg (24px)', 'xl (32px)']) {
  console.log(s, { ref: ref.includes(s), conv: conv.includes(s) });
}
console.log('REF cats', cats(ref));
console.log('CONV cats', cats(conv));
console.log('284 ref/conv', ref.includes('284'), conv.includes('284'));
console.log('Icon Accessibility', ref.includes('Icon Accessibility'), conv.includes('Icon Accessibility'));
console.log('gantt path in conv', /data-icon="gantt-chart"[\s\S]{0,600}<path/.test(conv));
console.log('home size xs svg', /data-icon="home"[\s\S]{0,400}<svg/.test(conv));

const broken = [];
for (const m of conv.matchAll(/data-icon="([^"]+)"/g)) {
  const name = m[1];
  const start = m.index;
  const chunk = conv.slice(start, start + 900);
  if (!chunk.includes('<svg') && !chunk.includes('tabler-icon')) {
    broken.push(name);
  }
}
console.log('broken count', broken.length, broken.slice(0, 40));

// Tabler examples: database/terminal should render
for (const name of ['database', 'terminal', 'code-bracket', 'brand-github']) {
  const idx = conv.indexOf(`data-icon="${name}"`);
  const chunk = idx >= 0 ? conv.slice(idx, idx + 400) : '';
  console.log(
    name,
    idx >= 0 ? (chunk.includes('tabler-icon') ? 'tabler' : chunk.includes('<svg') ? 'svg' : 'empty') : 'missing',
  );
}
