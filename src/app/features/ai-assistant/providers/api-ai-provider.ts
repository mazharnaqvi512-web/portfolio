import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type Observable, catchError, map, throwError } from 'rxjs';

import { API_BASE_URL } from '../../../core/config/api-config';
import { type AiProvider, AiProviderError } from '../../../core/models/ai-provider.model';
import type { ApiResponse } from '../../../core/models/api-response.model';
import type { ChatMessage, ChatMessageRole } from '../../../core/models/chat-message.model';

/** The backend rejects anything beyond these (see ChatRequest in portfolio-api), so stay inside them. */
const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 1000;

interface ChatTurn {
  readonly role: ChatMessageRole;
  readonly content: string;
}

interface ChatReply {
  readonly reply: string;
}

/**
 * Answers through the backend's POST /api/ai/chat. Used when `apiBaseUrl` is set; without a
 * backend the app keeps using MockAiProvider (see selectAiProvider). There is deliberately no
 * silent fallback to the mock when the call fails: canned answers would pass for the real
 * assistant, so the visitor is told it is unavailable instead.
 */
@Injectable()
export class ApiAiProvider implements AiProvider {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  sendMessage(message: string, history: readonly ChatMessage[]): Observable<string> {
    return this.http
      .post<ApiResponse<ChatReply>>(`${this.apiBaseUrl}/api/ai/chat`, {
        messages: this.buildTurns(message, history),
      })
      .pipe(
        map((response) => response.data.reply),
        catchError((error: unknown) => throwError(() => toProviderError(error))),
      );
  }

  /**
   * AiAssistantService has already put the new question at the end of `history`, so only add it
   * when it is missing. The backend needs the conversation to start and end with the visitor, to
   * hold at most 10 messages and to keep each under 1000 characters (a long assistant reply is
   * cut; the visitor's own text is already capped by the input).
   */
  private buildTurns(message: string, history: readonly ChatMessage[]): ChatTurn[] {
    const turns: ChatTurn[] = history.map(({ role, content }) => ({ role, content }));
    const last = turns.at(-1);
    if (last?.role !== 'user' || last.content !== message) {
      turns.push({ role: 'user', content: message });
    }

    let recent = turns.slice(-MAX_MESSAGES);
    while (recent.length > 1 && recent[0].role !== 'user') {
      recent = recent.slice(1);
    }
    return recent.map(({ role, content }) => ({
      role,
      content: content.slice(0, MAX_MESSAGE_LENGTH),
    }));
  }
}

function toProviderError(error: unknown): Error {
  if (!(error instanceof HttpErrorResponse)) {
    return error instanceof Error ? error : new Error('Unknown error');
  }
  // The backend's own 429/503 messages are written for visitors; the other statuses get fixed copy.
  const serverMessage = (error.error as Partial<ApiResponse<unknown>> | null)?.message;
  const fromServer = typeof serverMessage === 'string' && serverMessage ? serverMessage : null;

  switch (error.status) {
    case 0:
      return new AiProviderError(
        "I can't reach the assistant right now. Please check your connection and try again.",
      );
    case 400:
      return new AiProviderError("That message couldn't be sent. Try a shorter question.");
    case 429:
      return new AiProviderError(
        fromServer ??
          "You've asked a lot of questions in a short time. Please wait a few minutes and try again.",
      );
    case 502:
    case 503:
      return new AiProviderError(
        fromServer ?? 'The assistant is unavailable right now. Please try again later.',
      );
    default:
      return error;
  }
}
