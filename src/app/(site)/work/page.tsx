import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { projects } from "@/lib/projects";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink, Eyebrow } from "@/components/site/ui";
import { DepthCard } from "@/components/motion/Depth3D";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";

export const metadata: Metadata = pageMetadata({
  title: "Work — Case Studies",
  description:
    "Case studies from Coastal Digital Studio — websites, booking systems and business automation for small and growing businesses.",
  path: "/work",
});

export default function WorkPage() {
  const live = projects.filter((project) => project.status === "live");
  const unbuilt = projects.filter((project) => project.status !== "live");

  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Systems that run the business, not just the website."
        description={
          live.length > 0
            ? "Each project below is a working system — what the problem was, what we built, and what it changed. Every one is labelled for what it is."
            : "Each project below shows how we approach a real problem, end to end."
        }
      >
        <ButtonLink href="/start-a-project" size="lg">
          Start a Project
        </ButtonLink>
      </PageHero>

      <section className="section-tight">
        <div className="shell">
          {/*
            The notice only appears when there is something to disclaim. A page
            of delivered client work should not apologise for being demo work,
            and a page with demos on it must say so.
          */}
          {unbuilt.length > 0 && (
            <Reveal>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-signal/25 bg-signal-soft/60 px-5 py-4">
                <p className="max-w-3xl text-[0.86rem] leading-relaxed text-slate">
                  <span className="font-medium text-ink">
                    {unbuilt.length} of these {projects.length} projects
                    {unbuilt.length === 1 ? " is a" : " are"} demonstration or concept
                    {unbuilt.length === 1 ? " build" : " builds"}
                  </span>{" "}
                  rather than client work, and {unbuilt.length === 1 ? "it is" : "they are"}{" "}
                  labelled as such on the card and throughout the case study. No figure shown for
                  those projects is drawn from a real business.
                </p>
              </div>
            </Reveal>
          )}

          <div
            className={`stage-3d grid gap-5 lg:grid-cols-2 ${unbuilt.length > 0 ? "mt-10" : ""}`}
          >
            {projects.map((project, index) => (
              <DepthCard
                key={project.slug}
                intensity={0.65}
                lift={0.45}
                className={index === 0 ? "lg:col-span-2" : undefined}
              >
                <ProjectCard project={project} featured={index === 0} />
              </DepthCard>
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="section-tight border-t border-line">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col gap-8 rounded-3xl border border-line bg-sand/45 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Eyebrow>Next</Eyebrow>
                <h2 className="type-h2 mt-5 max-w-lg text-[1.9rem] sm:text-[2.3rem]">
                  Tell us what your business keeps doing by hand.
                </h2>
                <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-slate">
                  That is usually where the first useful system is hiding. No obligation — just a
                  conversation about what would actually help.
                </p>
              </div>

              <ButtonLink href="/start-a-project" size="lg" className="shrink-0">
                Start a Project
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
