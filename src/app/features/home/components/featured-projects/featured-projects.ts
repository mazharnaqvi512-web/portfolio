import { Component, computed, inject } from '@angular/core';

import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { ProjectCard } from '../../../projects/components/project-card/project-card';
import { ProjectsService } from '../../../projects/services/projects.service';

const MAX_FEATURED = 3;

@Component({
  selector: 'app-featured-projects',
  imports: [SectionHeader, EmptyState, ProjectCard],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="Work" title="Featured projects" />

      <div class="mt-8">
        @if (featuredProjects().length) {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (project of featuredProjects(); track project.slug) {
              <app-project-card [project]="project" />
            }
          </div>
        } @else {
          <app-empty-state
            icon="pi pi-folder-open"
            message="Case studies and projects are being published here soon."
            actionLabel="View all projects"
            actionRoute="/projects"
          />
        }
      </div>
    </section>
  `,
})
export class FeaturedProjects {
  private readonly projectsService = inject(ProjectsService);

  protected readonly featuredProjects = computed(() =>
    this.projectsService
      .projects()
      .filter((project) => project.featured)
      .slice(0, MAX_FEATURED),
  );
}
