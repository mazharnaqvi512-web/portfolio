import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { type Observable, firstValueFrom } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api-config';
import { AiProviderError } from '../../../core/models/ai-provider.model';
import type { ChatMessage, ChatMessageRole } from '../../../core/models/chat-message.model';
import { ApiAiProvider } from './api-ai-provider';

const URL = 'http://api.test/api/ai/chat';

let counter = 0;
function turn(role: ChatMessageRole, content: string): ChatMessage {
  counter += 1;
  return { id: `m-${counter}`, role, content, timestamp: counter };
}

describe('ApiAiProvider', () => {
  let provider: ApiAiProvider;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test' },
        ApiAiProvider,
      ],
    });
    provider = TestBed.inject(ApiAiProvider);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  /** Subscribes, answers the pending request with `respond`, and returns how the call ended. */
  async function failureOf(call: Observable<string>, respond: () => void): Promise<unknown> {
    const outcome = firstValueFrom(call).then(
      () => {
        throw new Error('expected the call to fail');
      },
      (error: unknown) => error,
    );
    respond();
    return outcome;
  }

  it('posts the conversation to /api/ai/chat and returns the reply text', async () => {
    const answer = firstValueFrom(provider.sendMessage('Skills?', [turn('user', 'Skills?')]));

    const request = http.expectOne(URL);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ messages: [{ role: 'user', content: 'Skills?' }] });
    request.flush({
      data: { reply: 'Angular and TypeScript.' },
      success: true,
      message: null,
      errors: null,
    });

    expect(await answer).toBe('Angular and TypeScript.');
  });

  it('does not repeat the question that the service already put at the end of the history', () => {
    provider
      .sendMessage('Second', [
        turn('user', 'First'),
        turn('assistant', 'Reply'),
        turn('user', 'Second'),
      ])
      .subscribe();

    expect(http.expectOne(URL).request.body.messages).toEqual([
      { role: 'user', content: 'First' },
      { role: 'assistant', content: 'Reply' },
      { role: 'user', content: 'Second' },
    ]);
  });

  it('adds the question when the history does not end with it', () => {
    provider.sendMessage('Hello', []).subscribe();

    expect(http.expectOne(URL).request.body.messages).toEqual([{ role: 'user', content: 'Hello' }]);
  });

  it('sends only the latest 10 messages and always starts with the visitor', () => {
    const history: ChatMessage[] = [];
    for (let i = 1; i <= 7; i++) {
      history.push(turn('user', `q${i}`), turn('assistant', `a${i}`));
    }
    history.push(turn('user', 'last'));

    provider.sendMessage('last', history).subscribe();

    const sent = http.expectOne(URL).request.body.messages as { role: string; content: string }[];
    expect(sent.length).toBeLessThanOrEqual(10);
    expect(sent[0].role).toBe('user');
    expect(sent.at(-1)).toEqual({ role: 'user', content: 'last' });
  });

  it('cuts a long assistant reply to the length the backend accepts', () => {
    provider
      .sendMessage('More?', [
        turn('user', 'Q'),
        turn('assistant', 'x'.repeat(2500)),
        turn('user', 'More?'),
      ])
      .subscribe();

    const sent = http.expectOne(URL).request.body.messages as { content: string }[];
    expect(sent[1].content).toHaveLength(1000);
  });

  describe('failures', () => {
    const send = () => provider.sendMessage('Hi', [turn('user', 'Hi')]);
    const respondWith = (status: number, body: string | object) => () =>
      http.expectOne(URL).flush(body, { status, statusText: 'x' });

    it('says it cannot be reached when the network is down', async () => {
      const error = await failureOf(send(), () =>
        http.expectOne(URL).error(new ProgressEvent('error')),
      );

      expect(error).toBeInstanceOf(AiProviderError);
      expect((error as Error).message).toContain("can't reach the assistant");
    });

    it('asks for a shorter question on a 400', async () => {
      const error = await failureOf(
        send(),
        respondWith(400, { success: false, message: 'Validation failed' }),
      );

      expect(error).toBeInstanceOf(AiProviderError);
      expect((error as Error).message).toContain('shorter');
    });

    it('gives up with a friendly message when the backend never answers', async () => {
      vi.useFakeTimers();
      try {
        const error = await failureOf(send(), () => vi.advanceTimersByTime(75_001));

        expect(error).toBeInstanceOf(AiProviderError);
        expect((error as Error).message).toContain('taking too long');
        expect(http.expectOne(URL).cancelled).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });

    it('does not cut off a backend that answers slowly but within the limit', async () => {
      vi.useFakeTimers();
      try {
        const answer = firstValueFrom(send());
        vi.advanceTimersByTime(60_000);
        http
          .expectOne(URL)
          .flush({ data: { reply: 'Slow but fine.' }, success: true, message: null, errors: null });

        expect(await answer).toBe('Slow but fine.');
      } finally {
        vi.useRealTimers();
      }
    });

    it("shows the backend's own wording for a 429", async () => {
      const error = await failureOf(
        send(),
        respondWith(429, { success: false, message: 'The assistant has reached its daily limit.' }),
      );

      expect(error).toBeInstanceOf(AiProviderError);
      expect((error as Error).message).toBe('The assistant has reached its daily limit.');
    });

    it('falls back to its own wording for a 429 with no readable message', async () => {
      const error = await failureOf(send(), respondWith(429, 'Too Many Requests'));

      expect(error).toBeInstanceOf(AiProviderError);
      expect((error as Error).message).toContain('wait a few minutes');
    });

    it('says the assistant is unavailable on a 503 (no API key on the server)', async () => {
      const error = await failureOf(
        send(),
        respondWith(503, {
          success: false,
          message: 'The AI assistant is not configured on this server.',
        }),
      );

      expect(error).toBeInstanceOf(AiProviderError);
      expect((error as Error).message).toBe('The AI assistant is not configured on this server.');
    });

    it('says it is unavailable on a 502 and never shows backend internals', async () => {
      const error = await failureOf(send(), respondWith(502, 'upstream exploded: stack trace'));

      expect(error).toBeInstanceOf(AiProviderError);
      expect((error as Error).message).toContain('unavailable');
      expect((error as Error).message).not.toContain('stack trace');
    });

    it('passes any other error through, to be shown as the generic message', async () => {
      const error = await failureOf(send(), respondWith(500, 'boom'));

      expect(error).toBeInstanceOf(HttpErrorResponse);
      expect(error).not.toBeInstanceOf(AiProviderError);
    });
  });
});
