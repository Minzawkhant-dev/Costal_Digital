import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/motion/Reveal";

export type LegalSection = {
  heading: string;
  body: string[];
  list?: string[];
};

/**
 * Shared shell for Privacy and Terms. Long-form legal copy needs a narrower
 * measure and a visible section index — not the marketing page rhythm.
 */
export function LegalLayout({
  eyebrow,
  title,
  description,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />

      <section className="pb-20 sm:pb-28">
        <div className="shell grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
          {/* Index */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="type-mono text-[0.58rem] text-muted">Last updated</p>
            <p className="mt-2 text-[0.88rem] text-ink">{updated}</p>

            <nav aria-label="Sections" className="mt-8 hidden flex-col gap-2.5 lg:flex">
              {sections.map((section, index) => (
                <a
                  key={section.heading}
                  href={`#section-${index + 1}`}
                  className="flex gap-3 text-[0.85rem] text-slate transition-colors hover:text-ink"
                >
                  <span className="type-mono shrink-0 text-[0.55rem] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                </a>
              ))}
            </nav>
          </aside>

          {/* Body */}
          <div className="max-w-2xl">
            {sections.map((section, index) => (
              <Reveal key={section.heading} amount={0.1}>
                <section
                  id={`section-${index + 1}`}
                  className="scroll-mt-28 border-t border-line py-9 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="type-mono shrink-0 text-[0.58rem] text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="type-h3 text-[1.25rem]">{section.heading}</h2>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 lg:pl-9">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-[0.94rem] leading-relaxed text-slate">
                        {paragraph}
                      </p>
                    ))}

                    {section.list && (
                      <ul className="mt-1 flex flex-col gap-2.5">
                        {section.list.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-[0.92rem] leading-relaxed text-slate"
                          >
                            <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
