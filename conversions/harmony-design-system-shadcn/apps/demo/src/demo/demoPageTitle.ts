/** Short name shown in demo browser tabs: "{page} | Design System (shadcn)". */
export const DEMO_SHORT_NAME = 'shadcn';

/** Match reference docs titles, with conversion short name in brackets. */
export function demoPageTitle(page: string): string {
  return `${page} | Design System (${DEMO_SHORT_NAME})`;
}
