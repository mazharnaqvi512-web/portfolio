// jsdom (the test environment) does not implement matchMedia. ThemeService
// reads it at construction time to resolve the "system" theme preference, so
// tests that inject anything depending on ThemeService need this polyfilled.
if (typeof window !== 'undefined' && !window.matchMedia) {
  /* eslint-disable @typescript-eslint/no-empty-function -- intentional no-op MediaQueryList mock */
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
  /* eslint-enable @typescript-eslint/no-empty-function */
}
