import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { businessTypes, solutions } from "@/lib/content";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { ButtonLink, Numeral } from "@/components/site/ui";
import { DepthCard, TiltCard, TiltLayer } from "@/components/motion/Depth3D";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Solutions — Booking, Automation, CRM & Dashboards",
  description:
    "Simple systems that produce better business outcomes: more bookings, less manual work, better customer management, better visibility and better communication.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Simple systems. Better business."
        description="We describe our work by the outcome it produces, not the software it uses. Here is what each outcome is actually made of."
      >
        <ButtonLink href="/start-a-project" size="lg">
          Start a Project
        </ButtonLink>
      </PageHero>

      {/* Outcomes */}
      <section className="section-tight">
        <div className="shell stage-3d flex flex-col gap-4">
          {solutions.map((solution, index) => {
            const chain = solution.stack.split(" + ");

            return (
              <DepthCard key={solution.outcome} intensity={0.5} lift={0.35}>
                <article className="grid gap-0 overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-[1fr_1.15fr]">
                  <div className="p-8 sm:p-10">
                    <Numeral>{String(index + 1).padStart(2, "0")}</Numeral>
                    <h2 className="type-h2 mt-5 text-[1.75rem] sm:text-[2.1rem]">
                      {solution.outcome}
                    </h2>
                    <p className="mt-5 max-w-md text-[0.96rem] leading-relaxed text-slate">
                      {solution.detail}
                    </p>
                  </div>

                  <div className="border-t border-line bg-ink p-8 sm:p-10 lg:border-l lg:border-t-0">
                    <p className="type-mono mb-6 text-[0.58rem] text-paper/40">The system</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {chain.map((part, partIndex) => (
                        <span key={part} className="flex items-center gap-2">
                          <span className="rounded-xl border border-line-dark bg-paper/[0.05] px-3.5 py-2 text-[0.85rem] text-paper/85">
                            {part}
                          </span>
                          {partIndex < chain.length - 1 && (
                            <ArrowRight size={13} className="text-paper/25" aria-hidden />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </DepthCard>
            );
          })}
        </div>
      </section>

      {/* By business type */}
      <section className="section bg-sand/45">
        <div className="shell">
          <SectionHead
            eyebrow="By business type"
            title="Digital solutions built around your business."
            description="The same building blocks, arranged differently depending on how you actually work."
            align="center"
          />

          <RevealGroup className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {businessTypes.map((type, index) => (
              <RevealItem
                key={type.title}
                className={index === 0 ? "sm:col-span-2 lg:col-span-1" : undefined}
              >
                <TiltCard max={5} className="group h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-7">
                    <TiltLayer depth={24} className="flex h-full flex-col">
                      <Numeral>{String(index + 1).padStart(2, "0")}</Numeral>
                      <h3 className="type-h3 mt-5">{type.title}</h3>
                      <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-slate">
                        {type.detail}
                      </p>
                      <p className="type-mono mt-6 border-t border-line pt-4 text-[0.58rem] leading-relaxed text-muted">
                        {type.stack}
                      </p>
                    </TiltLayer>
                  </div>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
