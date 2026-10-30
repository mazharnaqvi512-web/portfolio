import { Component, output } from '@angular/core';

import { SUGGESTED_PROMPTS } from '../../data/suggested-prompts.data';

@Component({
  selector: 'app-suggested-prompts',
  template: `
    <div class="flex flex-col gap-2">
      <p class="text-caption font-medium uppercase tracking-wide text-text-muted">Try asking</p>
      @for (prompt of prompts; track prompt) {
        <button
          type="button"
          (click)="selected.emit(prompt)"
          class="rounded-md border border-border bg-surface px-3 py-2 text-left text-small text-text-secondary transition-colors hover:border-accent hover:text-text-primary"
        >
          {{ prompt }}
        </button>
      }
    </div>
  `,
})
export class SuggestedPrompts {
  protected readonly prompts = SUGGESTED_PROMPTS;
  readonly selected = output<string>();
}
