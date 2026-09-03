import type { Metadata } from "next";
import { whyCoastal, brand } from "@/lib/content";
import { PageHero } from "@/components/site/PageHero";
import { SectionHead } from "@/components/site/SectionHead";
import { ButtonLink, Eyebrow } from "@/components/site/ui";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ScrollHighlightText } from "@/components/motion/Effects";
import { Parallax } from "@/components/motion/Depth3D";

export const metadata: Metadata = {
  title: "About — A Digital Partner for Growing Businesses",
  description:
    "Coastal Digital Studio is a digital partner for small and growing businesses: better websites, automated work, connected tools and systems that grow with you.",
  alternates: { canonical: "/about" },
};

const positioning = [
  "Build better websites.",
  "Automate repetitive work.",
  "Connect their digital tools.",
  "Improve customer experience.",
  "Build systems that can grow with the business.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="More than a website. A better way to work."
        description="We are a digital studio for small and growing businesses — the kind that are busy running the business and have no time left to fight their own software."
      >
        <ButtonLink href="/start-a-project" size="lg">
          Start a Project
        </ButtonLink>
        <ButtonLink href="/work" size="lg" variant="outline" icon="arrow-right">
          See our work
        </ButtonLink>
      </PageHero>

      {/* Positioning statement */}
      <section className="section-tight">
        <div className="shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal>
            <Eyebrow>What we do</Eyebrow>
          </Reveal>

          <div>
            <ScrollHighlightText
              text="We are not only a web design company. We are a digital partner — the people who help a business get its website, its tools and its daily operations working as one system."
              className="font-display text-[1.5rem] leading-[1.32] tracking-tight text-ink sm:text-[2.1rem]"
            />

            <RevealGroup className="mt-12 flex flex-col" stagger={0.07}>
              {positioning.map((item, index) => (
                <RevealItem key={item}>
                  <div className="flex items-baseline gap-5 border-t border-line py-5 last:border-b">
                    <span className="type-mono text-[0.6rem] text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[1.15rem] tracking-tight text-ink sm:text-[1.35rem]">
                      {item}
                    </span>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section relative overflow-hidden bg-ink text-paper">
        <div aria-hidden className="tech-grid absolute inset-0 opacity-70" />
        <Parallax speed={0.07} className="pointer-events-none absolute inset-0">
          <div
            aria-hidden
            className="absolute -left-[8%] top-[15%] size-[38rem] rounded-full opacity-[0.14] blur-[130px]"
            style={{ background: "radial-gradient(circle, #19b3a6, transparent 68%)" }}
          />
        </Parallax>

        <div className="shell relative">
          <SectionHead
            eyebrow="How we work"
            title="Five things we hold to."
            description="These are not slogans. They are the reasons our projects are scoped, built and supported the way they are."
            tone="light"
            align="split"
          />

          <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line-dark bg-line-dark sm:grid-cols-2 lg:grid-cols-3">
            {whyCoastal.map((item, index) => (
              <RevealItem key={item.title}>
                <div className="h-full bg-ink p-8 sm:p-9">
                  <span className="type-mono text-[0.6rem] text-accent-bright">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="type-h3 mt-5 text-paper">{item.title}</h3>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-paper/55">
                    {item.detail}
                  </p>
                </div>
              </RevealItem>
            ))}

            <RevealItem>
              <div className="flex h-full flex-col justify-end bg-accent p-8 sm:p-9">
                <p className="font-display text-[1.5rem] leading-tight tracking-tight text-white">
                  Work Smarter.
                  <br />
                  Serve Better.
                </p>
                <p className="mt-3 text-[0.85rem] text-white/70">{brand.name}</p>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* Who we work with */}
      <section className="section">
        <div className="shell">
          <SectionHead
            eyebrow="Who we work with"
            title="Small and growing businesses."
            description="Businesses big enough to feel the friction of manual work, and small enough that fixing it makes a visible difference within weeks."
            align="center"
          />

          <Reveal className="mt-14 flex justify-center" delay={0.1}>
            <ButtonLink href="/start-a-project" size="lg">
              Start a Project
            </ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
