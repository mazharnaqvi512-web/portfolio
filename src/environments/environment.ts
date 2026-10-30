import type { Environment } from '../app/core/models/environment.model';

/**
 * Default environment — used as-is by the build target's default
 * configuration ("production"). Swapped for environment.development.ts
 * during `ng serve` / dev builds via angular.json's fileReplacements.
 * Only public configuration belongs here — never secrets (see spec section 55).
 */
export const environment: Environment = {
  production: true,
  apiBaseUrl: '',
  githubUsername: '',
  featureFlags: {
    // aiAssistant is the mock provider (canned answers), so it stays off for
    // the public launch until a real AI backend replaces it. blog is off
    // until the first article exists (hides the nav link; the page would
    // otherwise be an empty state). testimonials/analytics/booking have no
    // feature behind them yet (or, for analytics, no provider chosen yet).
    aiAssistant: false,
    githubIntegration: true,
    blog: false,
    testimonials: false,
    analytics: false,
    booking: false,
  },
};
