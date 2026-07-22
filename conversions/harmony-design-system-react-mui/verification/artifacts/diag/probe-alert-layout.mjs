import { chromium } from 'playwright';

async function probeLayout(url, label) {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('colorTheme', 'cp');
  });
  await p.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2000);

  const data = await p.evaluate((label) => {
    const alert = label === 'ref'
      ? [...document.querySelectorAll('.alert--enhanced')].find((a) => a.textContent?.includes('primary and secondary'))
      : [...document.querySelectorAll('.MuiAlert-outlined')].find((a) => a.textContent?.includes('primary and secondary'));

    const msg = label === 'ref' ? alert?.querySelector('.alert__message') : alert?.querySelector('.MuiAlert-message');
    const btn = label === 'ref'
      ? alert?.querySelector('.alert__buttons .btn')
      : alert?.querySelector('.MuiButton-root');
    const msgRect = msg?.getBoundingClientRect();
    const btnRect = btn?.getBoundingClientRect();
    return {
      msgBottom: msgRect?.bottom,
      btnTop: btnRect?.top,
      btnGapFromMsg: btnRect && msgRect ? btnRect.top - msgRect.bottom : null,
      btnHeight: btn ? getComputedStyle(btn).height : null,
      dismissibleWorks: null,
    };
  }, label);

  await b.close();
  return data;
}

const ref = await probeLayout('http://localhost:4321/components/alerts', 'ref');
const conv = await probeLayout('http://localhost:5176/components/alerts', 'conv');
console.log(JSON.stringify({ ref, conv }, null, 2));
