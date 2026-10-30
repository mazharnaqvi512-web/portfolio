import { Component } from '@angular/core';

import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { SERVICES } from '../../../../core/config/services-config';
import { ServiceCard } from '../../components/service-card/service-card';

@Component({
  selector: 'app-services-page',
  imports: [SectionHeader, ServiceCard],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="Services" title="How I can help" [level]="1" />

      <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        @for (service of services; track service.slug) {
          <app-service-card [service]="service" />
        }
      </div>
    </section>
  `,
})
export class ServicesPage {
  protected readonly services = SERVICES;
}
