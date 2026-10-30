import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { CaseStudy } from '../../../../core/models/case-study.model';
import { AnalyticsService } from '../../../../core/services/analytics.service';

@Component({
  selector: 'app-case-study-card',
  imports: [RouterLink],
  template: `
    <article
      class="flex flex-col gap-3 rounded-card border border-border bg-surface p-6 transition-shadow hover:shadow-card"
    >
      <h2 class="text-h4 font-semibold text-text-primary">{{ caseStudy().title }}</h2>
      <p class="text-small text-text-secondary">{{ caseStudy().summary }}</p>
      <a
        [routerLink]="['/case-studies', caseStudy().slug]"
        (click)="analyticsService.trackCaseStudyView(caseStudy().slug)"
        class="mt-auto text-small font-medium text-accent hover:text-accent-hover"
      >
        Read case study →
      </a>
    </article>
  `,
})
export class CaseStudyCard {
  protected readonly analyticsService = inject(AnalyticsService);

  readonly caseStudy = input.required<CaseStudy>();
}
