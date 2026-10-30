import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  template: `
    <div class="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
      @if (eyebrow()) {
        <p class="text-caption font-semibold uppercase tracking-wide text-accent">
          {{ eyebrow() }}
        </p>
      }
      @if (level() === 1) {
        <h1 class="text-h2 font-semibold text-text-primary">{{ title() }}</h1>
      } @else {
        <h2 class="text-h2 font-semibold text-text-primary">{{ title() }}</h2>
      }
      @if (description()) {
        <p class="text-body text-text-secondary">{{ description() }}</p>
      }
    </div>
  `,
})
export class SectionHeader {
  readonly eyebrow = input<string>();
  readonly title = input.required<string>();
  readonly description = input<string>();
  /** Pages with no other <h1> (list/utility pages with no Hero-style component) pass 1 so the page has exactly one. */
  readonly level = input<1 | 2>(2);
}
