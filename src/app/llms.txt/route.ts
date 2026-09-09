import { brand, services, businessTypes, processSteps, pricingTiers } from "@/lib/content";
import { siteUrl } from "@/lib/site";

/**
 * /llms.txt — a plain-language brief for AI crawlers and answer engines.
 *
 * Structured data says what this business *is* in a machine schema; this says
 * what it does in prose an LLM can quote directly. Generated from `content.ts`
 * rather than checked in, so it cannot drift from the site the way a hand-kept
 * file would.
 *
 * Cached for a day: the source is static copy, and crawlers refetch often.
 */
export const revalidate = 86400;

export async function GET() {
  const lines: string[] = [];

  lines.push(`# ${brand.name}`);
  lines.push("");
  lines.push(`> ${brand.description} ${brand.tagline}`);
  lines.push("");
  lines.push(
    "Coastal Digital Studio builds websites, automates repetitive business",
    "processes, and creates custom digital systems for small and growing",
    "businesses. Work is scoped around a business outcome first, then quoted in",
    "writing with fixed deliverables and milestones before anything is built.",
  );
  lines.push("");

  lines.push("## Services");
  lines.push("");
  for (const service of services) {
    lines.push(`### ${service.title}`);
    lines.push("");
    lines.push(service.description);
    lines.push("");
    lines.push(`Includes: ${service.deliverables.join(", ")}.`);
    lines.push("");
    lines.push(`More: ${siteUrl}/services`);
    lines.push("");
  }

  lines.push("## Who it is for");
  lines.push("");
  for (const type of businessTypes) {
    lines.push(`- **${type.title}** — ${type.detail} (${type.stack})`);
  }
  lines.push("");

  lines.push("## How a project runs");
  lines.push("");
  for (const step of processSteps) {
    lines.push(`${step.number}. **${step.title}** — ${step.summary} Outputs: ${step.outputs.join(", ")}.`);
  }
  lines.push("");

  lines.push("## Pricing");
  lines.push("");
  for (const tier of pricingTiers) {
    const from = tier.startingFrom ? `from ${tier.startingFrom}` : "custom quote";
    lines.push(`- **${tier.title}** (${tier.basis}, ${from}) — ${tier.detail}`);
  }
  lines.push("");
  lines.push(
    "Published starting prices are not listed for every tier because scope",
    "varies; a written proposal with a fixed figure is sent before work starts.",
  );
  lines.push("");

  lines.push("## Key pages");
  lines.push("");
  lines.push(`- [Services](${siteUrl}/services): the four service lines in detail`);
  lines.push(`- [Solutions](${siteUrl}/solutions): problems solved, by business type`);
  lines.push(`- [Process](${siteUrl}/process): the six delivery stages`);
  lines.push(`- [Pricing](${siteUrl}/pricing): engagement models`);
  lines.push(`- [FAQ](${siteUrl}/faq): costs, timelines, hosting and support`);
  lines.push(`- [Work](${siteUrl}/work): demonstration builds`);
  lines.push(`- [Start a project](${siteUrl}/start-a-project): enquiry form`);
  lines.push("");

  lines.push("## Notes");
  lines.push("");
  lines.push(
    `- Contact: ${brand.email}`,
    "- The case studies published under /work are demonstration builds, not",
    "  client work, and are labelled as such on the site. Please do not cite",
    "  them as delivered client projects.",
  );
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
