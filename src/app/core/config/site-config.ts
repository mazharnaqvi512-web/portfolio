/**
 * Public origin of the deployed site, no trailing slash. Drives canonical
 * URLs, og:url, the sitemap and robots.txt (scripts/generate-sitemap.mjs reads
 * BASE_URL from this file). Provisional until the real hosting URL or custom
 * domain exists: change this one line, rebuild, and everything follows.
 */
const BASE_URL = 'https://syed-mazhar-hussain.netlify.app';

export const SITE_CONFIG = {
  baseUrl: BASE_URL,
  /** public/og-image.png — absolute because social crawlers need a full URL. */
  defaultOgImage: `${BASE_URL}/og-image.png`,
} as const;
