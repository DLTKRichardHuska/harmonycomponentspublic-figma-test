import { chromium } from 'playwright';

async function probeActions(url, label) {
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

    if (!alert) return { found: false };

    const actionsContainer = label === 'ref' ? alert.querySelector('.alert__actions') : alert.querySelector('.MuiStack-root');
    const link = label === 'ref' ? alert.querySelector('.alert__link') : alert.querySelector('.MuiLink-root');
    const borderEl = label === 'ref' ? alert.querySelector('.alert__border') : null;

    return {
      found: true,
      borderWidth: borderEl ? getComputedStyle(borderEl).width : getComputedStyle(alert).borderLeftWidth,
      actionsPaddingLeft: actionsContainer ? getComputedStyle(actionsContainer).paddingLeft : null,
      actionsMarginTop: actionsContainer ? getComputedStyle(actionsContainer).marginTop : null,
      linkFontSize: link ? getComputedStyle(link).fontSize : null,
      alertStructure: label === 'ref' ? !!alert.querySelector('.alert__actions') : !!actionsContainer,
    };
  }, label);

  await b.close();
  return data;
}

const ref = await probeActions('http://localhost:4321/components/alerts', 'ref');
const conv = await probeActions('http://localhost:5176/components/alerts', 'conv');
console.log(JSON.stringify({ ref, conv }, null, 2));
