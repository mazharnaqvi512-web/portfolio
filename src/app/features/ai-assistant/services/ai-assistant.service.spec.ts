import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';

import {
  AI_PROVIDER,
  type AiProvider,
  AiProviderError,
} from '../../../core/models/ai-provider.model';
import type { ChatMessage } from '../../../core/models/chat-message.model';
import { AiAssistantService } from './ai-assistant.service';

class FakeAiProvider implements AiProvider {
  response$ = new Subject<string>();
  lastMessage: string | null = null;
  lastHistory: readonly ChatMessage[] = [];
  shouldError = false;
  errorToThrow: Error | null = null;

  sendMessage(message: string, history: readonly ChatMessage[]): Observable<string> {
    this.lastMessage = message;
    this.lastHistory = history;
    if (this.shouldError) {
      return throwError(() => this.errorToThrow ?? new Error('provider failed'));
    }
    return of(`echo: ${message}`);
  }
}

describe('AiAssistantService', () => {
  let service: AiAssistantService;
  let provider: FakeAiProvider;

  beforeEach(() => {
    provider = new FakeAiProvider();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AI_PROVIDER, useValue: provider }],
    });
    service = TestBed.inject(AiAssistantService);
  });

  it('starts closed with no messages', () => {
    expect(service.isOpen()).toBe(false);
    expect(service.messages()).toEqual([]);
  });

  it('toggle() opens and closes the assistant', () => {
    service.toggle();
    expect(service.isOpen()).toBe(true);
    service.toggle();
    expect(service.isOpen()).toBe(false);
  });

  it('appends the user message immediately, then the provider response', () => {
    service.sendMessage('What is your experience?');

    expect(service.messages().length).toBe(2);
    expect(service.messages()[0].role).toBe('user');
    expect(service.messages()[0].content).toBe('What is your experience?');
    expect(service.messages()[1].role).toBe('assistant');
    expect(service.messages()[1].content).toBe('echo: What is your experience?');
    expect(service.isLoading()).toBe(false);
  });

  it('ignores blank or whitespace-only messages', () => {
    service.sendMessage('   ');
    expect(service.messages()).toEqual([]);
  });

  it('sets an error and stops loading when the provider fails', () => {
    provider.shouldError = true;
    service.sendMessage('trigger failure');

    expect(service.error()).not.toBeNull();
    expect(service.isLoading()).toBe(false);
  });

  it('shows the generic message for an unexpected provider error', () => {
    provider.shouldError = true;
    service.sendMessage('trigger failure');

    expect(service.error()).toBe('Something went wrong. Please try again.');
  });

  it("shows the provider's own wording when it fails with an AiProviderError", () => {
    provider.shouldError = true;
    provider.errorToThrow = new AiProviderError('The assistant is unavailable right now.');
    service.sendMessage('trigger failure');

    expect(service.error()).toBe('The assistant is unavailable right now.');
  });

  it('retry() resends the last user message', () => {
    service.sendMessage('first question');
    service.retry();

    expect(provider.lastMessage).toBe('first question');
    expect(service.messages().length).toBe(3);
  });

  it('clearConversation() resets messages and error state', () => {
    provider.shouldError = true;
    service.sendMessage('trigger failure');
    expect(service.error()).not.toBeNull();

    service.clearConversation();

    expect(service.messages()).toEqual([]);
    expect(service.error()).toBeNull();
  });
});
