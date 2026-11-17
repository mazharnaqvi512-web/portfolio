import { inject } from '@angular/core';

import { API_BASE_URL } from '../../../core/config/api-config';
import type { AiProvider } from '../../../core/models/ai-provider.model';
import { ApiAiProvider } from './api-ai-provider';
import { MockAiProvider } from './mock-ai-provider';

/**
 * The real assistant when a backend is configured, otherwise the canned-answer mock (which is
 * for development without a backend). Used as the factory for AI_PROVIDER in app.config.ts.
 */
export function selectAiProvider(): AiProvider {
  return inject(API_BASE_URL) ? inject(ApiAiProvider) : inject(MockAiProvider);
}
