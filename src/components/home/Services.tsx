import Link from "next/link";
import { ArrowUpRight, Globe, LifeBuoy, Settings2, Workflow } from "lucide-react";
import { services } from "@/lib/content";
import { SectionHead } from "@/components/site/SectionHead";
import { ArrowLink, ButtonLink, Numeral } from "@/components/site/ui";
import { DepthCard } from "@/components/motion/Depth3D";
import { Reveal } from "@/components/motion/Reveal";

const icons: Record<string, React.ReactNode> = {
  "web-development": <Globe size={20} strokeWidth={1.6} />,
  "business-automation": <Workflow size={20} strokeWidth={1.6} />,
  "digital-solutions": <Settings2 size={20} strokeWidth={1.6} />,
  "digital-support": <LifeBuoy size={20} strokeWidth={1.6} />,
};

export function Services() {
  return (
    <section className="section relative" id="services">
      <div className="shell">
        <SectionHead
          eyebrow="Services"
          title="Everything your business needs to go digital."
          description="From websites to automation, we build practical digital solutions that make your business easier to run and better to experience."
          aside={<ArrowLink href="/services">Explore our services</ArrowLink>}
        />

        {/* The stage supplies one perspective for the whole grid, so the cards
            tilt as a set rather than four unrelated planes. */}
        <div className="stage-3d mt-16 grid gap-4 md:grid-cols-2 lg:mt-20">
          {services.map((service, index) => (
            <DepthCard key={service.slug} intensity={0.75} lift={0.55}>
              <Link
                href={`/services#${service.slug}`}
                className="group/card relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-ink/25 hover:shadow-[0_28px_60px_-30px_rgba(10,20,28,0.3)] sm:p-9"
              >
                {/* Accent wash on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 100% 0%, rgba(25,179,166,0.09), transparent 60%)",
                  }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-xl border border-line bg-paper text-accent transition-colors duration-500 group-hover/card:border-accent/30 group-hover/card:bg-accent-soft">
                      {icons[service.slug]}
                    </span>
                    <Numeral>{service.number}</Numeral>
                  </div>

                  <h3 className="type-h3 mt-7">{service.title}</h3>
                  <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-slate">
                    {service.summary}
                  </p>
                </div>

                <div className="relative mt-9 flex flex-wrap items-center gap-1.5">
                  {service.deliverables.slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line bg-paper px-2.5 py-1 text-[0.7rem] text-slate"
                    >
                      {item}
                    </span>
                  ))}
                  {service.deliverables.length > 4 && (
                    <span className="type-mono px-1 text-[0.6rem] text-muted">
                      +{service.deliverables.length - 4}
                    </span>
                  )}
                  <span className="ml-auto grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-500 group-hover/card:border-ink group-hover/card:bg-ink group-hover/card:text-paper">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            </DepthCard>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center" delay={0.1}>
          <ButtonLink href="/services" variant="outline" size="lg">
            Explore Our Services
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
