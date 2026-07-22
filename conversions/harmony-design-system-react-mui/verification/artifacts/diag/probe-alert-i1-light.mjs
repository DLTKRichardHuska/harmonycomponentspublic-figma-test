import { chromium } from 'playwright';

async function probe(url, label) {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('colorTheme', 'cp');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('theme-cp');
  });
  await p.reload({ waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2000);

  const data = await p.evaluate((label) => {
    const pick = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        border: cs.border,
        borderLeft: cs.borderLeft,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow === 'none' ? 'none' : 'shadow',
      };
    };

    const h1 = document.querySelector('article h1, .page-header__title, .MuiTypography-h3')?.textContent?.trim();
    const infoAlert = label === 'ref'
      ? document.querySelector('.alert--info')
      : [...document.querySelectorAll('.MuiAlert-root')].find((a) => a.textContent?.includes('Information') && a.textContent?.includes('informational message'));

    const enhancedSuccess = label === 'ref'
      ? [...document.querySelectorAll('.alert--enhanced.alert--success')][0]
      : [...document.querySelectorAll('.MuiAlert-outlined')].find((a) => a.textContent?.includes('Alert Title'));

    const actionsAlert = label === 'ref'
      ? [...document.querySelectorAll('.alert--enhanced')].find((a) => a.textContent?.includes('Button Text'))
      : [...document.querySelectorAll('.MuiAlert-outlined')].find((a) => a.textContent?.includes('Button Text'));

    const actionButtons = actionsAlert
      ? [...actionsAlert.querySelectorAll('.btn, .MuiButton-root')].map((b) => ({
          text: b.textContent?.trim(),
          height: getComputedStyle(b).height,
          fontSize: getComputedStyle(b).fontSize,
        }))
      : [];

    const titleEl = infoAlert?.querySelector('.alert__title, .MuiAlertTitle-root');
    const msgEl = infoAlert?.querySelector('.alert__message, .MuiAlert-message');

    return {
      h1,
      mode: getComputedStyle(document.body).backgroundColor,
      info: pick(infoAlert),
      infoTitle: titleEl ? getComputedStyle(titleEl).fontWeight + ' / ' + getComputedStyle(titleEl).color : null,
      infoMsg: msgEl ? getComputedStyle(msgEl).color : null,
      enhanced: pick(enhancedSuccess),
      actionButtons,
      progressSection: document.body.textContent?.includes('Progress Alert') || document.body.textContent?.includes('Not supported in this conversion'),
      unsupportedCallout: document.body.textContent?.includes('Not supported in this conversion'),
    };
  }, label);

  await b.close();
  return data;
}

const ref = await probe('http://localhost:4321/components/alerts', 'ref');
const conv = await probe('http://localhost:5176/components/alerts', 'conv');
console.log(JSON.stringify({ ref, conv }, null, 2));
