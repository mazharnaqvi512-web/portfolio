import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import type { GithubRepository } from '../../../../core/models/github.model';

@Component({
  selector: 'app-repository-card',
  imports: [DatePipe],
  template: `
    <article class="flex flex-col gap-3 rounded-card border border-border bg-surface p-5">
      <div class="flex items-start justify-between gap-2">
        <h3 class="text-body font-semibold text-text-primary">{{ repository().name }}</h3>
        <a
          [href]="repository().htmlUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View repository"
          class="shrink-0 text-text-muted hover:text-accent"
        >
          <i class="pi pi-external-link"></i>
        </a>
      </div>

      @if (repository().description) {
        <p class="text-small text-text-secondary">{{ repository().description }}</p>
      }

      @if (repository().topics.length) {
        <div class="flex flex-wrap gap-2">
          @for (topic of repository().topics; track topic) {
            <span
              class="rounded-pill border border-border px-2.5 py-1 text-caption text-text-secondary"
              >{{ topic }}</span
            >
          }
        </div>
      }

      <div class="mt-auto flex items-center gap-4 pt-2 text-caption text-text-muted">
        @if (repository().language) {
          <span>{{ repository().language }}</span>
        }
        <span
          ><i class="pi pi-star" aria-hidden="true"></i> {{ repository().stargazersCount }}</span
        >
        <span
          ><i class="pi pi-share-alt" aria-hidden="true"></i> {{ repository().forksCount }}</span
        >
        <span>Updated {{ repository().updatedAt | date }}</span>
      </div>
    </article>
  `,
})
export class RepositoryCard {
  readonly repository = input.required<GithubRepository>();
}
