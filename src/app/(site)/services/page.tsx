import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Check } from "lucide-react";
import { getServices } from "@/lib/cms";
import { breadcrumbSchema, graph, serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink, Numeral } from "@/components/site/ui";
import { SectionHead } from "@/components/site/SectionHead";
import { DepthCard, Parallax } from "@/components/motion/Depth3D";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PricingTiers } from "@/components/sections/PricingTiers";

// Next requires segment config to be a literal, so this cannot import
// CMS_REVALIDATE. Keep the two in step if you change the cache window.
export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Services — Web Development, Automation & Digital Solutions",
  description:
    "Web development, business automation, custom digital solutions and ongoing digital support for small and growing businesses.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      {/*
        One Service node per line, each pointing back at the organisation. This
        is the page an answer engine reads to establish what the studio sells,
        so it tracks whatever is published rather than a hardcoded list.
      */}
      <JsonLd
        data={graph(
          ...services.map(serviceSchema),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        )}
      />

      <PageHero
        eyebrow="Services"
        title="Everything your business needs to go digital."
        description="Four services that work together. Most projects start with one and grow into the others as the business changes."
      >
        <ButtonLink href="/start-a-project" size="lg">
          Start a Project
        </ButtonLink>
        <ButtonLink href="/pricing" size="lg" variant="outline" icon="arrow-right">
          See pricing
        </ButtonLink>
      </PageHero>

      {/* Service detail */}
      <section className="section-tight">
        <div className="shell stage-3d flex flex-col gap-5">
          {services.map((service, index) => (
            <DepthCard key={service.slug} intensity={0.5} lift={0.35}>
              <article
                id={service.slug}
                className="scroll-mt-28 overflow-hidden rounded-3xl border border-line bg-surface"
              >
                <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
                  {/* Copy */}
                  <div className="p-8 sm:p-11">
                    <div className="flex items-center justify-between">
                      <Numeral>{service.number}</Numeral>
                      <span className="type-mono text-[0.58rem] text-accent">
                        {service.deliverables.length} deliverables
                      </span>
                    </div>

                    <h2 className="type-h2 mt-7 text-[1.9rem] sm:text-[2.35rem]">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-[1.02rem] leading-relaxed text-ink/80">
                      {service.summary}
                    </p>
                    <p className="mt-5 max-w-lg text-[0.94rem] leading-relaxed text-slate">
                      {service.description}
                    </p>

                    <ButtonLink
                      href="/start-a-project"
                      variant="outline"
                      size="md"
                      className="mt-9"
                    >
                      Discuss this service
                    </ButtonLink>
                  </div>

                  {/* Deliverables */}
                  <div className="relative border-t border-line bg-paper p-8 sm:p-11 lg:border-l lg:border-t-0">
                    <p className="type-mono mb-6 text-[0.58rem] text-muted">What this includes</p>
                    <RevealGroup className="grid gap-2.5 sm:grid-cols-2" stagger={0.05}>
                      {service.deliverables.map((item) => (
                        <RevealItem key={item}>
                          <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface px-4 py-3">
                            <Check
                              size={13}
                              strokeWidth={2.5}
                              className="mt-1 shrink-0 text-accent"
                            />
                            <span className="text-[0.87rem] leading-snug text-slate">{item}</span>
                          </div>
                        </RevealItem>
                      ))}
                    </RevealGroup>

                    {index === 0 && (
                      <Parallax speed={-0.05} className="pointer-events-none absolute inset-0">
                        <div
                          aria-hidden
                          className="absolute -right-20 top-10 size-72 rounded-full opacity-[0.13] blur-[80px]"
                          style={{ background: "radial-gradient(circle, #19b3a6, transparent 70%)" }}
                        />
                      </Parallax>
                    )}
                  </div>
                </div>
              </article>
            </DepthCard>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="section bg-sand/45">
        <div className="shell">
          <SectionHead
            eyebrow="Pricing"
            title="What this usually costs."
            description="Every business is different. Let's discuss what you actually need."
            align="center"
          />
          <div className="mt-14">
            <PricingTiers />
          </div>
          <Reveal className="mt-12 flex justify-center" delay={0.1}>
            <ButtonLink href="/start-a-project" size="lg">
              Get a Quote
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
