import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';

/** Empty string means no backend is configured — features fall back to their static/mailto behavior. A token (not a direct import) so tests can override it. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => environment.apiBaseUrl,
});
