import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { LayoutService, ThemeService } from '@scriptorium/ui-grimoire';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Route params, query params and data reach the routed components as inputs.
      withComponentInputBinding(),
    ),
    // Applies the remembered theme and the layout (data-theme, data-layout) before the first render.
    provideAppInitializer(() => {
      inject(ThemeService);
      inject(LayoutService);
    }),
  ],
};
