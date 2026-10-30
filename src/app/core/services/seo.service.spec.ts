import { DOCUMENT } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';

import { SeoService } from './seo.service';

@Component({ template: '' })
class BlankPage {}

describe('SeoService', () => {
  let service: SeoService;
  let meta: Meta;
  let title: Title;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
    title = TestBed.inject(Title);
    document = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    document.getElementById('ld-json-route')?.remove();
    document.getElementById('ld-json-website')?.remove();
  });

  it('sets the document title to the article title with the site suffix', () => {
    service.updateForArticle({
      title: 'A Real Article',
      description: 'A real description.',
      publishedAt: '2026-01-01',
      author: 'Syed Mazhar Hussain',
    });

    expect(title.getTitle()).toBe('A Real Article | Syed Mazhar Hussain');
  });

  it('sets og:type to article and includes article:published_time / article:author', () => {
    service.updateForArticle({
      title: 'A Real Article',
      description: 'A real description.',
      publishedAt: '2026-01-01',
      author: 'Syed Mazhar Hussain',
    });

    expect(meta.getTag('property="og:type"')?.content).toBe('article');
    expect(meta.getTag('property="article:published_time"')?.content).toBe('2026-01-01');
    expect(meta.getTag('property="article:author"')?.content).toBe('Syed Mazhar Hussain');
    expect(meta.getTag('property="article:modified_time"')).toBeNull();
  });

  it('includes article:modified_time only when a modifiedAt is given', () => {
    service.updateForArticle({
      title: 'A Real Article',
      description: 'A real description.',
      publishedAt: '2026-01-01',
      modifiedAt: '2026-02-01',
      author: 'Syed Mazhar Hussain',
    });

    expect(meta.getTag('property="article:modified_time"')?.content).toBe('2026-02-01');
  });

  it('writes an Article JSON-LD script with the real headline, dates and author', () => {
    service.updateForArticle({
      title: 'A Real Article',
      description: 'A real description.',
      publishedAt: '2026-01-01',
      modifiedAt: '2026-02-01',
      author: 'Syed Mazhar Hussain',
    });

    const script = document.getElementById('ld-json-route') as HTMLScriptElement | null;
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.text);
    expect(data['@type']).toBe('Article');
    expect(data.headline).toBe('A Real Article');
    expect(data.datePublished).toBe('2026-01-01');
    expect(data.dateModified).toBe('2026-02-01');
    expect(data.author).toEqual({ '@type': 'Person', name: 'Syed Mazhar Hussain' });
  });

  it('updateForWork gives a project its own title, description, canonical and CreativeWork data', () => {
    service.updateForWork({ title: 'Meal Dynamics', description: 'A food service platform.' });

    expect(title.getTitle()).toBe('Meal Dynamics | Syed Mazhar Hussain');
    expect(meta.getTag('name="description"')?.content).toBe('A food service platform.');
    expect(meta.getTag('property="og:title"')?.content).toBe('Meal Dynamics | Syed Mazhar Hussain');
    expect(meta.getTag('property="og:type"')?.content).toBe('website');
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toMatch(
      /\/$/,
    );

    const data = JSON.parse((document.getElementById('ld-json-route') as HTMLScriptElement).text);
    expect(data['@type']).toBe('CreativeWork');
    expect(data.name).toBe('Meal Dynamics');
    expect(data.description).toBe('A food service platform.');
  });
});

describe('SeoService (per-route metadata)', () => {
  let router: Router;
  let meta: Meta;

  const content = (selector: string) => meta.getTag(selector)?.content;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: '',
            component: BlankPage,
            title: 'Home Title',
            data: { seo: { description: 'Home description' } },
          },
          {
            path: 'about',
            component: BlankPage,
            title: 'About | Site',
            data: { seo: { description: 'About description' } },
          },
          {
            path: 'resume',
            component: BlankPage,
            title: 'Resume | Site',
            data: { seo: { description: 'Resume description' } },
          },
          { path: 'untitled', component: BlankPage },
        ]),
      ],
    });
    meta = TestBed.inject(Meta);
    router = TestBed.inject(Router);
    TestBed.inject(SeoService);
  });

  afterEach(() => {
    const doc = TestBed.inject(DOCUMENT);
    doc.getElementById('ld-json-route')?.remove();
    doc.getElementById('ld-json-website')?.remove();
  });

  it('uses the page’s own route title for og:title and twitter:title', async () => {
    await router.navigateByUrl('/about');

    expect(content('property="og:title"')).toBe('About | Site');
    expect(content('name="twitter:title"')).toBe('About | Site');
    expect(content('property="og:description"')).toBe('About description');
  });

  it('does not carry the previous page’s title over after navigating on', async () => {
    await router.navigateByUrl('/about');
    await router.navigateByUrl('/resume');

    expect(content('property="og:title"')).toBe('Resume | Site');
  });

  it('falls back to the document title for a route without a title', async () => {
    TestBed.inject(DOCUMENT).title = 'Fallback Title';
    await router.navigateByUrl('/untitled');

    expect(content('property="og:title"')).toBe('Fallback Title');
  });

  it('sets og:url and the canonical link from the slash-terminated address', async () => {
    await router.navigateByUrl('/about');

    expect(content('property="og:url"')).toMatch(/\/about\/$/);
    expect(
      TestBed.inject(DOCUMENT).head.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toMatch(/\/about\/$/);
  });
});
