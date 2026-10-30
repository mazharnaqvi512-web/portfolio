/**
 * Runs after `ng build` (see the "build" script in package.json). Adds the
 * files a static host needs that Angular does not generate:
 *   - sitemap.xml  built from the pages that were actually prerendered
 *   - robots.txt   pointing at that sitemap
 *   - 404.html     a copy of the client-side shell, so unknown URLs boot the
 *                  app, which renders its own Not Found page (hosts serve
 *                  404.html with a 404 status)
 * The site origin is read from BASE_URL in src/app/core/config/site-config.ts,
 * so there is one place to change when the domain does.
 */
import { copyFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'dist', 'my-app-21', 'browser');

/**
 * Prerendered list pages that are empty until the first entry exists. They are
 * left out of the sitemap so search engines are not pointed at empty pages.
 * Remove an entry once that section has real content.
 */
const EXCLUDED_FROM_SITEMAP = new Set(['/blog', '/case-studies']);

const siteConfig = readFileSync(join(root, 'src', 'app', 'core', 'config', 'site-config.ts'), 'utf8');
const baseUrl = /const BASE_URL = '([^']+)'/.exec(siteConfig)?.[1]?.replace(/\/$/, '');
if (!baseUrl) {
  throw new Error('postbuild: could not read BASE_URL from site-config.ts');
}

if (!existsSync(outDir)) {
  throw new Error(`postbuild: ${outDir} does not exist — run the Angular build first`);
}

/** Every prerendered page is a directory (or the root) holding an index.html. */
function findPages(dir) {
  const pages = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      pages.push(...findPages(full));
    } else if (entry === 'index.html') {
      const route = '/' + relative(outDir, dirname(full)).split(sep).filter(Boolean).join('/');
      pages.push(route);
    }
  }
  return pages;
}

const routes = findPages(outDir)
  .filter((route) => !EXCLUDED_FROM_SITEMAP.has(route))
  .sort((a, b) => a.length - b.length || a.localeCompare(b));

const lastmod = new Date().toISOString().slice(0, 10);
const urls = routes
  .map((route) => `  <url>\n    <loc>${baseUrl}${route === '/' ? '/' : `${route}/`}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
  .join('\n');

writeFileSync(
  join(outDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
writeFileSync(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`);
copyFileSync(join(outDir, 'index.csr.html'), join(outDir, '404.html'));

console.log(`postbuild: sitemap.xml (${routes.length} URLs), robots.txt, 404.html written for ${baseUrl}`);
