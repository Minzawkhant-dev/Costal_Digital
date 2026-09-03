import type { Metadata } from "next";
import { faqs } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Problems } from "@/components/home/Problems";
import { Solutions } from "@/components/home/Solutions";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BusinessTypes } from "@/components/home/BusinessTypes";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { WhyCoastal } from "@/components/home/WhyCoastal";
import { ProcessScene } from "@/components/home/ProcessScene";
import { PricingTiers } from "@/components/sections/PricingTiers";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { SectionHead } from "@/components/site/SectionHead";
import { ArrowLink } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Web Development, Business Automation & Digital Solutions",
  description:
    "Coastal Digital Studio builds websites, automates workflows, and creates practical digital solutions for small and growing businesses. Work Smarter. Serve Better.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Problems />
      <Solutions />
      <HowItWorks />
      <BusinessTypes />
      <FeaturedWork />
      <WhyCoastal />
      <ProcessScene />

      {/* Pricing */}
      <section className="section" id="pricing">
        <div className="shell">
          <SectionHead
            eyebrow="Pricing"
            title="Clear scope before any number."
            description="Every business is different. Let's discuss what you actually need."
            aside={<ArrowLink href="/pricing">Full pricing detail</ArrowLink>}
          />
          <div className="mt-16 lg:mt-20">
            <PricingTiers />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-sand/45" id="faq">
        <div className="shell">
          <SectionHead
            eyebrow="FAQ"
            title="Questions we get asked."
            aside={<ArrowLink href="/faq">All questions</ArrowLink>}
          />
          <div className="mt-14">
            <FaqAccordion items={faqs.slice(0, 6)} />
          </div>
        </div>
      </section>
    </>
  );
}
