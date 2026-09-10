/**
 * Canonical site URL.
 *
 * `NEXT_PUBLIC_SITE_URL` wins everywhere and is the one thing to set once a
 * custom domain is attached. Each host then has its own fallback, so a
 * deployment made without it still resolves absolute URLs to itself:
 *
 *   - Vercel exposes `VERCEL_PROJECT_PRODUCTION_URL`, a bare host.
 *   - Netlify exposes `URL`, already a full origin. It is gated behind
 *     `NETLIFY` because `URL` is a generic enough name to be set by something
 *     else entirely.
 *
 * Getting this wrong is quiet and expensive. `siteUrl` is the canonical tag on
 * every page, the sitemap, `robots.txt`, the Open Graph image and the `@id` of
 * every structured data block — so a wrong value does not break the site, it
 * tells search engines the whole thing lives somewhere it does not.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined) ??
  (process.env.NETLIFY ? process.env.URL : undefined) ??
  "http://localhost:3000";
