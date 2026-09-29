import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { ThemeService } from '@scriptorium/ui-grimoire';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Applies the remembered theme before the first render.
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ],
};
