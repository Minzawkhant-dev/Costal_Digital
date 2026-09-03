/**
 * Canonical site URL.
 *
 * Vercel exposes VERCEL_PROJECT_PRODUCTION_URL on every deployment, so previews
 * still resolve absolute URLs correctly. NEXT_PUBLIC_SITE_URL overrides it once
 * a custom domain is attached.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
