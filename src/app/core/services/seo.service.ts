import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { APP_CONFIG } from '../config/app-config';
import { SITE_CONFIG } from '../config/site-config';
import { SOCIAL_LINKS } from '../config/social-config';
import type {
  ArticleSeoOverride,
  SeoMeta,
  StructuredDataType,
  WorkSeoOverride,
} from '../models/seo-meta.model';
import { buildCanonicalUrl } from '../utils/canonical-url.util';

const WEBSITE_SCRIPT_ID = 'ld-json-website';
const ROUTE_SCRIPT_ID = 'ld-json-route';

/**
 * Reads `data.seo` off the activated route on every navigation and keeps
 * meta description, canonical link, OG/Twitter tags and JSON-LD structured
 * data in sync. Page <title> is left alone — Angular's native route `title`
 * already handles it (see app.routes.ts). The one exception is
 * updateForArticle(): a detail page whose entity resolves after navigation
 * (e.g. a specific blog post) calls it to override the generic per-route
 * title/description with the real entity's data.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.upsertWebsiteStructuredData();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.updateForCurrentRoute());
  }

  private updateForCurrentRoute(): void {
    const seo = this.leafRouteData();
    const canonicalUrl =
      seo.canonicalUrl ?? buildCanonicalUrl(SITE_CONFIG.baseUrl, this.router.url);
    const description = seo.description ?? APP_CONFIG.tagline;
    const ogImage = seo.ogImage ?? SITE_CONFIG.defaultOgImage;
    // The route's own title, not the document title: this runs on NavigationEnd, which can fire
    // before Angular's TitleStrategy has applied the new title, so getTitle() may still be the
    // previous page's. (The document title is only a fallback for routes without one.)
    const pageTitle = this.leafRoute()?.snapshot.title ?? this.title.getTitle();

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: seo.robots ?? 'index, follow' });

    // Cleared unconditionally: only updateForArticle() sets these, and a
    // route change must not leave a previous article's tags behind.
    this.clearArticleTags();
    this.updateSocialTags(pageTitle, description, canonicalUrl, 'website', ogImage);

    this.updateCanonicalLink(canonicalUrl);
    this.updateRouteStructuredData(seo, canonicalUrl, pageTitle, description);
  }

  /**
   * Called once a specific entity resolves (e.g. BlogPostPage once its post
   * loads) — overrides the generic per-route SEO set above with the real
   * title/description/dates a route's static `data.seo` can't know ahead of
   * time. Reuses the same canonical URL and JSON-LD script slot.
   */
  updateForArticle(article: ArticleSeoOverride): void {
    const canonicalUrl = buildCanonicalUrl(SITE_CONFIG.baseUrl, this.router.url);
    const pageTitle = `${article.title} | ${APP_CONFIG.name}`;
    const ogImage = article.ogImage ?? SITE_CONFIG.defaultOgImage;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: article.description });
    this.updateSocialTags(pageTitle, article.description, canonicalUrl, 'article', ogImage);

    this.meta.updateTag({ property: 'article:published_time', content: article.publishedAt });
    if (article.modifiedAt) {
      this.meta.updateTag({ property: 'article:modified_time', content: article.modifiedAt });
    } else {
      this.meta.removeTag('property="article:modified_time"');
    }
    this.meta.updateTag({ property: 'article:author', content: article.author });

    this.updateCanonicalLink(canonicalUrl);
    this.removeScript(ROUTE_SCRIPT_ID);
    this.appendScript(ROUTE_SCRIPT_ID, {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      url: canonicalUrl,
      datePublished: article.publishedAt,
      ...(article.modifiedAt ? { dateModified: article.modifiedAt } : {}),
      author: { '@type': 'Person', name: article.author },
    });
  }

  /**
   * Counterpart of updateForArticle() for project and case-study pages: a
   * route's static `data.seo` can't know which project is shown, so without
   * this every project page shares one title and description.
   */
  updateForWork(work: WorkSeoOverride): void {
    const canonicalUrl = buildCanonicalUrl(SITE_CONFIG.baseUrl, this.router.url);
    const pageTitle = `${work.title} | ${APP_CONFIG.name}`;
    const ogImage = work.ogImage ?? SITE_CONFIG.defaultOgImage;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: work.description });
    this.updateSocialTags(pageTitle, work.description, canonicalUrl, 'website', ogImage);
    this.updateCanonicalLink(canonicalUrl);
    this.updateRouteStructuredData(
      { structuredDataType: 'creative-work' },
      canonicalUrl,
      work.title,
      work.description,
    );
  }

  private updateSocialTags(
    title: string,
    description: string,
    url: string,
    ogType: 'website' | 'article',
    ogImage: string | undefined,
  ): void {
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: ogType });
    if (ogImage) {
      this.meta.updateTag({ property: 'og:image', content: ogImage });
    } else {
      this.meta.removeTag('property="og:image"');
    }

    this.meta.updateTag({
      name: 'twitter:card',
      content: ogImage ? 'summary_large_image' : 'summary',
    });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  private clearArticleTags(): void {
    this.meta.removeTag('property="article:published_time"');
    this.meta.removeTag('property="article:modified_time"');
    this.meta.removeTag('property="article:author"');
  }

  private leafRoute(): ActivatedRoute | null {
    let route = this.activatedRoute.firstChild;
    while (route?.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  private leafRouteData(): SeoMeta {
    return (this.leafRoute()?.snapshot.data['seo'] as SeoMeta | undefined) ?? {};
  }

  private updateCanonicalLink(canonicalUrl: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }

  private updateRouteStructuredData(
    seo: SeoMeta,
    url: string,
    pageTitle: string,
    description: string,
  ): void {
    this.removeScript(ROUTE_SCRIPT_ID);
    if (!seo.structuredDataType) {
      return;
    }
    const data = this.buildStructuredData(seo.structuredDataType, url, pageTitle, description);
    this.appendScript(ROUTE_SCRIPT_ID, data);
  }

  private buildStructuredData(
    type: StructuredDataType,
    url: string,
    pageTitle: string,
    description: string,
  ): Record<string, unknown> {
    switch (type) {
      case 'person':
        return {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: APP_CONFIG.name,
          jobTitle: APP_CONFIG.role,
          description: APP_CONFIG.tagline,
          url,
          sameAs: this.realSocialUrls(),
        };
      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: pageTitle,
          description,
          url,
          author: { '@type': 'Person', name: APP_CONFIG.name },
        };
      case 'creative-work':
        return {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: pageTitle,
          description,
          url,
          creator: { '@type': 'Person', name: APP_CONFIG.name },
        };
    }
  }

  private upsertWebsiteStructuredData(): void {
    this.removeScript(WEBSITE_SCRIPT_ID);
    this.appendScript(WEBSITE_SCRIPT_ID, {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: APP_CONFIG.name,
      url: SITE_CONFIG.baseUrl,
    });
  }

  private realSocialUrls(): string[] {
    // sameAs takes profile pages only — a mailto: address is not one.
    return SOCIAL_LINKS.map((link) => link.url).filter(
      (url) => url.startsWith('https://') && !url.includes('TODO_'),
    );
  }

  private appendScript(id: string, data: Record<string, unknown>): void {
    const script = this.document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  private removeScript(id: string): void {
    this.document.getElementById(id)?.remove();
  }
}
