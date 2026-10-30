import { Component } from '@angular/core';

@Component({
  selector: 'app-typing-indicator',
  template: `
    <div class="flex items-center gap-1 px-1 py-2" role="status" aria-label="Assistant is typing">
      <span class="size-1.5 animate-bounce rounded-pill bg-text-muted [animation-delay:0ms]"></span>
      <span
        class="size-1.5 animate-bounce rounded-pill bg-text-muted [animation-delay:150ms]"
      ></span>
      <span
        class="size-1.5 animate-bounce rounded-pill bg-text-muted [animation-delay:300ms]"
      ></span>
    </div>
  `,
})
export class TypingIndicator {}
