import { chromium } from 'playwright';

async function probe(url, isRef) {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  if (!isRef) {
    await p.evaluate(() => {
      localStorage.setItem('theme', 'light');
      localStorage.setItem('colorTheme', 'cp');
    });
    await p.reload({ waitUntil: 'networkidle', timeout: 60000 });
  }
  await p.waitForTimeout(2000);

  const data = await p.evaluate((ref) => {
    const pick = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        text: el.textContent?.trim().slice(0, 120),
        bg: cs.backgroundColor,
        color: cs.color,
        borderLeft: `${cs.borderLeftWidth} ${cs.borderLeftColor}`,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow !== 'none' ? cs.boxShadow.slice(0, 100) : 'none',
        padding: cs.padding,
      };
    };

    const h2s = [...document.querySelectorAll('h2, .section__title, .MuiTypography-h5')]
      .map((e) => e.textContent?.trim())
      .filter(Boolean);
    const h3s = [...new Set(
      [...document.querySelectorAll('h3, .MuiTypography-h6')]
        .map((e) => e.textContent?.trim())
        .filter(Boolean),
    )];

    const navLinks = [...document.querySelectorAll('.article-nav__link, a[href^="#"]')]
      .map((a) => ({ href: a.getAttribute('href'), text: a.textContent?.trim() }))
      .filter((l) => l.href && l.href.startsWith('#'));

    const alerts = ref
      ? [...document.querySelectorAll('.alert')].map(pick)
      : [...document.querySelectorAll('.MuiAlert-root')].map(pick);

    const unsupported = document.body.textContent?.includes('Not supported in this conversion') ?? false;
    const mappingSection = document.body.textContent?.includes('Harmony → MUI mapping') ?? false;
    const title = document.querySelector('h1, .page-header__title')?.textContent?.trim();
    const badge = document.querySelector('.badge, .MuiChip-root')?.textContent?.trim();

    const a11yEl = document.querySelector('#accessibility');
    const a11yText = a11yEl?.textContent?.trim().slice(0, 250) ?? '';

    const enhanced = alerts.filter((a) => a && parseFloat(a.borderLeft) >= 4);
    const standard = alerts.filter((a) => a && parseFloat(a.borderLeft) < 4);

    return {
      title,
      badge,
      h2s,
      h3s,
      navLinks,
      alertCount: alerts.length,
      standardSample: standard[0],
      enhancedSample: enhanced[0],
      alerts: alerts.slice(0, 14),
      unsupported,
      mappingSection,
      a11yText,
    };
  }, isRef);

  const shotPath = isRef ? 'ref-alert-i1.png' : 'conv-alert-i1.png';
  await p.screenshot({ path: shotPath, fullPage: true });
  await b.close();
  return { ...data, screenshot: shotPath };
}

const ref = await probe('http://localhost:4321/components/alerts', true);
const conv = await probe('http://localhost:5176/components/alerts', false);
console.log(JSON.stringify({ ref, conv }, null, 2));
