import { buildCanonicalUrl } from './canonical-url.util';

describe('buildCanonicalUrl', () => {
  const base = 'https://example.test';

  it('keeps the root as a single slash', () => {
    expect(buildCanonicalUrl(base, '/')).toBe('https://example.test/');
  });

  it('adds the trailing slash the static host serves pages under', () => {
    expect(buildCanonicalUrl(base, '/about')).toBe('https://example.test/about/');
    expect(buildCanonicalUrl(base, '/projects/meal-dynamics')).toBe(
      'https://example.test/projects/meal-dynamics/',
    );
  });

  it('does not double an existing trailing slash', () => {
    expect(buildCanonicalUrl(base, '/about/')).toBe('https://example.test/about/');
  });

  it('drops the query string and fragment', () => {
    expect(buildCanonicalUrl(base, '/projects?filter=ai')).toBe('https://example.test/projects/');
    expect(buildCanonicalUrl(base, '/skills#frontend')).toBe('https://example.test/skills/');
    expect(buildCanonicalUrl(base, '/?utm_source=x')).toBe('https://example.test/');
  });

  it('tolerates a base URL with a trailing slash', () => {
    expect(buildCanonicalUrl('https://example.test/', '/about')).toBe(
      'https://example.test/about/',
    );
  });
});
