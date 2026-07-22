export type ChangelogCategory = 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  category: ChangelogCategory;
  type: string;
  target: string;
  title: string;
  description: string;
  breaking: boolean;
}

export interface ChangelogVersionSection {
  version: string;
  label: string;
  subtitle?: string;
  entries: ChangelogEntry[];
}

export const IN_PROGRESS_VERSION = 'in-progress';

/** Trimmed changelog subset for the demo review surface. */
export const changelogEntries: ChangelogEntry[] = [
  {
    id: 'demo-1',
    version: '0.9.0',
    date: '2026-05-13T21:01:37.000Z',
    category: 'added',
    type: 'component',
    target: 'TableCostpointGrid',
    title: 'TableCostpointGrid',
    description: 'New TableCostpointGrid component added to the design system',
    breaking: false,
  },
  {
    id: 'demo-2',
    version: '0.9.0',
    date: '2026-05-13T21:01:37.000Z',
    category: 'changed',
    type: 'component',
    target: 'Table',
    title: 'Table',
    description: 'Update Table component implementation',
    breaking: false,
  },
  {
    id: 'demo-3',
    version: IN_PROGRESS_VERSION,
    date: '2026-07-01T12:00:00.000Z',
    category: 'changed',
    type: 'system',
    target: 'ReactMuiConversion',
    title: 'React + MUI demo chrome',
    description: 'Rebuilt demo review surface on MUI v9 with DocsLayout-equivalent chrome',
    breaking: false,
  },
];

export function groupChangelogByVersion(entries: ChangelogEntry[]): ChangelogVersionSection[] {
  const map = new Map<string, ChangelogEntry[]>();
  for (const entry of entries) {
    const list = map.get(entry.version) ?? [];
    list.push(entry);
    map.set(entry.version, list);
  }

  const versions = [...map.keys()].sort((a, b) => {
    if (a === IN_PROGRESS_VERSION) return -1;
    if (b === IN_PROGRESS_VERSION) return 1;
    return b.localeCompare(a, undefined, { numeric: true });
  });

  return versions.map((version) => ({
    version,
    label: version === IN_PROGRESS_VERSION ? 'In progress' : version,
    subtitle:
      version === IN_PROGRESS_VERSION
        ? 'Changes not yet in an official release'
        : undefined,
    entries: (map.get(version) ?? []).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
  }));
}

export const changelogVersionSections = groupChangelogByVersion(changelogEntries);

const categoryLabels: Record<ChangelogCategory, string> = {
  added: 'Added',
  changed: 'Changed',
  deprecated: 'Deprecated',
  removed: 'Removed',
  fixed: 'Fixed',
  security: 'Security',
};

export function getCategoryLabel(category: ChangelogCategory): string {
  return categoryLabels[category];
}
