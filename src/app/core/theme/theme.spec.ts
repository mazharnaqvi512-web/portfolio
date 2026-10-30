import { TestBed } from '@angular/core/testing';

import { STORAGE_KEYS } from '../constants/storage.constants';
import { StorageService } from '../services/storage.service';
import { ThemeService } from './theme';

/* eslint-disable @typescript-eslint/no-empty-function -- intentional no-op MediaQueryList mock */
function mockMatchMedia(matches: boolean): void {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
/* eslint-enable @typescript-eslint/no-empty-function */

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('defaults preference to "system" when nothing is stored', () => {
    const service = TestBed.inject(ThemeService);
    expect(service.preference()).toBe('system');
  });

  it('reads a previously stored preference', () => {
    localStorage.setItem(STORAGE_KEYS.themePreference, JSON.stringify('dark'));
    const service = TestBed.inject(ThemeService);
    expect(service.preference()).toBe('dark');
  });

  it('persists preference changes via StorageService', () => {
    const service = TestBed.inject(ThemeService);
    const storage = TestBed.inject(StorageService);

    service.setPreference('light');
    TestBed.flushEffects();

    expect(service.preference()).toBe('light');
    expect(storage.get(STORAGE_KEYS.themePreference, null)).toBe('light');
  });

  it('resolves "light"/"dark" preferences directly, independent of system preference', () => {
    mockMatchMedia(true);
    const service = TestBed.inject(ThemeService);

    service.setPreference('light');
    expect(service.resolvedTheme()).toBe('light');

    service.setPreference('dark');
    expect(service.resolvedTheme()).toBe('dark');
  });

  it('resolves "system" preference from the OS media query', () => {
    mockMatchMedia(true);
    const service = TestBed.inject(ThemeService);

    service.setPreference('system');
    expect(service.resolvedTheme()).toBe('dark');
  });
});
