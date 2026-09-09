import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/content";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink, DemoBadge, Numeral } from "@/components/site/ui";
import { DepthCard } from "@/components/motion/Depth3D";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectArtwork } from "@/components/work/ProjectArtwork";

export const metadata: Metadata = pageMetadata({
  title: "Work — Demonstration Projects",
  description:
    "Demonstration builds showing how Coastal Digital Studio approaches restaurant booking systems, salon appointments and small business automation.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Work we're proud to build."
        description="We are a new studio, so everything below is a demonstration build rather than a client project. Each one solves a real problem the way we would solve it for you."
      >
        <ButtonLink href="/start-a-project" size="lg">
          Start a Project
        </ButtonLink>
      </PageHero>

      <section className="section-tight">
        <div className="shell">
          {/* Honesty notice */}
          <Reveal>
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-signal/25 bg-signal-soft/60 px-5 py-4">
              <DemoBadge />
              <p className="max-w-3xl text-[0.86rem] leading-relaxed text-slate">
                These are demonstration projects built by Coastal Digital Studio to show our
                approach and capability. They are not client work, and no results shown are drawn
                from a real business. We will replace them with client case studies as they become
                available.
              </p>
            </div>
          </Reveal>

          <div className="stage-3d mt-10 grid gap-5 lg:grid-cols-2">
            {projects.map((project, index) => (
              <DepthCard
                key={project.slug}
                intensity={0.65}
                lift={0.45}
                className={index === 0 ? "lg:col-span-2" : undefined}
              >
                <Link
                  href={`/work/${project.slug}`}
                  className="group/project flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_30px_65px_-34px_rgba(10,20,28,0.32)]"
                >
                  <div
                    className={`relative overflow-hidden ${
                      index === 0 ? "min-h-[19rem] lg:min-h-[24rem]" : "min-h-[17rem]"
                    }`}
                  >
                    <ProjectArtwork project={project} />
                    <div className="absolute left-5 top-5 z-10">
                      <DemoBadge tone="light" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-6 p-7 sm:p-8">
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="type-mono text-[0.58rem] text-accent">
                          {project.category}
                        </span>
                        <Numeral>{project.number}</Numeral>
                      </div>
                      <h2 className="type-h3 mt-4 text-[1.35rem]">{project.title}</h2>
                      <p className="type-mono mt-2.5 text-[0.58rem] text-muted">{project.stack}</p>
                      <p className="mt-4 max-w-lg text-[0.92rem] leading-relaxed text-slate">
                        {project.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[0.85rem] font-medium text-ink">
                        Read the case study
                      </span>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-500 group-hover/project:border-ink group-hover/project:bg-ink group-hover/project:text-paper">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </DepthCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
