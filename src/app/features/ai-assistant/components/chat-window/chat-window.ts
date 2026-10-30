import { Component, ElementRef, afterRenderEffect, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AiAssistantService } from '../../services/ai-assistant.service';
import { ChatMessageComponent } from '../chat-message/chat-message';
import { SuggestedPrompts } from '../suggested-prompts/suggested-prompts';
import { TypingIndicator } from '../typing-indicator/typing-indicator';

@Component({
  selector: 'app-chat-window',
  imports: [FormsModule, ChatMessageComponent, SuggestedPrompts, TypingIndicator],
  template: `
    <div
      class="flex h-[32rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-card border border-border bg-surface-elevated shadow-elevated"
    >
      <header class="flex items-center justify-between border-b border-border px-4 py-3">
        <p class="text-small font-semibold text-text-primary">Ask about Mazhar</p>
        <div class="flex items-center gap-3">
          @if (aiAssistantService.messages().length) {
            <button
              type="button"
              (click)="aiAssistantService.clearConversation()"
              aria-label="Clear conversation"
              class="text-text-muted hover:text-text-primary"
            >
              <i class="pi pi-refresh"></i>
            </button>
          }
          <button
            type="button"
            (click)="aiAssistantService.close()"
            aria-label="Close assistant"
            class="text-text-muted hover:text-text-primary"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
      </header>

      <div #scrollContainer class="flex-1 overflow-y-auto px-4 py-4">
        @if (!aiAssistantService.messages().length) {
          <app-suggested-prompts (selected)="send($event)" />
        } @else {
          <div class="flex flex-col gap-3">
            @for (message of aiAssistantService.messages(); track message.id) {
              <app-chat-message [message]="message" />
            }
            @if (aiAssistantService.isLoading()) {
              <app-typing-indicator />
            }
          </div>
        }

        @if (aiAssistantService.error(); as error) {
          <div
            class="mt-3 flex flex-col items-start gap-2 rounded-md border border-border bg-surface p-3 text-small text-text-secondary"
          >
            <p>{{ error }}</p>
            <button
              type="button"
              (click)="aiAssistantService.retry()"
              class="font-medium text-accent hover:text-accent-hover"
            >
              Retry
            </button>
          </div>
        }
      </div>

      <form (ngSubmit)="submit()" class="flex items-center gap-2 border-t border-border p-3">
        <input
          type="text"
          [(ngModel)]="draft"
          name="message"
          placeholder="Ask a question..."
          aria-label="Message"
          [disabled]="aiAssistantService.isLoading()"
          class="flex-1 rounded-pill border border-border bg-background px-3 py-2 text-small text-text-primary focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          [disabled]="aiAssistantService.isLoading() || !draft.trim()"
          aria-label="Send message"
          class="flex size-9 shrink-0 items-center justify-center rounded-pill bg-accent text-white disabled:opacity-50"
        >
          <i class="pi pi-send"></i>
        </button>
      </form>
    </div>
  `,
})
export class ChatWindow {
  protected readonly aiAssistantService = inject(AiAssistantService);
  protected draft = '';

  private readonly scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  constructor() {
    afterRenderEffect(() => {
      this.aiAssistantService.messages();
      this.aiAssistantService.isLoading();
      const element = this.scrollContainer()?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }

  protected send(text: string): void {
    this.aiAssistantService.sendMessage(text);
  }

  protected submit(): void {
    if (!this.draft.trim()) {
      return;
    }
    this.aiAssistantService.sendMessage(this.draft);
    this.draft = '';
  }
}
