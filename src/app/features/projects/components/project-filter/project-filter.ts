import { Component, model } from '@angular/core';

import type { ProjectFilterTag } from '../../../../core/models/project.model';

export type ProjectFilterValue = ProjectFilterTag | 'all';

interface FilterOption {
  readonly label: string;
  readonly value: ProjectFilterValue;
}

/** Spec section 21's exact filter set. */
const FILTER_OPTIONS: readonly FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Angular', value: 'angular' },
  { label: 'Enterprise', value: 'enterprise' },
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'AI', value: 'ai' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'FinTech', value: 'fintech' },
  { label: 'Other', value: 'other' },
];

@Component({
  selector: 'app-project-filter',
  template: `
    <div
      class="flex gap-2 overflow-x-auto pb-2"
      role="group"
      aria-label="Filter projects by category"
    >
      @for (option of options; track option.value) {
        <button
          type="button"
          class="shrink-0 rounded-pill border px-4 py-2 text-small font-medium transition-colors"
          [class]="
            selected() === option.value
              ? 'border-accent bg-accent text-on-accent'
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
export class ProjectFilter {
  protected readonly options = FILTER_OPTIONS;
  readonly selected = model<ProjectFilterValue>('all');
}
