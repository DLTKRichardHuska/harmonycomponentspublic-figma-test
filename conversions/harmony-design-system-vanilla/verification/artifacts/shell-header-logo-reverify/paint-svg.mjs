import { chromium } from 'playwright';
import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const outDir = dirname(fileURLToPath(import.meta.url));
const modUrl = pathToFileURL('c:/Workspaces/harmonycomponentspublic-figma-test/conversions/harmony-design-system-vanilla/packages/ui/src/elements/productLogo.js').href;
const { productLogoMarkup } = await import(modUrl);
const svg = productLogoMarkup('CPVPLogo', 'test');
const html = `<!doctype html><html><body style="margin:40px;background:#fff;font-family:sans-serif">
<p>Embedded productLogoMarkup (as shipped)</p>
<div style="display:flex;align-items:center;gap:8px;border:1px solid #ccc;padding:12px;width:320px;background:#f7f7f7">
  <span style="width:20px;height:20px;display:inline-flex;overflow:hidden">${svg.replace('<svg','<svg width=\"20\" height=\"20\" style=\"display:block\"')}</span>
  <strong>Costpoint</strong>
</div>
<p>Same SVG with clipPath rect width/height restored</p>
<div style="display:flex;align-items:center;gap:8px;border:1px solid #ccc;padding:12px;width:320px;background:#f7f7f7">
  <span style="width:20px;height:20px;display:inline-flex;overflow:hidden">${svg.replace('<rect fill=\"white\"/>','<rect width=\"36\" height=\"36\" fill=\"white\"/>').replace('<svg','<svg width=\"20\" height=\"20\" style=\"display:block\"')}</span>
  <strong>Costpoint</strong>
</div>
<canvas id="a" width="20" height="20"></canvas>
<canvas id="b" width="20" height="20"></canvas>
<pre id="m"></pre>
<script type="module">
async function paint(svgEl, canvasId){
  const w=20,h=20;
  const xml = new XMLSerializer().serializeToString(svgEl);
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
  const img = new Image();
  await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src=url});
  const c = document.getElementById(canvasId); const ctx=c.getContext('2d'); ctx.drawImage(img,0,0,w,h);
  const data = ctx.getImageData(0,0,w,h).data; let opaque=0,blue=0;
  for(let i=0;i<data.length;i+=4){ if(data[i+3]<20) continue; opaque++; if(data[i+2]>120 && data[i+2]>data[i] && data[i+2]>data[i+1]-20) blue++; }
  const mid=ctx.getImageData(10,10,1,1).data;
  return {opaque,blue,mid:[mid[0],mid[1],mid[2],mid[3]], clip: svgEl.querySelector('clipPath rect')?.outerHTML};
}
const svgs=[...document.querySelectorAll('svg')];
const results={ shipped: await paint(svgs[0],'a'), restored: await paint(svgs[1],'b') };
document.getElementById('m').textContent=JSON.stringify(results,null,2);
</script>
</body></html>`;
writeFileSync(join(outDir, 'fixture.html'), html);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 560, height: 360 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const metrics = await page.textContent('#m');
console.log(metrics);
await page.screenshot({ path: join(outDir, 'fixture-paint.png') });
writeFileSync(join(outDir, 'fixture-metrics.json'), metrics || 'null');
await browser.close();
