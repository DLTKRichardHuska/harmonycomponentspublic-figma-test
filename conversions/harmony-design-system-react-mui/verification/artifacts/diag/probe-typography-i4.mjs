import { chromium } from 'playwright';

const SAMPLES = [
  { section: 'Display XL', refSel: '.text-display-xl', convVariant: 'h1', text: 'The quick brown fox' },
  { section: 'Display L', refSel: '.text-display-l', convVariant: 'h2', text: 'The quick brown fox jumps' },
  { section: 'Display M', refSel: '.text-display-m', convVariant: 'h3', text: 'The quick brown fox jumps over' },
  { section: 'Heading XL', refSel: '.text-heading-xl', convVariant: 'h4', text: 'Heading Extra Large' },
  { section: 'Heading L', refSel: '.text-heading-l', convVariant: 'h5', text: 'Heading Large' },
  { section: 'Heading M', refSel: '.text-heading-m', convVariant: 'h6', text: 'Heading Medium' },
  { section: 'Heading S', refSel: '.text-heading-s', convVariant: 'subtitle1', text: 'Heading Small' },
  { section: 'Body Default', refSel: '.text-body-default', convVariant: 'body1', text: 'standard body text' },
  { section: 'Body Emphasized', refSel: '.text-body-emphasized', convVariant: 'body2', text: 'emphasized body text' },
  { section: 'Label', refSel: '.text-label', convVariant: 'subtitle2', text: 'Form Field Label' },
  { section: 'Caption', refSel: '.text-caption', convVariant: 'caption', text: 'Last updated 2 hours ago' },
  { section: 'Overline', refSel: '.text-overline', convVariant: 'overline', text: 'FEATURED ARTICLE' },
];

function detail(el) {
  if (!el) return null;
  const cs = getComputedStyle(el);
  return {
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    lineHeight: cs.lineHeight,
    fontFamily: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
    letterSpacing: cs.letterSpacing,
    textTransform: cs.textTransform,
    color: cs.color,
  };
}

async function probe(url, isConv) {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage({ viewport: { width: 1280, height: 1400 } });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(1200);
  const res = await p.evaluate(({ SAMPLES, isConv }) => {
    function detail(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        fontFamily: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        color: cs.color,
      };
    }
    const article = document.querySelector('article');
    const pageTitle = article ? article.querySelector('h1') : null;
    const out = { pageTitle: detail(pageTitle), samples: [], content: {} };
    for (const s of SAMPLES) {
      let el;
      if (isConv) {
        const cls = `.MuiTypography-${s.convVariant}`;
        const els = article.querySelectorAll(cls);
        el = Array.from(els).find((e) => e.textContent.includes(s.text.slice(0, 18)));
      } else {
        el = document.querySelector(s.refSel);
      }
      out.samples.push({ section: s.section, ...detail(el), found: !!el });
    }
    const tableRows = article ? article.querySelectorAll('table tbody tr, .props-table tbody tr, .MuiTableBody-root tr') : [];
    out.content.tableRowCount = tableRows.length;
    out.content.hasUsageGuidelines = !!article?.textContent?.includes('Separate Visuals from Semantics');
    out.content.hasMuiVariantColumn = !!article?.textContent?.includes('MUI variant');
    out.content.sectionIds = ['display', 'headings', 'body', 'supporting', 'fonts'].map((id) => ({
      id,
      present: !!document.getElementById(id),
    }));
    const codeEl = isConv
      ? article?.querySelector('.MuiTypography-code, code.MuiTypography-root')
      : article?.querySelector('code.font-mono');
    out.content.codeSample = detail(codeEl);
    return out;
  }, { SAMPLES, isConv });
  await b.close();
  return res;
}

const ref = await probe('http://localhost:4321/foundation/typography', false);
const conv = await probe('http://localhost:5176/foundation/typography', true);

console.log(JSON.stringify({ ref, conv, compare: SAMPLES.map((s, i) => {
  const r = ref.samples[i];
  const c = conv.samples[i];
  const sizeMatch = r?.fontSize === c?.fontSize;
  const weightMatch = r?.fontWeight === c?.fontWeight;
  const lhMatch = r && c && Math.abs(parseFloat(r.lineHeight) - parseFloat(c.lineHeight)) < 1;
  const familyMatch = r && c && (
    r.fontFamily.toLowerCase().includes(c.fontFamily.toLowerCase().slice(0, 6)) ||
    c.fontFamily.toLowerCase().includes(r.fontFamily.toLowerCase().slice(0, 6))
  );
  return {
    section: s.section,
    status: r?.found && c?.found && sizeMatch && weightMatch && lhMatch && familyMatch ? 'match' : 'diff',
    ref: r,
    conv: c,
  };
}) }, null, 2));
