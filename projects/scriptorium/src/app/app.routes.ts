import { Routes } from '@angular/router';
import { ComingSoon } from './coming-soon/coming-soon';
import { Shell } from './shell/shell';

/** A bookmark whose page does not exist yet. */
const comingSoon = (path: string, heading: string) => ({
  path,
  title: `${heading} · Scriptorium`,
  component: ComingSoon,
  data: { heading },
});

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: 'quetes',
        loadChildren: () => import('@scriptorium/feature-quests').then((m) => m.QUESTS_ROUTES),
      },
      comingSoon('journal', 'Journal'),
      comingSoon('contacts', 'Contacts'),
      comingSoon('lieux', 'Lieux'),
      comingSoon('butin', 'Butin'),
      comingSoon('reglages', 'Réglages'),
      { path: '', pathMatch: 'full', redirectTo: 'quetes' },
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
  { path: '**', redirectTo: 'quetes' },
];
