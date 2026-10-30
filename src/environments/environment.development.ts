import type { Environment } from '../app/core/models/environment.model';

export const environment: Environment = {
  production: false,
  apiBaseUrl: '',
  githubUsername: '',
  featureFlags: {
    aiAssistant: false,
    githubIntegration: true,
    blog: false,
    testimonials: false,
    analytics: false,
    booking: false,
  },
};
