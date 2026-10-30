import { Injectable, inject, signal } from '@angular/core';

import { AI_PROVIDER } from '../../../core/models/ai-provider.model';
import type { ChatMessage } from '../../../core/models/chat-message.model';
import { AnalyticsService } from '../../../core/services/analytics.service';

let messageIdCounter = 0;
function createMessageId(): string {
  messageIdCounter += 1;
  return `msg-${messageIdCounter}`;
}

/**
 * Conversation lives in memory only (signals) — never persisted to
 * localStorage, per spec section 49 ("store only if explicitly needed,
 * don't persist sensitive messages unnecessarily"). Cleared on reload.
 */
@Injectable({ providedIn: 'root' })
export class AiAssistantService {
  private readonly provider = inject(AI_PROVIDER);
  private readonly analyticsService = inject(AnalyticsService);

  private readonly _messages = signal<ChatMessage[]>([]);
  readonly messages = this._messages.asReadonly();

  private readonly _isOpen = signal(false);
  readonly isOpen = this._isOpen.asReadonly();

  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  private lastUserMessage: string | null = null;

  open(): void {
    this._isOpen.set(true);
    this.analyticsService.trackAiOpen();
  }

  close(): void {
    this._isOpen.set(false);
  }

  toggle(): void {
    const willOpen = !this._isOpen();
    this._isOpen.set(willOpen);
    if (willOpen) {
      this.analyticsService.trackAiOpen();
    }
  }

  sendMessage(content: string): void {
    const trimmed = content.trim();
    if (!trimmed || this._isLoading()) {
      return;
    }

    this.lastUserMessage = trimmed;
    this._messages.update((messages) => [
      ...messages,
      { id: createMessageId(), role: 'user', content: trimmed, timestamp: Date.now() },
    ]);
    this.analyticsService.trackAiQuestion();
    this.requestResponse(trimmed);
  }

  retry(): void {
    if (this.lastUserMessage) {
      this.requestResponse(this.lastUserMessage);
    }
  }

  clearConversation(): void {
    this._messages.set([]);
    this._error.set(null);
  }

  private requestResponse(message: string): void {
    this._error.set(null);
    this._isLoading.set(true);

    this.provider.sendMessage(message, this._messages()).subscribe({
      next: (response) => {
        this._messages.update((messages) => [
          ...messages,
          { id: createMessageId(), role: 'assistant', content: response, timestamp: Date.now() },
        ]);
        this._isLoading.set(false);
      },
      error: () => {
        this._error.set('Something went wrong. Please try again.');
        this._isLoading.set(false);
      },
    });
  }
}
