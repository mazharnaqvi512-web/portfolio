import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Project } from '../../../../core/models/project.model';
import { AnalyticsService } from '../../../../core/services/analytics.service';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink],
  template: `
    <article
      class="flex flex-col gap-4 rounded-card border border-border bg-surface p-6 transition-shadow hover:shadow-card"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="rounded-pill bg-accent-subtle px-3 py-1 text-caption font-medium text-accent">
          {{ project().businessDomain }}
        </span>
        @if (project().featured) {
          <span class="text-caption font-medium text-text-muted">Featured</span>
        }
      </div>

      <div>
        @if (headingLevel() === 2) {
          <h2 class="text-h4 font-semibold text-text-primary">{{ project().name }}</h2>
        } @else {
          <h3 class="text-h4 font-semibold text-text-primary">{{ project().name }}</h3>
        }
        <p class="mt-2 text-small text-text-secondary">{{ project().shortDescription }}</p>
      </div>

      <div class="flex flex-wrap gap-2">
        @for (technology of project().technologyStack; track technology) {
          <span
            class="rounded-pill border border-border px-3 py-1 text-caption text-text-secondary"
          >
            {{ technology }}
          </span>
        }
      </div>

      <div class="mt-auto flex flex-wrap items-center gap-4 pt-2 text-small font-medium">
        <a
          [routerLink]="['/projects', project().slug]"
          (click)="analyticsService.trackProjectView(project().slug)"
          class="text-accent hover:text-accent-hover"
        >
          View details →
        </a>
        @if (project().liveDemoUrl) {
          <a
            [href]="project().liveDemoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-secondary hover:text-text-primary"
          >
            Live demo
          </a>
        }
        @if (project().githubUrl) {
          <a
            [href]="project().githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-text-secondary hover:text-text-primary"
          >
            GitHub
          </a>
        }
      </div>
    </article>
  `,
})
export class ProjectCard {
  protected readonly analyticsService = inject(AnalyticsService);

  readonly project = input.required<Project>();
  /** ProjectsPage (its own <h1>) passes 2; FeaturedProjects (under a <h2>) keeps the default. */
  readonly headingLevel = input<2 | 3>(3);
}
