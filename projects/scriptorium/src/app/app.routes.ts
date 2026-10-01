import { Routes } from '@angular/router';

export const routes: Routes = [
  // TEMPORARY: theme foundations test page, to remove with the "components" slice.
  {
    path: 'theme-test',
    loadComponent: () => import('./dev/theme-test/theme-test').then((m) => m.ThemeTest),
  },
  // TEMPORARY: the bookmark links of the test page point here, so the active page can be checked.
  {
    path: 'theme-test/:section',
    loadComponent: () => import('./dev/theme-test/theme-test').then((m) => m.ThemeTest),
  },
  { path: '', pathMatch: 'full', redirectTo: 'theme-test' },
];
