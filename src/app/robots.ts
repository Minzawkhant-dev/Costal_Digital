import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The dashboard and the write endpoint have no business in an index.
      disallow: ["/admin", "/admin/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
