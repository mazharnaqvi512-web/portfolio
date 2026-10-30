import { Component, computed, inject, signal } from '@angular/core';

import { GITHUB_CONFIG } from '../../../../core/config/github-config';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { GithubService } from '../../services/github.service';
import { GithubProfileHeader } from '../../components/github-profile-header/github-profile-header';
import { RepositoryCard } from '../../components/repository-card/repository-card';
import {
  type RepositoryLanguageFilterValue,
  type RepositorySortValue,
  sortAndFilterRepositories,
} from './repository-sort-filter.util';

const SORT_OPTIONS: readonly { label: string; value: RepositorySortValue }[] = [
  { label: 'Recently Updated', value: 'updated' },
  { label: 'Stars', value: 'stars' },
  { label: 'Name', value: 'name' },
];

/** Filters are only worth showing once there's more than one repo AND more than one distinct language to choose between. */
const MIN_REPOS_FOR_CONTROLS = 2;

@Component({
  selector: 'app-github-page',
  imports: [SectionHeader, EmptyState, GithubProfileHeader, RepositoryCard],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="GitHub" title="Open source & code" [level]="1" />

      <div class="mx-auto mt-10 max-w-3xl">
        @if (!githubService.isConfigured) {
          <app-empty-state
            icon="pi pi-github"
            message="GitHub integration isn't configured yet."
            actionLabel="Get in touch"
            actionRoute="/contact"
          />
        } @else if (githubService.isLoading()) {
          <div class="flex flex-col items-center gap-3 py-16 text-center">
            <i class="pi pi-spin pi-spinner text-h2 text-accent" aria-hidden="true"></i>
            <p class="text-small text-text-muted">Loading GitHub data...</p>
          </div>
        } @else if (githubService.isRateLimited()) {
          <div
            class="flex flex-col items-center gap-3 rounded-card border border-dashed border-border p-10 text-center"
          >
            <i class="pi pi-clock text-h2 text-text-muted" aria-hidden="true"></i>
            <p class="text-body text-text-secondary">
              GitHub activity is temporarily unavailable. Please try again later.
            </p>
            <a
              [href]="githubProfileUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-small font-medium text-accent hover:text-accent-hover"
            >
              View GitHub Profile
            </a>
          </div>
        } @else if (githubService.hasError()) {
          <div
            class="flex flex-col items-center gap-3 rounded-card border border-dashed border-border p-10 text-center"
          >
            <i class="pi pi-exclamation-triangle text-h2 text-text-muted" aria-hidden="true"></i>
            <p class="text-body text-text-secondary">GitHub activity is temporarily unavailable.</p>
            <button
              type="button"
              (click)="githubService.reload()"
              class="text-small font-medium text-accent hover:text-accent-hover"
            >
              Retry
            </button>
          </div>
        } @else if (githubService.profile(); as profile) {
          <app-github-profile-header [profile]="profile" />

          <div class="mt-12">
            @if (githubService.repositories().length) {
              @if (githubService.repositories().length >= minReposForControls) {
                <div
                  class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div
                    class="flex gap-2 overflow-x-auto"
                    role="group"
                    aria-label="Sort repositories"
                  >
                    @for (option of sortOptions; track option.value) {
                      <button
                        type="button"
                        class="shrink-0 rounded-pill border px-3 py-1.5 text-caption font-medium transition-colors"
                        [class]="
                          sortBy() === option.value
                            ? 'border-accent bg-accent text-white'
                            : 'border-border bg-surface text-text-secondary hover:text-text-primary'
                        "
                        [attr.aria-pressed]="sortBy() === option.value"
                        (click)="sortBy.set(option.value)"
                      >
                        {{ option.label }}
                      </button>
                    }
                  </div>

                  @if (githubService.availableLanguages().length > 1) {
                    <div
                      class="flex gap-2 overflow-x-auto"
                      role="group"
                      aria-label="Filter repositories by language"
                    >
                      <button
                        type="button"
                        class="shrink-0 rounded-pill border px-3 py-1.5 text-caption font-medium transition-colors"
                        [class]="
                          languageFilter() === 'all'
                            ? 'border-accent bg-accent text-white'
                            : 'border-border bg-surface text-text-secondary hover:text-text-primary'
                        "
                        [attr.aria-pressed]="languageFilter() === 'all'"
                        (click)="languageFilter.set('all')"
                      >
                        All
                      </button>
                      @for (language of githubService.availableLanguages(); track language) {
                        <button
                          type="button"
                          class="shrink-0 rounded-pill border px-3 py-1.5 text-caption font-medium transition-colors"
                          [class]="
                            languageFilter() === language
                              ? 'border-accent bg-accent text-white'
                              : 'border-border bg-surface text-text-secondary hover:text-text-primary'
                          "
                          [attr.aria-pressed]="languageFilter() === language"
                          (click)="languageFilter.set(language)"
                        >
                          {{ language }}
                        </button>
                      }
                    </div>
                  }
                </div>
              }

              @if (displayedRepositories().length) {
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  @for (repository of displayedRepositories(); track repository.name) {
                    <app-repository-card [repository]="repository" />
                  }
                </div>
              } @else {
                <app-empty-state icon="pi pi-search" message="No repositories match this filter." />
              }
            } @else {
              <app-empty-state
                icon="pi pi-folder-open"
                message="No public repositories to show yet."
              />
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class GithubPage {
  protected readonly githubService = inject(GithubService);

  protected readonly githubProfileUrl = GITHUB_CONFIG.profileUrl;
  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly minReposForControls = MIN_REPOS_FOR_CONTROLS;

  protected readonly sortBy = signal<RepositorySortValue>('updated');
  protected readonly languageFilter = signal<RepositoryLanguageFilterValue>('all');

  protected readonly displayedRepositories = computed(() =>
    sortAndFilterRepositories(
      this.githubService.repositories(),
      this.sortBy(),
      this.languageFilter(),
    ),
  );
}
