import fs from 'fs';
const code = fs.readFileSync('converters/figma/scripts/.button-rebuild-apply.js', 'utf8');
const compact = code
  .split('\n')
  .filter((l) => !/^\s*\/\//.test(l) || l.includes('http'))
  .join('\n')
  .replace(/\n{3,}/g, '\n\n');
fs.writeFileSync('converters/figma/scripts/.button-rebuild-apply.min.js', compact);
console.log(compact.length);
