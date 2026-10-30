import { Component } from '@angular/core';

import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { TECHNOLOGIES } from '../../../../core/config/technologies-config';
import type {
  SkillLevel,
  Technology,
  TechnologyCategory,
} from '../../../../core/models/technology.model';

interface CategoryGroup {
  readonly key: TechnologyCategory;
  readonly label: string;
  readonly technologies: readonly Technology[];
}

/** Spec section 17's order, minus "Databases" — no real entries exist for it, so it's omitted rather than invented. */
const CATEGORY_LABELS: readonly { key: TechnologyCategory; label: string }[] = [
  { key: 'frontend-engineering', label: 'Frontend Engineering' },
  { key: 'state-management', label: 'State Management' },
  { key: 'ui-frameworks', label: 'UI Frameworks' },
  { key: 'backend', label: 'Backend' },
  { key: 'ai', label: 'AI' },
  { key: 'cloud-devops', label: 'Cloud / DevOps' },
  { key: 'development-tools', label: 'Development Tools' },
];

const LEVEL_LABELS: Record<SkillLevel, string> = {
  primary: 'Primary',
  strong: 'Strong',
  'working-knowledge': 'Working Knowledge',
  learning: 'Learning',
};

@Component({
  selector: 'app-skills-page',
  imports: [SectionHeader],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="Skills" title="Technical skills dashboard" [level]="1" />

      <div class="mt-12 flex flex-col gap-12">
        @for (group of categoryGroups; track group.key) {
          <div>
            <h2 class="text-h4 font-semibold text-text-primary">{{ group.label }}</h2>
            <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              @for (technology of group.technologies; track technology.name) {
                <div class="flex flex-col gap-2 rounded-card border border-border bg-surface p-5">
                  <div class="flex items-center justify-between gap-2">
                    <p class="text-body font-semibold text-text-primary">{{ technology.name }}</p>
                    <span
                      class="rounded-pill bg-accent-subtle px-2.5 py-1 text-caption font-medium text-accent"
                    >
                      {{ levelLabels[technology.level] }}
                    </span>
                  </div>
                  <p class="text-small text-text-secondary">{{ technology.description }}</p>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class SkillsPage {
  protected readonly levelLabels = LEVEL_LABELS;

  protected readonly categoryGroups: readonly CategoryGroup[] = CATEGORY_LABELS.map(
    ({ key, label }) => ({
      key,
      label,
      technologies: TECHNOLOGIES.filter((technology) => technology.category === key),
    }),
  ).filter((group) => group.technologies.length > 0);
}
