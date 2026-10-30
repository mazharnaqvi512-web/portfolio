import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SectionHeader } from '../../../../shared/components/section-header/section-header';
import { BlogService } from '../../services/blog.service';
import { BlogCard } from '../../components/blog-card/blog-card';
import { BlogFilter, type BlogFilterValue } from '../../components/blog-filter/blog-filter';
import { BlogSearch } from '../../components/blog-search/blog-search';

const SEARCH_DEBOUNCE_MS = 250;

@Component({
  selector: 'app-blog-page',
  imports: [SectionHeader, EmptyState, BlogSearch, BlogFilter, BlogCard],
  template: `
    <section class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
      <app-section-header
        eyebrow="Blog"
        title="Writing on Angular, architecture and AI-assisted development"
        [level]="1"
      />

      <div class="mt-10">
        @if (hasPosts()) {
          <div class="mx-auto flex max-w-xl flex-col gap-4">
            <app-blog-search [(query)]="searchQuery" />
            <app-blog-filter [(selected)]="selectedCategory" />
          </div>

          <div class="mt-8">
            @if (filteredPosts().length) {
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                @for (post of filteredPosts(); track post.slug) {
                  <app-blog-card [post]="post" />
                }
              </div>
            } @else {
              <app-empty-state icon="pi pi-search" message="No articles match your search." />
            }
          </div>
        } @else {
          <app-empty-state
            icon="pi pi-book"
            message="Articles are being written and will be published here soon."
            actionLabel="Get in touch"
            actionRoute="/contact"
          />
        }
      </div>
    </section>
  `,
})
export class BlogPage {
  private readonly blogService = inject(BlogService);

  protected readonly hasPosts = computed(() => this.blogService.posts().length > 0);

  protected readonly searchQuery = signal('');
  protected readonly selectedCategory = signal<BlogFilterValue>('all');

  private readonly debouncedQuery = toSignal(
    toObservable(this.searchQuery).pipe(debounceTime(SEARCH_DEBOUNCE_MS)),
    {
      initialValue: '',
    },
  );

  protected readonly filteredPosts = computed(() => {
    const query = this.debouncedQuery().trim().toLowerCase();
    const category = this.selectedCategory();

    return this.blogService.posts().filter((post) => {
      const matchesCategory = category === 'all' || post.category === category;
      const matchesQuery =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  });
}
