import type { IconName } from '@scriptorium/ui-grimoire';

interface AppPage {
  /** URL path, under the shell (`/quetes`). */
  path: string;
  /** Bookmark label and page title. */
  label: string;
  icon: IconName;
}

/**
 * The app's pages: each one's path, label and bookmark icon, written once. The routes, the page
 * titles and the navigation are built from this table.
 */
export const PAGES = {
  quests: { path: 'quetes', label: 'Quêtes', icon: 'quete' },
  journal: { path: 'journal', label: 'Journal', icon: 'journal' },
  contacts: { path: 'contacts', label: 'Contacts', icon: 'joueurs' },
  places: { path: 'lieux', label: 'Lieux', icon: 'carte' },
  loot: { path: 'butin', label: 'Butin', icon: 'butin' },
  settings: { path: 'reglages', label: 'Réglages', icon: 'reglages' },
} as const satisfies Record<string, AppPage>;

export type PageId = keyof typeof PAGES;

/** Order of the navigation bookmarks; `divider` separates the groups. */
export const NAV_ORDER: readonly (PageId | 'divider')[] = [
  'quests',
  'journal',
  'contacts',
  'places',
  'loot',
  'divider',
  'settings',
];

/**
 * Entries of the mobile tab bar (five at most): those of the mobile mockup, with Réglages in
 * place of « Plus » until that menu exists (design/GAPS.md). Lieux is not in the bar.
 */
export const MOBILE_NAV: readonly PageId[] = ['quests', 'journal', 'contacts', 'loot', 'settings'];

/** Browser tab title of a page. */
export function pageTitle(id: PageId): string {
  return `${PAGES[id].label} · Scriptorium`;
}
