import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { BlogPost } from '../../../../core/models/blog-post.model';

@Component({
  selector: 'app-blog-card',
  imports: [RouterLink],
  template: `
    <article
      class="flex flex-col gap-3 rounded-card border border-border bg-surface p-6 transition-shadow hover:shadow-card"
    >
      <div class="flex items-center gap-2 text-caption text-text-muted">
        <span class="rounded-pill bg-accent-subtle px-2.5 py-1 font-medium text-accent">{{
          post().category
        }}</span>
        <span>{{ post().readingTime }} min read</span>
      </div>
      <h2 class="text-h4 font-semibold text-text-primary">{{ post().title }}</h2>
      <p class="text-small text-text-secondary">{{ post().excerpt }}</p>
      <a
        [routerLink]="['/blog', post().slug]"
        class="mt-auto text-small font-medium text-accent hover:text-accent-hover"
      >
        Read article →
      </a>
    </article>
  `,
})
export class BlogCard {
  readonly post = input.required<BlogPost>();
}
