import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Service } from '../../../../core/models/service.model';

@Component({
  selector: 'app-service-card',
  imports: [RouterLink],
  template: `
    <article class="flex flex-col gap-4 rounded-card border border-border bg-surface p-6">
      <h2 class="text-h4 font-semibold text-text-primary">{{ service().title }}</h2>
      <p class="text-small text-text-secondary">{{ service().description }}</p>

      <div>
        <p class="text-caption font-semibold uppercase tracking-wide text-text-muted">
          What I can deliver
        </p>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-small text-text-secondary">
          @for (item of service().deliverables; track item) {
            <li>{{ item }}</li>
          }
        </ul>
      </div>

      <div class="flex flex-wrap gap-2">
        @for (technology of service().technologies; track technology) {
          <span
            class="rounded-pill border border-border px-3 py-1 text-caption text-text-secondary"
            >{{ technology }}</span
          >
        }
      </div>

      <p class="text-caption text-text-muted">{{ service().idealClient }}</p>

      <a
        [routerLink]="['/contact']"
        [queryParams]="{ service: service().slug }"
        class="mt-auto text-small font-medium text-accent hover:text-accent-hover"
      >
        Discuss a project →
      </a>
    </article>
  `,
})
export class ServiceCard {
  readonly service = input.required<Service>();
}
