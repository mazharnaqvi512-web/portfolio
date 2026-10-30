import { Component } from '@angular/core';

import { SectionHeader } from '../../../../shared/components/section-header/section-header';

interface Principle {
  readonly title: string;
  readonly description: string;
}

/** Spec section 13's example concepts — engineering values, not personal-history claims, so no fabrication concern. */
const PRINCIPLES: readonly Principle[] = [
  {
    title: 'Clean Architecture',
    description:
      'Clear boundaries between core, shared and feature code so the codebase scales without becoming tangled.',
  },
  {
    title: 'Reusable Components',
    description:
      'Build once, compose everywhere — shared UI and logic instead of duplicated one-offs.',
  },
  {
    title: 'Performance First',
    description:
      'Lazy loading, deferred views and bundle discipline from the start, not bolted on later.',
  },
  {
    title: 'User Experience',
    description: 'Every technical decision is ultimately judged by how it feels to use.',
  },
  {
    title: 'Maintainability',
    description:
      'Code is read far more often than it is written — optimize for the next person, including future me.',
  },
  {
    title: 'Scalability',
    description:
      'Architecture that holds up as the codebase, team and traffic grow, not just at demo size.',
  },
  {
    title: 'Accessibility',
    description:
      'Keyboard navigation, semantic HTML and screen-reader support by default, not as an afterthought.',
  },
  {
    title: 'Continuous Learning',
    description:
      'Staying current with the Angular ecosystem and deliberately building toward full-stack and AI skills.',
  },
];

@Component({
  selector: 'app-about-philosophy',
  imports: [SectionHeader],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="Philosophy" title="How I approach engineering" />

      <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        @for (principle of principles; track principle.title) {
          <div class="rounded-card border border-border bg-surface p-5">
            <p class="text-body font-semibold text-text-primary">{{ principle.title }}</p>
            <p class="mt-2 text-small text-text-secondary">{{ principle.description }}</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class Philosophy {
  protected readonly principles = PRINCIPLES;
}
