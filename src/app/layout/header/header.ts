import { Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';

import { APP_CONFIG } from '../../core/config/app-config';
import { NAVIGATION_ITEMS } from '../../core/config/navigation-config';
import { SOCIAL_LINKS } from '../../core/config/social-config';
import type { SocialLink } from '../../core/models/social-link.model';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ThemeService } from '../../core/theme/theme';
import { MobileNavigation } from '../mobile-navigation/mobile-navigation';
import { THEME_OPTIONS } from '../theme-options';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ButtonDirective,
    SelectButton,
    MobileNavigation,
  ],
  template: `
    <header
      class="sticky top-0 z-[var(--z-index-sticky)] border-b transition-colors duration-[var(--transition-normal)]"
      [class]="
        scrolled()
          ? 'border-border bg-surface/80 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      "
    >
      <div
        class="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8"
      >
        <a routerLink="/" class="text-body-lg font-bold tracking-tight text-text-primary">
          {{ initials }}
        </a>

        <nav class="hidden items-center gap-6 xl:flex" aria-label="Primary">
          @for (item of navItems; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="text-accent"
              [routerLinkActiveOptions]="{ exact: item.route === '/' }"
              class="text-small font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {{ item.label }}
            </a>
          }
        </nav>

        <div class="hidden items-center gap-4 xl:flex">
          @for (link of socialLinks; track link.platform) {
            @if (link.platform !== 'email') {
              <a
                [href]="link.url"
                target="_blank"
                rel="noopener noreferrer"
                [attr.aria-label]="link.label"
                (click)="trackSocialClick(link)"
                class="text-h4 leading-none text-text-secondary transition-colors hover:text-accent"
              >
                <i [class]="link.icon"></i>
              </a>
            }
          }

          <p-selectbutton
            [options]="themeOptions"
            optionLabel="label"
            optionValue="value"
            [ngModel]="preference()"
            (ngModelChange)="themeService.setPreference($event)"
            aria-label="Theme"
          />

          <a
            pButton
            routerLink="/contact"
            size="small"
            (click)="analyticsService.trackEvent('hire_me_clicked')"
            >Hire Me</a
          >
        </div>

        <button
          type="button"
          class="text-h3 leading-none text-text-primary xl:hidden"
          aria-label="Open menu"
          (click)="mobileNavOpen.set(true)"
        >
          <i class="pi pi-bars"></i>
        </button>
      </div>
    </header>

    @defer (when mobileNavOpen()) {
      <app-mobile-navigation [(visible)]="mobileNavOpen" />
    }
  `,
})
export class Header {
  protected readonly themeService = inject(ThemeService);
  protected readonly analyticsService = inject(AnalyticsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly initials = APP_CONFIG.name
    .split(' ')
    .map((part) => part[0])
    .join('');
  protected readonly navItems = NAVIGATION_ITEMS.filter((item) => item.visible);
  protected readonly socialLinks = SOCIAL_LINKS;
  protected readonly themeOptions = [...THEME_OPTIONS];
  protected readonly preference = this.themeService.preference;

  protected readonly scrolled = signal(false);
  protected readonly mobileNavOpen = signal(false);

  constructor() {
    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }

  protected trackSocialClick(link: SocialLink): void {
    if (link.platform === 'github' || link.platform === 'linkedin') {
      this.analyticsService.trackExternalLink(link.platform);
    }
  }
}
