import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { ProjectCard } from '../../components/project-card/project-card';
import {
  ProjectFilter,
  type ProjectFilterValue,
} from '../../components/project-filter/project-filter';
import { ProjectSearch } from '../../components/project-search/project-search';
import { ProjectsService } from '../../services/projects.service';
import { filterProjects } from './project-filter.util';

const SEARCH_DEBOUNCE_MS = 250;

@Component({
  selector: 'app-projects-page',
  imports: [SectionHeader, EmptyState, ProjectFilter, ProjectSearch, ProjectCard],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="Work" title="Projects" [level]="1" />

      <div class="mt-10">
        @if (hasProjects()) {
          <div class="mx-auto flex max-w-xl flex-col gap-4">
            <app-project-search [(query)]="searchQuery" />
            <app-project-filter [(selected)]="selectedFilter" />
          </div>

          <div class="mt-8">
            @if (filteredProjects().length) {
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @for (project of filteredProjects(); track project.slug) {
                  <app-project-card [project]="project" [headingLevel]="2" />
                }
              </div>
            } @else {
              <app-empty-state icon="pi pi-search" message="No projects match your search." />
            }
          </div>
        } @else {
          <app-empty-state
            icon="pi pi-folder-open"
            message="Projects are being published here soon."
            actionLabel="Get in touch"
            actionRoute="/contact"
          />
        }
      </div>
    </section>
  `,
})
export class ProjectsPage {
  private readonly projectsService = inject(ProjectsService);

  protected readonly hasProjects = computed(() => this.projectsService.projects().length > 0);

  protected readonly searchQuery = signal('');
  protected readonly selectedFilter = signal<ProjectFilterValue>('all');

  private readonly debouncedQuery = toSignal(
    toObservable(this.searchQuery).pipe(debounceTime(SEARCH_DEBOUNCE_MS)),
    {
      initialValue: '',
    },
  );

  protected readonly filteredProjects = computed(() =>
    filterProjects(this.projectsService.projects(), this.selectedFilter(), this.debouncedQuery()),
  );
}
