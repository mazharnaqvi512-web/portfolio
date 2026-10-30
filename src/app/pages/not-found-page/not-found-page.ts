import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <section
      class="mx-auto flex min-h-[60vh] max-w-content flex-col items-center justify-center gap-6 px-4 py-24 text-center"
    >
      <p class="text-caption uppercase tracking-wide text-text-muted">404</p>
      <h1 class="text-h2 font-semibold text-text-primary">Page not found</h1>
      <p class="max-w-md text-body text-text-secondary">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <nav class="flex flex-wrap justify-center gap-6 text-body font-medium">
        <a routerLink="/" class="text-accent hover:text-accent-hover">Go home</a>
        <a routerLink="/projects" class="text-accent hover:text-accent-hover">View projects</a>
        <a routerLink="/contact" class="text-accent hover:text-accent-hover">Contact me</a>
      </nav>
    </section>
  `,
})
export class NotFoundPage {}
