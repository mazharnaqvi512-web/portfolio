import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TECHNOLOGIES } from '../../../../core/config/technologies-config';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';

@Component({
  selector: 'app-skills-preview',
  imports: [SectionHeader, RouterLink],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="Skills" title="Core technologies" />

      <div class="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
        @for (technology of featuredTechnologies; track technology.name) {
          <span
            class="rounded-pill border border-border bg-surface px-4 py-2 text-small font-medium text-text-secondary"
          >
            {{ technology.name }}
          </span>
        }
      </div>

      <div class="mt-8 text-center">
        <a routerLink="/skills" class="text-body font-medium text-accent hover:text-accent-hover">
          View all skills →
        </a>
      </div>
    </section>
  `,
})
export class SkillsPreview {
  protected readonly featuredTechnologies = TECHNOLOGIES.filter(
    (technology) => technology.featured,
  );
}
