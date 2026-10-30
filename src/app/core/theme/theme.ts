import {
  DestroyRef,
  Injectable,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { STORAGE_KEYS } from '../constants/storage.constants';
import { StorageService } from '../services/storage.service';
import type { ResolvedTheme, ThemePreference } from './theme.types';

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

/** Dark is the primary experience (Part 2) — used when there's no browser to resolve a real preference from. */
const SERVER_DEFAULT_THEME: ResolvedTheme = 'dark';

function toThemePreference(value: string): ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly media = this.isBrowser ? window.matchMedia(DARK_MEDIA_QUERY) : null;
  private readonly systemPrefersDark = signal(this.media?.matches ?? false);

  readonly preference = signal<ThemePreference>(
    toThemePreference(this.storage.get<string>(STORAGE_KEYS.themePreference, 'system')),
  );

  readonly resolvedTheme = computed<ResolvedTheme>(() => {
    if (!this.isBrowser) {
      return SERVER_DEFAULT_THEME;
    }
    const preference = this.preference();
    return preference === 'system' ? (this.systemPrefersDark() ? 'dark' : 'light') : preference;
  });

  constructor() {
    if (this.media) {
      const onSystemChange = (event: MediaQueryListEvent) =>
        this.systemPrefersDark.set(event.matches);
      this.media.addEventListener('change', onSystemChange);
      this.destroyRef.onDestroy(() => this.media?.removeEventListener('change', onSystemChange));
    }

    effect(() => {
      const theme = this.resolvedTheme();
      this.storage.set(STORAGE_KEYS.themePreference, this.preference());
      if (this.isBrowser) {
        document.documentElement.dataset['theme'] = theme;
      }
    });
  }

  setPreference(preference: ThemePreference): void {
    this.preference.set(preference);
  }
}
