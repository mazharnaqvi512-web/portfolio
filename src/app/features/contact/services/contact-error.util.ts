import { HttpErrorResponse } from '@angular/common/http';

import type { ApiResponse } from '../../../core/models/api-response.model';

const NETWORK_ERROR_STATUS = 0;
const VALIDATION_ERROR_STATUS = 400;
const RATE_LIMITED_STATUS = 429;

/** Turns a failed submission into visitor-friendly copy — never surfaces raw status codes or technical details. */
export function describeContactError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === NETWORK_ERROR_STATUS) {
      return "Couldn't reach the server. Please check your connection and try again.";
    }
    if (error.status === RATE_LIMITED_STATUS) {
      return "You've sent several messages recently. Please wait a little while before trying again.";
    }
    if (error.status === VALIDATION_ERROR_STATUS) {
      const body = error.error as Partial<ApiResponse<unknown>> | null;
      // Backend messages look like "name: Name is required" — drop the field prefix for display.
      const details = (body?.errors ?? []).map((message) => message.replace(/^\w+:\s*/, ''));
      if (details.length) {
        return `Please check your details: ${details.join('; ')}.`;
      }
    }
  }
  return 'Something went wrong sending your message. Please try again.';
}
