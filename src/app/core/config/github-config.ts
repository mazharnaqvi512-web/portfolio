import { InjectionToken } from '@angular/core';

const GITHUB_USERNAME = 'mazharnaqvi512-web';

export const GITHUB_CONFIG = {
  username: GITHUB_USERNAME,
  profileUrl: `https://github.com/${GITHUB_USERNAME}`,
  enabled: !GITHUB_USERNAME.startsWith('TODO_'),
  repositoryLimit: 12,
  /**
   * Not enforced as a TTL cache today: GithubService is a root-provided
   * singleton and httpResource only re-fires when its reactive request
   * (built from this config) changes, so navigating away from and back to
   * the GitHub page already never re-fetches within a session. This exists
   * so a real timed-refresh policy has one place to live if ever needed.
   */
  cacheDurationMs: 5 * 60 * 1000,
} as const;

/** The slice of GITHUB_CONFIG the service needs, injectable so tests can switch the integration on. */
export interface GithubSettings {
  readonly username: string;
  readonly enabled: boolean;
  readonly repositoryLimit: number;
}

export const GITHUB_SETTINGS = new InjectionToken<GithubSettings>('GITHUB_SETTINGS', {
  providedIn: 'root',
  factory: () => GITHUB_CONFIG,
});
