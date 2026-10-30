/** Read by SeoService (core/services/seo.service.ts) off each route's `data.seo`. */
export type StructuredDataType = 'person' | 'article' | 'creative-work';

export interface SeoMeta {
  readonly title?: string;
  readonly description?: string;
  readonly canonicalUrl?: string;
  readonly robots?: string;
  readonly ogImage?: string;
  readonly structuredDataType?: StructuredDataType;
}

/**
 * Passed to SeoService.updateForWork() once a specific project or case study
 * resolves, for the same reason as ArticleSeoOverride below.
 */
export interface WorkSeoOverride {
  readonly title: string;
  readonly description: string;
  readonly ogImage?: string;
}

/**
 * Passed to SeoService.updateForArticle() once a specific entity (e.g. a
 * blog post) resolves — the generic per-route `SeoMeta` above can't know an
 * entity's real title/description/dates ahead of time.
 */
export interface ArticleSeoOverride {
  readonly title: string;
  readonly description: string;
  readonly publishedAt: string;
  readonly modifiedAt?: string;
  readonly author: string;
  readonly ogImage?: string;
}
