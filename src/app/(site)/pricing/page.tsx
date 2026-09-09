import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getFaqs } from "@/lib/cms";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { ButtonLink } from "@/components/site/ui";
import { PricingTiers } from "@/components/sections/PricingTiers";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

// Next requires segment config to be a literal, so this cannot import
// CMS_REVALIDATE. Keep the two in step if you change the cache window.
export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Pricing — Project and Monthly Plans",
  description:
    "Websites, automation, custom digital solutions and monthly digital support. Every business is different — we scope the outcome first, then quote.",
  path: "/pricing",
});

const principles = [
  {
    title: "Scope before number",
    detail:
      "We work out what the project actually needs to do before quoting it. A price without a scope is a guess that someone has to pay for later.",
  },
  {
    title: "Written proposals",
    detail:
      "Every quote arrives in writing with deliverables, milestones and anything explicitly out of scope. No verbal estimates.",
  },
  {
    title: "One-time and monthly",
    detail:
      "Build work is a one-time project cost. Hosting, maintenance and support are a monthly plan, priced separately and clearly.",
  },
  {
    title: "No surprise invoices",
    detail:
      "If something changes mid-project, we tell you what it costs and wait for you to agree before doing it.",
  },
];

export default async function PricingPage() {
  const faqs = await getFaqs();

  // The pricing-relevant questions, kept in the same order as the FAQ page.
  const pricingFaqs = faqs.filter((item) =>
    /cost|long|hosting|support|redesign/i.test(item.question),
  );

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Clear scope before any number."
        description="Every business is different. Let's discuss what you actually need, then put a real figure against it."
      >
        <ButtonLink href="/start-a-project" size="lg">
          Get a Quote
        </ButtonLink>
      </PageHero>

      <section className="section-tight">
        <div className="shell">
          <PricingTiers />

          <Reveal delay={0.15}>
            <p className="mt-8 rounded-xl border border-line bg-surface px-5 py-4 text-[0.86rem] leading-relaxed text-slate">
              Published starting prices are shown as a custom quote until we have scoped your
              project. That is deliberate: a website with one page and a website with online
              booking in two languages are not the same job, and pretending otherwise helps
              nobody.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section className="section bg-sand/45">
        <div className="shell">
          <SectionHead
            eyebrow="How we price"
            title="Four rules we don't bend."
            align="center"
          />

          <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2" stagger={0.07}>
            {principles.map((item, index) => (
              <RevealItem key={item.title}>
                <div className="h-full rounded-2xl border border-line bg-surface p-7">
                  <span className="type-mono text-[0.6rem] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="type-h3 mt-4">{item.title}</h3>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-slate">{item.detail}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* FAQ */}
      {pricingFaqs.length > 0 && (
        <section className="section">
          <div className="shell">
            <SectionHead eyebrow="FAQ" title="Common questions about cost." align="center" />
            <div className="mx-auto mt-12 max-w-3xl">
              <FaqAccordion items={pricingFaqs} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
