import type { Metadata } from "next";
import { brand } from "@/lib/content";
import { siteUrl } from "@/lib/site";

/**
 * The generated social card, as a metadata image descriptor.
 *
 * `app/opengraph-image.tsx` is attached automatically only to pages that set no
 * `openGraph` of their own. The moment a page sets one — which every page here
 * does, so its card can carry its own title — the generated image stops being
 * inherited and the card renders blank. Naming the route explicitly keeps it on
 * every page; `metadataBase` in the root layout resolves it to an absolute URL.
 */
const socialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${brand.name} — ${brand.tagline}`,
};

/**
 * Per-page metadata.
 *
 * Open Graph fields do not inherit a page's `title`. Next inherits the whole
 * `openGraph` object from the layout, and only when a page sets none of it — so
 * pages that set just `title` and `description` all shared the site-wide card,
 * and every shared link looked identical.
 *
 * Building the title, the canonical and both social cards from one call keeps
 * them in step, and means a new page cannot quietly ship without a card.
 */
export function pageMetadata({
  title,
  description,
  path,
  ...overrides
}: {
  /** Page title, without the site name — the layout template appends that. */
  title: string;
  description: string;
  /** Route path, leading slash, no trailing slash. Empty string for home. */
  path: string;
} & Omit<Metadata, "title" | "description" | "alternates">): Metadata {
  // Social cards have no title template applied, so the site name is added here
  // to match what the <title> tag ends up as.
  const socialTitle = `${title} — ${brand.name}`;

  return {
    title,
    description,
    alternates: { canonical: path === "" ? "/" : path },
    openGraph: {
      type: "website",
      siteName: brand.name,
      title: socialTitle,
      description,
      url: `${siteUrl}${path}`,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage],
    },
    // Anything else a page needs (a `robots` directive, say) passes through and
    // wins over the defaults above.
    ...overrides,
  };
}
