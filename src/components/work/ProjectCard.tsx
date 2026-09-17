import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";
import { Numeral } from "@/components/site/ui";
import { ProjectStatusBadge } from "@/components/work/ProjectStatusBadge";
import { ProjectArtwork } from "@/components/work/ProjectArtwork";

/**
 * A project card: screenshot, name, type, short description, and the button
 * through to the case study.
 *
 * The whole card is the link — the button is a visual affordance inside it, not
 * a second tab stop, so keyboard users get one target rather than two that go
 * to the same place.
 */
export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      aria-label={`View case study: ${project.title}`}
      className="group/project flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_30px_65px_-34px_rgba(10,20,28,0.32)]"
    >
      {/* Screenshot */}
      <div
        className={cn(
          "relative overflow-hidden bg-sand",
          featured ? "aspect-[16/9] sm:aspect-[2/1]" : "aspect-[16/10]",
        )}
      >
        {project.cover ? (
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 1100px" : "(max-width: 1024px) 100vw, 550px"}
            className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/project:scale-[1.03]"
            priority={featured}
          />
        ) : (
          <ProjectArtwork project={project} />
        )}

        {/* Status sits on the image so it cannot be missed or scrolled past. */}
        <div className="absolute left-4 top-4 z-10">
          <ProjectStatusBadge
            status={project.status}
            className="bg-surface/92 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <Numeral>{project.number}</Numeral>
          <span aria-hidden className="h-px flex-1 bg-line" />
          {project.year && (
            <span className="type-mono text-[0.6rem] text-muted">{project.year}</span>
          )}
        </div>

        {/* Project type */}
        <p className="type-mono mt-5 text-[0.6rem] text-accent">{project.category}</p>

        {/* Name */}
        <h3 className={cn("type-h3 mt-2.5", featured ? "text-[1.7rem] sm:text-[2rem]" : "text-[1.4rem]")}>
          {project.title}
        </h3>

        <p className="type-mono mt-2 text-[0.58rem] text-muted">{project.stack}</p>

        {/* Short description */}
        <p
          className={cn(
            "mt-4 leading-relaxed text-slate",
            featured ? "max-w-xl text-[0.95rem]" : "text-[0.9rem]",
          )}
        >
          {project.summary}
        </p>

        {/* View Case Study */}
        <div className="mt-7 flex items-center justify-between gap-4 pt-1">
          <span className="inline-flex items-center gap-2 border-b border-ink/20 pb-1 text-[0.875rem] font-medium text-ink transition-colors duration-300 group-hover/project:border-ink">
            View Case Study
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/project:translate-x-0.5 group-hover/project:-translate-y-0.5"
            />
          </span>

          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-500 group-hover/project:border-ink group-hover/project:bg-ink group-hover/project:text-paper">
            <ArrowUpRight size={17} />
          </span>
        </div>
      </div>
    </Link>
  );
}

