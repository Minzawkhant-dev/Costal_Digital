import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * Neither Next nor Vercel sets these by default, and the site has an admin area
 * behind a single password, so they are worth having on every route.
 *
 * There is deliberately no full Content-Security-Policy here. A strict one is
 * real work against Framer Motion's inline styles and would break the site
 * quietly rather than loudly. The one CSP directive included — `frame-ancestors`
 * — restricts framing only, so it cannot affect scripts or styles, and it is the
 * modern counterpart to X-Frame-Options. Both are sent: the older header still
 * covers clients that ignore CSP.
 */
const securityHeaders = [
  // Two years, subdomains included. `preload` is left off on purpose: getting
  // onto the preload list is easy and getting off it is slow, and it would bind
  // every future subdomain to HTTPS. Add it once the domain has settled.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  // Stop the browser second-guessing declared content types.
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Send the full URL same-origin, origin only cross-origin, nothing over
  // plain HTTP — so lead-form URLs never leak into a third party's logs.
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Nothing here should ever be framed; clickjacking the admin area is the
  // case that matters.
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'",
  },
  // The site asks for none of these. Denying them means an injected script
  // cannot ask on our behalf either.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework and version to a scanner.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
