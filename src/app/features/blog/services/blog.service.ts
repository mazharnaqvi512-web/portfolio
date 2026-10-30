import { httpResource } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { API_BASE_URL } from '../../../core/config/api-config';
import type { ApiResponse } from '../../../core/models/api-response.model';
import type { BlogPost } from '../../../core/models/blog-post.model';
import { StaticContentRepository } from '../../../core/repositories/content-repository';
import { BLOG_POSTS } from '../data/blog-posts.data';

/**
 * Same migration pattern as ProjectsService (spec section 71): static by
 * default, switching to portfolio-api's /api/blog when API_BASE_URL is set,
 * with components unchanged either way. Components never import
 * blog-posts.data.ts directly.
 *
 * `posts` is published-only and respects the `blog` feature flag (spec
 * section 52): when off, it behaves as if there were no posts at all, so a
 * direct /blog/:slug visit is the same honest-empty as the nav being hidden.
 * The server already withholds drafts; filtering here too means static data
 * can't leak one either, and a misbehaving backend can't expose one.
 *
 * `posts` must be read reactively (never captured as a one-time snapshot) so
 * pages update once the API response arrives.
 */
@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly repository = new StaticContentRepository<BlogPost>(
    BLOG_POSTS,
    (post) => post.slug,
  );
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private readonly apiResource = this.apiBaseUrl
    ? httpResource<ApiResponse<BlogPost[]>>(() => `${this.apiBaseUrl}/api/blog`)
    : null;

  /** hasValue(), not value(): reading value() in an error state throws — loading and failed requests fall back to the static data instead. */
  readonly posts = computed<readonly BlogPost[]>(() => {
    if (!environment.featureFlags.blog) {
      return [];
    }
    const apiResource = this.apiResource;
    const source = apiResource?.hasValue() ? apiResource.value().data : this.repository.getAll();
    return source.filter((post) => post.status === 'published');
  });

  getBySlug(slug: string): BlogPost | undefined {
    return this.posts().find((post) => post.slug === slug);
  }
}
