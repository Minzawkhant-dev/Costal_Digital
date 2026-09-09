import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { projects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/site/JsonLd";
import { ButtonLink, DemoBadge, Eyebrow, Numeral } from "@/components/site/ui";
import { ProjectArtwork } from "@/components/work/ProjectArtwork";
import { Reveal, RevealGroup, RevealItem, MaskedHeading } from "@/components/motion/Reveal";
import { ScrollSettle, Parallax } from "@/components/motion/Depth3D";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) return { title: "Not found" };

  return pageMetadata({
    title: `${project.title} (Demo Project)`,
    description: `${project.summary} A demonstration build by Coastal Digital Studio — not client work.`,
    path: `/work/${project.slug}`,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      {/*
        Breadcrumbs only. These are demonstration builds, so no CreativeWork or
        case-study markup — structured data claiming delivered client work would
        contradict the DEMO label the page carries.
      */}
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: project.title, path: `/work/${project.slug}` },
          ]),
        )}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pb-14 pt-28 sm:pt-32 lg:pt-40">
        <div aria-hidden className="tech-grid-light absolute inset-0 opacity-40" />

        <div className="shell relative">
          <Reveal>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-[0.85rem] text-slate transition-colors hover:text-ink"
            >
              <ArrowLeft size={14} />
              All work
            </Link>
          </Reveal>

          <div className="mt-9 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-end">
            <div>
              <Reveal>
                <div className="flex flex-wrap items-center gap-3">
                  <DemoBadge />
                  <span className="type-mono text-[0.6rem] text-muted">{project.category}</span>
                </div>
              </Reveal>
              <MaskedHeading
                as="h1"
                text={project.title}
                className="type-display mt-6 max-w-3xl text-[clamp(2.4rem,5.5vw,4.4rem)]"
              />
            </div>

            <div className="lg:pb-3">
              <Reveal delay={0.15}>
                <p className="type-lede max-w-lg">{project.summary}</p>
                <p className="type-mono mt-6 text-[0.6rem] text-accent">{project.stack}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Visual */}
      <section className="pb-16">
        <div className="shell stage-3d">
          <ScrollSettle className="relative min-h-[22rem] overflow-hidden rounded-3xl border border-line sm:min-h-[30rem]">
            <ProjectArtwork project={project} />
            <p className="type-mono absolute bottom-5 left-5 z-10 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[0.52rem] text-paper/70 backdrop-blur-sm">
              Illustrative interface mockup &middot; not a screenshot of a live client system
            </p>
          </ScrollSettle>
        </div>
      </section>

      {/* Problem / Challenge */}
      <section className="section-tight">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow>The problem</Eyebrow>
            <p className="mt-6 text-[1.02rem] leading-relaxed text-ink/85">{project.problem}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>The challenge</Eyebrow>
            <p className="mt-6 text-[1.02rem] leading-relaxed text-ink/85">{project.challenge}</p>
          </Reveal>
        </div>
      </section>

      {/* Solution */}
      <section className="relative overflow-hidden bg-ink py-20 text-paper sm:py-28">
        <div aria-hidden className="tech-grid absolute inset-0 opacity-70" />
        <Parallax speed={0.06} className="pointer-events-none absolute inset-0">
          <div
            aria-hidden
            className="absolute -right-[10%] top-[10%] size-[34rem] rounded-full opacity-[0.16] blur-[120px]"
            style={{ background: "radial-gradient(circle, #19b3a6, transparent 68%)" }}
          />
        </Parallax>

        <div className="shell relative grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow tone="light">The solution</Eyebrow>
              <p className="mt-6 text-[1.05rem] leading-relaxed text-paper/80">
                {project.solution}
              </p>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.1}>
              <Eyebrow tone="light">The system</Eyebrow>
            </Reveal>
            <RevealGroup className="mt-7 flex flex-col gap-2.5" stagger={0.06}>
              {project.system.map((item, itemIndex) => (
                <RevealItem key={item}>
                  <div className="flex items-start gap-3.5 rounded-xl border border-line-dark bg-paper/[0.04] px-4 py-3.5">
                    <span className="type-mono mt-0.5 shrink-0 text-[0.55rem] text-accent-bright">
                      {String(itemIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9rem] leading-snug text-paper/80">{item}</span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Result */}
      <section className="section-tight">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>The result</Eyebrow>
              <h2 className="type-h2 mt-6 text-[1.85rem]">What changes.</h2>
              <p className="mt-5 max-w-sm text-[0.9rem] leading-relaxed text-muted">
                Outcomes described here are the intended effects of this system design. They are
                not measured results from a live business.
              </p>
            </Reveal>
          </div>

          <RevealGroup className="flex flex-col" stagger={0.07}>
            {project.result.map((item) => (
              <RevealItem key={item}>
                <div className="flex items-start gap-4 border-t border-line py-5 last:border-b">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="text-[0.98rem] leading-relaxed text-ink/85">{item}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Technology */}
      <section className="section-tight bg-sand/45">
        <div className="shell">
          <Reveal>
            <Eyebrow>Technology used</Eyebrow>
          </Reveal>
          <RevealGroup className="mt-7 flex flex-wrap gap-2" stagger={0.04}>
            {project.technology.map((tech) => (
              <RevealItem key={tech}>
                <span className="rounded-full border border-line bg-surface px-4 py-2 text-[0.85rem] text-slate">
                  {tech}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Next project */}
      <section className="section-tight">
        <div className="shell">
          <Reveal>
            <Link
              href={`/work/${next.slug}`}
              className="group/next flex flex-col gap-6 rounded-3xl border border-line bg-surface p-8 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ink/25 sm:flex-row sm:items-center sm:justify-between sm:p-10"
            >
              <div>
                <Numeral>Next project</Numeral>
                <h2 className="type-h3 mt-3 text-[1.5rem]">{next.title}</h2>
                <p className="type-mono mt-2 text-[0.58rem] text-muted">{next.stack}</p>
              </div>
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-500 group-hover/next:border-ink group-hover/next:bg-ink group-hover/next:text-paper">
                <ArrowUpRight size={19} />
              </span>
            </Link>
          </Reveal>

          <Reveal className="mt-10 flex justify-center" delay={0.1}>
            <ButtonLink href="/start-a-project" size="lg">
              Start a Project
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
