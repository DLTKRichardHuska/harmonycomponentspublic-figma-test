export type SidebarVariant = 'cp' | 'vp' | 'ppm' | 'maconomy';

export interface SidebarItem {
  /** Stable identity for controlled active state. Falls back to a positional id. */
  id?: string;
  /** Harmony Icon name. */
  icon?: string;
  label: string;
  href?: string;
  active?: boolean;
  /** Render a custom image instead of an Icon (e.g. the Dela logo). */
  isCustom?: boolean;
  customSrc?: string;
  /** Custom image used when the item is active (e.g. RS_Dela_Active.svg). */
  customSrcActive?: string;
  /** Title used when this item opens a ShellPanel (defaults to label). */
  panelTitle?: string;
  /** Icon used when this item opens a ShellPanel (defaults to icon). */
  panelIcon?: string;
}

export interface SidebarSection {
  items: SidebarItem[];
}

export const leftSidebarDefaults: Record<SidebarVariant, SidebarSection[]> = {
  cp: [
    {
      items: [
        { icon: 'home', label: 'Welcome screen' },
        { icon: 'squares-2x2', label: 'Dashboard' },
        { icon: 'star', label: 'My menu' },
        { icon: 'clock', label: 'Recent' },
      ],
    },
    {
      items: [
        { icon: 'magnifying-glass', label: 'Search' },
        { icon: 'squares-plus', label: 'Command Center' },
        { icon: 'calculator', label: 'Accounting' },
        { icon: 'chart-bar', label: 'Planning' },
        { icon: 'document-arrow-down', label: 'Capture & contracts' },
        { icon: 'clipboard-document-list', label: 'Projects' },
        { icon: 'cube', label: 'Materials' },
        { icon: 'clock', label: 'Time & expense' },
        { icon: 'users', label: 'People' },
        { icon: 'document-chart-bar', label: 'Reports' },
        { icon: 'cog-6-tooth', label: 'Admin' },
      ],
    },
  ],
  vp: standardLeft(),
  ppm: standardLeft(),
  maconomy: standardLeft(),
};

function standardLeft(): SidebarSection[] {
  return [
    {
      items: [
        { icon: 'rectangle-group', label: 'Command Center', active: true },
        { icon: 'book-open', label: 'Programs' },
        { icon: 'briefcase', label: 'Portfolios' },
        { icon: 'building-office', label: 'Projects' },
        { icon: 'calendar-days', label: 'Calendars' },
        { icon: 'document', label: 'Codes' },
        { icon: 'wallet', label: 'Rates' },
        { icon: 'cog-6-tooth', label: 'Settings' },
        { icon: 'plus', label: 'Add Menu' },
      ],
    },
  ];
}

const DELA_ITEM: SidebarItem = {
  label: 'Dela AI',
  isCustom: true,
  customSrc: '/RS_DelaDefault.svg',
  customSrcActive: '/RS_Dela_Active.svg',
  panelTitle: 'Dela AI',
};

export const rightSidebarDefaults: Record<SidebarVariant, SidebarSection[]> = {
  cp: [
    {
      items: [
        { ...DELA_ITEM },
        { icon: 'bell', label: 'Notifications' },
        { icon: 'arrow-up-tray', label: 'Files' },
      ],
    },
    {
      items: [
        { icon: 'printer', label: 'Print' },
        { icon: 'view-columns', label: 'Layout Options' },
      ],
    },
    {
      items: [
        { icon: 'mic-slash', label: 'Microphone' },
        { icon: 'signal-slash', label: 'Offline' },
        { icon: 'command-line', label: 'Keyboard Shortcuts' },
        { icon: 'question-mark-circle', label: 'Help' },
      ],
    },
  ],
  vp: standardRight(),
  ppm: standardRight(),
  maconomy: standardRight(),
};

function standardRight(): SidebarSection[] {
  return [
    {
      items: [
        { ...DELA_ITEM },
        { icon: 'pencil-square', label: 'Edit' },
        { icon: 'magnifying-glass', label: 'Search' },
        { icon: 'ellipsis-horizontal-circle', label: 'Actions' },
        { icon: 'cloud-arrow-up', label: 'Upload' },
        { icon: 'cloud-arrow-down', label: 'Download' },
      ],
    },
    {
      items: [
        { icon: 'bell', label: 'Notifications' },
        { icon: 'question-mark-circle', label: 'Help' },
        { icon: 'share', label: 'Share' },
      ],
    },
    {
      items: [
        { icon: 'globe-alt', label: 'Accessibility' },
        { icon: 'language', label: 'Language' },
        { icon: 'moon', label: 'Dark Mode' },
      ],
    },
  ];
}

export function itemId(item: SidebarItem, sectionIndex: number, index: number): string {
  return item.id ?? `${sectionIndex}-${index}`;
}
