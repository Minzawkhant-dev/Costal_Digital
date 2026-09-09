import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) are
      // covered by this and are deliberately allowed: being quotable in an AI
      // answer is a lead source for a studio nobody has heard of yet.
      userAgent: "*",
      allow: "/",
      // The dashboard and the write endpoint have no business in an index.
      disallow: ["/admin", "/admin/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
