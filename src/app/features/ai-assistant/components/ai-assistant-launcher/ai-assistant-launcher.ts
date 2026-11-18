import { Component, inject } from '@angular/core';

import { AiAssistantService } from '../../services/ai-assistant.service';
import { ChatWindow } from '../chat-window/chat-window';

@Component({
  selector: 'app-ai-assistant-launcher',
  imports: [ChatWindow],
  template: `
    <div class="fixed bottom-6 right-6 z-[var(--z-index-modal)] flex flex-col items-end gap-3">
      @defer (when aiAssistantService.isOpen()) {
        @if (aiAssistantService.isOpen()) {
          <app-chat-window />
        }
      }

      <button
        type="button"
        (click)="aiAssistantService.toggle()"
        [attr.aria-label]="aiAssistantService.isOpen() ? 'Close AI assistant' : 'Ask about Mazhar'"
        class="flex size-14 items-center justify-center rounded-pill bg-accent text-h4 text-on-accent shadow-elevated transition-transform hover:scale-105"
      >
        <i [class]="aiAssistantService.isOpen() ? 'pi pi-times' : 'pi pi-comments'"></i>
      </button>
    </div>
  `,
})
export class AiAssistantLauncher {
  protected readonly aiAssistantService = inject(AiAssistantService);
}
