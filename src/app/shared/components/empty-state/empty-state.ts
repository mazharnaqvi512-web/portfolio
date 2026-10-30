import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  imports: [RouterLink],
  template: `
    <div
      class="mx-auto flex max-w-md flex-col items-center gap-3 rounded-card border border-dashed border-border p-10 text-center"
    >
      <i [class]="icon()" class="text-h2 text-text-muted"></i>
      <p class="text-body text-text-secondary">{{ message() }}</p>
      @if (actionLabel() && actionRoute()) {
        <a
          [routerLink]="actionRoute()"
          class="text-body font-medium text-accent hover:text-accent-hover"
        >
          {{ actionLabel() }} →
        </a>
      }
    </div>
  `,
})
export class EmptyState {
  readonly icon = input('pi pi-inbox');
  readonly message = input.required<string>();
  readonly actionLabel = input<string>();
  readonly actionRoute = input<string>();
}
