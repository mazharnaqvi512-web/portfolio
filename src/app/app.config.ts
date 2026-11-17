import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { AppPreset } from './core/theme/app-preset';
import { AI_PROVIDER } from './core/models/ai-provider.model';
import { ApiAiProvider } from './features/ai-assistant/providers/api-ai-provider';
import { MockAiProvider } from './features/ai-assistant/providers/mock-ai-provider';
import { selectAiProvider } from './features/ai-assistant/providers/select-ai-provider';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Root-provided: GithubService and ProjectsService (optionally, when
    // environment.apiBaseUrl is set) both need it, and ProjectsService is
    // reachable from the eager Home route via FeaturedProjects — route-
    // scoping it the way GithubService's route used to wouldn't work there.
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    ApiAiProvider,
    MockAiProvider,
    { provide: AI_PROVIDER, useFactory: selectAiProvider },
    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          // Light and dark semantic tokens in AppPreset both resolve through
          // the same var(--color-*) references, which already flip value
          // under [data-theme="dark"] (see src/tailwind.css). PrimeNG's own
          // dark-mode selector switching is therefore unnecessary.
          darkModeSelector: false,
        },
      },
      ripple: true,
    }),
    provideClientHydration(withEventReplay()),
  ],
};
