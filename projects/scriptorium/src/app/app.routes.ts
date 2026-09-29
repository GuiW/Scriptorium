import { Routes } from '@angular/router';

export const routes: Routes = [
  // TEMPORARY: theme foundations test page, to remove with the "components" slice.
  {
    path: 'theme-test',
    loadComponent: () => import('./dev/theme-test/theme-test').then((m) => m.ThemeTest),
  },
  { path: '', pathMatch: 'full', redirectTo: 'theme-test' },
];
