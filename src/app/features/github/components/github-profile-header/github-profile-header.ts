import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import type { GithubProfile } from '../../../../core/models/github.model';

@Component({
  selector: 'app-github-profile-header',
  imports: [NgOptimizedImage],
  template: `
    <div class="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
      <img
        [ngSrc]="profile().avatarUrl"
        [alt]="profile().name ?? profile().login"
        width="80"
        height="80"
        [priority]="false"
        class="size-20 rounded-pill"
      />

      <div class="flex-1">
        <h2 class="text-h3 font-semibold text-text-primary">
          {{ profile().name ?? profile().login }}
        </h2>
        <p class="text-small text-text-muted">&#64;{{ profile().login }}</p>
        @if (profile().bio) {
          <p class="mt-2 text-body text-text-secondary">{{ profile().bio }}</p>
        }

        <div
          class="mt-3 flex flex-wrap justify-center gap-4 text-small text-text-secondary sm:justify-start"
        >
          <span>{{ profile().publicRepos }} repositories</span>
          <span>{{ profile().followers }} followers</span>
          <span>{{ profile().following }} following</span>
        </div>
      </div>

      <a
        [href]="profile().htmlUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-small font-medium text-accent hover:text-accent-hover"
      >
        View on GitHub →
      </a>
    </div>
  `,
})
export class GithubProfileHeader {
  readonly profile = input.required<GithubProfile>();
}
