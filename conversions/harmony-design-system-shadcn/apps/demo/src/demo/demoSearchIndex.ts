import { demoNavigation } from './demoNavigation';

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

export function getSearchIndex(): SearchIndexItem[] {
  return baseIndex;
}

export function searchComponents(query: string): SearchIndexItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getSearchIndex().filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      item.href.toLowerCase().includes(q),
  );
}
