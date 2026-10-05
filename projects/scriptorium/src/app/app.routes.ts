import { Route, Routes } from '@angular/router';
import { ComingSoon } from './coming-soon/coming-soon';
import { PAGES, pageTitle, type PageId } from './pages';
import { Shell } from './shell/shell';

/** The route of a page from the PAGES table: its path and title, plus what it shows. */
const page = (id: PageId, route: Omit<Route, 'path' | 'title'>): Route => ({
  path: PAGES[id].path,
  title: pageTitle(id),
  ...route,
});

/** A bookmark whose page does not exist yet. */
const comingSoon = (id: PageId): Route =>
  page(id, { component: ComingSoon, data: { heading: PAGES[id].label } });

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      page('quests', {
        loadChildren: () => import('@scriptorium/feature-quests').then((m) => m.QUESTS_ROUTES),
      }),
      comingSoon('journal'),
      comingSoon('contacts'),
      comingSoon('places'),
      comingSoon('loot'),
      page('settings', {
        loadComponent: () => import('./settings/settings').then((m) => m.Settings),
      }),
      { path: '', pathMatch: 'full', redirectTo: PAGES.quests.path },
    ],
  },
  // TEMPORARY: theme foundations test page, outside the shell.
  {
    path: 'theme-test',
    loadComponent: () => import('./dev/theme-test/theme-test').then((m) => m.ThemeTest),
  },
  // TEMPORARY: the bookmark links of the test page point here, so the active page can be checked.
  {
    path: 'theme-test/:section',
    loadComponent: () => import('./dev/theme-test/theme-test').then((m) => m.ThemeTest),
  },
  { path: '**', redirectTo: PAGES.quests.path },
];
