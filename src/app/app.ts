import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AnalyticsService } from './core/services/analytics.service';
import { SeoService } from './core/services/seo.service';
import { ThemeService } from './core/theme/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /**
   * Injected (not just provided) so ThemeService activates on bootstrap —
   * otherwise its effect() never runs and the inline no-FOUC script's
   * initial data-theme is never kept in sync with later preference/system
   * changes.
   */
  private readonly themeService = inject(ThemeService);
  /** Injected so its NavigationEnd subscription starts on bootstrap — see SeoService. */
  private readonly seoService = inject(SeoService);
  /** Injected so its NavigationEnd subscription starts on bootstrap — see AnalyticsService. */
  private readonly analyticsService = inject(AnalyticsService);
}
