import { InjectionToken } from '@angular/core';
import type { Observable } from 'rxjs';

import type { ChatMessage } from './chat-message.model';

/**
 * The UI depends only on this interface, never on a concrete provider
 * (spec section 47) — swapping to a real AI backend later is a matter of
 * providing a different AI_PROVIDER implementation, no UI changes.
 */
export interface AiProvider {
  sendMessage(message: string, history: readonly ChatMessage[]): Observable<string>;
}

export const AI_PROVIDER = new InjectionToken<AiProvider>('AI_PROVIDER');

/**
 * A failure a provider has already turned into something worth showing the visitor: its
 * `message` is user-facing copy, not a technical error. Anything else a provider throws is
 * shown as a generic "something went wrong".
 */
export class AiProviderError extends Error {
  override readonly name = 'AiProviderError';
}
