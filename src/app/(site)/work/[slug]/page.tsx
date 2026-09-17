import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { getProject, projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/site/JsonLd";
import { ButtonLink, Eyebrow, Numeral } from "@/components/site/ui";
import { ProjectStatusBadge, StatusNote } from "@/components/work/ProjectStatusBadge";
import { ProjectGallery } from "@/components/work/ProjectGallery";
import { ProjectArtwork } from "@/components/work/ProjectArtwork";
import { Reveal, RevealGroup, RevealItem, MaskedHeading } from "@/components/motion/Reveal";
import { Parallax, ScrollSettle } from "@/components/motion/Depth3D";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Not found" };

  // The suffix is part of the honesty rule: a demo must read as a demo in a
  // search result and a shared link, not only once the page is open.
  const suffix =
    project.status === "demo"
      ? " (Demo Project)"
      : project.status === "concept"
        ? " (Concept Project)"
        : "";

  const provenance = project.isDemo
    ? " A demonstration build by Coastal Digital Studio — not client work."
    : "";

  return pageMetadata({
    title: `${project.title} — Case Study${suffix}`,
    description: `${project.summary}${provenance}`,
    path: `/work/${project.slug}`,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const siteLabel = project.liveUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: project.title, path: `/work/${project.slug}` },
          ]),
        )}
      />

      {/* ---------- Hero ---------- */}
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
                  <ProjectStatusBadge status={project.status} />
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

          <Reveal delay={0.2}>
            <StatusNote status={project.status} className="mt-9 max-w-3xl" />
          </Reveal>
        </div>
      </section>

      {/* ---------- Visual, for projects with no screenshots ---------- */}
      {!project.shots && (
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
      )}

      {/* ---------- 1. Overview ---------- */}
      <section className="section-tight">
        <div className="shell grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <Reveal>
            <Eyebrow>Overview</Eyebrow>
            {/* A project without its own overview falls back to the summary
                rather than showing an empty section. */}
            <p className="mt-6 text-[1.02rem] leading-relaxed text-ink/85">
              {project.overview ?? project.summary}
            </p>
          </Reveal>

          {/* Facts, and the live link */}
          <Reveal delay={0.1}>
            <dl className="rounded-2xl border border-line bg-sand/40 p-6 sm:p-7">
              <Fact label="Sector" value={project.category} />
              {project.client && <Fact label="Client" value={project.client} />}
              {project.location && <Fact label="Location" value={project.location} />}
              {project.year && <Fact label="Year" value={project.year} />}
              <Fact label="Scope" value={project.stack} />

              {/* 6. Live website link */}
              {project.liveUrl && (
                <div className="mt-6 border-t border-line pt-6">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/live inline-flex items-center gap-2 text-[0.9rem] font-medium text-ink"
                  >
                    <span className="border-b border-ink/25 pb-0.5 transition-colors group-hover/live:border-ink">
                      {siteLabel}
                    </span>
                    <ExternalLink
                      size={14}
                      className="text-slate transition-transform duration-300 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5"
                    />
                  </a>
                  <p className="type-mono mt-2 text-[0.55rem] text-muted">Visit the live site</p>
                </div>
              )}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------- 2. Problem / Challenge ---------- */}
      <section className="section-tight border-t border-line">
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

      {/* ---------- 3. What we built ---------- */}
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
              <Eyebrow tone="light">What we built</Eyebrow>
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

      {/* ---------- 4. Key features ---------- */}
      {project.features && project.features.length > 0 && (
      <section className="section-tight">
        <div className="shell">
          <Reveal>
            <Eyebrow>Key features</Eyebrow>
            <h2 className="type-h2 mt-6 max-w-2xl text-[1.85rem] sm:text-[2.2rem]">
              What it actually does.
            </h2>
          </Reveal>

          {/* Low amount: the grid grows with the feature list, and a tall
              container with a high threshold never enters view. */}
          <RevealGroup
            className="mt-10 grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.05}
            amount={0.04}
          >
            {project.features.map((feature, featureIndex) => (
              <RevealItem key={feature.title}>
                <div className="flex h-full flex-col border-t border-line py-6">
                  <Numeral>{String(featureIndex + 1).padStart(2, "0")}</Numeral>
                  <h3 className="type-h3 mt-3 text-[1.05rem]">{feature.title}</h3>
                  <p className="mt-3 text-[0.88rem] leading-relaxed text-slate">
                    {feature.detail}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      )}

      {/* ---------- 5. Screenshots ---------- */}
      {project.shots && (
        <section className="section-tight bg-sand/40">
          <div className="shell">
            <Reveal>
              <Eyebrow>Screenshots</Eyebrow>
              <h2 className="type-h2 mt-6 max-w-2xl text-[1.85rem] sm:text-[2.2rem]">
                Desktop and mobile.
              </h2>
              <p className="mt-4 max-w-xl text-[0.9rem] leading-relaxed text-slate">
                {project.status === "live"
                  ? "Captured from the running site at 1440px and 390px — the mobile set is the layout a phone genuinely gets, not a scaled-down desktop."
                  : "Captured from the build at 1440px and 390px."}
              </p>
            </Reveal>

            {/*
              Deliberately not wrapped in <Reveal>. This block is thousands of
              pixels tall, and Reveal only fires once 25% of its element is on
              screen — which a block taller than four viewports can never be, so
              the whole gallery would sit at opacity 0 forever. The individual
              frames reveal themselves instead.
            */}
            <div className="mt-9">
              <ProjectGallery shots={project.shots} siteLabel={siteLabel} />
            </div>
          </div>
        </section>
      )}

      {/* ---------- Result ---------- */}
      <section className="section-tight">
        <div className="shell grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>The result</Eyebrow>
              <h2 className="type-h2 mt-6 text-[1.85rem]">What changes.</h2>
              <p className="mt-5 max-w-sm text-[0.9rem] leading-relaxed text-muted">
                {project.status === "live"
                  ? "What the system changed about the way the business runs. These are described outcomes, not measured statistics."
                  : "Outcomes described here are the intended effects of this system design. They are not measured results from a live business."}
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

      {/* ---------- Technology ---------- */}
      <section className="section-tight border-t border-line">
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

      {/* ---------- 6. Visit the live site ---------- */}
      {project.liveUrl && (
        <section className="section-tight pt-0">
          <div className="shell">
            <Reveal>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/visit flex flex-col gap-6 rounded-3xl border border-line bg-surface p-8 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ink/25 sm:flex-row sm:items-center sm:justify-between sm:p-10"
              >
                <div>
                  <Numeral>Live website</Numeral>
                  <h2 className="type-h3 mt-3 text-[1.5rem]">{siteLabel}</h2>
                  <p className="mt-2 text-[0.88rem] text-slate">
                    See the running site for yourself.
                  </p>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-500 group-hover/visit:border-ink group-hover/visit:bg-ink group-hover/visit:text-paper">
                  <ExternalLink size={18} />
                </span>
              </a>
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- Next project + 7. CTA ---------- */}
      <section className="section-tight pt-0">
        <div className="shell">
          {next.slug !== project.slug && (
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
          )}

          <Reveal className="mt-14 flex flex-col items-center text-center" delay={0.1}>
            <h2 className="type-h2 max-w-xl text-[1.9rem] sm:text-[2.3rem]">
              Want something like this for your business?
            </h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-slate">
              Tell us what is taking up your time. We will tell you honestly whether a system would
              help.
            </p>
            <ButtonLink href="/start-a-project" size="lg" className="mt-8">
              Start a Project
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line py-3.5 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="type-mono shrink-0 text-[0.55rem] text-muted">{label}</dt>
      <dd className="text-[0.88rem] leading-snug text-ink/85 sm:text-right">{value}</dd>
    </div>
  );
}
