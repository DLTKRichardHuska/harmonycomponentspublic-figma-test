import { demoNavigation } from './demoNavigation';
import { demoThemeConfig, type DemoProduct } from './demoThemeConfig';

export interface SearchIndexItem {
  title: string;
  href: string;
  section: string;
  icon: string;
}

function buildBaseIndex(): SearchIndexItem[] {
  const items: SearchIndexItem[] = [];
  for (const section of demoNavigation) {
    for (const item of section.items) {
      items.push({
        title: item.title,
        href: item.href,
        section: section.title,
        icon: item.icon,
      });
    }
  }
  return items;
}

const baseIndex = buildBaseIndex();

export function getSearchIndex(product: DemoProduct): SearchIndexItem[] {
  const themeItems = demoThemeConfig[product].components.map((item) => ({
    title: item.title,
    href: item.href,
    section: `${demoThemeConfig[product].name} Components`,
    icon: item.icon,
  }));
  return [...baseIndex, ...themeItems];
}

export function searchComponents(query: string, product: DemoProduct): SearchIndexItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getSearchIndex(product).filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      item.href.toLowerCase().includes(q),
  );
}
