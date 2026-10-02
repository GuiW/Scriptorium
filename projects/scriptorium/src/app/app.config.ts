import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { ThemeService } from '@scriptorium/ui-grimoire';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Route params, query params and data reach the routed components as inputs.
    provideRouter(routes, withComponentInputBinding()),
    // Applies the remembered theme before the first render.
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ],
};
