import { Component, computed, input, model } from '@angular/core';

import type { ExperienceCategory } from '../../../../core/models/experience.model';

export type ExperienceFilterValue = ExperienceCategory | 'all';

interface FilterOption {
  readonly label: string;
  readonly value: ExperienceFilterValue;
}

const FILTER_OPTIONS: readonly FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Frontend', value: 'frontend' },
  { label: 'Angular', value: 'angular' },
  { label: 'Enterprise', value: 'enterprise' },
  { label: 'AI', value: 'ai' },
  { label: 'Full Stack', value: 'full-stack' },
];

@Component({
  selector: 'app-experience-filter',
  template: `
    <div
      class="flex gap-2 overflow-x-auto pb-2"
      role="group"
      aria-label="Filter experience by category"
    >
      @for (option of options(); track option.value) {
        <button
          type="button"
          class="shrink-0 rounded-pill border px-4 py-2 text-small font-medium transition-colors"
          [class]="
            selected() === option.value
              ? 'border-accent bg-accent text-white'
              : 'border-border bg-surface text-text-secondary hover:text-text-primary'
          "
          [attr.aria-pressed]="selected() === option.value"
          (click)="selected.set(option.value)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
})
export class ExperienceFilter {
  /** Categories that at least one entry uses; a chip for any other would only ever show nothing. */
  readonly available = input.required<readonly ExperienceCategory[]>();
  readonly selected = model<ExperienceFilterValue>('all');

  protected readonly options = computed(() =>
    FILTER_OPTIONS.filter(
      (option) => option.value === 'all' || this.available().includes(option.value),
    ),
  );
}
