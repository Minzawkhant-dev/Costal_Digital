import type { Metadata } from "next";
import { Check } from "lucide-react";
import { processSteps } from "@/lib/content";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink, Numeral } from "@/components/site/ui";
import { SectionHead } from "@/components/site/SectionHead";
import { DepthCard } from "@/components/motion/Depth3D";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Process — From Idea to Launch",
  description:
    "Six stages from discovery to ongoing support: how Coastal Digital Studio scopes, designs, builds, launches and maintains websites, automation and digital systems.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="From idea to launch."
        description="Six stages, in order, with a clear deliverable at the end of each. You always know which stage we are in and what comes next."
      >
        <ButtonLink href="/start-a-project" size="lg">
          Start a Project
        </ButtonLink>
      </PageHero>

      <section className="section-tight">
        <div className="shell stage-3d flex flex-col gap-4">
          {processSteps.map((step, index) => (
            <DepthCard key={step.number} intensity={0.45} lift={0.3}>
              <article className="grid gap-0 overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-[auto_1.3fr_1fr]">
                {/* Number rail */}
                <div className="flex items-center gap-4 border-b border-line bg-paper px-8 py-6 lg:flex-col lg:items-start lg:justify-start lg:border-b-0 lg:border-r lg:px-9 lg:py-10">
                  <span className="font-display text-[2.6rem] leading-none tracking-tighter text-accent lg:text-[3.4rem]">
                    {step.number}
                  </span>
                  <span className="type-mono text-[0.58rem] text-muted lg:mt-3">
                    Stage {index + 1} of {processSteps.length}
                  </span>
                </div>

                {/* Copy */}
                <div className="p-8 sm:p-10">
                  <h2 className="type-h3 text-[1.55rem]">{step.title}</h2>
                  <p className="mt-4 text-[1rem] leading-relaxed text-ink/80">{step.summary}</p>
                  <p className="mt-4 max-w-lg text-[0.92rem] leading-relaxed text-slate">
                    {step.detail}
                  </p>
                </div>

                {/* Outputs */}
                <div className="border-t border-line bg-paper p-8 sm:p-10 lg:border-l lg:border-t-0">
                  <p className="type-mono mb-5 text-[0.58rem] text-muted">What you get</p>
                  <RevealGroup className="flex flex-col gap-2.5" stagger={0.06}>
                    {step.outputs.map((output) => (
                      <RevealItem key={output}>
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                            <Check size={11} strokeWidth={3} />
                          </span>
                          <span className="text-[0.88rem] leading-snug text-slate">{output}</span>
                        </div>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </div>
              </article>
            </DepthCard>
          ))}
        </div>
      </section>

      <section className="section bg-sand/45">
        <div className="shell">
          <SectionHead
            eyebrow="What happens first"
            title="It starts with a conversation, not a contract."
            description="Send a project request and you'll get a confirmation immediately. We review the detail, arrange a short discovery call, then send a written proposal. Nothing is charged until you approve it."
            align="center"
          />
          <Reveal className="mt-12 flex justify-center" delay={0.1}>
            <ButtonLink href="/start-a-project" size="lg">
              Start a Project
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
