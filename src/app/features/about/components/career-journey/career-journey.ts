import { Component, inject } from '@angular/core';

import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { ExperienceTimeline } from '../../../experience/components/experience-timeline/experience-timeline';
import { ExperienceService } from '../../../experience/services/experience.service';

@Component({
  selector: 'app-about-career-journey',
  imports: [SectionHeader, EmptyState, ExperienceTimeline],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="Career" title="Career journey" />

      <div class="mt-10">
        @if (experiences().length) {
          <app-experience-timeline [experiences]="experiences()" />
        } @else {
          <app-empty-state
            icon="pi pi-briefcase"
            message="A detailed career timeline is being added here soon."
            actionLabel="See the full Experience page"
            actionRoute="/experience"
          />
        }
      </div>
    </section>
  `,
})
export class CareerJourney {
  private readonly experienceService = inject(ExperienceService);
  protected readonly experiences = this.experienceService.experiences;
}
