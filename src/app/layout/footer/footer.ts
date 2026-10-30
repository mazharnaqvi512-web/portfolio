import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_CONFIG } from '../../core/config/app-config';
import { NAVIGATION_ITEMS } from '../../core/config/navigation-config';
import { ROUTE_PATHS } from '../../core/constants/route.constants';
import { SOCIAL_LINKS } from '../../core/config/social-config';

/** Spec section 29's service names — plain text, not links, since individual service pages don't exist yet. */
const SERVICE_NAMES: readonly string[] = [
  'Angular Development',
  'Enterprise Frontend Development',
  'Frontend Architecture',
  'UI Implementation',
  'API Integration',
  'Performance Optimization',
  'Code Review',
  'AI Integration',
  'Technical Consulting',
];

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="border-t border-border">
      <div class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div class="flex flex-col gap-3">
            <a routerLink="/" class="text-body-lg font-bold text-text-primary">{{ siteName }}</a>
            <p class="text-small text-text-secondary">{{ tagline }}</p>
            <div class="mt-2 flex gap-4">
              @for (link of socialLinks; track link.platform) {
                <a
                  [href]="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  [attr.aria-label]="link.label"
                  class="text-h4 leading-none text-text-secondary hover:text-accent"
                >
                  <i [class]="link.icon"></i>
                </a>
              }
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <h2 class="text-small font-semibold text-text-primary">Navigation</h2>
            <nav class="flex flex-col gap-2" aria-label="Footer">
              @for (item of navItems; track item.route) {
                <a
                  [routerLink]="item.route"
                  class="text-small text-text-secondary hover:text-text-primary"
                >
                  {{ item.label }}
                </a>
              }
            </nav>
          </div>

          <div class="flex flex-col gap-3">
            <h2 class="text-small font-semibold text-text-primary">Services</h2>
            <ul class="flex flex-col gap-2">
              @for (service of serviceNames; track service) {
                <li class="text-small text-text-secondary">{{ service }}</li>
              }
            </ul>
          </div>

          <div class="flex flex-col gap-3">
            <h2 class="text-small font-semibold text-text-primary">Get in touch</h2>
            <a
              [routerLink]="resumeRoute"
              class="text-small text-text-secondary hover:text-text-primary"
            >
              Resume
            </a>
            <a
              [routerLink]="contactRoute"
              class="text-small text-text-secondary hover:text-text-primary"
            >
              Contact
            </a>
          </div>
        </div>

        <div class="mt-12 border-t border-border pt-6 text-caption text-text-muted">
          © {{ currentYear }} {{ siteName }}. All rights reserved.
        </div>
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly siteName = APP_CONFIG.name;
  protected readonly tagline = APP_CONFIG.tagline;
  protected readonly navItems = NAVIGATION_ITEMS.filter((item) => item.visible);
  protected readonly socialLinks = SOCIAL_LINKS;
  protected readonly serviceNames = SERVICE_NAMES;
  protected readonly resumeRoute = `/${ROUTE_PATHS.resume}`;
  protected readonly contactRoute = `/${ROUTE_PATHS.contact}`;
  protected readonly currentYear = new Date().getFullYear();
}
