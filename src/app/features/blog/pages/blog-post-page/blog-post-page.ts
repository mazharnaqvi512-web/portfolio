import { Component, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import type { BlogPost } from '../../../../core/models/blog-post.model';
import type { Project } from '../../../../core/models/project.model';
import { SeoService } from '../../../../core/services/seo.service';
import { findRelatedByTags } from '../../../../core/utils/related-content.util';
import { ProjectsService } from '../../../projects/services/projects.service';
import { BlogService } from '../../services/blog.service';
import { parseContentSections } from './content-section-parser.util';

const RELATED_LIMIT = 3;

@Component({
  selector: 'app-blog-post-page',
  imports: [RouterLink],
  template: `
    @if (post(); as post) {
      <article class="mx-auto max-w-content px-4 py-16 md:px-6 lg:px-8">
        <header class="mx-auto max-w-2xl text-center">
          <p class="text-caption font-semibold uppercase tracking-wide text-accent">
            {{ post.category }}
          </p>
          <h1 class="mt-2 text-h1 font-bold text-text-primary">{{ post.title }}</h1>
          <p class="mt-4 text-small text-text-muted">
            {{ post.author }} · {{ post.publishedAt }}
            @if (post.updatedAt) {
              (updated {{ post.updatedAt }})
            }
            · {{ post.readingTime }} min read
          </p>

          <button
            type="button"
            (click)="share(post)"
            class="mt-4 text-small font-medium text-accent hover:text-accent-hover"
          >
            @if (shareState() === 'copied') {
              Link copied!
            } @else {
              Share this article
            }
          </button>
        </header>

        @if (sections().length > 1) {
          <nav
            class="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2"
            aria-label="Table of contents"
          >
            @for (section of sections(); track section.id) {
              @if (section.title) {
                <a
                  [href]="'#' + section.id"
                  class="text-small font-medium text-accent hover:text-accent-hover"
                  >{{ section.title }}</a
                >
              }
            }
          </nav>
        }

        <div class="mx-auto mt-12 flex max-w-2xl flex-col gap-8">
          @for (section of sections(); track section.id) {
            <section [id]="section.id">
              @if (section.title) {
                <h2 class="text-h4 font-semibold text-text-primary">{{ section.title }}</h2>
              }
              <p class="mt-3 whitespace-pre-line text-body text-text-secondary">
                {{ section.body }}
              </p>
            </section>
          }
        </div>

        @if (post.tags.length) {
          <div class="mx-auto mt-10 flex max-w-2xl flex-wrap gap-2">
            @for (tag of post.tags; track tag) {
              <span
                class="rounded-pill border border-border px-3 py-1 text-caption text-text-secondary"
                >#{{ tag }}</span
              >
            }
          </div>
        }

        @if (relatedPosts().length) {
          <div class="mx-auto mt-16 max-w-2xl">
            <h2 class="text-h4 font-semibold text-text-primary">Related Articles</h2>
            <div class="mt-4 flex flex-col gap-2">
              @for (related of relatedPosts(); track related.slug) {
                <a
                  [routerLink]="['/blog', related.slug]"
                  class="text-body font-medium text-accent hover:text-accent-hover"
                >
                  {{ related.title }} →
                </a>
              }
            </div>
          </div>
        }

        @if (relatedProjects().length) {
          <div class="mx-auto mt-10 max-w-2xl">
            <h2 class="text-h4 font-semibold text-text-primary">Related Projects</h2>
            <div class="mt-4 flex flex-col gap-2">
              @for (related of relatedProjects(); track related.slug) {
                <a
                  [routerLink]="['/projects', related.slug]"
                  class="text-body font-medium text-accent hover:text-accent-hover"
                >
                  {{ related.name }} →
                </a>
              }
            </div>
          </div>
        }

        <nav class="mx-auto mt-10 flex max-w-2xl justify-between text-small font-medium">
          @if (previousPost(); as previous) {
            <a [routerLink]="['/blog', previous.slug]" class="text-accent hover:text-accent-hover"
              >← {{ previous.title }}</a
            >
          } @else {
            <span></span>
          }
          @if (nextPost(); as next) {
            <a [routerLink]="['/blog', next.slug]" class="text-accent hover:text-accent-hover"
              >{{ next.title }} →</a
            >
          }
        </nav>

        <div
          class="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-4 rounded-card border border-border bg-surface p-10 text-center"
        >
          <p class="text-body-lg font-semibold text-text-primary">Have a project in mind?</p>
          <a routerLink="/contact" class="text-body font-medium text-accent hover:text-accent-hover"
            >Let's talk →</a
          >
        </div>
      </article>
    } @else {
      <div class="mx-auto flex max-w-content flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 class="text-h2 font-semibold text-text-primary">Article not found</h1>
        <a routerLink="/blog" class="text-body font-medium text-accent hover:text-accent-hover"
          >← Back to blog</a
        >
      </div>
    }
  `,
})
export class BlogPostPage {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);
  private readonly projectsService = inject(ProjectsService);
  private readonly seoService = inject(SeoService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly shareState = signal<'idle' | 'copied'>('idle');

  /** Read inside computed() (not an RxJS map) so the page also updates when API data arrives after navigation. */
  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    {
      initialValue: '',
    },
  );

  protected readonly post = computed<BlogPost | undefined>(() =>
    this.blogService.getBySlug(this.slug()),
  );

  constructor() {
    effect(() => {
      const post = this.post();
      if (!post) {
        return;
      }
      this.seoService.updateForArticle({
        title: post.title,
        description: post.excerpt,
        publishedAt: post.publishedAt,
        modifiedAt: post.updatedAt,
        author: post.author,
        ogImage: post.coverImage,
      });
    });
  }

  protected readonly sections = computed(() =>
    this.post() ? parseContentSections(this.post()!.content) : [],
  );

  protected readonly relatedPosts = computed(() => {
    const current = this.post();
    if (!current) {
      return [];
    }
    const otherPosts = this.blogService.posts().filter((post) => post.slug !== current.slug);
    return findRelatedByTags(
      otherPosts,
      [...current.tags, current.category],
      (post) => [...post.tags, post.category],
      RELATED_LIMIT,
    );
  });

  protected readonly relatedProjects = computed<readonly Project[]>(() => {
    const current = this.post();
    if (!current) {
      return [];
    }
    return findRelatedByTags(
      this.projectsService.projects(),
      current.tags,
      (project) => project.technologyStack,
      RELATED_LIMIT,
    );
  });

  private readonly adjacentPosts = computed(() => {
    const current = this.post();
    const all = this.blogService.posts();
    const index = current ? all.findIndex((post) => post.slug === current.slug) : -1;
    return { all, index };
  });

  protected readonly previousPost = computed<BlogPost | undefined>(() => {
    const { all, index } = this.adjacentPosts();
    return index > 0 ? all[index - 1] : undefined;
  });

  protected readonly nextPost = computed<BlogPost | undefined>(() => {
    const { all, index } = this.adjacentPosts();
    return index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;
  });

  protected async share(post: BlogPost): Promise<void> {
    if (!this.isBrowser) {
      return;
    }
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: post.title, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    this.shareState.set('copied');
    setTimeout(() => this.shareState.set('idle'), 2000);
  }
}
