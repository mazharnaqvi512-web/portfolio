import { Component, computed, inject, signal } from '@angular/core';

import type { ExperienceCategory } from '../../../../core/models/experience.model';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import {
  ExperienceFilter,
  type ExperienceFilterValue,
} from '../../components/experience-filter/experience-filter';
import { ExperienceTimeline } from '../../components/experience-timeline/experience-timeline';
import { ExperienceService } from '../../services/experience.service';

@Component({
  selector: 'app-experience-page',
  imports: [SectionHeader, EmptyState, ExperienceFilter, ExperienceTimeline],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="Experience" title="Where I've made an impact" [level]="1" />

      <div class="mt-10">
        @if (hasExperience()) {
          <app-experience-filter
            [available]="availableCategories()"
            [(selected)]="selectedFilter"
          />
          <div class="mt-8">
            <app-experience-timeline [experiences]="filteredExperiences()" [headingLevel]="2" />
          </div>
        } @else {
          <app-empty-state
            icon="pi pi-briefcase"
            message="Detailed work experience is being added here soon."
            actionLabel="Get in touch"
            actionRoute="/contact"
          />
        }
      </div>
    </section>
  `,
})
export class ExperiencePage {
  private readonly experienceService = inject(ExperienceService);

  protected readonly hasExperience = computed(
    () => this.experienceService.experiences().length > 0,
  );
  protected readonly selectedFilter = signal<ExperienceFilterValue>('all');

  protected readonly availableCategories = computed<readonly ExperienceCategory[]>(() => [
    ...new Set(this.experienceService.experiences().flatMap((experience) => experience.categories)),
  ]);

  protected readonly filteredExperiences = computed(() => {
    const filter = this.selectedFilter();
    const experiences = this.experienceService.experiences();
    return filter === 'all'
      ? experiences
      : experiences.filter((experience) => experience.categories.includes(filter));
  });
}
