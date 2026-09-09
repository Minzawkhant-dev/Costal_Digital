import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Check, Clock, FileText, MessageSquare } from "lucide-react";
import { brand } from "@/lib/content";
import { PageHero } from "@/components/site/PageHero";
import { Eyebrow } from "@/components/site/ui";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "Start a Project",
  description:
    "Tell us about your business and what you need. You'll get a confirmation immediately, then a discovery call and a written proposal.",
  path: "/start-a-project",
  robots: { index: true, follow: true },
});

const whatHappensNext = [
  {
    icon: <Check size={15} />,
    title: "Confirmation, immediately",
    detail: "You get an email straight away so you know the request arrived.",
  },
  {
    icon: <MessageSquare size={15} />,
    title: "A discovery call",
    detail: "We review the detail and reply to arrange a short call about the business.",
  },
  {
    icon: <FileText size={15} />,
    title: "A written proposal",
    detail: "Scope, timeline and cost in writing, with anything out of scope stated plainly.",
  },
  {
    icon: <Clock size={15} />,
    title: "Only then, a decision",
    detail: "Nothing is charged and nothing is committed until you approve that proposal.",
  },
];

export default function StartAProjectPage() {
  return (
    <>
      <PageHero
        eyebrow="Start a project"
        title="Tell us what's slowing you down."
        description="The more you tell us about how the business actually runs, the more useful our first reply will be. Only four fields are required."
      />

      <section className="pb-20 sm:pb-28">
        <div className="shell grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <Reveal>
            <ProjectForm source="start-a-project" />
          </Reveal>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={0.1}>
              <Eyebrow>What happens next</Eyebrow>
            </Reveal>

            <RevealGroup className="mt-7 flex flex-col" stagger={0.07}>
              {whatHappensNext.map((item, index) => (
                <RevealItem key={item.title}>
                  <div className="flex gap-4 border-t border-line py-5 last:border-b">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-line bg-surface text-accent">
                      {item.icon}
                    </span>
                    <div>
                      <p className="flex items-baseline gap-2 text-[0.95rem] text-ink">
                        {item.title}
                        <span className="type-mono text-[0.55rem] text-muted">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </p>
                      <p className="mt-1.5 text-[0.87rem] leading-relaxed text-slate">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.2}>
              <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
                <p className="type-mono text-[0.58rem] text-muted">Prefer email?</p>
                <a
                  href={`mailto:${brand.email}`}
                  className="mt-2.5 inline-block text-[0.95rem] text-accent transition-colors hover:text-ink"
                >
                  {brand.email}
                </a>
                <p className="mt-4 text-[0.84rem] leading-relaxed text-muted">
                  Either route reaches the same place. The form just means we have the context
                  before we reply.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
