/** The 10 categories from spec section 31. */
export type BlogCategory =
  | 'angular'
  | 'typescript'
  | 'rxjs'
  | 'frontend-architecture'
  | 'performance'
  | 'ai'
  | 'java'
  | 'spring-boot'
  | 'career'
  | 'software-engineering';

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: BlogCategory;
  readonly tags: readonly string[];
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly readingTime: number;
  readonly author: string;
  readonly coverImage?: string;
  readonly featured: boolean;
  readonly status: BlogPostStatus;
  /** Plain text/markdown for now — a renderer is worth adding once real articles exist. */
  readonly content: string;
}
