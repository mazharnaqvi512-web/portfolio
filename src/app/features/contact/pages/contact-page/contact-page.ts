import { Component } from '@angular/core';

import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { ContactForm } from '../../components/contact-form/contact-form';
import { ContactInfo } from '../../components/contact-info/contact-info';

@Component({
  selector: 'app-contact-page',
  imports: [SectionHeader, ContactInfo, ContactForm],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header eyebrow="Contact" title="Let's work together" [level]="1" />

      <div class="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr]">
        <app-contact-info />
        <app-contact-form />
      </div>
    </section>
  `,
})
export class ContactPage {}
