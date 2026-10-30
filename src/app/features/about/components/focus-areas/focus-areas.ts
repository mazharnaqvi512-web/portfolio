import { Component } from '@angular/core';

import { APP_CONFIG } from '../../../../core/config/app-config';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';

@Component({
  selector: 'app-about-focus-areas',
  imports: [SectionHeader],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="Focus" title="Technical focus & current learning" />

      <div class="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div class="rounded-card border border-border bg-surface p-6">
          <p class="text-body font-semibold text-text-primary">Current focus</p>
          <p class="mt-2 text-body text-text-secondary">{{ currentFocus }}</p>
        </div>

        <div class="rounded-card border border-border bg-surface p-6">
          <p class="text-body font-semibold text-text-primary">Future focus</p>
          <div class="mt-3 flex flex-wrap gap-2">
            @for (item of futureFocus; track item) {
              <span
                class="rounded-pill bg-accent-subtle px-3 py-1 text-caption font-medium text-accent"
              >
                {{ item }}
              </span>
            }
          </div>
        </div>
      </div>

      <p class="mx-auto mt-10 max-w-2xl text-center text-body text-text-secondary">
        {{ whatIBring }}
      </p>
    </section>
  `,
})
export class FocusAreas {
  protected readonly currentFocus = APP_CONFIG.currentFocus;
  protected readonly futureFocus = APP_CONFIG.futureFocus;
  protected readonly whatIBring = `What I bring is a senior-level Angular skillset applied with enterprise discipline — clean architecture, performance and accessibility as defaults, not afterthoughts — paired with a deliberate, ongoing push into backend and AI-assisted development.`;
}
