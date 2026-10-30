import { Injectable, computed, inject } from '@angular/core';
import { HttpErrorResponse, httpResource } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { GITHUB_SETTINGS } from '../../../core/config/github-config';
import type {
  GithubProfile,
  GithubProfileApiResponse,
  GithubRepository,
  GithubRepositoryApiResponse,
} from '../../../core/models/github.model';

const GITHUB_API_BASE = 'https://api.github.com';
const RATE_LIMIT_STATUS = 403;

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly settings = inject(GITHUB_SETTINGS);

  /** True once a real username replaces the Phase A placeholder AND the feature flag (spec section 52) is on — gates the network calls below. */
  readonly isConfigured = this.settings.enabled && environment.featureFlags.githubIntegration;

  /**
   * httpResource is @experimental (verified against the installed Angular
   * 21.2.21 types) — it's Angular's own forward-looking replacement for
   * manual HttpClient + toSignal wiring for a reactive GET-as-signals case
   * like this. Used deliberately as the current, latest-API choice, not by
   * accident.
   */
  private readonly profileResource = httpResource<GithubProfileApiResponse>(() =>
    this.isConfigured ? `${GITHUB_API_BASE}/users/${this.settings.username}` : undefined,
  );

  private readonly repositoriesResource = httpResource<GithubRepositoryApiResponse[]>(() =>
    this.isConfigured
      ? `${GITHUB_API_BASE}/users/${this.settings.username}/repos?sort=updated&per_page=${this.settings.repositoryLimit}`
      : undefined,
  );

  readonly profile = computed<GithubProfile | undefined>(() => {
    // value() throws while the resource is in the error state, so guard with hasValue().
    if (!this.profileResource.hasValue()) {
      return undefined;
    }
    const raw = this.profileResource.value();
    return {
      login: raw.login,
      name: raw.name,
      avatarUrl: raw.avatar_url,
      bio: raw.bio,
      publicRepos: raw.public_repos,
      followers: raw.followers,
      following: raw.following,
      htmlUrl: raw.html_url,
    };
  });

  readonly repositories = computed<readonly GithubRepository[]>(() => {
    if (!this.repositoriesResource.hasValue()) {
      return [];
    }
    return this.repositoriesResource
      .value()
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        htmlUrl: repo.html_url,
        language: repo.language,
        topics: repo.topics ?? [],
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        updatedAt: repo.updated_at,
      }));
  });

  readonly availableLanguages = computed<readonly string[]>(() => {
    const languages = new Set<string>();
    for (const repository of this.repositories()) {
      if (repository.language) {
        languages.add(repository.language);
      }
    }
    return [...languages].sort((a, b) => a.localeCompare(b));
  });

  readonly isLoading = computed(
    () => this.profileResource.isLoading() || this.repositoriesResource.isLoading(),
  );

  /** GitHub returns 403 when the unauthenticated rate limit is hit — distinguished so the UI can use the "temporarily busy" copy instead of a generic error. */
  readonly isRateLimited = computed(
    () =>
      this.isRateLimitError(this.profileResource.error()) ||
      this.isRateLimitError(this.repositoriesResource.error()),
  );

  readonly hasError = computed(
    () =>
      !this.isRateLimited() &&
      (this.profileResource.status() === 'error' || this.repositoriesResource.status() === 'error'),
  );

  reload(): void {
    this.profileResource.reload();
    this.repositoriesResource.reload();
  }

  private isRateLimitError(error: Error | undefined): boolean {
    return error instanceof HttpErrorResponse && error.status === RATE_LIMIT_STATUS;
  }
}
