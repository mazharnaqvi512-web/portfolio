import { Component, input } from '@angular/core';

import type { ChatMessage } from '../../../../core/models/chat-message.model';

@Component({
  selector: 'app-chat-message',
  template: `
    <div class="flex" [class]="message().role === 'user' ? 'justify-end' : 'justify-start'">
      <p
        class="max-w-[85%] whitespace-pre-line rounded-md px-3 py-2 text-small"
        [class]="
          message().role === 'user' ? 'bg-accent text-white' : 'bg-surface-hover text-text-primary'
        "
      >
        {{ message().content }}
      </p>
    </div>
  `,
})
export class ChatMessageComponent {
  readonly message = input.required<ChatMessage>();
}
