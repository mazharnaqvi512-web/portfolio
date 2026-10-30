import { Component, inject, model } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { SelectButton } from 'primeng/selectbutton';

import { NAVIGATION_ITEMS } from '../../core/config/navigation-config';
import { SOCIAL_LINKS } from '../../core/config/social-config';
import type { SocialLink } from '../../core/models/social-link.model';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ThemeService } from '../../core/theme/theme';
import { THEME_OPTIONS } from '../theme-options';

/**
 * Backdrop click and Escape are handled by PrimeNG's Drawer itself (modal +
 * closeOnEscape) — both emit visibleChange, which our [(visible)] two-way
 * binding already picks up, so no extra close-handling code is needed here.
 */
@Component({
  selector: 'app-mobile-navigation',
  imports: [Drawer, RouterLink, RouterLinkActive, FormsModule, ButtonDirective, SelectButton],
  template: `
    <p-drawer
      [(visible)]="visible"
      header="Menu"
      position="right"
      [modal]="true"
      [closeOnEscape]="true"
      styleClass="w-full max-w-xs"
    >
      <nav class="flex flex-col gap-1" aria-label="Primary">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="text-accent"
            [routerLinkActiveOptions]="{ exact: item.route === '/' }"
            (click)="close()"
            class="rounded-md px-3 py-2 text-body font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          >
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="mt-6 flex flex-col gap-4 border-t border-border pt-6">
        <p-selectbutton
          [options]="themeOptions"
          optionLabel="label"
          optionValue="value"
          [ngModel]="preference()"
          (ngModelChange)="themeService.setPreference($event)"
          aria-label="Theme"
        />

        <div class="flex gap-5">
          @for (link of socialLinks; track link.platform) {
            <a
              [href]="link.url"
              target="_blank"
              rel="noopener noreferrer"
              [attr.aria-label]="link.label"
              (click)="trackSocialClick(link)"
              class="text-h4 leading-none text-text-secondary hover:text-accent"
            >
              <i [class]="link.icon"></i>
            </a>
          }
        </div>

        <a pButton routerLink="/contact" (click)="onHireMeClick()" class="w-full justify-center"
          >Hire Me</a
        >
      </div>
    </p-drawer>
  `,
})
export class MobileNavigation {
  protected readonly themeService = inject(ThemeService);
  private readonly analyticsService = inject(AnalyticsService);

  readonly visible = model(false);

  protected readonly navItems = NAVIGATION_ITEMS.filter((item) => item.visible);
  protected readonly socialLinks = SOCIAL_LINKS;
  protected readonly themeOptions = [...THEME_OPTIONS];
  protected readonly preference = this.themeService.preference;

  protected close(): void {
    this.visible.set(false);
  }

  protected onHireMeClick(): void {
    this.analyticsService.trackEvent('hire_me_clicked');
    this.close();
  }

  protected trackSocialClick(link: SocialLink): void {
    if (link.platform === 'github' || link.platform === 'linkedin') {
      this.analyticsService.trackExternalLink(link.platform);
    }
  }
}
