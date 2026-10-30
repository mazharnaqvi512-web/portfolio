import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { type Observable, map, of } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api-config';
import { SOCIAL_LINKS } from '../../../core/config/social-config';
import type { ApiResponse } from '../../../core/models/api-response.model';
import type { ContactFormValue } from '../../../core/models/contact-form.model';

/**
 * Two delivery modes, chosen by whether a backend is configured
 * (environment.apiBaseUrl, via API_BASE_URL):
 * - API: POSTs to portfolio-api's /api/contact.
 * - mailto (default): hands the message to the visitor's own email client —
 *   the one mechanism that's genuinely functional without any backend,
 *   rather than simulating a network call that goes nowhere.
 *
 * Don't point apiBaseUrl at a backend for real visitors until it actually
 * delivers messages somewhere a human reads — portfolio-api currently only
 * logs them server-side (spec section 46's database + email notification
 * don't exist yet).
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly contactEmail =
    SOCIAL_LINKS.find((link) => link.platform === 'email')?.url.replace('mailto:', '') ?? '';

  /** True when submissions go to the backend; false means they go through the visitor's own mail client. */
  readonly usesApi = this.apiBaseUrl !== '';

  buildMailtoUrl(value: ContactFormValue): string {
    const bodyLines = [
      `Name: ${value.name}`,
      `Email: ${value.email}`,
      value.company ? `Company: ${value.company}` : null,
      value.projectType ? `Project Type: ${value.projectType}` : null,
      value.budget ? `Budget: ${value.budget}` : null,
      value.timeline ? `Timeline: ${value.timeline}` : null,
      '',
      value.message,
    ].filter((line): line is string => line !== null);

    // encodeURIComponent (not URLSearchParams, which encodes spaces as "+" —
    // not reliably decoded back to a space by mail clients in a mailto: URI).
    const subject = encodeURIComponent(value.subject);
    const body = encodeURIComponent(bodyLines.join('\n'));

    return `mailto:${this.contactEmail}?subject=${subject}&body=${body}`;
  }

  submit(value: ContactFormValue): Observable<void> {
    if (this.usesApi) {
      return this.http
        .post<ApiResponse<null>>(`${this.apiBaseUrl}/api/contact`, value)
        .pipe(map(() => undefined));
    }
    this.openMailClient(value);
    return of(undefined);
  }

  openMailClient(value: ContactFormValue): void {
    if (!this.isBrowser) {
      return;
    }
    window.location.href = this.buildMailtoUrl(value);
  }
}
