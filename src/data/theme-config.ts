export interface ThemeComponent {
  title: string;
  href: string;
  icon: string;
}

export interface ThemeConfig {
  name: string;
  fullName: string;
  primaryColor: string;
  components: ThemeComponent[];
}

export const themeConfig: Record<string, ThemeConfig> = {
  cp: {
    name: 'CP',
    fullName: 'Harmony CP Design System',
    primaryColor: '#4C92D9',
    components: [
      { title: 'Floating Nav', href: '/cp/floating-nav', icon: 'ti-navigation' }
    ]
  },
  vp: {
    name: 'VP',
    fullName: 'Harmony VP Design System',
    primaryColor: '#4C92D9',
    components: []
  },
  ppm: {
    name: 'PPM',
    fullName: 'Harmony PPM Design System',
    primaryColor: '#30659F',
    components: []
  },
  maconomy: {
    name: 'Maconomy',
    fullName: 'Harmony Maconomy Design System',
    primaryColor: '#804A98',
    components: []
  }
};


