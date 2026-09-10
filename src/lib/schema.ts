import { brand, location, socials, type Service } from "@/lib/content";
import { siteUrl } from "@/lib/site";

/**
 * Schema.org structured data.
 *
 * Search engines use it for rich results; answer engines (AI Overviews,
 * Perplexity, ChatGPT search) use it to work out what this business *is* before
 * they will cite it. Only the FAQ page carried any, so the studio itself was
 * not a described entity anywhere on the site.
 *
 * One deliberate omission, waiting on information rather than code:
 * `LocalBusiness` / `ProfessionalService` rather than `Organization` would be
 * the stronger type, but both are expected to carry a postal address and service
 * area. Publishing one without an address is worse than publishing none, so this
 * stays `Organization` until the studio's location is settled — see `location`
 * in content.ts, which upgrades the type the moment it is filled in.
 */

/** Stable @id so every block refers to one entity rather than several. */
const ORG_ID = `${siteUrl}/#organization`;
const SITE_ID = `${siteUrl}/#website`;

/**
 * `sameAs` is how an answer engine confirms this is the same business it has
 * seen elsewhere, so a wrong link is worse than a missing one. The links in
 * `content.ts` are still bare platform domains, so anything without a path is
 * dropped — fill in real profile URLs and they start appearing automatically.
 */
function realSocialProfiles(): string[] {
  return socials
    .map((social) => social.href)
    .filter((href) => {
      try {
        return new URL(href).pathname.replace(/\/+$/, "").length > 0;
      } catch {
        return false;
      }
    });
}

/**
 * The studio as an entity.
 *
 * Upgrades itself from `Organization` to `ProfessionalService` — a LocalBusiness
 * subtype, and much stronger for "web design in <city>" and for answer engines
 * placing the business — as soon as `location` in content.ts is filled in.
 * No street address is emitted: this is a service-area business, so the locality
 * plus `areaServed` is the shape Google asks for.
 */
export function organizationSchema() {
  const sameAs = realSocialProfiles();

  const localFields = location
    ? {
        "@type": "ProfessionalService",
        address: {
          "@type": "PostalAddress",
          addressLocality: location.city,
          addressRegion: location.region,
          addressCountry: location.country,
        },
        areaServed: location.areaServed.map((name) => ({ "@type": "Place", name })),
        ...(location.phone ? { telephone: location.phone } : {}),
      }
    : { "@type": "Organization" };

  return {
    ...localFields,
    "@id": ORG_ID,
    name: brand.name,
    alternateName: brand.shortName,
    url: siteUrl,
    // Square mark rather than the lockup: Google wants a logo it can crop to a
    // tile, and the wide lockup letterboxes badly in a knowledge panel.
    //
    // Its own 512px asset, not the `logo-mark.png` the header uses. That one is
    // 128px because it renders at 36px — right for the UI, and the declared
    // width/height here have to be the file's real dimensions, not the ones we
    // wish it had. Serving the 512 in the header instead would put 47KB more on
    // every first paint to feed a crawler that reads this block once.
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo-mark-512.png`,
      width: 512,
      height: 512,
    },
    image: `${siteUrl}/logo.png`,
    email: brand.email,
    slogan: brand.tagline,
    description: brand.description,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    knowsAbout: [
      "Web development",
      "Business process automation",
      "n8n workflow automation",
      "CRM systems",
      "Custom dashboards",
      "API integration",
      "Website maintenance",
    ],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: siteUrl,
    name: brand.name,
    description: brand.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/**
 * One `Service` per service line, tied back to the organisation as provider.
 * `hasOfferCatalog` carries the deliverables, which is the part an answer engine
 * quotes when asked what the studio actually does.
 */
export function serviceSchema(service: Service) {
  return {
    "@type": "Service",
    "@id": `${siteUrl}/services#${service.slug}`,
    name: service.title,
    serviceType: service.title,
    description: service.description,
    provider: { "@id": ORG_ID },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} deliverables`,
      itemListElement: service.deliverables.map((deliverable) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: deliverable },
      })),
    },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
}

export function faqSchema(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * Wraps blocks in a single `@graph`, so a page emits one script tag whose nodes
 * cross-reference by `@id` instead of several disconnected islands.
 */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
