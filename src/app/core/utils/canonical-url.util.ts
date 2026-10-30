/**
 * Canonical URL for a router path: query string and fragment dropped, and a
 * trailing slash added. The static host serves every prerendered page as
 * `/page/` and redirects `/page` to it, so that is the address that has to be
 * declared canonical (and listed in the sitemap), or every page would
 * advertise a URL that redirects.
 */
export function buildCanonicalUrl(baseUrl: string, routerUrl: string): string {
  const path = routerUrl.split(/[?#]/)[0];
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return `${baseUrl.replace(/\/$/, '')}${withSlash.startsWith('/') ? withSlash : `/${withSlash}`}`;
}
