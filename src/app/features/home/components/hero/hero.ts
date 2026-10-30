import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';

import { APP_CONFIG } from '../../../../core/config/app-config';
import { SOCIAL_LINKS } from '../../../../core/config/social-config';

/**
 * No professional photo is available yet — per spec section 8, this uses a
 * decorative placeholder visual rather than a stock or invented photo.
 */
@Component({
  selector: 'app-hero',
  imports: [RouterLink, ButtonDirective],
  template: `
    <section class="relative overflow-hidden">
      <div
        class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,var(--color-accent-subtle),transparent_60%)]"
        aria-hidden="true"
      ></div>

      <div
        class="mx-auto flex max-w-content flex-col items-center gap-6 px-4 py-20 text-center md:px-6 lg:px-8 lg:py-28"
      >
        <p class="text-caption font-semibold uppercase tracking-wide text-accent">{{ role }}</p>

        <h1 class="text-hero font-bold text-text-primary">{{ name }}</h1>

        <p class="text-small font-medium text-text-muted">
          {{ yearsOfExperience }}+ Years of Experience
        </p>

        <p class="max-w-2xl text-body-lg text-text-secondary">{{ tagline }}</p>

        <div class="mt-2 flex flex-wrap items-center justify-center gap-4">
          <a pButton routerLink="/contact">Let's Work Together</a>
          <a pButton routerLink="/projects" outlined="true">View My Work</a>
          <a
            routerLink="/resume"
            class="inline-flex items-center gap-2 text-small font-medium text-text-secondary hover:text-text-primary"
          >
            <i class="pi pi-file"></i>
            View Resume
          </a>
        </div>

        <div class="mt-4 flex gap-5">
          @for (link of socialLinks; track link.platform) {
            <a
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
              [attr.aria-label]="link.label"
              class="text-h4 leading-none text-text-secondary transition-colors hover:text-accent"
            >
              <i [class]="link.icon"></i>
            </a>
          }
        </div>
      </div>
    </section>
  `,
})
export class Hero {
  protected readonly name = APP_CONFIG.name;
  protected readonly role = APP_CONFIG.role;
  protected readonly tagline = APP_CONFIG.tagline;
  protected readonly yearsOfExperience = APP_CONFIG.yearsOfExperience;
  protected readonly socialLinks = SOCIAL_LINKS;
}
