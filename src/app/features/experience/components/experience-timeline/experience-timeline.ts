import { Component, input } from '@angular/core';

import type { Experience } from '../../../../core/models/experience.model';
import { formatMonth } from '../../../../core/utils/format-month.util';

@Component({
  selector: 'app-experience-timeline',
  template: `
    <ol class="flex flex-col gap-10">
      @for (experience of experiences(); track experience.company + experience.role) {
        <li class="relative border-l border-border pl-6">
          <span class="absolute -left-[5px] top-1.5 size-2.5 rounded-pill bg-accent"></span>

          <p class="text-caption font-medium uppercase tracking-wide text-text-muted">
            {{ format(experience.startDate) }} —
            {{ experience.endDate ? format(experience.endDate) : 'Present' }} ·
            {{ experience.location }}
          </p>
          @if (headingLevel() === 2) {
            <h2 class="mt-1 text-h4 font-semibold text-text-primary">
              {{ experience.role }} · {{ experience.company }}
            </h2>
          } @else {
            <h3 class="mt-1 text-h4 font-semibold text-text-primary">
              {{ experience.role }} · {{ experience.company }}
            </h3>
          }
          <p class="mt-2 text-body text-text-secondary">{{ experience.description }}</p>

          @if (experience.responsibilities.length) {
            <ul class="mt-3 list-disc space-y-1 pl-5 text-small text-text-secondary">
              @for (item of experience.responsibilities; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          }

          @if (experience.keyContributions.length) {
            <p class="mt-4 text-small font-semibold text-text-primary">Key contributions</p>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-small text-text-secondary">
              @for (item of experience.keyContributions; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          }

          @if (experience.projectLinks?.length) {
            <p class="mt-3 text-small text-text-secondary">
              Live:
              @for (link of experience.projectLinks; track link.url; let last = $last) {
                <a
                  [href]="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium text-accent hover:text-accent-hover"
                  >{{ link.label }}</a
                >{{ last ? '' : ', ' }}
              }
            </p>
          }

          @if (experience.technologies.length) {
            <div class="mt-3 flex flex-wrap gap-2">
              @for (technology of experience.technologies; track technology) {
                <span
                  class="rounded-pill border border-border bg-surface px-3 py-1 text-caption text-text-secondary"
                >
                  {{ technology }}
                </span>
              }
            </div>
          }
        </li>
      }
    </ol>
  `,
})
export class ExperienceTimeline {
  protected readonly format = formatMonth;

  readonly experiences = input.required<readonly Experience[]>();
  /** ExperiencePage (its own <h1>) passes 2; ResumePage (under a <h2>) keeps the default. */
  readonly headingLevel = input<2 | 3>(3);
}
