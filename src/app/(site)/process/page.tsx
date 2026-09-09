import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { processSteps } from "@/lib/content";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink } from "@/components/site/ui";
import { SectionHead } from "@/components/site/SectionHead";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Effects";
import { ProcessJourney } from "@/components/process/ProcessJourney";

export const metadata: Metadata = pageMetadata({
  title: "Process — From Idea to Launch",
  description:
    "Six stages from discovery to ongoing support: how Coastal Digital Studio scopes, designs, builds, launches and maintains websites, automation and digital systems.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="From idea to launch."
        description="Six stages, in order, with a clear deliverable at the end of each. You always know which stage we are in and what comes next."
      >
        <Magnetic>
          <ButtonLink href="/start-a-project" size="lg">
            Start a Project
          </ButtonLink>
        </Magnetic>
      </PageHero>

      {/* The stages read left to right as the page is scrolled down. */}
      <section aria-label="The six stages" className="section-tight pb-0">
        <Reveal className="shell mb-10 flex items-center gap-4">
          <span className="type-mono text-[0.58rem] text-muted">Keep scrolling</span>
          <span aria-hidden className="h-px flex-1 bg-line" />
          <span className="type-mono text-[0.58rem] text-accent">
            01 — {String(processSteps.length).padStart(2, "0")}
          </span>
        </Reveal>

        <ProcessJourney steps={processSteps} />
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
            <Magnetic>
              <ButtonLink href="/start-a-project" size="lg">
                Start a Project
              </ButtonLink>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
