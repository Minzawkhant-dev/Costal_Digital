import type { Metadata } from "next";
import { getFaqs } from "@/lib/cms";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { ButtonLink } from "@/components/site/ui";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Reveal } from "@/components/motion/Reveal";

// Next requires segment config to be a literal, so this cannot import
// CMS_REVALIDATE. Keep the two in step if you change the cache window.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "FAQ — Costs, Timelines, Hosting & Support",
  description:
    "Answers on website costs, project timelines, hosting, redesigns, workflow automation, LINE integration and ongoing support.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  // FAQPage structured data — lets the answers surface directly in search.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Serialised from our own content, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="FAQ"
        title="Questions we get asked."
        description="If yours isn't here, send it over — we'd rather answer it properly than have you guess."
      >
        <ButtonLink href="/contact" size="lg" variant="outline" icon="arrow-right">
          Ask a question
        </ButtonLink>
      </PageHero>

      <section className="section-tight">
        <div className="shell mx-auto max-w-4xl">
          <FaqAccordion items={faqs} defaultOpen={0} />
        </div>
      </section>

      <section className="section bg-sand/45">
        <div className="shell">
          <SectionHead
            eyebrow="Still deciding"
            title="A short call answers more than a long page."
            description="Tell us what the business does and what's slowing it down. We'll tell you honestly whether we're the right fit."
            align="center"
          />
          <Reveal className="mt-12 flex flex-wrap justify-center gap-3" delay={0.1}>
            <ButtonLink href="/start-a-project" size="lg">
              Start a Project
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="outline" icon="arrow-right">
              Contact us
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
