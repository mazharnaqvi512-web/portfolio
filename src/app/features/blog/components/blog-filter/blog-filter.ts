import { Component, model } from '@angular/core';

import type { BlogCategory } from '../../../../core/models/blog-post.model';

export type BlogFilterValue = BlogCategory | 'all';

interface FilterOption {
  readonly label: string;
  readonly value: BlogFilterValue;
}

/** Spec section 31's exact category list. */
const FILTER_OPTIONS: readonly FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Angular', value: 'angular' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'RxJS', value: 'rxjs' },
  { label: 'Frontend Architecture', value: 'frontend-architecture' },
  { label: 'Performance', value: 'performance' },
  { label: 'AI', value: 'ai' },
  { label: 'Java', value: 'java' },
  { label: 'Spring Boot', value: 'spring-boot' },
  { label: 'Career', value: 'career' },
  { label: 'Software Engineering', value: 'software-engineering' },
];

@Component({
  selector: 'app-blog-filter',
  template: `
    <div
      class="flex gap-2 overflow-x-auto pb-2"
      role="group"
      aria-label="Filter articles by category"
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
export class BlogFilter {
  protected readonly options = FILTER_OPTIONS;
  readonly selected = model<BlogFilterValue>('all');
}
