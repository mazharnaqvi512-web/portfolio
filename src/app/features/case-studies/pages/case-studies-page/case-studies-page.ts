import { Component, inject } from '@angular/core';

import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { CaseStudyCard } from '../../components/case-study-card/case-study-card';
import { CaseStudiesService } from '../../services/case-studies.service';

@Component({
  selector: 'app-case-studies-page',
  imports: [SectionHeader, EmptyState, CaseStudyCard],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header
        eyebrow="Case Studies"
        title="In-depth engineering write-ups"
        [level]="1"
      />

      <div class="mt-10">
        @if (caseStudies().length) {
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (caseStudy of caseStudies(); track caseStudy.slug) {
              <app-case-study-card [caseStudy]="caseStudy" />
            }
          </div>
        } @else {
          <app-empty-state
            icon="pi pi-book"
            message="Case studies are being written and will be published here soon."
            actionLabel="View projects"
            actionRoute="/projects"
          />
        }
      </div>
    </section>
  `,
})
export class CaseStudiesPage {
  private readonly caseStudiesService = inject(CaseStudiesService);
  protected readonly caseStudies = this.caseStudiesService.caseStudies;
}
