import { Component } from '@angular/core';

import { APP_CONFIG } from '../../../../core/config/app-config';
import { SOCIAL_LINKS } from '../../../../core/config/social-config';

@Component({
  selector: 'app-contact-info',
  template: `
    <div class="flex flex-col gap-8">
      <div>
        <p class="text-caption font-semibold uppercase tracking-wide text-text-muted">
          Availability
        </p>
        <p class="mt-2 flex items-center gap-2 text-body font-medium text-text-primary">
          <span class="size-2 rounded-pill bg-accent" aria-hidden="true"></span>
          {{ availabilityStatus }}
        </p>
      </div>

      <div class="flex flex-col gap-4">
        @for (link of socialLinks; track link.platform) {
          <a
            [href]="link.url"
            [target]="link.platform === 'email' ? null : '_blank'"
            rel="noopener noreferrer"
            class="flex items-center gap-3 text-body text-text-secondary hover:text-text-primary"
          >
            <i [class]="link.icon" class="text-h4 leading-none text-accent"></i>
            {{ link.label }}
          </a>
        }
      </div>
    </div>
  `,
})
export class ContactInfo {
  protected readonly availabilityStatus = APP_CONFIG.availabilityStatus;
  protected readonly socialLinks = SOCIAL_LINKS;
}
