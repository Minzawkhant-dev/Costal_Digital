import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { SectionHead } from "@/components/site/SectionHead";
import { ArrowLink, Numeral } from "@/components/site/ui";
import { DepthCard } from "@/components/motion/Depth3D";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import { ProjectArtwork } from "@/components/work/ProjectArtwork";

/** How many projects the homepage shows before "See all work" takes over. */
const LIMIT = 3;

export function FeaturedWork() {
  const featured = projects.slice(0, LIMIT);
  const unbuilt = featured.filter((project) => project.isDemo);
  const allDemo = unbuilt.length === featured.length;

  return (
    <section className="section relative" id="work">
      <div className="shell">
        <SectionHead
          eyebrow="Featured work"
          title="Work we're proud to build."
          description={
            allDemo
              ? "These are demonstration builds that show how we approach real business problems. They are not client projects."
              : "Working systems, built for real businesses. Each one starts with a problem somebody was solving by hand."
          }
          aside={<ArrowLink href="/work">See all work</ArrowLink>}
        />

        {/*
          The notice is conditional on purpose. It was unconditional while every
          project was a demo; now it must describe the list as it actually is,
          or it will mislabel delivered client work as a demonstration.
        */}
        {unbuilt.length > 0 && (
          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center gap-3 rounded-xl border border-signal/25 bg-signal-soft/60 px-5 py-4">
              <p className="text-[0.86rem] leading-relaxed text-slate">
                {allDemo
                  ? "Every project below is a demonstration build created by Coastal Digital Studio to show our approach. We will replace these with client work as it becomes available."
                  : "Projects below are labelled for what they are. Anything marked Demo or Concept is a build made to show our approach, not client work."}
              </p>
            </div>
          </Reveal>
        )}

        <div className="stage-3d mt-12 flex flex-col gap-5">
          {featured.map((project, index) => (
            <DepthCard key={project.slug} intensity={0.6} lift={0.4}>
              <Link
                href={`/work/${project.slug}`}
                aria-label={`View case study: ${project.title}`}
                className="group/project block overflow-hidden rounded-3xl border border-line bg-surface transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_34px_70px_-36px_rgba(10,20,28,0.35)]"
              >
                <div
                  className={cn(
                    "grid items-stretch gap-0 lg:grid-cols-[1fr_1.15fr]",
                    index % 2 === 1 && "lg:[&>*:first-child]:order-2",
                  )}
                >
                  {/* Copy */}
                  <div className="flex flex-col justify-between p-8 sm:p-10">
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <ProjectStatusBadge status={project.status} />
                        <Numeral>{project.number}</Numeral>
                      </div>

                      <h3 className="type-h3 mt-7 text-[1.5rem] sm:text-[1.85rem]">
                        {project.title}
                      </h3>
                      <p className="type-mono mt-3 text-[0.6rem] text-accent">{project.stack}</p>
                      <p className="mt-5 max-w-md text-[0.94rem] leading-relaxed text-slate">
                        {project.summary}
                      </p>
                    </div>

                    <div className="mt-9 flex items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.technology.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-line bg-paper px-2.5 py-1 text-[0.68rem] text-slate"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-500 group-hover/project:border-ink group-hover/project:bg-ink group-hover/project:text-paper">
                        <ArrowUpRight size={17} />
                      </span>
                    </div>
                  </div>

                  {/* Screenshot, or generated artwork when there isn't one yet */}
                  <div className="relative min-h-[17rem] overflow-hidden border-t border-line lg:min-h-[21rem] lg:border-l lg:border-t-0">
                    {project.cover ? (
                      <Image
                        src={project.cover.src}
                        alt={project.cover.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 640px"
                        className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/project:scale-[1.03]"
                      />
                    ) : (
                      <ProjectArtwork project={project} />
                    )}
                  </div>
                </div>
              </Link>
            </DepthCard>
          ))}
        </div>
      </div>
    </section>
  );
}
