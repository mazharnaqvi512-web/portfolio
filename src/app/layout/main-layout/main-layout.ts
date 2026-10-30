import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { environment } from '../../../environments/environment';
import { AiAssistantLauncher } from '../../features/ai-assistant/components/ai-assistant-launcher/ai-assistant-launcher';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

/**
 * No <p-toast/> host yet — nothing triggers one until the Contact form /
 * error-state phases exist. Add it then, not preemptively (spec section 73:
 * don't load features the current page can't use yet).
 */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer, AiAssistantLauncher],
  template: `
    <div class="flex min-h-dvh flex-col bg-background text-text-primary">
      <app-header />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>
    @if (aiAssistantEnabled) {
      <app-ai-assistant-launcher />
    }
  `,
})
export class MainLayout {
  protected readonly aiAssistantEnabled = environment.featureFlags.aiAssistant;
}
