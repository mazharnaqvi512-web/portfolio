import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { AnalyticsEventName, AnalyticsEventPayload } from '../models/analytics-event.model';

/**
 * No-ops entirely while environment.featureFlags.analytics is false (today,
 * always) — see spec section 61: prepare the architecture, don't add
 * unnecessary tracking. Wiring a real provider (GA4/Plausible/etc.) is a
 * deliberate future decision, not made here.
 *
 * Named methods (spec section 48) are thin wrappers over trackEvent() that
 * centralize each event's exact name (spec section 51) — call sites never
 * hand-write event name strings.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly router = inject(Router);

  constructor() {
    if (!environment.featureFlags.analytics) {
      return;
    }
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.trackPageView(event.urlAfterRedirects));
  }

  trackEvent(name: AnalyticsEventName, payload?: AnalyticsEventPayload): void {
    if (!environment.featureFlags.analytics) {
      return;
    }
    // Real provider call goes here once one is chosen.
    void name;
    void payload;
  }

  trackPageView(url: string): void {
    this.trackEvent('page_view', { url });
  }

  trackResumeDownload(): void {
    this.trackEvent('resume_download');
  }

  trackProjectView(slug: string): void {
    this.trackEvent('project_view', { slug });
  }

  trackCaseStudyView(slug: string): void {
    this.trackEvent('case_study_view', { slug });
  }

  trackContactStart(): void {
    this.trackEvent('contact_started');
  }

  trackContactSubmit(): void {
    this.trackEvent('contact_submitted');
  }

  trackExternalLink(platform: 'github' | 'linkedin'): void {
    this.trackEvent(platform === 'github' ? 'github_click' : 'linkedin_click');
  }

  trackAiOpen(): void {
    this.trackEvent('ai_opened');
  }

  trackAiQuestion(): void {
    this.trackEvent('ai_question_submitted');
  }
}
