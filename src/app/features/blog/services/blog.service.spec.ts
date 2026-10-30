import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import { API_BASE_URL } from '../../../core/config/api-config';
import type { BlogPost } from '../../../core/models/blog-post.model';
import { BlogService } from './blog.service';

/** httpResource resolves asynchronously — wait for it to settle before asserting on its value. */
async function settle(): Promise<void> {
  TestBed.tick();
  await TestBed.inject(ApplicationRef).whenStable();
}

function makePost(slug: string, status: BlogPost['status']): BlogPost {
  return {
    id: `id-${slug}`,
    slug,
    title: `Title ${slug}`,
    excerpt: 'Excerpt',
    category: 'angular',
    tags: ['angular'],
    publishedAt: '2026-01-01',
    readingTime: 5,
    author: 'Syed Mazhar Hussain',
    featured: false,
    status,
    content: 'Body',
  };
}

describe('BlogService (static mode — no backend configured)', () => {
  it('falls back to the static (empty) source when no API base URL is configured', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(BlogService);

    expect(service.posts()).toEqual([]);
    expect(service.getBySlug('anything')).toBeUndefined();
  });
});

describe('BlogService (API mode — backend configured)', () => {
  // The blog flag ships off until the first article exists; these tests exercise the enabled path.
  const flags = environment.featureFlags as { blog: boolean };
  let originalBlogFlag: boolean;
  let service: BlogService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    originalBlogFlag = flags.blog;
    flags.blog = true;
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://api.test' },
      ],
    });
    service = TestBed.inject(BlogService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    flags.blog = originalBlogFlag;
    httpController.verify();
  });

  it('exposes nothing while the blog feature flag is off, even if the backend sends published posts', async () => {
    flags.blog = false;
    TestBed.tick();
    httpController.expectOne('http://api.test/api/blog').flush({
      data: [makePost('hello', 'published')],
      success: true,
      message: null,
      errors: null,
    });
    await settle();

    expect(service.posts()).toEqual([]);
    expect(service.getBySlug('hello')).toBeUndefined();
  });

  it('requests /api/blog and exposes the unwrapped posts once they arrive', async () => {
    TestBed.tick();
    const post = makePost('hello', 'published');
    httpController
      .expectOne('http://api.test/api/blog')
      .flush({ data: [post], success: true, message: null, errors: null });
    await settle();

    expect(service.posts()).toEqual([post]);
    expect(service.getBySlug('hello')).toEqual(post);
  });

  it('never exposes a draft or archived post, even if the backend sent one', async () => {
    TestBed.tick();
    httpController.expectOne('http://api.test/api/blog').flush({
      data: [makePost('live', 'published'), makePost('wip', 'draft'), makePost('old', 'archived')],
      success: true,
      message: null,
      errors: null,
    });
    await settle();

    expect(service.posts().map((post) => post.slug)).toEqual(['live']);
    expect(service.getBySlug('wip')).toBeUndefined();
    expect(service.getBySlug('old')).toBeUndefined();
  });

  it('degrades to the static fallback instead of throwing when the backend is down', async () => {
    TestBed.tick();
    httpController
      .expectOne('http://api.test/api/blog')
      .error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
    await settle();

    expect(() => service.posts()).not.toThrow();
    expect(service.posts()).toEqual([]);
  });
});
